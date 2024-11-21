import {HiShoppingCart} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {MdOutlineShoppingCartCheckout} from "react-icons/md";
import {formatVND} from "../helpers/parsers.js";
import {Button, Select} from "flowbite-react";
import pushToast from "../helpers/sonnerToast.js";
import useLocalStorageState from "use-local-storage-state";
import {axios} from "../services/requests.js";

export default function ClientCheckout() {
  const [orderId, setOrderId] = useLocalStorageState("orderId", {
    defaultValue: null,
  });
  const [order, setOrder] = useState(null);
  const [checkoutMethod, setCheckoutMethod] = useState("banking");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${orderId}`);
      setOrder(res.data)
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  const onPay = async () => {
    const confirm = window.confirm("Xác nhận thanh toán?");
    if (!confirm) return;

    if (checkoutMethod === "cash") {

    } else {
      try {
        const res = await axios.post(`/checkout/create-payment-url`, {
          orderId: orderId
        });
        window.location.href = res.data;
      } catch (error) {
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    }
  }

  if (!order) return null;

  return (
    <>
      <div className={"text-gray-800"}>
        <div className={"flex gap-2 items-center px-8 mt-4"}>
          <MdOutlineShoppingCartCheckout className="h-7 w-7"/>
          <h1 className={"text-2xl font-bold p-2"}>Thanh toán</h1>
        </div>
        <div className={"p-4 m-4 bg-white rounded-lg"}>
          <div className={"grid grid-cols-1 gap-2"}>
            {order.products.map((item, index) => (
              <div>
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
              </div>
            ))}
          </div>
        </div>
        <div className={"p-4 m-4 bg-white rounded-lg"}>
          <div className={"flex justify-between items-center"}>
            <h1 className={"text-2xl font-bold"}>{order.products.length} Món</h1>
            <h1
              className={"text-2xl font-bold"}>{formatVND(order.products.reduce((acc, item) => acc + item.price * item.quantity, 0))}</h1>
          </div>
          <h1 className={"font-bold mt-4 text-lg"}>Chiết khấu</h1>
          <div className={"flex justify-between items-center"}>
            {order?.discounts?.map((item, index) => (
              <div className={"flex justify-between items-center"} key={index}>
                <h1 className={""}>{item.reason}</h1>
                <h1 className={""}>{formatVND(item.value)}</h1>
              </div>
            ))}
            {order?.discounts?.length === 0 && <h1 className={""}>Không có chiết khấu</h1>}
          </div>
          <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
          {!order.isPaid && <div className={"flex justify-between items-center"}>
            <h1 className={"text font-bold"}>Hình thức thanh toán</h1>
            <Select className={""} id={"checkout_method"} name={"checkout_method"}
                    value={checkoutMethod}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
            >
              {/*<option value={"cash"}>Tiền mặt</option>*/}
              <option value={"banking"}>Chuyển khoản</option>
            </Select>
          </div>}
          <div className={"mt-4"}>
            <Button className={"w-full"}
                    disabled={order.isPaid}
                    onClick={onPay}
            >{order.isPaid ? "Đã thanh toán" : "Thanh toán"}</Button>
          </div>
        </div>
      </div>
    </>
  );
}