import React from "react";
import CableIcon from "@mui/icons-material/Cable";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import { useLocation } from "react-router-dom";

const PDCSectionDashboard = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const workOrderId = queryParams.get("WorkOrderId");
  const pdcId = queryParams.get("PDCId");
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const upstairsUrl = `http://localhost:${applicationPortNumber}/SubAssembly/Upstairs/${workOrderId}/${pdcId}/`;

  const handleClick = () => {
    window.location.href = upstairsUrl;
  };

  const cardStyle =
    "m-5 p-20 bg-white text-xl text-white rounded-xl font-black w-3/12 cursor-pointer bg-indigo-800 transition duration-30 transform hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center";

  return (
    <div className="bg-background">
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center p-5 w-11/12 bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-xl shadow-xl mt-10 mb-10">
          <h1 className="text-3xl font-bold text-white mb-3 text-center w-full">
            Sections
          </h1>
          <div className={cardStyle} onClick={handleClick}>
            <CableIcon style={{ fontSize: "6rem" }} />
            <p>Upstairs</p>
          </div>
          <div className={cardStyle}>
            <SettingsInputComponentIcon style={{ fontSize: "6rem" }} />
            <p>Downstairs</p>
          </div>
          <div className={cardStyle}>
            <ElectricalServicesIcon style={{ fontSize: "6rem" }} />
            <p>Wiring</p>
          </div>
          <div className={cardStyle}>
            <CableIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
          <div className={cardStyle}>
            <SettingsInputComponentIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
          <div className={cardStyle}>
            <ElectricalServicesIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDCSectionDashboard;
