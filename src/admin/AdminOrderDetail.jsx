import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import pushToast from "../helpers/sonnerToast.js";
import {Button, HR, Progress} from "flowbite-react";
import {BiArrowBack, BiMinus, BiPlus} from "react-icons/bi";
import {formatVND} from "../helpers/parsers.js";
import {FaRegCheckCircle} from "react-icons/fa";
import {PiBowlFoodFill, PiCookingPotFill} from "react-icons/pi";
import moment from "moment";

function ProductOrderCard({
  product
}) {
  console.log(product)
  if (!product) return null;
  return (
    <div className="bg-blue-200 p-2 rounded-lg flex flex-col gap-2">
      <div className="flex gap-4 items-center justify-between">
        <div className="flex gap-2 items-center ml-2">
          <h1 className="text-lg font-bold">SL:</h1>
          <div className="w-32 max-w-sm relative">
            <div className="relative">
              <button
                id="decreaseButton"
                className="absolute right-9 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <BiMinus className="h-4 w-4"/>
              </button>
              <input
                id="amountInput"
                type="number"
                value="0"
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                id="increaseButton"
                className="absolute right-1 top-1 rounded bg-slate-800 p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <BiPlus className="h-4 w-4"/>
              </button>
            </div>
          </div>
          <h1 className="text-lg font-bold ml-4">{product.product.name}</h1>
        </div>
        <h1 className="text-lg font-bold mr-2">{formatVND(product.price * product.quantity)}</h1>
      </div>
      <div className="my-4">
        <div className="grid grid-cols-[0.1fr,2fr,0.1fr,2fr,0.1fr] gap-4 items-center">
          <div className={`col-start-1 flex justify-center`}>
            <FaRegCheckCircle className={"h-7 w-7 text-blue-600"}/>
          </div>
          <div className={`col-start-2`}>
            <Progress
              className={`w-full`}
              progress={product.status === "cooking" ? 100 : 0}
            />
          </div>
          <div className={`col-start-3 flex justify-center`}>
            <PiCookingPotFill className={"h-7 w-7 text-blue-600"}/>
          </div>
          <div className={`col-start-4`}>
            <Progress
              className={`w-full`}
              progress={product.status === "cooking" ? 100 : 0}
            />
          </div>
          <div className={`col-start-5 flex justify-center`}>
            <PiBowlFoodFill className={"h-7 w-7 text-blue-600"}/>
          </div>
        </div>
        <HR className={"my-6"}/>
        <div className={"flex gap-2 justify-center"}>
          <Button gradientMonochrome={"info"}>Cập nhật số lượng</Button>
          <Button gradientMonochrome={"failure"}>Sửa giá</Button>
          <Button gradientMonochrome={"cyan"}>Đang nấu</Button>
          <Button gradientMonochrome={"success"}>Trả món</Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminOrderDetail() {
  const {id} = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/orders/${id}`);
        setOrder(res.data)
      } catch (error) {
        pushToast(error?.response?.data?.message || e?.message, "error");
      }
    }
    fetchOrder();
  }, []);

  if (!order) return (<div>Loading...</div>)
  return (
    <>
      <div className="p-4 bg-blue-400 grid grid-cols-3">
        <Button className="w-fit"
                onClick={() => navigate(-1)}
        >
          <BiArrowBack className={"mr-2 h-5 w-5"}/>
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold text-center col-span-1">
          Bàn {order?.table?.name} - {order?.table?.floor?.name}
        </h1>
      </div>
      <div className="flex items-start justify-center h-full w-full">
        <div className="relative h-full w-full p-4 bg-blue-100 flex flex-col gap-4">
          <div className="p-4 bg-white rounded-lg">
            <div>
              <h1 className="text-xl font-bold mb-2">
                Mã HĐ: {order?.billCode}
              </h1>
              <h1 className="text-xl font-bold mb-2">
                Tên bàn: {order?.table?.name}
              </h1>
              <h1 className="text-xl font-bold mb-2">
                Tầng: {order?.table?.floor?.name}
              </h1>
              <h1 className="text-xl font-bold mb-2">
                Ngày tạo: {moment(order?.createdAt).format("HH:mm DD/MM/YYYY")}
              </h1>
            </div>
            <div className={"flex gap-2"}>
              <Button gradientDuoTone={"greenToBlue"}>Thanh toán</Button>
              <Button gradientDuoTone={"cyanToBlue"}>Thêm món</Button>
              <Button gradientDuoTone={"redToYellow"}>Chuyển bàn</Button>
              <Button gradientDuoTone={"pinkToOrange"}>Tách bàn</Button>
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h1 className="text-xl font-bold mb-2">
              Danh sách món
            </h1>
            <div className="flex flex-col gap-2">
              {
                order?.products?.map((product) => (
                  <ProductOrderCard product={product} key={product.product._id}/>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const foodStatus = {
  "pending": "Chờ xác nhận",
  "cooking": "Đang nấu",
  "completed": "Hoàn thành",
}