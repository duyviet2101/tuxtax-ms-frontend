import React from 'react'
import { Sidebar } from 'flowbite-react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './admin/AdminLayout'
import AdminHome from './admin/Home'
import AdminUserManager from './admin/Users'
import AdminDashboard from './admin/Dashboard'
import AdminNotification from './admin/Notification'
import AdminOrders from './admin/Orders'
import ClientOrder from './client/ClientOrder'
import TablesManager from './admin/Tables'
import ProductsManager from './admin/Products'
import ContextProvider from "./contexts/ContextProvider.jsx";
import ProtectedRoute from "./comps/ProtectedRoute.jsx";
import Login from "./admin/Login.jsx";
import {Toaster} from "sonner";

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
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<AdminHome />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="notifications" element={<AdminNotification />} />
              <Route path="users" element={<AdminUserManager />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="orders" element={<AdminOrders />} />
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
