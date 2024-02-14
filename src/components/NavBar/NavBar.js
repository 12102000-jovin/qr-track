import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Home from "../../containers/Home";
import WorkOrder from "../../containers/WorkOrder/WorkOrder";
import PDC from "../../containers/PDC/PDC";
import PDCSectionDashboard from "../../containers/Section/PDCSectionDashboard";
import SubAssembly from "../../containers/SubAssembly/SubAssembly";
import SubAssemblyQRGenerator from "../SubAssemblyQRGenerator/SubAssemblyQRGenerator";
import logo from "../../Images/FE-logo.png";
import "../../App.css";

const drawerWidth = 200;

const closedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar)({
  zIndex: (theme) => theme.zIndex.drawer + 1,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  height: "100%",
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      border: "none",
      background: "#f9fafc",
    },
  }),
}));

const NavBar = () => {
  return (
    <Router>
      <Box sx={{ display: "flex" }}>
        <AppBar
          open
          className="h-16 flex items-start"
          sx={{
            background: "#043f9d",
          }}
        >
          <div className="ml-52 mt-5">
            <h1 className="text-white font-bold text-xl"> Dashboard </h1>
          </div>
        </AppBar>

        <Drawer variant="permanent">
          <DrawerHeader
            style={{ justifyContent: "start" }}
            className="flex items-center h-16 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-700 text-white"
          >
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <p className="text-xl ml-3 font-bold"> QR Tracking </p>
          </DrawerHeader>

          <Divider />
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/">
                <Typography variant="body1" fontWeight="medium">
                  Home
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/WorkOrder">
                <Typography variant="body1" fontWeight="medium">
                  Work Order
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/PDC">
                <Typography variant="body1" fontWeight="medium">
                  PDC
                </Typography>
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton component={Link} to="/SubAssembly">
                <Typography variant="body1" fontWeight="medium">
                  Sub-Assembly
                </Typography>
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
          {/* Additional list items can be added here */}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, backgroundColor: "#eef3f9", height: "100vh" }}
        >
          <DrawerHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/WorkOrder" element={<WorkOrder />} />
            <Route path="/PDC" element={<PDC />} />
            <Route
              path="/PDCSectionDashboard"
              element={<PDCSectionDashboard />}
            />
            <Route path="/SubAssembly" element={<SubAssembly />} />
            <Route
              path="/SubAssembly/:section/:workOrderId/:pdcId"
              element={<SubAssembly />}
            />
            <Route
              path="/SubAssembly/SubAssemblyQRGenerator"
              element={<SubAssemblyQRGenerator />}
            />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default NavBar;
