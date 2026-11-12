import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  const token = localStorage.getItem("token");
  const [open, setOpen] = useState(Boolean(token));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
        overflowX: "hidden",
      }}
    >
      {/* TOP NAVBAR */}
      <Navbar onMenuClick={() => setOpen(!open)} />

      {/* SIDEBAR AND PAGE CONTENT */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {/* LEFT SIDEBAR */}
        {token && (
          <Sidebar
            open={open}
            onClose={() => setOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            p: { xs: 2, sm: 3, md: 4 },
            boxSizing: "border-box",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;