import {HiShoppingCart} from "react-icons/hi";
import React, {useEffect, useState} from "react";
import {MdOutlineShoppingCartCheckout} from "react-icons/md";
import {formatVND} from "../helpers/parsers.js";
import {Button, Select} from "flowbite-react";
import pushToast from "../helpers/sonnerToast.js";
import useLocalStorageState from "use-local-storage-state";
import {axios} from "../services/requests.js";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function ClientCheckout() {
  const {id} = useParams();
  const [orderId, setOrderId] = useLocalStorageState("orderId", {
    defaultValue: null,
  });
  const [order, setOrder] = useState(null);
  const [checkoutMethod, setCheckoutMethod] = useState("banking");
  const {t} = useTranslation();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${orderId}`);

      if (res.data.table._id === id) {
        setOrder(res.data);
      } else {
        setOrderId(null);
        setOrder(null);
      }
    } catch (error) {
      // pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    fetchOrder();
  }, []);

  const onPay = async () => {
    const confirm = window.confirm(t("checkout.confirmMessage"));
    if (!confirm) return;

    if (checkoutMethod === "cash") {

    } else {
      try {
        const res = await axios.post(`/checkout/create-payment-url`, {
          orderId: orderId,
          returnUrl: `${window.location.origin}/${id}/payment-success`,
        });
        window.location.href = res.data;
      } catch (error) {
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    }
  }

  if (!order || !orderId) return (
    <>
      <div className={"text-gray-800"}>
        <div className={"flex gap-2 items-center px-8 mt-4"}>
          <HiShoppingCart className="h-7 w-7"/>
          <h1 className={"text-2xl font-bold p-2"}>{t("checkout.title")}</h1>
        </div>
        <div className={"p-4 m-4 bg-white rounded-lg"}>
          <h1 className={"text-2xl font-bold"}>{t("checkout.noOrder")}</h1>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className={"text-gray-800"}>
        <div className={"flex gap-2 items-center px-8 mt-4"}>
          <MdOutlineShoppingCartCheckout className="h-7 w-7"/>
          <h1 className={"text-2xl font-bold p-2"}>{t("checkout.title")}</h1>
        </div>
        <div className={"p-4 m-4 bg-white rounded-lg"}>
          <div className={"grid grid-cols-1 gap-2"}>
            {order.products.map((item, index) => (
              <div>
                <div className={"flex justify-between items-center p-2"} key={index}>
                  <div>
                    <h1 className={"text-lg font-bold"}>{item.product.name}</h1>
                    <h1 className={""}>{t("checkout.quantity")}: {item.quantity}</h1>
                    <h1 className={""}>{t("checkout.price")}: {formatVND(item.price)}</h1>
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
            <h1 className={"text-2xl font-bold"}>{order.products.length} {t("cart.dishes")}</h1>
            <h1
              className={"text-2xl font-bold"}>{formatVND(order.products.reduce((acc, item) => acc + item.price * item.quantity, 0))}</h1>
          </div>
          <h1 className={"font-bold mt-4 text-lg"}>{t("checkout.discount")}</h1>
          <div className={"flex justify-between items-center"}>
            {order?.discounts?.map((item, index) => (
              <div className={"flex justify-between items-center"} key={index}>
                <h1 className={""}>{item.reason}</h1>
                <h1 className={""}>{formatVND(item.value)}</h1>
              </div>
            ))}
            {order?.discounts?.length === 0 && <h1 className={""}>{t("checkout.noDiscount")}</h1>}
          </div>
          <hr className={"my-2 border-0 border-dashed border-b-2 border-b-gray-400"}/>
          {!order.isPaid && <div className={"flex justify-between items-center"}>
            <h1 className={"text font-bold"}>{t("checkout.paymentMethod")}</h1>
            <Select className={""} id={"checkout_method"} name={"checkout_method"}
                    value={checkoutMethod}
                    onChange={(e) => setCheckoutMethod(e.target.value)}
            >
              {/*<option value={"cash"}>Tiền mặt</option>*/}
              <option value={"banking"}>{t("checkout.banking")}</option>
            </Select>
          </div>}
          <div className={"mt-4"}>
            <Button className={"w-full"}
                    disabled={order.isPaid}
                    onClick={onPay}
            >{order.isPaid ? t("checkout.isPaid") : t("checkout.title")}</Button>
          </div>
        </div>
      </div>
    </>
  );
}