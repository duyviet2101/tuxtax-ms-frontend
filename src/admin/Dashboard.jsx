import {Card, Datepicker, Select} from "flowbite-react";
import React, {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import pushToast from "../helpers/sonnerToast.js";
import {formatVND} from "../helpers/parsers.js";

// Đăng ký các thành phần cần thiết
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function IncomesCard() {
  const [incomes, setIncomes] = useState([]);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [by, setBy] = useState("today");
  const [response, setResponse] = useState(null);

  const fetchIncomes = async () => {
    try {
      const res = await axios.get("/dashboard/income", {
        params: {
          from,
          to,
          by
        }
      });
      setIncomes(res.data.incomes.map(item => ({
        _id: item._id,
        total: item.total
      })));
      setResponse(res.data);
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  // Tách dữ liệu để sử dụng trong biểu đồ
  const labels = incomes.map(income => income._id); // Các ngày
  const dataValues = incomes.map(income => income.total); // Tổng thu nhập

  // Cấu hình dữ liệu cho biểu đồ
  const data = {
    labels: labels,
    datasets: [
      {
        // label: `Tổng thu nhập theo ${by}`,
        data: dataValues,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cấu hình biểu đồ
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          callback: function (value, index, values) {
            if (values.length <= 15) {
              return this.getLabelForValue(value);
            }
            return index % 5 === 0 ? this.getLabelForValue(value) : "";
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const onChangeBy = (e) => {
    setBy(e.target.value);
    setFrom(null);
    setTo(null);
  }

  useEffect(() => {
    fetchIncomes();
  }, [by, from, to]);

  if (!response) return null;

  return (
    <Card className={"col-span-2 row-span-2"} >
      <div className="w-full h-full">
        <div className={"flex justify-between items-center"}>
          <span className="text-2xl font-bold">Thống kê doanh thu</span>
          <div className={"flex gap-2 items-center"}>
            {by !== "today" && (
              <>
                <Datepicker language={"vi"} labelTodayButton={"Hôm nay"} labelClearButton={"Xoá"}
                            onChange={(value) => {
                              setFrom(moment(value).startOf("day").toISOString());
                            }}
                            value={from}
                            weekStart={1}
                />
                -
                <Datepicker language={"vi"} labelTodayButton={"Hôm nay"} labelClearButton={"Xoá"}
                            onChange={(value) => {
                              setTo(moment(value).endOf("day").toISOString());
                            }}
                            value={to}
                            weekStart={1}
                />
              </>
            )}
            <Select
              value={by}
              onChange={onChangeBy}
            >
              <option value="today">Hôm nay</option>
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </Select>
          </div>
        </div>
        <div className={"p-4"}>
          <Bar data={data} options={options}/>
        </div>
        <div className={"flex justify-between items-center"}>
          <span className="text-lg font-bold">Tổng orders</span>
          <span className="text-lg font-bold">{response.orders}</span>
        </div>
        <div className={"flex justify-between items-center"}>
          <span className="text-lg font-bold">Tổng doanh thu</span>
          <span className="text-lg font-bold">{formatVND(response.total)}</span>
        </div>
      </div>
    </Card>
  )
}

function BestSellerCard() {
  const [bestSeller, setBestSeller] = useState([]);
  const [by, setBy] = useState("day");

  const fetchBestSeller = async () => {
    try {
      const res = await axios.get("/dashboard/best-seller", {
        params: {
          by,
          limit: 4
        }
      });
      setBestSeller(res.data.bestSellers);
    } catch (error) {
      pushToast(error?.response?.data?.message || error?.message, "error");
    }
  }

  useEffect(() => {
    fetchBestSeller();
  }, [by]);

  return (
    <Card className="col-span-2 row-span-2">
      <div className="w-full h-full">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">Món bán chạy</span>
          <div>
            <Select
              value={by}
              onChange={(e) => setBy(e.target.value)}
            >
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </Select>
          </div>
        </div>
        <div className={"flex flex-col gap-2 mt-2"}>
          {bestSeller.map((item, index) => (
            <div key={item.product._id} className={"p-4 bg-blue-200 rounded-md flex justify-between items-center"}>
              <div className={"flex gap-2 items-center"}>
                <div className={"flex items-center"}>
                  <img src={item.product.image} className="w-20 h-20 object-cover rounded-lg shadow-lg"/>
                </div>
                <div className={"flex flex-col justify-start h-full"}>
                  <span className="text-lg font-bold">{item.product.name}</span>
                  <span className="text-sm">{formatVND(item.product.price)}</span>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold">{item.quantity}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {

  return (
    <div className="h-full w-full p-6 flex items-center overflow-scrool">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 auto-rows-max w-full gap-2">
        <IncomesCard/>
        <BestSellerCard/>
      </div>
    </div>
  )
}