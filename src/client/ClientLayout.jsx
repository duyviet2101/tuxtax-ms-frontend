import {
  Button, Drawer, Modal,
  ModalBody, ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeadCell, TableRow
} from "flowbite-react";
import {Link, Outlet, useParams} from "react-router-dom";
import {HiShoppingCart} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {FaHome, FaSearch} from "react-icons/fa";
import {MdOutlineShoppingCartCheckout} from "react-icons/md";

export default function ClientLayout() {
  const {id} = useParams();
  const [table, setTable] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  const fetchTable = async () => {
    try {
      const res = await axios.get(`/tables/${id}`)
      setTable(res.data);
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    fetchTable();
  }, []);

  if (!table) return null;

  return (
    <div className="w-screen h-screen bg-gray-200 overflow-auto" id={"products-container"}>
      <Navbar fluid rounded>
        <NavbarBrand as={Link} to={`/${id}`}>
          <img src="/Logo-tuxtax.png" className="mr-3 h-6 sm:h-9" alt="Tuxtax logo"/>
          <div className={"flex flex-col gap-1"}>
            <span className="text-sm font-bold text-gray-800 text-wrap">TUXTAX ẨM THỰC THÁI LAN</span>
            <span className="text-sm font-bold text-gray-800 text-wrap">Bàn: {table.floor.slug}-{table.name}</span>
          </div>
        </NavbarBrand>
        <div className={"flex gap-2"}>
          <div className={"text-black p-2 cursor-pointer hover:bg-blue-200 rounded-lg"}>
            <FaSearch className="h-7 w-7"/>
          </div>
          <div onClick={() => setIsOpen(true)} className={"text-black p-2 cursor-pointer hover:bg-blue-200 rounded-lg"}>
            <HiShoppingCart className="h-7 w-7"/>
          </div>
        </div>
      </Navbar>
      <Navbar fluid rounded className={"p-1 font-bold text-sm border-t cursor-pointer"}>
        <Link to={`/${id}`}
              className={"text-gray-800 w-1/2 h-full p-2 flex gap-2 items-center justify-center active:bg-gray-300 transition rounded py-2"}>
          <FaHome className="h-5 w-5"/>
          <h1 className={""}>Trang chủ</h1>
        </Link>
        <div className={"text-gray-800 w-1/2 h-full p-2 flex gap-2 items-center justify-center active:bg-gray-300 transition rounded py-2"}>
          <MdOutlineShoppingCartCheckout className="h-5 w-5"/>
          <h1 className={""}>Thanh toán</h1>
        </div>
      </Navbar>

      {id && <Outlet/>}

      <Drawer open={isOpen} onClose={handleClose} position={"right"} className={"w-screen"}>
        <Drawer.Header title="Drawer" />
        <Drawer.Items>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Supercharge your hiring by taking advantage of our&nbsp;
            <a href="#" className="text-cyan-600 underline hover:no-underline dark:text-cyan-500">
              limited-time sale
            </a>
            &nbsp;for Flowbite Docs + Job Board. Unlimited access to over 190K top-ranked candidates and the #1 design
            job board.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <a
              href="#"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Learn more
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-lg bg-cyan-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Get access&nbsp;
              <svg
                className="ms-2 h-3.5 w-3.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </Drawer.Items>
      </Drawer>
    </div>
  );
}