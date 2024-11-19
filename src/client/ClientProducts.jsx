import {Button, Card, Navbar, Spinner} from "flowbite-react";
import React, {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {Link, useParams, useSearchParams} from "react-router-dom";
import moment from "moment/moment.js";
import {formatVND} from "../helpers/parsers.js";
import InfiniteScroll from "react-infinite-scroll-component";
import {FaPlusCircle} from "react-icons/fa";

export default function ClientProducts() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const {id} = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories", {
        params: {
          page: 1,
          limit: 100,
        }
      });
      setCategories(res.data.docs);
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products", {
        params: {
          page: pagination.page,
          limit: 10,
          category: searchParams.get("category") || null,
        }
      });
      setProducts([...products, ...res.data.docs]);
      setPagination({
        page: res.data.page,
        totalPages: res.data.totalPages,
        hasNextPage: res.data.hasNextPage,
        hasPrevPage: res.data.hasPrevPage,
      })
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, searchParams.get("category")]);

  const fetchMoreData = () => {
    if (pagination.hasNextPage) {
      setPagination({
        ...pagination,
        page: pagination.page + 1,
      });
    }
  }

  return (
    <>
      <Navbar fluid rounded>
        <div className={"flex gap-2 overflow-x-auto w-screen flex-nowrap h-full py-1"}>
          <Button pill outline={!!searchParams.get("category")} className={"min-w-fit"}
                  onClick={() => {
                    searchParams.delete("category");
                    setProducts([]);
                    setPagination({
                      page: 1,
                      totalPages: 1,
                      hasNextPage: false,
                      hasPrevPage: false,
                    })
                    setSearchParams(searchParams);
                  }}
          >
            Tất cả
          </Button>
          {categories.map(category => (
            <Button key={category._id} pill
                    outline={searchParams.get("category") !== category.slug}
                    className={"min-w-fit max-h-fit"}
                    onClick={() => {
                      searchParams.set("category", category.slug)
                      setProducts([]);
                      setPagination({
                        page: 1,
                        totalPages: 1,
                        hasNextPage: false,
                        hasPrevPage: false,
                      })
                      setSearchParams(searchParams);
                    }}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </Navbar>

      <InfiniteScroll
        next={fetchMoreData}
        hasMore={pagination.hasNextPage}
        loader={
          <div className="text-center">
            <Spinner/>
          </div>
        }
        dataLength={products.length}
        scrollableTarget={"products-container"}
        className={"p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"}
      >
        {products.map(product => (
          <ProductCard key={product._id} product={product}/>
        ))}
      </InfiniteScroll>
    </>
  )
}

function ProductCard({product}) {
  return (
    <>
      <div className={"rounded-lg bg-white p-2 text-gray-800"}>
        <div className="h-40 overflow-hidden flex items-center justify-center rounded-lg relative">
          <img src={product.image} className={"rounded-lg object-center"}/>
          <div className={"cursor-pointer"}>
            <FaPlusCircle className={"absolute right-1 bottom-1 text-2xl text-white bg-black p-1 rounded-full w-8 h-8 active:bg-gray-300 active:text-gray-800 transition"}/>
          </div>
        </div>
        <div className="p-2">
          <h1 className={"text-lg font-bold"}>{product.name}</h1>
          <h1 className={"text-gray-500"}>{formatVND(product.price)}</h1>
        </div>
      </div>
    </>
  );
}