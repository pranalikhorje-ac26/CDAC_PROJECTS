import { useState } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";

function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FB",
        overflowX: "hidden",
      }}
    >
      {/* TOP NAVBAR - ALWAYS VISIBLE */}
      <DashboardNavbar
        onMenuClick={() => setOpen(!open)}
      />

      {/* SIDEBAR AND MAIN CONTENT */}
      <Box
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar
          open={open}
          onClose={() => setOpen(false)}
        />

        {/* MAIN PAGE CONTENT */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            width: open ? "calc(100% - 260px)" : "100%",
            p: { xs: 2, sm: 3, md: 4 },
            boxSizing: "border-box",
            transition: "width 0.3s ease",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
