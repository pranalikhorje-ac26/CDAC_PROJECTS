import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import {
  Dashboard,
  Category,
  ReceiptLong,
  AccountBalanceWallet,
  Savings,
  Person,
  Logout,
  People,
  Assessment,
  Mail,
} from "@mui/icons-material";

import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const isAdmin = user.role === "admin";

  const userMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/user/dashboard" },
    { text: "Categories", icon: <Category />, path: "/user/categories" },
    { text: "Transactions", icon: <ReceiptLong />, path: "/user/transactions" },
    { text: "Budgets", icon: <AccountBalanceWallet />, path: "/user/budgets" },
    { text: "Savings Goals", icon: <Savings />, path: "/user/savings" },
    { text: "My Profile", icon: <Person />, path: "/user/profile" },
  ];

  const adminMenuItems = [
    { text: "Admin Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Manage Users", icon: <People />, path: "/admin/users" },
    { text: "Manage Transactions", icon: <ReceiptLong />, path: "/admin/transactions" },
    { text: "Reports", icon: <Assessment />, path: "/admin/reports" },
    { text: "Contact Messages", icon: <Mail />, path: "/admin/contact-messages" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profileImage");

    onClose?.();
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: open ? 260 : 0,
        minWidth: open ? 260 : 0,
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.3s ease, min-width 0.3s ease",
        backgroundColor: "#FFFFFF",
        borderRight: open ? "1px solid #E5E7EB" : "none",
        minHeight: "calc(100vh - 75px)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      <List sx={{ px: 2, mt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              onClick={onClose}
              selected={isActive}
              sx={{
                borderRadius: 3,
                mb: 1,
                py: 1.5,
                color: "#334155",
                whiteSpace: "nowrap",

                "& .MuiListItemIcon-root": {
                  color: "#64748B",
                  minWidth: 40,
                },

                "&.Mui-selected": {
                  backgroundColor: "#DBEAFE",
                  color: "#1D4ED8",
                },

                "&.Mui-selected .MuiListItemIcon-root": {
                  color: "#2563EB",
                },

                "&.Mui-selected:hover": {
                  backgroundColor: "#BFDBFE",
                },

                "&:hover": {
                  backgroundColor: "#EFF6FF",
                  color: "#2563EB",
                },

                "&:hover .MuiListItemIcon-root": {
                  color: "#2563EB",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>

              <ListItemText
                primary={item.text}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: isActive ? "bold" : "normal",
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ mt: "auto", px: 2, pb: 2 }}>
        <Divider sx={{ borderColor: "#E5E7EB", mb: 2 }} />

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            py: 1.5,
            color: "#DC2626",
            whiteSpace: "nowrap",

            "& .MuiListItemIcon-root": {
              color: "#DC2626",
              minWidth: 40,
            },

            "&:hover": {
              backgroundColor: "#FEE2E2",
            },
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default Sidebar;