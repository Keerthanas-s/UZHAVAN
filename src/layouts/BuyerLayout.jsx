import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";

import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";

const BuyerLayout = ({ children }) => {

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: "flex" }}>

            <Navbar toggleSidebar={handleDrawerToggle} />

            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    minHeight: "100vh",
                    background: "#F5F7FA"
                }}
            >
                <Toolbar />

                {children}

                <Footer />

            </Box>

        </Box>
    );
};

export default BuyerLayout;