import {useNavigate, useParams} from "react-router-dom";
import {Button, Select, Table, TextInput} from "flowbite-react";
import {BiArrowBack} from "react-icons/bi";
import React, {useEffect, useRef, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {formatVND} from "../helpers/parsers.js";
import moment from "moment/moment.js";
import Bill from "../comps/Bill.jsx";
import {useReactToPrint} from "react-to-print";
import {FaCircleMinus} from "react-icons/fa6";
import {IoAddCircle} from "react-icons/io5";
import {FaCheck} from "react-icons/fa";

export default function AdminCheckout() {
  const {id} = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();
  const billRef = useRef(null);
  const product = order?.products?.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: formatVND(item.price),
    total: formatVND(item.price * item.quantity),
    _id: item._id
  })) || [];
  const [discounts, setDiscounts] = useState([]);
  const [checkoutMethod, setCheckoutMethod] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${id}`);
      setOrder(res.data)
      setDiscounts(res.data.discounts || []);
      setCheckoutMethod(res.data.checkoutMethod);
    } catch (error) {
      navigate('/admin/orders');
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
      try {
        await axios.patch(`/orders/${id}/is-paid`, {
          isPaid: true
        });
        pushToast("Thanh toán thành công", "success");
        fetchOrder();
      } catch (error) {
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    } else if (checkoutMethod === "banking") {
      try {
        const res = await axios.post(`/checkout/create-payment-url`, {
          orderId: id,
          returnUrl: `${window.location.origin}/admin/payment-success`
        });
        window.location.href = res.data;
      } catch (error) {
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    } else {
      pushToast("Chưa chọn phương thức thanh toán", "error");
    }
  }

  const addDiscount = async ({reason, value}) => {
    try {
      await axios.patch(`/orders/${id}/discounts`, {
        reason,
        value
      });
      fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  const removeDiscount = async (discountId) => {
    try {
      await axios.delete(`/orders/${id}/discounts/${discountId}`);
      fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  const handlePrint = useReactToPrint({
    contentRef: billRef,
    documentTitle: `Bill-${order?.billCode}`,
    pageStyle: `
      @page {
        size: 120mm 297mm;
        margin: 0;
      }
      @media print {
        body {
          margin: 0;
        }
      }
    `
  })

  const onReversePay = async () => {
    const confirm = window.confirm("Xác nhận hoàn tác thanh toán?");
    if (!confirm) return;

    try {
      await axios.patch(`/orders/${id}/is-paid`, {
        isPaid: false
      });
      pushToast("Hoàn tác thanh toán thành công", "success");
      fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  if (!order) return <div>Loading...</div>;

  return (
    <>
      <Bill order={order} ref={billRef}/>
      <div className="min-h-full bg-blue-100">
        <div className="p-4 grid grid-cols-3 sticky top-0 bg-blue-400 z-40">
          <Button className="w-fit"
                  onClick={() => navigate(-1)}
          >
            <BiArrowBack className={"mr-2 h-5 w-5"}/>
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold text-center col-span-1">
            Hoá đơn: {order?.table?.floor?.slug}-{order?.table?.name}
          </h1>
        </div>
        <div className="flex items-start justify-center w-full">
          <div className="w-full p-4 flex flex-col gap-4">
            <div className="p-4 bg-white rounded-lg">
              <div>
                <h1 className="text-xl font-bold mb-2">
                  Khách: {order?.name || "Khách lẻ"}
                </h1>
                <h1 className="text-xl font-bold mb-2">
                  SĐT: {order?.phone || "N/A"}
                </h1>
                <h1 className="text-lg mb-2">
                  Mã HĐ: {order?.billCode}
                </h1>
                <h1 className="text-lg mb-2">
                  Tên bàn: {order?.table?.floor?.slug}-{order?.table?.name}
                </h1>
                <h1 className="text-lg mb-2">
                  Tầng: {order?.table?.floor?.name}
                </h1>
                <h1 className="text-lg mb-2">
                  Ngày tạo: {moment(order?.createdAt).format("HH:mm DD/MM/YYYY")}
                </h1>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h1 className="text-xl font-bold mb-2">
                Danh sách món
              </h1>
              <div className={"mt-4 w-full"}>
                <table className={"border-0 w-full"}>
                  <thead className={"border-0"}>
                  <tr>
                    <th className={"border-y-2 border-y-black border-dashed p-2 border-x-0 text-left"}>
                      Tên món
                    </th>
                    <th className={"border-y-2 border-y-black border-dashed p-2 border-x-0 text-right"}>
                      Số lượng
                    </th>
                    <th className={"border-y-2 border-y-black border-dashed p-2 border-x-0 text-right"}>
                      Đơn giá
                    </th>
                    <th className={"border-y-2 border-y-black border-dashed p-2 border-x-0 text-right"}>
                      Thành tiền
                    </th>
                  </tr>
                  </thead>
                  <tbody className={"border-0"}>
                  {product.map((item) => (
                    <tr key={item._id}>
                      {tableFields.map((field) => (
                        <td key={field.key + "-" + item._id}
                            className={`text-black border-y border-y-black border-dashed p-2 border-x-0 ${(field.key === 'price' || field.key === 'total' || field.key === 'quantity') ? "text-right" : ""}`}>
                          {item[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="sticky bottom-0 p-4 bg-white rounded-lg">
              <div className="flex justify-between">
                <h1 className="text-xl font-bold">
                  Thanh toán
                </h1>
                <h1 className="text-xl font-bold">
                  {formatVND(order?.total)}
                </h1>
              </div>
              <div className={"my-2"}>
                <div className={"flex items-center justify-between mb-2"}>
                  <h1 className="text-lg">
                    Chiết khấu
                  </h1>
                  <div>
                    {!order.isPaid ? <Button
                      color="blue"
                      onClick={() => {
                        setDiscounts([...discounts, {reason: "", value: null}]);
                      }}
                      size={"xs"}
                    >
                      <IoAddCircle className="h-5 w-5"/>
                    </Button> : (
                      <h1 className="text-lg font-bold">
                        {order?.discounts?.length} chiết khấu
                      </h1>
                    )}
                  </div>
                </div>
                <div className="grid gap-2 grid-cols-1">
                  {discounts?.map((discount, index) => (
                    <div key={index} className={"flex gap-2"}>
                      <TextInput
                        className="w-full"
                        type="text"
                        placeholder="Lý do chiết khấu"
                        value={discount.reason}
                        onChange={(e) => {
                          const newDiscounts = [...discounts];
                          newDiscounts[index].reason = e.target.value;
                          setDiscounts(newDiscounts);
                        }}
                        disabled={order.isPaid}
                      />
                      <TextInput
                        className="w-full"
                        type="number"
                        placeholder="Giá trị (vnđ)"
                        value={discount.value}
                        onChange={(e) => {
                          if (isNaN(e.target.value) || parseInt(e.target.value) < 0) {
                            e.target.value = 0;
                            return;
                          }

                          const newDiscounts = [...discounts];
                          newDiscounts[index].value = parseInt(e.target.value);
                          setDiscounts(newDiscounts);
                        }}
                        disabled={order.isPaid}
                      />
                      {!discount._id && <Button
                        color="warning"
                        className={"flex items-center justify-center"}
                        onClick={() => {
                          addDiscount(discount);
                        }}
                        size={"xs"}
                      >
                        <FaCheck className="h-5 w-5"/>
                      </Button>}
                      {!order.isPaid && <Button
                        color="failure"
                        className={"flex items-center justify-center"}
                        onClick={() => {
                          const newDiscounts = [...discounts];
                          newDiscounts.splice(index, 1);
                          setDiscounts(newDiscounts);
                          if (discount._id) {
                            removeDiscount(discount._id);
                          }
                        }}
                        size={"xs"}
                      >
                        <FaCircleMinus className="h-5 w-5"/>
                      </Button>}
                    </div>
                  ))}
                </div>
              </div>
              <div className={"py-2 flex justify-between items-center"}>
                <h1 className="text-lg">
                  Phương thức thanh toán
                </h1>
                <Select
                  value={checkoutMethod}
                  onChange={(e) => {
                    setCheckoutMethod(e.target.value);
                  }}
                  disabled={order.isPaid}
                >
                  <option value="">Chọn phương thức</option>
                  <option value="cash">Tiền mặt</option>
                  <option value="banking">Chuyển khoản</option>
                </Select>
              </div>
              <div className={"flex gap-2"}>
                <Button className="w-full mt-2"
                        gradientDuoTone={"greenToBlue"}
                        onClick={onPay}
                        disabled={order?.isPaid}
                        size={"lg"}
                >
                  {order?.isPaid ? "Đã thanh toán" : "Thanh toán"}
                </Button>
                {order.isPaid && <Button className="w-full mt-2"
                                         gradientDuoTone={"purpleToBlue"}
                                         onClick={onReversePay}
                                         size={"lg"}
                >
                  Hoàn tác thanh toán
                </Button>}
                <Button className="w-full mt-2"
                        gradientDuoTone={"purpleToPink"}
                        size={"lg"}
                        onClick={handlePrint}
                >
                  In hoá đơn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const tableFields = [
  {
    key: "name",
    label: "Tên món",
  },
  {
    key: "quantity",
    label: "SL",
  },
  {
    key: "price",
    label: "Đơn giá",
  },
  {
    key: "total",
    label: "Thành tiền",
  }
]