import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQRCode from "qrcode.react";
import html2canvas from "html2canvas";
import logo from "../../Images/FE-logo.png";
import moment from "moment-timezone";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import WorkOrderQRGenerator from "../../components/WorkOrderQRGenerator/WorkOrderQRGenerator";
import "animate.css/animate.min.css";
import "../../components/NavBar/NavBar.css";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LaunchIcon from "@mui/icons-material/Launch";

const WorkOrder = () => {
  const [data, setData] = useState([]);
  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;

  const [qrCodeData, setQrCodeData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const captureRef = useRef(null);
  const [modalPdcID, setModalPdcID] = useState(null);

  const [openWorkOrderModal, setOpenWorkOrderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchWorkOrderData();
  }, [searchQuery]);

  const fetchWorkOrderData = () => {
    axios
      .get(`http://localhost:${serverPortNumber}/WorkOrder/getAllWorkOrder`)
      .then((response) => {
        setData(response.data);
        applySearchFilter(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleLinks = (link) => {
    window.location.href = link;
  };

  const extractIdFromLink = (link) => {
    const match = link.match(/WO(\d+)/);
    return match ? `WO${match[1]}` : null;
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(data.link);
    setModalPdcID(extractIdFromLink(data.link));
    setOpenModal(true);
  };

  const handleDownload = (workOrderID) => {
    html2canvas(captureRef.current)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const fileName = `${workOrderID}.png`;
        const a = document.createElement("a");
        a.href = imgData;
        a.download = fileName;
        a.click();
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  };

  const handleAddWorkOrder = () => {
    setOpenWorkOrderModal(true);
  };

  const handleAddWorkOrderCloseModal = () => {
    setOpenWorkOrderModal(false);
    fetchWorkOrderData();
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    applySearchFilter(data);
  };

  const applySearchFilter = (data) => {
    const filteredResults = data.filter((item) => {
      const workOrderId = extractIdFromLink(item.link);
      const formattedDate = moment(item.generatedDate)
        .tz("Australia/Sydney")
        .format("DD MMMM YYYY");

      return (
        item.link &&
        (workOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          formattedDate.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
    setSearchResults(filteredResults);
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none ">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-8">
          <p className="text-4xl text-signature font-black mb-5 mt-3">
            Work Order
          </p>
          <div className="flex">
            <form className="p-1 flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-1/3"
                  placeholder="Search Work Order"
                  required
                  onChange={handleSearchChange}
                  value={searchQuery}
                />
              </div>
            </form>
            <form class="max-w-sm mx-auto">
              <select
                id="countries"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="10" selected>
                  {" "}
                  10
                </option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </form>
          </div>
          <hr className="h-px m-1 my-2 bg-gray-200 border-0 dark:bg-gray-700" />
          <div className="flex justify-center">
            <TableContainer className="w-full m-1 border border-blue-600 rounded-md">
              <Table className="border-collapse w-full">
                <TableBody>
                  <TableRow className="bg-signature m-4">
                    {/* <TableCell
                    align="center"
                    style={{
                      width: "40%",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.10rem",
                    }}
                  >
                    Link
                  </TableCell> */}
                    <TableCell
                      align="center"
                      style={{
                        width: "20%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                      }}
                    >
                      Work Order ID
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        width: "20%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                      }}
                    >
                      Generated Date
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        width: "20%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableBody>
                  {searchResults.map((row) => (
                    <TableRow
                      key={row._id}
                      className="border-blue-400 border-1 hover:bg-gray-100"
                    >
                      {/* <TableCell align="center">{row.link}</TableCell> */}
                      <TableCell align="center">
                        {row.link && extractIdFromLink(row.link)}
                      </TableCell>
                      <TableCell align="center">
                        {moment(row.generatedDate)
                          .tz("Australia/Sydney")
                          .format("DD MMMM YYYY")}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="delete"
                          size="small"
                          style={{ color: "red" }}
                          //   onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="icon"
                          size="small"
                          style={{ color: "black" }}
                          //   onClick={() => handleEdit(row._id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="QR"
                          size="small"
                          style={{ color: "navy" }}
                          onClick={() => showQRCodes(row)}
                        >
                          <QrCodeIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="links"
                          size="small"
                          style={{ color: "smokewhite" }}
                          onClick={() => handleLinks(row.link)}
                        >
                          <LaunchIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Dialog
                open={openModal}
                onClose={handleCloseModal}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    outline: "none",
                  },
                }}
              >
                <DialogContent>
                  <div ref={captureRef}>
                    <ReactQRCode
                      value={qrCodeData}
                      size={512}
                      imageSettings={{
                        text: "QR Code",
                        src: logo,
                        excavate: true,
                        width: 60,
                        height: 35,
                      }}
                    />
                    <p
                      style={{
                        color: "#043f9d",
                        fontFamily: "Avenir, sans-serif",
                        fontSize: "20px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      Work Order ID:{" "}
                      {qrCodeData && extractIdFromLink(qrCodeData)}
                    </p>
                  </div>
                </DialogContent>

                <DialogActions>
                  <button
                    className="bg-signature hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded "
                    onClick={() => handleDownload(modalPdcID)}
                  >
                    Download
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded "
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </DialogActions>
              </Dialog>
            </TableContainer>
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-5">
        <Fab
          variant="extended"
          aria-label="add"
          sx={{
            textTransform: "capitalize",
            fontWeight: "bold",
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#6c757d",
            },
          }}
          onClick={handleAddWorkOrder}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add Work Order
        </Fab>
      </div>
      <Dialog
        open={openWorkOrderModal}
        onClose={handleAddWorkOrderCloseModal}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            outline: "none",
            width: "120vh",
          },
        }}
      >
        <DialogContent className="bg-blue-900">
          <WorkOrderQRGenerator
            entityName="Work Order"
            apiEndpoint={`http://localhost:${process.env.REACT_APP_SERVER_PORT}/WorkOrder/generateWorkOrder`}
            prefix="WO"
            entityNameNoSpace="WorkOrder"
          />

          <div className="flex justify-center">
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded mt-5 generate-button"
              onClick={handleAddWorkOrderCloseModal}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkOrder;
