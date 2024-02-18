import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "moment/locale/en-au";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import moment from "moment-timezone";
import ReactQRCode from "qrcode.react";
import logo from "../../Images/FE-logo.png";
import html2canvas from "html2canvas";

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

import PDCQRGenerator from "../../components/PDCQRGenerator/PDCQRGenerator";

const PDC = () => {
  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const [PDCData, setPDCData] = useState([]);

  const [qrCodeData, setQrCodeData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const captureRef = useRef(null);

  const [openAddPDCModal, setOpenPDCModal] = useState(false);
  const [modalPdcID, setModalPdcID] = useState(null);

  const { workOrderId } = useParams();

  useEffect(() => {
    // Fetch options from database
    fetchPDCData();
  }, [PDCData]);

  const fetchPDCData = () => {
    axios
      .get(`http://localhost:${serverPortNumber}/PDC/${workOrderId}/getAllPDC`)
      .then((response) => {
        setPDCData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  // Add a function to extract the work order ID
  const extractPDCId = (link) => {
    const regex = /(PDC\d+)/;
    const match = link.match(regex);
    return match ? match[1] : "Invalid PDC ID";
  };

  const handleAddPDCModal = () => {
    setOpenPDCModal(true);
  };

  const handleAddPDCCloseModal = () => {
    setOpenPDCModal(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(data.link);
    setModalPdcID(extractPDCId(data.link));
    setOpenModal(true);
  };

  const handleDownload = (pdcID) => {
    html2canvas(captureRef.current)
      .then((canvas) => {
        // Convert canvas to data URL
        const imgData = canvas.toDataURL("image/png");

        // Generate a unique filename
        const fileName = `${pdcID}.png`;

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

  const handleLinks = (link) => {
    window.location.href = link;
  };

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-8">
          <p className="text-4xl text-signature font-black mb-5 mt-3">PDC</p>
          <div className="p-5 m-1 bg-black rounded-md">
            <div className="grid grid-cols-2 gap-x-4 text-white">
              <div className="flex flex-col items-start ">
                <p className="text-3xl font-bold mb-1 ">Work Order</p>
                <p className="font-semibold">{workOrderId}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <TableContainer className="w-full m-1 border border-blue-600 rounded-md">
              <Table className="border-collapse w-full">
                <TableHead className="bg-signature m-4">
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
                    PDC ID
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
                  {PDCData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      {/* <TableCell align="center">{row.link}</TableCell> */}
                      <TableCell align="center">
                        {row.link && extractPDCId(row.link)}
                      </TableCell>
                      <TableCell align="center">
                        {" "}
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
                      PDC ID: {qrCodeData && extractPDCId(qrCodeData)}
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
                    className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded"
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
          onClick={handleAddPDCModal}
        >
          <AddIcon sx={{ mr: 1 }} />
          Add PDC
        </Fab>
      </div>
      <Dialog
        open={openAddPDCModal}
        onClose={handleAddPDCCloseModal}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            outline: "none",
            width: "120vh",
          },
        }}
      >
        <DialogContent className="bg-blue-900">
          <PDCQRGenerator />
          <div className="flex justify-center">
            <button
              className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded mt-5 generate-button"
              onClick={handleAddPDCCloseModal}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDC;
