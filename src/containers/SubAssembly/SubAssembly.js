import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import moment from "moment-timezone";
import ReactQRCode from "qrcode.react";
import logo from "../../Images/FE-logo.png";
import html2canvas from "html2canvas";
import SubAssemblyQRGenerator from "../../components/SubAssemblyQRGenerator/SubAssemblyQRGenerator";

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

const SubAssembly = () => {
  const { section, workOrderId, pdcId } = useParams();
  const [data, setData] = useState(null);
  const [openAddSubAssemblyModal, setOpenSubAssemblyModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [QRModal, setQRModal] = useState(false);
  const [modalSubAssemblyID, setModalSubAssemblyID] = useState(null);
  const captureRef = useRef(null);

  useEffect(() => {
    fetchSubAssemblyData();
    // console.log(section);
    // console.log(workOrderId);
    // console.log(pdcId);
  }, [data]);

  const fetchSubAssemblyData = () => {
    axios
      .get(
        `http://localhost:${process.env.REACT_APP_SERVER_PORT}/SubAssembly/${section}/${workOrderId}/${pdcId}/getSubAssembly`
      )
      .then((response) => {
        setData(response.data.upstairsPDC);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const extractSubAssemblyId = (link) => {
    const regex = /(SUB\d+)/;
    const match = link.match(regex);
    return match ? match[1] : "Invalid Sub-Assembly Id";
  };

  const handleAddSubAssemblyCloseModal = () => {
    setOpenSubAssemblyModal(false);
  };

  const handleAddSubAssemblyOpenModal = () => {
    setOpenSubAssemblyModal(true);
  };

  const showQRCodes = (data, row) => {
    setQrCodeData(data.link);
    setModalSubAssemblyID(extractSubAssemblyId(data.link));
    setQRModal(true);
  };

  const handleCloseQRModal = () => {
    setQRModal(false);
  };

  return (
    <div>
      <div>
        <div className="flex justify-center bg-background border-none">
          <div className="w-3/4 p-6 shadow-lg bg-white rounded-md my-8">
            <div className="flex justify-center">
              <p className="text-4xl text-signature font-black mb-5 mt-3 flex items-center">
                {" "}
                Sub-Assembly{" "}
                <span className="p-2 ml-3 bg-red-600 text-xl text-white rounded-full">
                  {section}
                </span>
              </p>
            </div>
            <div className="p-5 m-1 bg-black rounded-md">
              <div className="grid grid-cols-2 gap-x-4 text-white">
                <div className="flex flex-col items-start ">
                  <p className="text-3xl font-bold mb-1 ">Work Order</p>
                  <p className="font-semibold">{workOrderId}</p>
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-3xl font-bold mb-1">PDC</p>
                  <p className="font-semibold">{pdcId}</p>
                </div>
              </div>
            </div>

            {/* <div className="bg-black rounded-xl w-1/2 text-white p-3">
                <p className="p-2 font-semibold">
                  Work Order ID: {workOrderId}
                </p>
                <p className="p-2 font-semibold">PDC ID: {pdcId}</p>
              </div> */}

            <div className="flex justify-center">
              <TableContainer className="w-full m-1 border border-blue-400 rounded-md">
                <Table className="border-collapse w-full">
                  <TableHead className="bg-gradient-to-br from-signature to-indigo-800 m-4 ">
                    <TableCell
                      align="center"
                      style={{
                        width: "20%",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.10rem",
                      }}
                    >
                      SubAssembly Id
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
                    {data &&
                      data.map((row) => (
                        <TableRow key={row.id} className="hover:bg-gray-100">
                          <TableCell align="center">
                            {" "}
                            {extractSubAssemblyId(row.link)}
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
                              // onClick={() => handleLinks(row.link)}
                            >
                              <LaunchIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                <Dialog
                  open={QRModal}
                  onClose={handleCloseQRModal}
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
                        Sub-Assembly ID:{" "}
                        {qrCodeData && extractSubAssemblyId(qrCodeData)}
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
                      onClick={handleCloseQRModal}
                    >
                      Close
                    </button>
                  </DialogActions>
                </Dialog>
              </TableContainer>

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
                  onClick={handleAddSubAssemblyOpenModal}
                >
                  <AddIcon sx={{ mr: 1 }} />
                  Add Sub-Assembly for {section}
                </Fab>
              </div>
              <Dialog
                open={openAddSubAssemblyModal}
                onClose={handleAddSubAssemblyCloseModal}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    outline: "none",
                    width: "120vh",
                  },
                }}
              >
                {" "}
                <DialogContent className="bg-blue-900">
                  <SubAssemblyQRGenerator />
                  <div className="flex justify-center">
                    <button
                      className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded mt-5 generate-button"
                      onClick={handleAddSubAssemblyCloseModal}
                    >
                      Close
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubAssembly;
