import { Sidebar, SidebarItem, SidebarItems } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";
import {
  HiArrowSmRight, HiChartPie, HiInbox,
  HiShoppingBag, HiTable, HiUser, HiViewBoards
} from "react-icons/hi";
import {FaLayerGroup} from "react-icons/fa";
import {TbCategoryFilled} from "react-icons/tb";
import {FaKitchenSet} from "react-icons/fa6";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar className="fixed w-64 bg-gray-200 shadow-lg z-40">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Logo img="/Logo-tuxtax.png">
              <Link to="/admin">
                <span className="text-xl font-bold text-gray-800 text-wrap">TUXTAX ẨM THỰC THÁI LAN</span>
              </Link>
            </Sidebar.Logo>
            <Sidebar.Item icon={HiShoppingBag}>
              <Link to="orders">QL Orders</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={FaKitchenSet}>
              <Link to="kitchen">QL Bếp</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiViewBoards}>
              <Link to="products">QL thực đơn</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiTable}>
              <Link to="tables">QL bàn</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiUser}>
              <Link to="users">QL nhân viên</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={FaLayerGroup}>
              <Link to="floors">QL tầng</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiChartPie}>
              <Link to="dashboard">Thống kê doanh thu</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={TbCategoryFilled}>
              <Link to="categories">QL danh mục</Link>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="fixed pl-64 flex-col w-full h-full text-gray-900 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}