import { Banner, Button, Card, Carousel, Modal, ModalBody, ModalFooter, ModalHeader, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, {useEffect, useState} from "react";
import { HiShoppingCart } from "react-icons/hi";
import {Link, useParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";

export default function ClientOrder() {
  const [bestSeller, setBestSeller] = useState([]);
  const [categories, setCategories] = useState([]);
  const {id} = useParams();

  const fetchBestSeller = async () => {
    try {
      const res = await axios.get("/dashboard/best-seller", {
        params: {
          by: "day",
          limit: 5
        }
      });
      setBestSeller(res.data.bestSellers.map(item => ({
        ...item.product
      })));
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

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

  useEffect(() => {
    fetchBestSeller();
    fetchCategories();
  }, []);

  return (
    <>
      <div className="h-64 sm:h-64 xl:h-80 2xl:h-96 p-4">
        <Carousel>
          {bestSeller.map((item, index) => (
            <img src={item.image} alt={item.name} key={item._id} className={"object-bottom"}/>
          ))}
        </Carousel>
      </div>

      <div className="p-4 grid grid-cols-2">
        <Link to={`/${id}/products`} className={"bg-white border p-8 m-1 text-center align-middle rounded-lg shadow"}>
          <h1 className={"text-lg font-bold text-black"}>Tất cả</h1>
          <h1 className={"font-bold text-black"}>({categories.reduce((acc, item) => {
            return acc + item.products
          }, 0)})</h1>
        </Link>
        {categories.map((item, index) => (
          <Link to={`/${id}/products?category=${item.slug}`} className={`bg-white border p-8 m-1 text-center align-middle rounded-lg shadow ${index} ${((index % 2) && (index === (categories.length - 1))) ? "col-span-2" : ""}`} key={item._id}>
            <h1 className={"text-lg font-bold text-black"}>{item.name}</h1>
            <h1 className={"font-bold text-black"}>({item.products})</h1>
          </Link>
        ))}
      </div>
    </>
  );
}