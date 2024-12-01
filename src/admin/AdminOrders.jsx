import {Badge, Button, Tooltip} from "flowbite-react";
import {FaCartArrowDown, FaHistory} from "react-icons/fa";
import {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import {isNull} from "lodash";
import {MdTableRestaurant} from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";
import pushToast from "../helpers/sonnerToast.js";
import {formatVND} from "../helpers/parsers.js";
import {IoBagCheckOutline} from "react-icons/io5";
import {PiCookingPotDuotone} from "react-icons/pi";
import {getSocket} from "../socket.js";
const socket = getSocket();

export default function AdminOrders() {
  const [floors, setFloors] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const res = await axios.get('/floors', {
          params: {
            limit: 100,
            page: 1
          }
        })
        res?.data?.docs.sort((a, b) => {
          if (a.active && !b.active) {
            return -1;
          }
          if (!a.active && b.active) {
            return 1;
          }
          return 0;
        });
        setFloors(res?.data?.docs);
      } catch (error) {
        pushToast(error?.response?.data?.message || error?.message, "error");
      }
    }
    fetchFloors();
  }, []);

  const fetchTables = async () => {
    const res = await axios.get('/tables', {
      params: {
        limit: 100,
        page: 1,
        floor: selectedFloor
      }
    })
    res?.data?.docs.sort((a, b) => {
      if (a?.order && !b?.order) {
        return -1;
      }
      if (!a?.order && b?.order) {
        return 1;
      }
      return 0;
    });

    setTables(res?.data?.docs);
  }

  useEffect(() => {
    fetchTables();
  }, [selectedFloor]);

  useEffect(() => {
    // Join the "admins" room
    socket.emit("joinAdmin");

    // Listen for new order notifications
    socket.on("SERVER_ADD_ORDER", (data) => {
      // console.log("New order received for Admin:", data);
      pushToast(`Đã nhận order mới cho bàn ${data?.table?.name}`, "success");
      fetchTables();
    });
    socket.on("UPDATE_ORDERS", (data) => {
      pushToast(`Danh sách order có cập nhật!`, "success");
      fetchTables();
    });

    // Cleanup
    return () => {
      socket.off("SERVER_ADD_ORDER");
      socket.off("UPDATE_ORDERS");
    };
  }, []);

  return (
    <div className="flex items-start justify-center h-full w-full">
      <div className="relative h-full w-full p-8">
        <div className="border-b rounded-t-lg flex mb-4">
          <Link to={"/admin/orders"} className="p-4 bg-gray-200 rounded-t-lg text-cyan-600 flex gap-2 hover:cursor-pointer hover:bg-gray-200">
            <FaCartArrowDown className="h-5 w-5"/>
            <h1 className="text-sm font-medium">Quản lý Orders</h1>
          </Link>
          <Link to={"/admin/orders/history"} className="p-4 rounded-t-lg text-gray-600 font-medium flex gap-2 hover:cursor-pointer hover:bg-gray-200">
            <FaHistory className="h-5 w-5"/>
            <h1 className="text-sm">Lịch sử</h1>
          </Link>
        </div>

        <div className="w-full">
          <div className="p-4 bg-gray-300 rounded-xl flex gap-2 overflow-auto">
            <Button className="min-w-24"
                    outline={!isNull(selectedFloor)}
                    gradientDuoTone={"cyanToBlue"}
                    onClick={() => setSelectedFloor(null)}
            >
              Tất cả
            </Button>
            {floors.map((floor, index) => (
              <Button
                key={floor._id}
                gradientDuoTone={colorsButton[Math.floor(index % colorsButton.length)]}
                className="min-w-24"
                outline={selectedFloor !== floor._id}
                onClick={() => setSelectedFloor(floor._id)}
                disabled={!floor.active}
              >{floor.name}</Button>
            ))}
          </div>
          <div className="grid lg:grid-cols-8 sm:grid-cols-6 grid-cols-4 gap-4 mt-4">
            {tables.map((table) => (
              <div key={table._id}
                   className={`bg-${table?.order ? "blue" : "gray"}-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer relative`}
                   onClick={async () => {
                     if (table?.order) {
                       navigate(`/admin/orders/${table.order._id}`);
                     } else {
                       const isConfirm = window.confirm("Bạn có muốn tạo order cho bàn này không?");
                        if (isConfirm) {
                          try {
                            const res = await axios.post('/orders', {
                              table: table._id,
                              name: "Khách lẻ",
                              phone: "N/A",
                              products: [],
                              isAdmin: true
                            });
                            navigate(`/admin/orders/${res?.data?._id}`);
                          } catch (error) {
                            pushToast(error?.response?.data?.message || error?.message, "error");
                          }
                        }
                     }
                   }}
              >
                <span
                  className={`text-center dark:text-gray-200 text-black`}>{`${formatVND(table?.order?.total) || (table?.active ? "Trống" : "Không hoạt động")}`}</span>
                <MdTableRestaurant size={80} className={`text-${table?.order ? "blue" : "gray"}-500`}/>
                <span
                  className={`text-center font-bold dark:text-gray-200 text-black`}>{`${table.floor.slug}-${table.name}`}</span>
                <span
                  className={`text-center dark:text-gray-200 text-black`}>({`${table.capacity} chỗ`})</span>
                <div className={"flex gap-2 mt-2"}>
                  <Tooltip content={isPaid(table?.order)}>
                    <Badge icon={IoBagCheckOutline} color={`${table?.order?.isPaid === true ? "green" : "red"}`} className={""} size={"xs"}></Badge>
                  </Tooltip>
                  <Tooltip content={status(table?.order)}>
                    <Badge icon={PiCookingPotDuotone} color={`${table?.order?.status === "completed" ? "green" : "red"}`} className="" size={"xs"}></Badge>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const colorsButton = [
  "cyanToBlue",
  "greenToBlue",
  "purpleToBlue",
  "purpleToPink",
  "pinkToOrange",
]

const isPaid = (order) => {
  if (!order) {
    return "Trống";
  }

  return order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán";
}

const status = (order) => {
  if (!order) {
    return "Trống";
  }
  return order?.status === "pending" ? "Đang nấu" : "Đã trả hết món";
}