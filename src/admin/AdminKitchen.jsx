import {useNavigate, useSearchParams} from "react-router-dom";
import {Button, Card} from "flowbite-react";
import {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import {formatVND} from "../helpers/parsers.js";
import pushToast from "../helpers/sonnerToast.js";
import {IoFastFood} from "react-icons/io5";
import {getSocket} from "../socket.js";
const socket = getSocket();

export default function AdminKitchen() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/orders', {
        params: {
          page: 1,
          limit: 1000,
          sortBy: "createdAt",
          order: "asc",
          filters: "status:pending",
        }
      })

      setOrders(res?.data?.docs);

    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const onUpdateStatusProductInOrder = async (orderId, product) => {
    try {
      const res = await axios.patch(`/orders/${orderId}/products`, {
        product: product.product._id,
        status: product?.status === "pending" ? "cooking" : "completed",
        option: product.option
      });
      pushToast("Cập nhật trạng thái thành công", "success");
      fetchOrders();
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  };

  const onCompleteOrder = async (orderId) => {
    try {
      const res = await axios.patch(`/orders/${orderId}`, {
        status: "completed"
      });
      pushToast("Hoàn thành order thành công", "success");
      fetchOrders();
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    // Join the "admins" room
    socket.emit("joinAdmin");

    // Listen for new order notifications
    socket.on("UPDATE_ORDERS", (data) => {
      pushToast(`Danh sách order có cập nhật!`, "success");
      fetchOrders();
    });

    // Cleanup
    return () => {
      socket.off("UPDATE_ORDERS");
    };
  }, []);

  if (!orders) return null;

  return (
    <div className={"flex items-center h-full w-full"}>
      <div className="relative h-full flex flex-col flex-wrap gap-6 p-8">
        {orders.map(order => (
          <div className={"w-96 mr-8 shadow-lg"}>
            <div className={"bg-blue-400 p-4 rounded-t-lg flex justify-between"}>
              <div>
                <span className={"font-bold"}>Bàn: </span>
                <span>{order?.table?.floor?.slug}-{order?.table?.name}</span>
              </div>
              <Button size={"xs"} color={"info"} onClick={() => onCompleteOrder(order._id)}>Trả hết</Button>
            </div>
            <div>
              {order.products.map(product => (
                <div className={`flex justify-between items-center p-4 bg-${product.status === "pending" ? "gray" : "blue"}-200 border-t border-gray-400 relative cursor-pointer hover:bg-gray-100 ${product.status === "completed" ? "hidden" : ""}`}
                     onClick={() => onUpdateStatusProductInOrder(order._id, product)}
                >
                  <div className={"flex"}>
                    <IoFastFood className={"h-5 w-5 mr-2"}/>
                    <div>
                      <span className={"font-bold"}>{product.product.name}</span>
                      <h1 className={"text-sm font-medium"}>Loại: {product.option || "Mặc định"}</h1>
                    </div>
                  </div>
                  <div className={"flex flex-col gap-1 items-end justify-center"}>
                    <div className={"p-1 h-fit w-fit bg-sky-600 rounded-md flex justify-between items-center"}>
                      <span className={"text-sm text-white font-bold "}>{product.quantity}</span>
                      <span className={"text-xs text-white"}>/{product.totalAll}</span>
                    </div>
                    {product.status === "cooking" && <span className={"text-xs text-red-600 font-bold"}>Đang nấu</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && (
        <div className={"w-full h-full flex items-center justify-center"}>
          <h1 className={"text-center text-4xl font-bold"}>Không có order</h1>
        </div>
      )}
    </div>
  );
}