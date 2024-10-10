export default function MachineStatusInformation({
  machineData,
  connectionStatus,
}) {
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
      </div>
    </div>
  );
}
