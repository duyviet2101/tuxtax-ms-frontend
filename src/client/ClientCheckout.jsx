import {HiShoppingCart} from "react-icons/hi";
import React from "react";
import {MdOutlineShoppingCartCheckout} from "react-icons/md";
import {formatVND} from "../helpers/parsers.js";
import {Button, Select} from "flowbite-react";
import pushToast from "../helpers/sonnerToast.js";

export default function ClientCheckout() {
  return (
    <>
      <div className={"text-gray-800"}>
        <div className={"flex gap-2 items-center px-8 mt-4"}>
          <MdOutlineShoppingCartCheckout className="h-7 w-7"/>
          <h1 className={"text-2xl font-bold p-2"}>Thanh toán</h1>
        </div>
        <div className={"p-4 m-4 bg-white rounded-lg"}>
          <div className={"grid grid-cols-1 gap-2"}>
            {cart.map((item, index) => (
              <>
                <div className={"flex justify-between items-center p-2"} key={index}>
                  <div>
                    <h1 className={"text-lg font-bold"}>{item.product.name}</h1>
                    <h1 className={""}>Số lượng: {item.quantity}</h1>
                    <h1 className={""}>Đơn giá: {formatVND(item.price)}</h1>
                  </div>
                  <div className={"flex"}>
                    <h1 className={"text-lg font-bold"}>{formatVND(item.price * item.quantity)}</h1>
                  </div>
                </div>
                <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
              </>
            ))}
          </div>
        </div>
        <div className={"p-4 m-4 bg-white rounded-lg"}>
          <div className={"flex justify-between items-center"}>
            <h1 className={"text-2xl font-bold"}>{cart.length} Món</h1>
            <h1
              className={"text-2xl font-bold"}>{formatVND(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}</h1>
          </div>
          <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
          <div className={"flex justify-between items-center"}>
            <h1 className={"text font-bold"}>Hình thức thanh toán</h1>
            <Select className={""} id={"checkout_method"} name={"checkout_method"}>
              <option value={1}>Tiền mặt</option>
              <option value={2}>Chuyển khoản</option>
            </Select>
          </div>
          <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
          <div>
            <h1 className={"text font-bold"}>Thông tin chuyển khoản</h1>
            <div className={"flex mt-4"}>
              <img src={"/QR_Checkout.png"} alt={"QR CHECK OUT"} className={"h-40"}/>
              <div className={"flex justify-center items-center flex-col w-full"}>
                <h1 className="text-center text-lg">
                  Techcombank
                </h1>
                <h1 className="text-center text-lg">
                  STK: 1015308512
                </h1>
                <h1 className="text-center text-lg">
                  CTK: HOANG THI THUY
                </h1>
              </div>
            </div>
          </div>
          <div className={"mt-4"}>
            <Button className={"w-full"} onClick={() => {
              pushToast("Nhân viên sẽ đến kiểm tra, vui lòng đợi!", "success")
            }}>Thanh toán</Button>
          </div>
        </div>
      </div>
    </>
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