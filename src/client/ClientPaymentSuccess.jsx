import {FaCheck} from "react-icons/fa";
import {Button} from "flowbite-react";
import {IoClose} from "react-icons/io5";
import {Link, useParams, useSearchParams} from "react-router-dom";
import {axios} from "../services/requests.js";
import {useEffect, useState} from "react";

export default function ClientPaymentSuccess() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(false);
  const {id} = useParams();

  const verifyPayment = async () => {
    try {
      const res = await axios.get(`/checkout/vnpay-return?${searchParams.toString()}`);
      if (res?.data?.code === "00") {
        setStatus(true);
      } else {
        console.error(res?.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-200 overflow-auto text-gray-800">
      <div className={"h-full px-8 flex flex-col gap-8"}>
        {status ? <FaCheck className="text-9xl text-green-500 mx-auto mt-20"/> : <IoClose className="text-9xl text-red-500 mx-auto mt-20"/>}
        <h1 className="text-4xl font-bold text-center mt-10">Thanh toán {status ? "thành công!" : "thất bại!"}!</h1>
        <p className="text-lg text-center font-medium mt-5">{status ? "Cảm ơn đã sử dụng dịch vụ!" : "Vui lòng thử lại sau!"}</p>
        <Button className="mx-auto" pill outline color={"dark"} onClick={() => window.location.href = `/${id}`}>
          <IoClose className="h-5 w-5 mr-2"/>
          Đóng
        </Button>
      </div>
    </div>
  );
}