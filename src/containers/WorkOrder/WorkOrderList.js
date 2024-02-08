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

const WorkOrderDashboard = () => {
  const [data, setData] = useState([]);
  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;

  const [qrCodeData, setQrCodeData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const captureRef = useRef(null);
  const [modalPdcID, setModalPdcID] = useState(null);

  const [openWorkOrderModal, setOpenWorkOrderModal] = useState(false);

  useEffect(() => {
    fetchWorkOrderData();
  }, []);

  const fetchWorkOrderData = () => {
    axios
      .get(`http://localhost:${serverPortNumber}/WorkOrder/getAllWorkOrder`)
      .then((response) => {
        setData(response.data);
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
    const match = link.match(/id=WO(\d+)/);
    return match ? `WO${match[1]}` : null;
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(data.link);
    setModalPdcID(extractIdFromLink(data.link));
    setOpenModal(true);
  };

  const handleDownload = (pdcID) => {
    html2canvas(captureRef.current)
      .then((canvas) => {
        // Convert canvas to data URL
        const imgData = canvas.toDataURL("image/png");

        // Generate a unique filename
        const fileName = `PDCQR_${pdcID}.png`;

        // Create a download link with the specified filename
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
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-8">
          <p className="text-3xl font-bold mb-5 mt-3">Work Order List</p>
          <div className="flex justify-center">
            <TableContainer className="w-full m-1 border border-blue-400 rounded-md">
              <Table className="border-collapse w-full">
                <TableHead className="bg-gradient-to-br from-signature to-teal-500 m-4 ">
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
                </TableHead>
                <TableBody>
                  {data.map((row) => (
                    <TableRow
                      key={row._id}
                      className="border-blue-400 border-1"
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
                className=" bg-gradient-to-br from-signature to-teal-500"
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
        <DialogContent className="bg-gradient-to-br from-signature to-teal-500">
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

export default WorkOrderDashboard;
