import React from "react";
import CableIcon from "@mui/icons-material/Cable";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import { useParams } from "react-router-dom";

const PDCSectionDashboard = () => {
  const { workOrderId, pdcId } = useParams();
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const panelUrl = `http://localhost:${applicationPortNumber}/SubAssembly/Panel/${workOrderId}/${pdcId}/`;

  const handleClick = () => {
    window.location.href = panelUrl;
  };

  const cardStyle =
    "m-2 p-20 bg-white text-xl text-white rounded-xl font-black w-3/12 cursor-pointer transition duration-30 transform hover:scale-105 hover:shadow-lg flex flex-col justify-center items-center";

  return (
    <div className="bg-background">
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center p-10 w-11/12 bg-gradient-to-br from-gray-700 via-gray-800 to-black rounded-xl shadow-xl mt-10 mb-10 pb-20">
          <h1 className="text-4xl font-bold text-white mb-3 text-center w-full">
            Sections
          </h1>
          <div
            className={cardStyle}
            onClick={handleClick}
            style={{ backgroundColor: "#043f9d" }}
          >
            <CableIcon style={{ fontSize: "6rem" }} />
            <p>Panel</p>
          </div>
          <div className={cardStyle} style={{ backgroundColor: "#043f9d" }}>
            <SettingsInputComponentIcon style={{ fontSize: "6rem" }} />
            <p>More... </p>
          </div>
          <div className={cardStyle} style={{ backgroundColor: "#043f9d" }}>
            <ElectricalServicesIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
          <div className={cardStyle} style={{ backgroundColor: "#043f9d" }}>
            <CableIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
          <div className={cardStyle} style={{ backgroundColor: "#043f9d" }}>
            <SettingsInputComponentIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
          <div className={cardStyle} style={{ backgroundColor: "#043f9d" }}>
            <ElectricalServicesIcon style={{ fontSize: "6rem" }} />
            <p>More...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDCSectionDashboard;
