import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "moment/locale/en-au";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";
import ReactQRCode from "qrcode.react";
import logo from "../../Images/FE-logo.png";

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

const WorkOrderDashboard = () => {
  const serverPortNumber = process.env.REACT_APP_SERVER_PORT;
  const applicationPortNumber = process.env.REACT_APP_APPLICATION_PORT;

  const [PDCData, setPDCData] = useState([]);

  const [qrCodeData, setQrCodeData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const captureRef = useRef(null);

  const [openAddPDCModal, setOpenPDCModal] = useState(false);
  const [modalPdcID, setModalPdcID] = useState(null);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const workOrderId = queryParams.get("id");

  useEffect(() => {
    // Fetch options from database
    fetchPDCData();
  }, []);

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
    const regex = /PDCId=(PDC\d+)/;
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

  return (
    <div>
      <div className="flex justify-center bg-background border-none">
        <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-8">
          <p className="text-3xl font-bold mb-5 mt-3">PDC List</p>
          <div className="flex justify-center mb-5">
            <div className="bg-black rounded-xl w-1/2 ">
              <p className=" text-white font-semibold">
                {" "}
                Work Order ID: {workOrderId}
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <TableContainer className="w-full m-1 border border-blue-400 rounded-md">
              <Table className="border-collapse w-full">
                <TableHead className="bg-gradient-to-br from-signature to-teal-500 m-4">
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
                    <TableRow key={row.id}>
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
                          //   onClick={() => handleLinks(row.link)}
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
                className="bg-gradient-to-br from-signature to-teal-500 animate-shiny-pulse"
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
                    // onClick={() => handleDownload(modalPdcID)}
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
        <DialogContent className="bg-gradient-to-br from-signature to-teal-500">
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

export default WorkOrderDashboard;
