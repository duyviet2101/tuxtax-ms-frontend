import {FaCheck} from "react-icons/fa";
import {Button} from "flowbite-react";
import {IoClose} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-gray-200 overflow-auto text-gray-800">
      <div className={"h-full px-8 flex flex-col gap-8"}>
        <FaCheck className="text-9xl text-green-500 mx-auto mt-20" />
        <h1 className="text-4xl font-bold text-center mt-10">Gọi món thành công!</h1>
        <p className="text-lg text-center font-medium mt-5">Chúng tôi sẽ mang món ăn đến cho bạn sớm nhất có thể, vui lòng đợi!</p>
        <Button className="mx-auto" pill outline color={"dark"} onClick={() => navigate(-1)}>
          <IoClose className="h-5 w-5 mr-2" />
          Đóng
        </Button>
      </div>
    </div>
  );
}