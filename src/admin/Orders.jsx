import {Button, Tabs} from "flowbite-react";
import {FaCartArrowDown, FaHistory} from "react-icons/fa";
import {useEffect, useState} from "react";
import {axios} from "../services/requests.js";
import {isNull} from "lodash";
import { MdTableRestaurant } from "react-icons/md";

export default function AdminOrders() {
  const [floors, setFloors] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);

  useEffect(() => {
    const fetchFloors = async () => {
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
    }
    fetchFloors();
  }, []);

  useEffect(() => {
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
    fetchTables();
  }, [selectedFloor]);

  return (
    <div className="flex items-start justify-center h-full w-full">
      <div className="relative h-full w-full p-8">
        <Tabs aria-label="QL Order" variant="default" className={"w-full"}>
          <Tabs.Item active title="Quản lý Orders" icon={FaCartArrowDown}>
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
                       className={`bg-${table?.order ? "blue" : "gray"}-100 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer`}
                  >
                    <span
                      className={`text-center dark:text-gray-200 text-black`}>{`${formatVND(table?.order?.total) || "Trống"}`}</span>
                    <MdTableRestaurant size={80} className={`text-${table?.order ? "blue" : "gray"}-500`}/>
                    <span
                      className={`text-center font-bold dark:text-gray-200 text-black`}>{`${table.floor.slug}-${table.name}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item title="Lịch sử" icon={FaHistory}>
            <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200 text-black">Lịch sử Orders</h1>
          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  )
}

const colorsButton = [
  "purpleToBlue",
  "greenToBlue",
  "purpleToPink",
  "pinkToOrange",
  "tealToLime",
  "redToYellow"
]

const formatVND = (amount) => {
  const number = parseFloat(amount);
  if (isNaN(number)) {
    return null;
  }
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};
