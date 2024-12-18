import {Button, Drawer, HR, Navbar, Spinner, Textarea} from "flowbite-react";
import React, {useEffect, useRef, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {useOutletContext, useParams, useSearchParams} from "react-router-dom";
import {formatVND} from "../helpers/parsers.js";
import InfiniteScroll from "react-infinite-scroll-component";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {BiCart, BiMinus, BiPlus} from "react-icons/bi";
import {IoClose} from "react-icons/io5";
import {useTranslation} from "react-i18next";

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
  const prevPage = useRef(pagination.page);
  const [cart, setCart, addToCart, removeFromCart] = useOutletContext();

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

  const fetchProducts = async (newPage = true) => {
    try {
      const res = await axios.get("/products", {
        params: {
          page: newPage ? pagination.page : 1,
          limit: 10,
          category: searchParams.get("category") || null,
          search: searchParams.get("search") || null,
          filters: "status:available",
        }
      });
      if (newPage) {
        setProducts([...products, ...res.data.docs]);
      } else {
        setProducts(res.data.docs);
        prevPage.current = res.data.page;
      }
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
    if (prevPage.current !== pagination.page) {
      // Nếu pagination.page thay đổi, gọi fetchProducts với newPage = true
      fetchProducts(true);
    } else {
      // Nếu các dependency khác thay đổi, gọi fetchProducts thông thường
      fetchProducts(false);
    }
    // Cập nhật giá trị hiện tại vào ref để dùng cho lần render tiếp theo
    prevPage.current = pagination.page;
  }, [pagination.page, searchParams.get("category"), searchParams.get("search")]);

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
                    // setProducts([]);
                    // setPagination({
                    //   page: 1,
                    //   totalPages: 1,
                    //   hasNextPage: false,
                    //   hasPrevPage: false,
                    // })
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
                      // setProducts([]);
                      // setPagination({
                      //   page: 1,
                      //   totalPages: 1,
                      //   hasNextPage: false,
                      //   hasPrevPage: false,
                      // })
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
          <ProductCard key={product._id} product={product} addToCart={addToCart} cart={cart}/>
        ))}
      </InfiniteScroll>
    </>
  )
}

function ProductCard({product, addToCart, cart}) {
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [option, setOption] = useState("");
  const [note, setNote] = useState("");
  const productInCart = cart.filter(item => item.product._id === product._id).reduce((acc, item) => acc + item.quantity, 0);
  const {t} = useTranslation();

  const handleClose = () => setOpenProductDetail(false);

  const onChangeQuantity = (value) => {
    if (value < 1) {
      setQuantity(1);
      pushToast(t("product.quantityMinimum"), "error");
    } else {
      setQuantity(value);
    }
  }

  const onAdd = () => {
    if (product.options && product.options.length > 0 && !option) {
      pushToast(t("pleaseSelectOption"), "warning");
      return;
    }

    addToCart({
      product: product,
      quantity: quantity,
      option: option,
      note: note,
      price: product.price,
    });
    // setOption("");
    setQuantity(1);
    setNote("");
    handleClose();
  }

  return (
    <>
      <div className={"rounded-lg bg-white p-2 text-gray-800"} onClick={() => setOpenProductDetail(true)}>
        <div className="h-40 overflow-hidden flex items-center justify-center rounded-lg relative">
          <img src={product.image} className={"rounded-lg object-center"}/>
          {!!productInCart && <div
            className={"cursor-pointer absolute right-1 bottom-1 rounded-full border-gray-100 border-4 bg-gray-500 font-bold text-white p-3 size-10 flex justify-center items-center"}
          >
            {productInCart}
          </div>}
        </div>
        <div className="p-2">
          <h1 className={"text-lg font-bold"}>{product.name}</h1>
          <h1 className={"text-gray-500"}>{formatVND(product.price)}</h1>
        </div>
      </div>

      <Drawer open={openProductDetail} onClose={handleClose} position="bottom" className={"h-screen max-h-dvh p-0"}>
        <div className={"text-gray-800 relative h-full w-full"}>
          <div className="h-80 overflow-hidden flex items-center justify-center relative">
            <img src={product.image} className={"relative -translate-y-20"}/>
            <div className={"cursor-pointer absolute right-1 top-1"} onClick={handleClose}>
              <IoIosCloseCircleOutline className={"text-2xl text-white bg-black p-1 rounded-full size-14 active:bg-gray-300 active:text-gray-800 transition"}/>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <div className={"flex justify-between"}>
              <div className={"flex flex-col gap-2"}>
                <h1 className={"text-4xl font-bold"}>{product.name}</h1>
                <h1 className={"text-gray-500 font-bold text-xl"}>{formatVND(product.price)}</h1>
              </div>
              <div className="w-32 max-w-sm relative">
                <div className="relative">
                  <button
                    id="decreaseButton"
                    className="absolute right-9 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => onChangeQuantity(quantity - 1)}
                  >
                    <BiMinus className="h-4 w-4"/>
                  </button>
                  <input
                    id="amountInput"
                    type="number"
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    value={quantity}
                    onChange={(e) => onChangeQuantity(parseInt(e.target.value))}
                  />
                  <button
                    id="increaseButton"
                    className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={() => onChangeQuantity(quantity + 1)}
                  >
                    <BiPlus className="h-4 w-4"/>
                  </button>
                </div>
              </div>
            </div>
            <h1 className={"text-gray-800"}>{product.description}</h1>
            <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
            {product?.options && product.options.length > 0 && (
              <div className={"flex flex-col gap-2"}>
                <h1 className={"text-lg font-bold"}>{t("product.pleaseSelectOption")}:</h1>
                {product.options.map((option, index) => (
                  <div className="flex items-center pe-4 border border-gray-200 rounded dark:border-gray-700"
                       key={product._id+"-"+option+"-"+index}>
                    <label htmlFor={option}
                           className="w-full text-lg py-2 ms-4 font-medium text-gray-900 dark:text-gray-300">{option}</label>
                    <input id={option} type="radio" value={option} name={product._id + "-option"}
                           className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                           onChange={(e) => setOption(e.target.value)}
                    />
                  </div>
                ))}
                <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
              </div>
            )}
            <div>
              <h1 className={"text-lg font-bold"}>{t("product.note")}:</h1>
              <Textarea className={"w-full h-20 rounded"}
                        onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className={"w-full bottom-4 flex justify-between gap-2"}>
              <Button className={"min-w-fit flex items-center justify-center w-full"} size={"xl"}
                      onClick={onAdd}
              >
                <BiCart className={"h-6 w-6 mr-2"}/>
                {t("product.add")}
              </Button>
              <Button color={"gray"} className={"w-full flex items-center justify-center"} size={"xl"}
                      onClick={handleClose}>
                <IoClose className={"h-6 w-6 mr-2"}/>
                {t("product.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}