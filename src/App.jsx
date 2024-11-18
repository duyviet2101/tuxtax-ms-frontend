import React from 'react'
import { Sidebar } from 'flowbite-react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './admin/AdminLayout'
import AdminHome from './admin/Home'
import AdminUserManager from './admin/Users'
import AdminDashboard from './admin/Dashboard'
import AdminNotification from './admin/Notification'
import AdminOrders from './admin/AdminOrders.jsx'
import ClientOrder from './client/ClientOrder'
import TablesManager from './admin/Tables.jsx'
import ProductsManager from './admin/Products.jsx'
import ContextProvider from "./contexts/ContextProvider.jsx";
import ProtectedRoute from "./comps/ProtectedRoute.jsx";
import Login from "./admin/Login.jsx";
import {Toaster} from "sonner";
import CategoriesManager from "./admin/Categories.jsx";
import FloorManagement from "./admin/Floor.jsx";
import AdminOrderDetail from "./admin/AdminOrderDetail.jsx";
import AdminCheckout from "./admin/AdminCheckout.jsx";
import AdminOrderHistory from "./admin/AdminOrderHistory.jsx";

function App() {
  return (
    <>
      <Toaster
        richColors={true}
        position={"top-right"}
        expand={false}
        closeButton={true}
      />
      <ContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={"/auth/login"} element={<Login/>} />
            <Route path="/admin" element={<AdminHome />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="notifications" element={<AdminNotification />} />
              <Route path="users" element={<AdminUserManager />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/history" element={<AdminOrderHistory />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="orders/:id/checkout" element={<AdminCheckout/>}/>
              <Route path="floors" element={<FloorManagement/>} />
              <Route path="tables" element={<TablesManager />} />
              <Route path="*" element={<div>404</div>} />
            </Route>
            <Route path="/" element={<ClientOrder />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </BrowserRouter>
      </ContextProvider>
    </>
  )
}

export default App
