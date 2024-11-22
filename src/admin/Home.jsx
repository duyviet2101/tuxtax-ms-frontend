import { Card } from "flowbite-react";
import {HiArchive, HiChartBar, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards} from "react-icons/hi";
import { HiAcademicCap, HiArrowUpOnSquareStack } from "react-icons/hi2";
import { Link } from "react-router-dom";
import {TbCategoryFilled} from "react-icons/tb";
import {FaLayerGroup} from "react-icons/fa";
import {FaKitchenSet} from "react-icons/fa6";

function AdminDashboardItemCard({ icon, title, description }) {
  return (
    <Card className="col-span-2 row-span-2 w-full h-full">
      {/* Show Icon */}
      <div className="flex items-center justify-center">
        {icon}
      </div>

      {/* Show Title */}
      <div className="flex items-center justify-center">
        <h2 className="text-4xl font-bold">{title}</h2>
      </div>

      {/* Show Description */}
      <div className="flex items-center justify-center">
        <p className="">{description}</p>
      </div>
    </Card>
  )
}

export default function AdminHome() {
  return (
    <div className="flex h-screen w-screen bg-blue-200">
      <div className="fixed flex-col w-full h-full text-gray-900 overflow-auto">
        <div className="h-full w-full p-6 flex flex-col items-center overflow-scrool">
          <div className={"h-full basis-1/3 flex items-center"}>
            <div className={"border pt-16 p-8 rounded-lg relative flex flex-col gap-2 shadow-xl bg-white"}>
              <div className={"h-32 w-32 absolute top-0 -translate-x-1/2 -translate-y-1/2 left-1/2"}>
                <img src={"/Logo-tuxtax.png"}
                     className={"h-full w-full rounded-full object-contain border-gray-400 border-2"}/>
              </div>
              <h1 className="text-center text-3xl font-bold">TUXTAX ẨM THỰC THÁI LAN</h1>
              <h2 className="text-center text-xl font-medium">17B Hàn Thuyên, Hai Bà Trưng, Hà Nội</h2>
              <h2 className="text-center text-xl font-semibold">Hotline: 0963607229</h2>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 auto-rows-max w-full gap-2">
            <Link to="/admin/orders">
              <AdminDashboardItemCard
                icon={<HiShoppingBag className="w-12 h-12 text-gray-800"/>}
                title="Orders"
                description="Quản lý Orders"
              />
            </Link>

            <Link to="/admin/kitchen">
              <AdminDashboardItemCard
                icon={<FaKitchenSet className="w-12 h-12 text-gray-800"/>}
                title="Bếp"
                description="Quản lý bếp"
              />
            </Link>

            <Link to="/admin/products">
              <AdminDashboardItemCard
                icon={<HiViewBoards className="w-12 h-12 text-gray-800"/>}
                title="Thực đơn"
                description="Quản lý thực đơn"
              />
            </Link>

            <Link to="/admin/tables">
              <AdminDashboardItemCard
                icon={<HiTable className="w-12 h-12 text-gray-800"/>}
                title="Bàn"
                description="Quản lý bàn"
              />
            </Link>

            <Link to="/admin/users">
              <AdminDashboardItemCard
                icon={<HiUser className="w-12 h-12 text-gray-800"/>}
                title="Nhân viên"
                description="Quản lý nhân viên"
              />
            </Link>

            <Link to="/admin/floors">
              <AdminDashboardItemCard
                icon={<FaLayerGroup className="w-12 h-12 text-gray-800"/>}
                title="Tầng"
                description="Quản lý tầng"
              />
            </Link>

            <Link to="/admin/categories">
              <AdminDashboardItemCard
                icon={<TbCategoryFilled className="w-12 h-12 text-gray-800"/>}
                title="Danh mục"
                description="Quản lý danh mục"
              />
            </Link>

            <Link to="/admin/dashboard">
              <AdminDashboardItemCard
                icon={<HiChartPie className="w-12 h-12 text-gray-800"/>}
                title="Thống kê doanh thu"
                description="Thống kê và báo cáo"
              />
            </Link>

            {/*<Link to="/admin/signout" className="text-red-400">*/}
            {/*  <AdminDashboardItemCard*/}
            {/*    icon={<HiArrowUpOnSquareStack className="w-12 h-12 text-red-400" />}*/}
            {/*    title="Sign Out"*/}
            {/*    description="Sign out of admin"*/}
            {/*  />*/}
            {/*</Link>*/}
          </div>
        </div>
      </div>
      </div>
  )
}