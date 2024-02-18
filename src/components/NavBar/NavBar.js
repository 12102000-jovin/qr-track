import React, { useState, useRef, useEffect } from "react";
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
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import "animate.css";

import { Dialog, DialogContent } from "@mui/material";

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
  const [QRScannerModal, setQRScannerModal] = useState(false);
  const [QRScanner, setQRScanner] = useState(false);
  const [scannedURL, setScannedURL] = useState("");
  const inputRef = useRef();

  const handleQRScanner = () => {
    setQRScanner(true);
    setQRScannerModal(true);
    console.log("QR Scanner State", QRScanner);
  };
  const handleScannerModal = () => {
    setQRScannerModal(false);
    setScannedURL("");
  };

  const handleInput = (event) => {
    const scannedInput = event.target.value;
    setScannedURL(scannedInput);
    // Implement your logic to extract URL from scanned input if needed
    console.log("Scanned URL:", scannedInput);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Navigate to the scanned URL when Enter is pressed
      // window.location.href = scannedURL;

      // Open the scanned URL in a new window
      window.open(scannedURL, "_blank");
    }
  };

  let blurTimeout;

  const handleBlur = () => {
    // Delay the modal closing to allow user interaction with the close button
    blurTimeout = setTimeout(() => {
      handleScannerModal();
    }, 200); // Adjust the delay time as needed
  };

  const handleFocus = () => {
    // Clear the blurTimeout to prevent the modal from closing
    clearTimeout(blurTimeout);
  };

  useEffect(() => {
    // Focus the input field after a short delay when the component mounts or modal opens
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100); // Adjust the delay as needed

    return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
  }, [QRScannerModal]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Check if the pressed key is `
      if (event.key === "]") {
        event.preventDefault();
        setQRScannerModal(true);
        setScannedURL("");
      } else if (event.key === "[" || event.key === " ") {
        event.preventDefault();
        setQRScannerModal(false);
        setScannedURL("");
      }
    };

    // Attach the event listener
    document.addEventListener("keypress", handleKeyPress);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div>
      <Router>
        <Box sx={{ display: "flex" }}>
          <AppBar
            open
            className="h-16 flex"
            sx={{
              background: "#043f9d",
            }}
          >
            <div className="mt-2 flex justify-between items-center">
              <div className="ml-52">
                <h1 className="text-white font-bold text-xl"> Dashboard </h1>
              </div>
              <button
                className="mr-14 flex items-center bg-black p-2 px-3 rounded-md text-white hover:bg-secondary"
                onClick={handleQRScanner}
              >
                <span className="font-black">Scan QR Code </span>
                <QrCodeScannerRoundedIcon
                  style={{ fontSize: 32, marginLeft: 8 }}
                />
              </button>
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
              <Route path="/PDC/:workOrderId" element={<PDC />} />
              <Route
                path="/PDCSectionDashboard/:workOrderId/:pdcId"
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
      <Dialog
        open={QRScannerModal}
        onClose={handleScannerModal}
        onClick={handleScannerModal}
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none",
            margin: 0,
            padding: 10,
          },
        }}
      >
        <div className="flex justify-center items-center flex-col">
          <h1
            className=" text-white text-center font-black text-6xl mb-5"
            style={{ textShadow: "4px 4px #043f9d" }}
          >
            Scan QR Code{" "}
            <QrCodeScannerRoundedIcon
              className="ml-4 mb-3 bg-white rounded-xl animate__animated animate__flipInX"
              style={{
                fontSize: 65,
                color: "#043f9d",
                boxShadow: "4px 4px #043f9d",
              }}
            />
          </h1>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleScannerModal}
            className="bg-red-800 text-white font-bold rounded-xl mb-5 hover:bg-secondary"
            style={{ boxShadow: "4px 4px #043f9d" }}
          >
            {" "}
            Cancel
          </button>
        </div>
        <div className="flex justify-center">
          <input
            ref={inputRef}
            type="text"
            value={scannedURL}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            autoFocus
            className="bg-transparent text-white text-2xl text-center font-black w-96 border-none focus:outline-none caret-transparent"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default NavBar;
