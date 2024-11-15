import { Card } from "flowbite-react";
import { HiArchive, HiChartBar, HiInbox, HiUser, HiViewBoards } from "react-icons/hi";
import { HiAcademicCap, HiArrowUpOnSquareStack } from "react-icons/hi2";
import { Link } from "react-router-dom";

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
        <Link to="/admin/notifications" className="col-span-2">
          <AdminDashboardItemCard
            icon={<HiInbox className="w-12 h-12 text-gray-800" />}
            title="Notifications"
            description="Notifications and alerts"
          />
        </Link>

        <Link to="/admin/users">
          <AdminDashboardItemCard
            icon={<HiUser className="w-12 h-12 text-gray-800" />}
            title="Users"
            description="Manage users and roles"
          />
        </Link>

        <Link to="/admin/products">
          <AdminDashboardItemCard
            icon={<HiViewBoards className="w-12 h-12 text-gray-800" />}
            title="Products"
            description="Products"
          />
        </Link>

        <Link to="/admin/orders">
          <AdminDashboardItemCard
            icon={<HiArchive className="w-12 h-12 text-gray-800" />}
            title="Orders"
            description="Orders and sales"
          />
        </Link>

        <Link to="/admin/tables">
          <AdminDashboardItemCard
            icon={<HiAcademicCap className="w-12 h-12 text-gray-800" />}
            title="Tables"
            description="Tables and data"
          />
        </Link>

        <Link to="/admin/analysis">
          <AdminDashboardItemCard
            icon={<HiChartBar className="w-12 h-12 text-gray-800" />}
            title="Analysis"
            description="Analysis and reports"
          />
        </Link>

        <Link to="/admin/signout" className="text-red-400">
          <AdminDashboardItemCard
            icon={<HiArrowUpOnSquareStack className="w-12 h-12 text-red-400" />}
            title="Sign Out"
            description="Sign out of admin"
          />
        </Link>
      </div>
    </div>
  )
}