import React from "react";
import QRGenerator from "../../components/WorkOrderQRGenerator/WorkOrderQRGenerator";

const WorkOrder = () => {
  return (
    <div>
      <QRGenerator
        entityName="Work Order"
        apiEndpoint={`http://localhost:${process.env.REACT_APP_SERVER_PORT}/WorkOrder/generateWorkOrder`}
        prefix="WO"
        entityNameNoSpace="WorkOrder"
      />
    </div>
  );
};

export default WorkOrder;
