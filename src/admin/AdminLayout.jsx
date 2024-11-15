import { Sidebar, SidebarItem, SidebarItems } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";
import {
  HiArrowSmRight, HiChartPie, HiInbox,
  HiShoppingBag, HiTable, HiUser, HiViewBoards
} from "react-icons/hi";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-screen bg-gray-50">
      <Sidebar className="fixed w-64 bg-gray-200 shadow-lg z-40">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Logo img="/vite.svg">
              <Link to="/admin">
                <span className="text-xl font-bold text-gray-800">Admin UI</span>
              </Link>
            </Sidebar.Logo>
            <Sidebar.Item icon={HiChartPie}>
              <Link to="dashboard">Dashboard</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiInbox} label="3">
              <Link to="notifications">Notifications</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiUser}>
              <Link to="users">Users</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiViewBoards}>
              <Link to="products">Products</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiShoppingBag}>
              <Link to="orders">Orders</Link>
            </Sidebar.Item>
            <Sidebar.Item icon={HiTable}>
              <Link to="tables">Tables</Link>
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