import {
  Button, Checkbox, Drawer, Label, Modal,
  ModalBody, ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  Table,
  TableBody, TableCell,
  TableHead,
  TableHeadCell, TableRow, TextInput
} from "flowbite-react";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {HiShoppingCart} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {FaHome, FaSearch} from "react-icons/fa";
import {MdOutlineShoppingCartCheckout} from "react-icons/md";
import {BiMinus, BiPlus} from "react-icons/bi";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {formatVND} from "../helpers/parsers.js";

export default function ClientLayout() {
  const {id} = useParams();
  const [table, setTable] = useState(null);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const productsCart = cart;
  const [openModalForm, setOpenModalForm] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setOpenCartDrawer(false);

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
          <div onClick={() => setOpenCartDrawer(true)} className={"text-black p-2 cursor-pointer hover:bg-blue-200 rounded-lg"}>
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
        <Link to={`/${id}/checkout`} className={"text-gray-800 w-1/2 h-full p-2 flex gap-2 items-center justify-center active:bg-gray-300 transition rounded py-2"}>
          <MdOutlineShoppingCartCheckout className="h-5 w-5"/>
          <h1 className={""}>Thanh toán</h1>
        </Link>
      </Navbar>

      {id && <Outlet/>}

      <Drawer open={openCartDrawer} onClose={handleClose} position={"right"} className={"w-screen"}>
        <div className={"text-gray-800 relative h-full w-full"}>
          <div className={"flex gap-2 items-center justify-between"}>
            <div className={"flex gap-2 items-center"}>
              <HiShoppingCart className="h-7 w-7"/>
              <h1 className={"text-2xl font-bold p-2"}>Món ăn trong giỏ</h1>
            </div>
            <div className={""} onClick={handleClose}>
              <IoIosCloseCircleOutline
                className={"text-2xl text-white bg-black p-1 rounded-full size-12 active:bg-gray-300 active:text-gray-800 transition"}/>
            </div>
          </div>
          <div className={"flex flex-col gap-2 mt-8"}>
            {productsCart.map((item, index) => (
              <>
                <div key={index} className={"flex justify-between p-2"}>
                  <div className={"flex flex-col gap-1"}>
                    <span className={"font-bold text-xl"}>{item.product.name}</span>
                    <span>{item.option}</span>
                    <span>{item.note}</span>
                  </div>
                  <div className={"flex flex-col gap-1 items-end"}>
                    <div className="w-32 max-w-sm relative">
                      <div className="relative">
                        <button
                          id="decreaseButton"
                          className="absolute right-9 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                          // onClick={() => onChangeQuantity(quantity - 1)}
                        >
                          <BiMinus className="h-4 w-4"/>
                        </button>
                        <input
                          id="amountInput"
                          type="number"
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          value={10}
                          // onChange={(e) => onChangeQuantity(parseInt(e.target.value))}
                        />
                        <button
                          id="increaseButton"
                          className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                          type="button"
                          // onClick={() => onChangeQuantity(quantity + 1)}
                        >
                          <BiPlus className="h-4 w-4"/>
                        </button>
                      </div>
                    </div>
                    <span className={"text-xl font-bold"}>{formatVND(item.price)}</span>
                  </div>
                </div>
                <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
              </>
            ))}
          </div>
          <div className={"flex justify-between items-center p-2 text-xl font-bold"}>
            <h1 className={""}>Tổng cộng:</h1>
            <h1 className={""}>{productsCart.length} món | {formatVND(productsCart.reduce((acc, item) => acc + item.price, 0))}</h1>
          </div>
          <div className={"flex flex-col gap-2 pb-4"}>
            <Button className={"w-full"} size={"xl"} onClick={() => setOpenModalForm(true)}>Xác nhận</Button>
            <Button className={"w-full"} color={"gray"} size={"xl"} onClick={handleClose}>Đóng</Button>
          </div>
        </div>
      </Drawer>

      <Modal show={openModalForm} size={"md"} onClose={() => setOpenModalForm(false)} popup>
        {/*<Modal.Header/>*/}
        <Modal.Body className={"pt-4"}>
          <div className="space-y-3">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Hãy để lại thông tin của bạn!</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Họ Tên"/>
              </div>
              <TextInput
                id="name"
                placeholder="Họ tên của bạn"
                // value={email}
                // onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="SĐT"/>
              </div>
              <TextInput
                id="phone"
                placeholder="Số điện thoại của bạn"
                required
              />
            </div>
            <div className="w-full flex gap-2">
              <Button onClick={() => {
                navigate(`/success`);
              }}>Đặt món</Button>
              <Button onClick={() => setOpenModalForm(false)} color={"gray"}>Đóng</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

const cart = [
  {
    product: {
      _id: "1",
      name: "Cơm gà",
    },
    price: 50000,
    option: "Không ớt",
    note: "Ít dầu giúp em với ạ",
    quantity: 2,
  },
  {
    product: {
      _id: "1",
      name: "bún bò",
    },
    price: 30000,
    option: "Không cay",
    note: "Ít dầu giúp em với ạ",
    quantity: 10,
  },
  {
    product: {
      _id: "1",
      name: "bún riêu",
    },
    price: 30000,
    option: "Không cay",
    note: "Ít dầu giúp em với ạ",
    quantity: 10,
  },
  {
    product: {
      _id: "1",
      name: "Mooping kèm xôi" +
        "",
    },
    price: 500000,
    option: "Không ớt",
    note: "Ít dầu giúp em với ạ",
    quantity: 12,
  },
  {
    product: {
      _id: "1",
      name: "bún bò",
    },
    price: 30000,
    option: "Cay",
    note: "Ít dầu giúp em với ạ",
    quantity: 10,
  },
  {
    product: {
      _id: "1",
      name: "Cơm gà",
    },
    price: 50000,
    option: "Không ớt",
    note: "Ít dầu giúp em với ạ",
    quantity: 2,
  },
  {
    product: {
      _id: "1",
      name: "bún bò",
    },
    price: 30000,
    option: "Không cay",
    note: "Ít dầu giúp em với ạ",
    quantity: 10,
  },
  {
    product: {
      _id: "1",
      name: "bún riêu",
    },
    price: 30000,
    option: "Không cay",
    note: "Ít dầu giúp em với ạ",
    quantity: 10,
  },
  {
    product: {
      _id: "1",
      name: "Mooping kèm xôi" +
        "",
    },
    price: 500000,
    option: "Không ớt",
    note: "Ít dầu giúp em với ạ",
    quantity: 12,
  },
  {
    product: {
      _id: "1",
      name: "bún bò",
    },
    price: 30000,
    option: "Cay",
    note: "Ít dầu giúp em với ạ",
    quantity: 10,
  },
]