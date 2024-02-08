import React, { useState, useEffect } from "react";
import { FaQrcode } from "react-icons/fa";
import axios from "axios";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import moment from "moment-timezone";
import "moment/locale/en-au";

const WorkOrderDashboard = () => {
  const [numQR, setNumQR] = useState(1);
  const [startNum, setStartNum] = useState(1);

  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const [options, setOption] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");

  const [qrCode, setQRCodes] = useState([]);
  const [imageData, setImageData] = useState([]);

  const [qrGenerated, setQRGenerated] = useState(false);

  useEffect(() => {
    // Fetch options from database
    fetchWorkOrderData();
  }, []);

  const fetchWorkOrderData = () => {
    axios
      .get(`http://localhost:${serverPortNumber}/WorkOrder/getAllWorkOrder`)
      .then((response) => {
        setOption(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Add a function to extract the work order ID
  const extractWorkOrderId = (link) => {
    const regex = /id=(WO\d+)/;
    const match = link.match(regex);
    return match ? match[1] : "Invalid Work Order ID";
  };

  const handleSubmit = async (e) => {
    console.log(numQR);
    console.log(startNum);
    console.log(selectedValue);

    e.preventDefault();

    const links = Array.from({ length: numQR }, (_, index) => ({
      link: `http://localhost:${applicationPortNumber}/WorkOrderDashboard?WorkOrderId=${selectedValue}&PDCId=PDC000${
        Number(startNum) + index
      }`,

      generatedDate: moment()
        .tz("Australia/Sydney")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      const response = await axios.post(
        `http://localhost:${serverPortNumber}/PDC/${selectedValue}/generatePDC`,
        { links }
      );

      console.log(response.data); // Log the response

      setQRCodes(() => {
        const newQRCodes = response.data.map((qrcode, index) => ({
          ...qrcode,
          PDCId: `PDC000${Number(startNum) + index}`,
        }));

        return newQRCodes;
      });
      setQRGenerated(true);
    } catch (error) {
      console.error("Error saving QR codes:", error);
    }
  };

  const handleDownload = async (PDCId) => {
    const qrCodeData = qrCode.find((code) => code.PDCId === PDCId);
    const qrCodeElement = document.getElementById(`qrcode-${PDCId}`);

    const qrCodeCanvas = await html2canvas(qrCodeElement, {
      width: 512, // Specify your desired width
      height: 565, // Specify your desired height
    });

    const a = document.createElement("a");
    a.href = qrCodeCanvas.toDataURL("image/png");
    a.download = `${PDCId}.png`;
    a.click();
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const promises = qrCode.map(async (code) => {
      const qrCodeElement = document.getElementById(`qrcode-${code.PDCId}`);
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.PDCId}.png`,
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
      a.download = `PDC [PDC000${startNum} - ${
        Number(startNum) + Number(numQR) - 1
      }]`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div>
      <div className="flex justify-center border-none">
        <div className="w-96 p-6 text-white rounded-md ">
          <p className="text-3xl text-center font-bold ">Add PDC</p>
          {selectedValue && (
            <div className="flex justify-center">
              <p className="text-center text-l font-semibold mt-2 mb-5 bg-secondary w-full p-2 rounded-xl text-white ">
                Generate PDC for {selectedValue}
              </p>
            </div>
          )}

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
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
              min="1"
              onChange={(e) => setNumQR(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="startEntityNum"
              className="block text-base mb-2 flex justify-start font-medium"
            >
              Starting PDC Number
            </label>
            <input
              type="number"
              id="startEntityNum"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
              min="1"
              onChange={(e) => setStartNum(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="Work Order"
              className="block text-base mb-2 flex justify-start font-medium"
            >
              Work Order
            </label>
            <select
              id="dropdown"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
            >
              <option value="">Select Work Order ...</option>
              {options.map((option) => (
                <option key={option._id} value={option.value}>
                  {extractWorkOrderId(option.link)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-center">
            <button
              className=" bg-black hover:bg-neutral-800 text-white font-semibold py-4 px-4 rounded mt-5 shadow-lg generate-button"
              onClick={handleSubmit}
            >
              <FaQrcode className="mr-2" />
              Generate PDC
            </button>
          </div>
        </div>
      </div>

      {qrGenerated && (
        <div className="flex justify-center">
          <div className="flex justify-center items-center bg-slate-200 pb-5 w-full rounded-xl">
            <button
              className="bg-secondary hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded mt-5 "
              onClick={handleDownloadAll}
            >
              Download All Generated QR
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center flex-wrap mt-5  bg-white rounded-xl">
        {qrCode.map((code, index) => (
          <div
            key={index}
            className="p-5 shadow-xl rounded-lg"
            style={{
              color: "#043f9d",
              fontFamily: "Avenir, sans-serif",
              fontSize: "20px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <div id={`qrcode-${code.PDCId}`}>
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
              <div className="mb-5">PDC ID: {code.PDCId}</div>
            </div>
            <img
              src={imageData[code.PDCId]}
              alt={`Converted ${code.PDCId}`}
              style={{ display: "none", margin: "10px auto" }}
            />
            <div className="mt-5 flex items-center justify-center">
              <button
                className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                onClick={() => handleDownload(code.PDCId)}
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

export default WorkOrderDashboard;
