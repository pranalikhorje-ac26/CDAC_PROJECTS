import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute";

// Public pages
import Home from "../pages/Home";
import About from "../pages/About";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Contact from "../pages/Contact";

// User pages
import Dashboard from "../pages/user/Dashboard";
import Transactions from "../pages/user/Transactions";
import Categories from "../pages/user/Categories";
import Budgets from "../pages/user/Budgets";
import SavingsGoals from "../pages/user/SavingsGoals";
import Profile from "../pages/user/Profile";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManagerTransactions from "../pages/admin/ManagerTransactions";
import AdminReports from "../pages/admin/AdminReports";
import AdminContactMessages from "../pages/admin/AdminContactMessages";

function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC PAGES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* AUTHENTICATION */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* USER ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route path="/user/dashboard" element={<Dashboard />} />
        <Route path="/user/transactions" element={<Transactions />} />
        <Route path="/user/categories" element={<Categories />} />
        <Route path="/user/budgets" element={<Budgets />} />
        <Route path="/user/savings" element={<SavingsGoals />} />
        <Route path="/user/profile" element={<Profile />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/transactions" element={<ManagerTransactions />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/contact-messages" element={<AdminContactMessages />} />
      </Route>

    </Routes>
  );
}

export default AppRoutes;