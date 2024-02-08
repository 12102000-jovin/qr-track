import React, { useState } from "react";
import { FaQrcode } from "react-icons/fa";
import axios from "axios";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import moment from "moment-timezone";
import "moment/locale/en-au";

const WorkOrder = () => {
  const [numQR, setNumQR] = useState(1);
  const [startNum, setStartNum] = useState(1);

  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const [qrCode, setQRCodes] = useState([]);
  const [imageData, setImageData] = useState([]);

  const [qrGenerated, setQRGenerated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const links = Array.from({ length: numQR }, (_, index) => ({
      link: `http://localhost:${applicationPortNumber}/WorkOrder?id=WO000${
        Number(startNum) + index
      }`,
      generatedDate: moment()
        .tz("Australia/Sydney")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      const response = await axios.post(
        `http://localhost:${serverPortNumber}/WorkOrder/generateWorkOrder`,
        { links }
      );

      console.log(response.data); // Log the response

      setQRCodes(() => {
        const newQRCodes = response.data.map((qrcode, index) => ({
          ...qrcode,
          workOrderId: `WO000${Number(startNum) + index}`,
        }));

        return newQRCodes;
      });

      setQRGenerated(true);
    } catch (error) {
      console.error("Error saving QR codes:", error);
    }
  };

  const handleDownload = async (workOrderId) => {
    const qrCodeData = qrCode.find((code) => code.workOrderId === workOrderId);
    const qrCodeElement = document.getElementById(`qrcode-${workOrderId}`);

    const qrCodeCanvas = await html2canvas(qrCodeElement, {
      width: 512, // Specify your desired width
      height: 565, // Specify your desired height
    });

    const a = document.createElement("a");
    a.href = qrCodeCanvas.toDataURL("image/png");
    a.download = `PDCQR_${workOrderId}.png`;
    a.click();
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const promises = qrCode.map(async (code) => {
      const qrCodeElement = document.getElementById(
        `qrcode-${code.workOrderId}`
      );
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `PDCQR_${code.workOrderId}.png`,
        data: qrCodeCanvas
          .toDataURL("image/png")
          .replace(/^data:image\/(png|jpg);base64,/, ""),
      };
    });

    const files = await Promise.all(promises);

    files.forEach((file) => {
      zip.file(file.name, file.data, { base64: true });
    });

    zip.generateAsync({ type: "blob" }).then((content) => {
      const a = document.createElement("a");
      const url = URL.createObjectURL(content);
      a.href = url;
      a.download = "allQRCodes.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <div className="flex justify-center bg-signature border-none">
        <div className="w-96 p-6 shadow-lg bg-white rounded-md my-8">
          <p className="text-3xl font-bold mb-10">Work Order</p>
          <div className="mt-3">
            <label
              htmlFor="numQR"
              className="block text-base mb-2 flex justify-start font-medium"
            >
              Number of QR
            </label>
            <input
              type="number"
              id="numQR"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600"
              min="1"
              onChange={(e) => setNumQR(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="startWorkOrderNum"
              className="block text-base mb-2 flex justify-start font-medium"
            >
              Starting Work Order Number
            </label>
            <input
              type="number"
              id="startWorkOrderNum"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600"
              min="1"
              onChange={(e) => setStartNum(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-signature hover:bg-blue-700 text-white font-semibold py-4 px-4 rounded mt-5 mb-5 shadow-lg"
              onClick={handleSubmit}
            >
              <FaQrcode className="mr-2" />
              Generate Work Order
            </button>
          </div>
        </div>
      </div>

      {qrGenerated && (
        <div className="flex justify-center items-center bg-slate-200 pb-5 bg-slate-200  ">
          <button
            className="bg-black hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-5"
            onClick={handleDownloadAll}
          >
            Download All
          </button>
        </div>
      )}

      <div className="flex justify-center flex-wrap mt-5">
        {qrCode.map((code, index) => (
          <div
            key={index}
            className="p-5 m-5 shadow-xl rounded-lg"
            style={{
              color: "#043f9d",
              fontFamily: "Avenir, sans-serif",
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <div id={`qrcode-${code.workOrderId}`}>
              <ReactQRCode
                value={code.link}
                size={512}
                imageSettings={{
                  src: logo,
                  excavate: true,
                  width: 60,
                  height: 35,
                }}
              />
              <div className="mb-5">Work Order ID: {code.workOrderId}</div>
            </div>
            <img
              src={imageData[code.workOrderId]}
              alt={`Converted ${code.workOrderId}`}
              style={{ display: "none", margin: "10px auto" }}
            />
            <div className="mt-5 flex items-center justify-center">
              <button
                className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                onClick={() => handleDownload(code.workOrderId)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkOrder;
