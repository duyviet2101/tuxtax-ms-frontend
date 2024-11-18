import {useNavigate, useParams} from "react-router-dom";
import {Button} from "flowbite-react";
import {BiArrowBack} from "react-icons/bi";
import {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {formatVND} from "../helpers/parsers.js";
import moment from "moment/moment.js";

export default function AdminCheckout() {
  const {id} = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`/orders/${id}`);
      setOrder(res.data)
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

    try {
      await axios.patch(`/orders/${id}/is-paid`, {
        isPaid: true
      });
      pushToast("Thanh toán thành công", "success");
      fetchOrder();
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  if (!order) return <div>Loading...</div>;

  return (
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
            <div className="flex flex-col gap-4">
              {order?.products?.map((product, index) => (
                <div key={product._id} className="flex justify-between items-center mb-2">
                  <div className={"flex flex-col gap-1 justify-center"}>
                    <span className="text-lg text-black">{product.quantity} x {product.product.name}</span>
                    <span className="text-sm text-gray-500">Loại: {product.option || "Mặc định"}</span>
                  </div>
                  <span className="text-lg text-black">{formatVND(product.price * product.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 p-4 bg-blue-400 rounded-lg">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold">
                Tổng
              </h1>
              <h1 className="text-xl font-bold">
                {formatVND(order?.total)}
              </h1>
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
              <Button className="w-full mt-2"
                      gradientDuoTone={"purpleToPink"}
                      size={"lg"}
              >
                In hoá đơn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}