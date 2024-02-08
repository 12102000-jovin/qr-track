import React from "react";
// Importing necessary components for client-side routing with React Router.
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "../../containers/Home";
import WorkOrder from "../../containers/WorkOrder/WorkOrder";
import WorkOrderList from "../../containers/WorkOrder/WorkOrderList";
import WorkOrderDashboard from "../../containers/WorkOrder/WorkOrderDashboard";
import "./NavBar.css";

// Importing Material UI components
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <BrowserRouter>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/WorkOrderList">Work Order</Link>
            </li>
            <li>
              <button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                PDC
                <ArrowDropDownIcon />
              </button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem>
                  <Link to="/PDCList" className="sub-menu-link">
                    PDC List
                  </Link>
                </MenuItem>
              </Menu>
            </li>
          </ul>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/WorkOrderList" element={<WorkOrderList />} />
        <Route path="/WorkOrderDashboard" element={<WorkOrderDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default NavBar;
