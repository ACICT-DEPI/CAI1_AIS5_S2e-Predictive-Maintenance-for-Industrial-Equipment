import axios from "axios";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function MachineStatusInformation({
  machineData,
  connectionStatus,
  connectionStatusHandler,
}) {
  const [failure, setFailure] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStatusToggle = () => {
    setLoading(true);
    axios
      .post("/machine-toggle")
      .then((response) => {
        if (response.status === 200) connectionStatusHandler(!connectionStatus);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleFailureToggle = () => {
    setLoading(true);
    axios
      .post("/machine-mode")
      .then((response) => {
        if (response.status === 200) {
          setFailure(!failure);
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClearData = () => {
    setLoading(true);
    axios
      .post("/clear-data")
      .then((response) => {
        if (response.status === 200) window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="machine-latest-container">
      {machineData.length > 0 ? (
        <div className="machine-latest-information">
          <h2>Latest Data:</h2>
          <h3>Current Iteration: {machineData[machineData.length - 1].uid}</h3>
          <p className="machine-latest-information-p">
            Working on product :
            {" " + machineData[machineData.length - 1].productID}
          </p>
          <p className="machine-latest-information-p ">
            Successful Products:{" "}
            {machineData.length -
              machineData.filter((log) => log.predictedFailure === true).length}
          </p>
          <p className="machine-latest-information-p ">
            Number of failures:{" "}
            {machineData.filter((log) => log.predictedFailure === true).length}
          </p>
        </div>
      ) : (
        <p>No data available.</p>
      )}
      <div className="machine-latest-information-status">
        <div className="status-indicator-container">
          <p className="status-indicator-container-text">
            {connectionStatus === true ? "ON" : "OFF"}
          </p>
          <div
            className="status-indicator"
            style={{
              backgroundColor: connectionStatus === true ? "green" : "red",
            }}
          ></div>
        </div>
        <div className="machine-btn-controls">
          <button
            onClick={handleStatusToggle}
            disabled={loading}
            style={{ width: 150 }}
          >
            {!loading ? (
              `Turn ${connectionStatus ? "Off" : "On"}`
            ) : (
              <CircularProgress color="inherit" size={20} />
            )}
          </button>
          <button
            style={{ width: 150 }}
            onClick={handleFailureToggle}
            disabled={!connectionStatus || loading}
          >
            {!loading ? (
              `Toggle ${failure === true ? "Normal" : "Failure"}`
            ) : (
              <CircularProgress color="inherit" size={20} />
            )}
          </button>
          <button
            style={{ width: 150 }}
            onClick={handleClearData}
            disabled={connectionStatus || !machineData.length > 0 || loading}
          >
            {!loading ? (
              "Clear Data"
            ) : (
              <CircularProgress color="inherit" size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
