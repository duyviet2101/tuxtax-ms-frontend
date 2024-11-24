import moment from "moment";
import {formatVND} from "../helpers/parsers.js";
import {forwardRef} from "react";

const Bill = forwardRef((props, ref) => {
  const {order} = props;
  const product = order.products.map(item => ({
    name: item.product.name,
    quantity: item.quantity,
    price: formatVND(item.price),
    total: formatVND(item.price * item.quantity),
    _id: item._id
  }));

  return (
    <div className={"hidden"}>
      <div className="flex justify-center text-black" ref={ref}>
        <div className="w-[700px] h-full p-4 box-border my-2">
          <div className={"text-center"}>
            <h1 className="text-xl font-bold">
              Tux-Tax Ẩm Thực Thailand
            </h1>
            <h1 className="">
              17B Hàn Thuyên, Hai Bà Trưng, Hà Nội
            </h1>
            <h1 className="">
              Hotline: 0963607229
            </h1>
            <hr className={"border-t-2 text-black border-dashed border-t-black my-2"}/>
          </div>
          <div className={"flex flex-col gap-2"}>
            <div>
              <h1 className="text-xl font-bold text-center">
                HOÁ ĐƠN
              </h1>
              <h1 className="text-center">
                Mã HĐ: {order?.billCode}
              </h1>
            </div>
            <div className={"flex flex-col gap-1"}>
              <h1 className="">
                <b>Khách hàng:</b> {order?.name || "Khách lẻ"}
              </h1>
              <h1 className="">
                <b>SĐT:</b> {order?.phone || "N/A"}
              </h1>
              <h1 className="">
                <b>Bàn:</b> {order?.table?.floor?.slug}-{order?.table?.name}
              </h1>
              <h1 className="">
                <b>Ngày tạo:</b> {moment(order?.createdAt).format("HH:mm DD/MM/YYYY")}
              </h1>
              <h1 className="">
                <b>Thanh toán:</b> {moment(order?.paidAt).format("HH:mm DD/MM/YYYY")}
              </h1>
            </div>
            <div className={"mt-4"}>
              <table className={"border-0"}>
                <thead className={"border-0"}>
                <tr>
                  {tableFields.map((field) => (
                    <th key={field.key} className={"border-y-2 border-y-black border-dashed p-2 border-x-0 text-left"}>
                      {field.label}
                    </th>
                  ))}
                </tr>
                </thead>
                <tbody className={"border-0"}>
                  {product.map((item) => (
                    <tr key={item._id}>
                      {tableFields.map((field) => (
                        <td key={field.key + "-" + item._id} className={`text-black border-y border-y-black border-dashed p-2 border-x-0 ${(field.key === 'price' || field.key === 'total') ? "text-right" : ""}`}>
                          {item[field.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <hr className={"border-t-2 text-black border-dashed border-t-black my-2"}/>
            <div>
              <div className={"flex justify-between"}>
                <h1 className="font-bold">
                  Thành tiền:
                </h1>
                <h1 className="mr-2">
                  {formatVND(order?.total)}
                </h1>
              </div>
              <div className={"flex justify-between"}>
                <h1 className="font-bold">
                  Hình thức:
                </h1>
                <h1 className="mr-2">
                  {order?.checkoutMethod === "banking" ? "Chuyển khoản" : order?.checkoutMethod === "cash" ? "Tiền mặt" : "N/A"}
                </h1>
              </div>
              {/*<div className={"flex mt-4"}>*/}
              {/*  <img src={"/QR_Checkout.png"} alt={"QR CHECK OUT"} className={"h-40"}/>*/}
              {/*  <div className={"flex justify-center items-center flex-col w-full"}>*/}
              {/*    <h1 className="text-center text-lg">*/}
              {/*      Techcombank*/}
              {/*    </h1>*/}
              {/*    <h1 className="text-center text-lg">*/}
              {/*      STK: 1015308512*/}
              {/*    </h1>*/}
              {/*    <h1 className="text-center text-lg">*/}
              {/*      CTK: HOANG THI THUY*/}
              {/*    </h1>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

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

export default Bill;