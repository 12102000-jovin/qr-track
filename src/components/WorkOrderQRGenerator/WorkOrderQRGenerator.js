import React, { useState } from "react";
import { FaQrcode } from "react-icons/fa";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import moment from "moment-timezone";
import "moment/locale/en-au";
import axios from "axios";

const QRCodeGenerator = ({
  entityName,
  apiEndpoint,
  prefix,
  entityNameNoSpace,
}) => {
  const [numQR, setNumQR] = useState(1);
  const [startNum, setStartNum] = useState(1);
  const [qrCode, setQRCodes] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [qrGenerated, setQRGenerated] = useState(false);
  const host = "http://localhost:";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const links = Array.from({ length: numQR }, (_, index) => ({
      link: `${host}${
        process.env.REACT_APP_APPLICATION_PORT
      }/PDC?WorkOrderId=${prefix}000${Number(startNum) + index}`,
      generatedDate: moment()
        .tz("Australia/Sydney")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      const response = await axios.post(apiEndpoint, { links });
      const data = response.data;

      setQRCodes(() => {
        const newQRCodes = data.map((qrcode, index) => ({
          ...qrcode,
          entityId: `${prefix}000${Number(startNum) + index}`,
        }));

        return newQRCodes;
      });

      setQRGenerated(true);
    } catch (error) {
      console.error(`Error saving QR codes for ${entityName}:`, error);
    }
  };

  const handleDownload = async (entityId) => {
    const qrCodeData = qrCode.find((code) => code.entityId === entityId);
    const qrCodeElement = document.getElementById(`qrcode-${entityId}`);

    const qrCodeCanvas = await html2canvas(qrCodeElement, {
      width: 512,
      height: 565,
    });

    const a = document.createElement("a");
    a.href = qrCodeCanvas.toDataURL("image/png");
    a.download = `${entityName}_${entityId}.png`;
    a.click();
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const promises = qrCode.map(async (code) => {
      const qrCodeElement = document.getElementById(`qrcode-${code.entityId}`);
      const qrCodeCanvas = await html2canvas(qrCodeElement, {
        width: 512,
        height: 565,
      });

      return {
        name: `${code.entityId}.png`,
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
      a.download = `${entityName} [${prefix}000${startNum} - ${
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
        <div className="w-96 p-5  text-white rounded-md ">
          <p className="text-4xl text-center font-black mb-10">
            Add {entityName}
          </p>
          <div className="mt-10">
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
              x
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="startEntityNum"
              className="block text-base mb-2 flex justify-start font-medium"
            >
              Starting {entityName} Number
            </label>
            <input
              type="number"
              id="startEntityNum"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focus:border-gray-600 text-black"
              min="1"
              onChange={(e) => setStartNum(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-black text-white font-semibold py-4 px-4 rounded mt-5 shadow-lg generate-button"
              onClick={handleSubmit}
            >
              <FaQrcode className="mr-2" />
              Generate {entityName}
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

      <div className="flex justify-center flex-wrap mt-5 bg-white rounded-xl">
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
            <div id={`qrcode-${code.entityId}`}>
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
              <div className="mb-5">
                {entityName} ID: {code.entityId}
              </div>
            </div>
            <img
              src={imageData[code.entityId]}
              alt={`Converted ${code.entityId}`}
              style={{ display: "none", margin: "10px auto" }}
            />
            <div className="mt-5 flex items-center justify-center">
              <button
                className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                onClick={() => handleDownload(code.entityId)}
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

export default QRCodeGenerator;
