import React, { useEffect, useState } from "react";
import { FaQrcode } from "react-icons/fa";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import logo from "../../Images/FE-logo.png";
import JSZip from "jszip";
import moment from "moment-timezone";
import axios from "axios";
import { useParams } from "react-router-dom";

const SubAssemblyQRGenerator = () => {
  const [numQR, setNumQR] = useState(1);
  const [startNum, setStartNum] = useState(1);

  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const [options, setOption] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedWorkOrderId, setWorkOrderId] = useState("");
  const [PDCoption, setPDCOption] = useState([]);
  const [selectedPDCId, setPDCId] = useState("");

  const [qrCode, setQRCodes] = useState([]);
  const [imageData, setImageData] = useState([]);

  const [qrGenerated, setQRGenerated] = useState(false);

  const [selectedSection, setSection] = useState("");

  const [subAssemblyData, setsubAssemblyData] = useState(null);

  const { workOrderId, pdcId, section } = useParams();

  useEffect(() => {
    // Fetch options from database
    fetchSubAssemblyData();
    fetchWorkOrderData();
    fetchPDCData();
  }, [subAssemblyData]);

  useEffect(() => {
    // Set initial value of selectedValue to workOrderId
    if (workOrderId) {
      setWorkOrderId(workOrderId);
    }

    // Set initial value of selectedValue to pdcId
    if (pdcId) {
      setPDCId(pdcId);
    }

    if (section) {
      setSelectedValue(section);
    }
  }, [workOrderId, pdcId, section]);

  const fetchSubAssemblyData = () => {
    axios
      .get(
        `http://localhost:${process.env.REACT_APP_SERVER_PORT}/SubAssembly/${selectedSection}/WO0001/PDC0002/getSubAssembly`
      )
      .then((response) => {
        setsubAssemblyData(response.data.upstairsPDC);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

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

  const fetchPDCData = () => {
    axios
      .get(`http://localhost:${serverPortNumber}/PDC/getAllPDC`)
      .then((response) => {
        setPDCOption(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Add a function to extract the work order ID
  const extractWorkOrderId = (link) => {
    const regex = /(WO\d+)/;
    const match = link.match(regex);
    return match ? match[1] : "Invalid Work Order ID";
  };

  // Add a function to extract the PDC Id
  const extractPDCId = (link) => {
    const regex = /(PDC\d+)/;
    const match = link.match(regex);
    return match ? match[1] : "Invalid PDC ID";
  };

  const handleSubmit = async (e) => {
    console.log(numQR);
    console.log(startNum);
    console.log(selectedValue);
    console.log(workOrderId);
    console.log(pdcId);
    console.log(section);

    e.preventDefault();

    const links = Array.from({ length: numQR }, (_, index) => ({
      link: `http://localhost:${applicationPortNumber}/${section}/${selectedWorkOrderId}/${selectedPDCId}/SUB000${
        Number(startNum) + index
      }`,
      generatedDate: moment()
        .tz("Australia/Sydney")
        .format("YYYY-MM-DD HH:mm:ss"),
    }));

    try {
      const response = await axios.post(
        `http://localhost:${serverPortNumber}/SubAssembly/${section}/${selectedWorkOrderId}/${selectedPDCId}/generateSubAssembly`,
        links // Send the array of links
      );

      const data = response.data;

      console.log(data);

      setQRCodes(() => {
        const newQRCodes = data.links.map((qrcode, index) => ({
          ...qrcode,
          entityId: `SUB000${Number(startNum) + index}`,
        }));

        return newQRCodes;
      });

      setQRGenerated(true);
    } catch (error) {
      console.error("Error:", error);
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
    a.download = `SUB_${entityId}.png`;
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
      a.download = `Sub-Assembly [SUB000${startNum} - ${
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
      <div className="flex justify-center text-white">
        <div className="border-none">
          <div className="w-96 p-6 rounded-md">
            <p className="text-3xl text-center font-bold"> Add Sub-Assembly</p>
          </div>
          <div className="mt-3">
            <label
              htmlFor="numQR"
              className="block text-base mb-2 flex justify-start font-bold"
            >
              Number of QR
            </label>
            <input
              type="number"
              id="numQR"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focusborder-gray-600 text-black"
              min="1"
              onChange={(e) => setNumQR(e.target.value)}
            ></input>
          </div>
          <div className="mt-3">
            <label
              htmlFor="startSubAssemblyNum"
              className="block text-base mb-2 flex justify-start font-bold"
            >
              Starting Sub-Assembly Number
            </label>
            <input
              type="number"
              id="startSubAssemblyNum"
              className="border w-full px-2 py-1 rounded-md focus:outline-none focus:ring-3 focusborder-gray-600 text-black"
              min="1"
              onChange={(e) => setStartNum(e.target.value)}
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="Section"
              className="block text-base mb-2 flex justify-start font-bold"
            >
              Section
            </label>
            <select
              id="sectionDropdown"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
            >
              <option>Select Section ...</option>
              <option>Upstairs</option>
              <option>Downstairs</option>
            </select>
          </div>
          <div className="mt-3">
            <label
              htmlFor="WorkOrderId"
              className="block text-base mb-2 flex justify-start font-bold"
            >
              Work Order
            </label>
            <select
              id="workOrderDropdown"
              value={selectedWorkOrderId}
              onChange={(e) => setWorkOrderId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
              disabled
            >
              <option value="">Select Work Order</option>
              {options.map((option) => (
                <option key={option._id} value={option.value}>
                  {extractWorkOrderId(option.link)}
                </option>
              ))}
            </select>
          </div>

          {selectedWorkOrderId && (
            <div className="mt-3">
              <label
                htmlFor="PDCId"
                className="block text-base mb-2 flex justify-start font-bold flex items-center"
              >
                PDC
                <span className="ml-1"> </span>
                <span class="bg-white text-black text-xs font-black px-2.5 py-0.5 rounded-full">
                  {selectedWorkOrderId}
                </span>
              </label>

              <select
                id="PDCDropdown"
                value={selectedPDCId}
                onChange={(e) => setPDCId(e.target.value)}
                className="mt-1 block w-full border border-black-300 rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm text-black"
                disabled
              >
                <option value="">Select PDC</option>
                {PDCoption.map((PDCoption) => (
                  <option key={PDCoption._id} value={PDCoption.value}>
                    {extractPDCId(PDCoption.link)}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-center">
            <button
              className=" bg-black hover:bg-neutral-800 text-white font-semibold py-4 px-4 rounded mt-5 shadow-lg generate-button"
              onClick={handleSubmit}
            >
              <FaQrcode className="mr-2" />
              Generate Sub-Assembly
            </button>
          </div>
        </div>
      </div>

      {qrGenerated && (
        <div className="flex justify-center">
          <div className="flex justify-center items-center bg-slate-200  w-full rounded-xl mt-5">
            <button
              className="bg-secondary hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded mt-5 mb-5"
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
              <div className="mb-5">Sub-Assembly ID: {code.entityId}</div>
              <img
                src={imageData[code.entityId]}
                alt={`Convereted ${code.entityId}`}
                style={{ display: "none", margin: "10px auto" }}
              />
              <div className="mt-5 flex items-center justify-center">
                <button
                  className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mt-1"
                  onClick={() => handleDownload(code.entityId)}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubAssemblyQRGenerator;
