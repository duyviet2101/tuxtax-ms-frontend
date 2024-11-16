import { Sidebar, SidebarItem, SidebarItems } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";
import {
  HiArrowSmRight, HiChartPie, HiInbox,
  HiShoppingBag, HiTable, HiUser, HiViewBoards
} from "react-icons/hi";
import {FaLayerGroup} from "react-icons/fa";
import {TbCategoryFilled} from "react-icons/tb";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar className="fixed w-64 bg-gray-200 shadow-lg z-40">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Logo img="/Logo-tuxtax.jpg">
              <Link to="/admin">
                <span className="text-xl font-bold text-gray-800">Quản lý Tuxtax</span>
              </Link>
            </Sidebar.Logo>
            <Sidebar.Item icon={HiChartPie}>
              <Link to="dashboard">Dashboard</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiInbox} label="3">
              <Link to="notifications">Notifications</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiShoppingBag}>
              <Link to="orders">QL Orders</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiUser}>
              <Link to="users">Người dùng</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={TbCategoryFilled}>
              <Link to="categories">Danh mục</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiViewBoards}>
              <Link to="products">Sản phẩm</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={FaLayerGroup}>
              <Link to="floors">Tầng</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiTable}>
              <Link to="tables">Bàn</Link>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div className="fixed pl-64 flex-col w-full h-full text-gray-900">
        <Outlet />
      </div>
    </div>
  )
}