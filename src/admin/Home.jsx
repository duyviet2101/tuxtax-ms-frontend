import { Card } from "flowbite-react";
import {HiArchive, HiChartBar, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiViewBoards} from "react-icons/hi";
import { HiAcademicCap, HiArrowUpOnSquareStack } from "react-icons/hi2";
import { Link } from "react-router-dom";
import {TbCategoryFilled} from "react-icons/tb";
import {FaLayerGroup} from "react-icons/fa";

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
    <div className="h-full w-full p-6 flex items-center overflow-scrool">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 auto-rows-max w-full gap-2">
        <Link to="/admin/orders" className="col-span-2">
          <AdminDashboardItemCard
            icon={<HiShoppingBag className="w-12 h-12 text-gray-800" />}
            title="Orders"
            description="Quản lý Orders"
          />
        </Link>

        <Link to="/admin/dashboard">
          <AdminDashboardItemCard
            icon={<HiChartPie className="w-12 h-12 text-gray-800" />}
            title="Dashboard"
            description="Thống kê và báo cáo"
          />
        </Link>

        <Link to="/admin/users">
          <AdminDashboardItemCard
            icon={<HiUser className="w-12 h-12 text-gray-800" />}
            title="Nhân viên"
            description="Quản lý nhân viên"
          />
        </Link>

        <Link to="/admin/products">
          <AdminDashboardItemCard
            icon={<HiViewBoards className="w-12 h-12 text-gray-800" />}
            title="Thực đơn"
            description="Quản lý thực đơn"
          />
        </Link>

        <Link to="/admin/categories">
          <AdminDashboardItemCard
            icon={<TbCategoryFilled className="w-12 h-12 text-gray-800" />}
            title="Danh mục"
            description="Quản lý danh mục"
          />
        </Link>

        <Link to="/admin/floors">
          <AdminDashboardItemCard
            icon={<FaLayerGroup className="w-12 h-12 text-gray-800" />}
            title="Tầng"
            description="Quản lý tầng"
          />
        </Link>

        <Link to="/admin/tables">
          <AdminDashboardItemCard
            icon={<HiTable className="w-12 h-12 text-gray-800" />}
            title="Bàn"
            description="Quản lý bàn"
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
  )
}