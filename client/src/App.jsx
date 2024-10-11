import React, { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import { io } from "socket.io-client";
import LineChartComponent from "./components/LineChartComponent";
import BarChartComponent from "./components/BarChartComponent";
import PieChartComponent from "./components/PieChartComponent";
import MachineStatusInformation from "./components/MachineStatusComponent";
import ChartsChunkComponent from "./components/ChartsChunkComponent";

const CHUNK_SIZE = 200;
const linecharts = [
  {
    dataKey: "rotationalSpeed",
    name: "Rotational Speed (rpm)",
    color: "#ffc658",
    minY: 0,
    maxY: 3500,
    width: "45%",
  },
  {
    dataKey: "torque",
    name: "Torque (Nm)",
    color: "white",
    minY: 0,
    maxY: 150,
    width: "45%",
  },
  {
    dataKey: "airTemperature",
    name: "Air Temperature (K)",
    color: "#8884d8",
    minY: 0,
    maxY: 500,
    width: "30%",
  },
  {
    dataKey: "processTemperature",
    name: "Process Temperature (K)",
    color: "#82ca9d",
    minY: 0,
    maxY: 500,
    width: "30%",
  },
];

export default function App() {
  const [status, setStatus] = useState(false);
  const [machineData, setMachineData] = useState([]);
  const [selectedChunk, setSelectedChunk] = useState(-1);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const socketRef = useRef(null);
  const autoUpdateRef = useRef(autoUpdate);

  const chunkCount = Math.ceil(machineData.length / CHUNK_SIZE);
  const marks = Array.from({ length: chunkCount }, (_, index) => ({
    value: index,
    label: `Chunk ${index}`,
  }));
  useEffect(() => {
    autoUpdateRef.current = autoUpdate;
  }, [autoUpdate]);

  const updateMachineData = useCallback((newData) => {
    setMachineData((prevData) => {
      const updatedData = Array.isArray(newData)
        ? newData
        : [...prevData, newData];
      if (autoUpdateRef.current) {
        setSelectedChunk(Math.ceil(updatedData.length / CHUNK_SIZE) - 1);
      }
      return updatedData;
    });
  }, []);

  useEffect(() => {
    socketRef.current = io("http://127.0.0.1:5000");

    socketRef.current.on("connect", () => {
      setConnectionStatus("Connected");
    });

    socketRef.current.on("machine_status", (data) => {
      const parsedData = JSON.parse(data);
      console.log(parsedData);
      updateMachineData(parsedData);
      setStatus(true);
    });

    socketRef.current.on("machine_data", (data) => {
      const parsedData = JSON.parse(data);
      console.log(data);
      updateMachineData(parsedData);
    });

    socketRef.current.on("disconnect", () => {
      setConnectionStatus("Disconnected. Attempting to reconnect...");
      setStatus(false);
    });

    socketRef.current.on("connect_error", () => {
      setConnectionStatus("Connection Error");
      setStatus(false);
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [updateMachineData]);

  const getTypeCounts = () => {
    const counts = { M: 0, H: 0, L: 0, F: 0 };
    machineData.forEach((item) => {
      if (item.predictedFailure) counts["F"]++;
      else counts[item.type]++;
    });

    // Convert counts object to an array of objects with type and count
    return Object.entries(counts).map(([type, count]) => ({ type, count }));
  };

  const currentChunk = machineData.slice(
    selectedChunk * CHUNK_SIZE,
    (selectedChunk + 1) * CHUNK_SIZE
  );

  const handleSliderChange = (event, newValue) => {
    if (newValue === Math.ceil(machineData.length / CHUNK_SIZE) - 1) {
      setSelectedChunk(chunkCount - 1);
      setAutoUpdate(true);
    } else {
      setSelectedChunk(newValue);
      setAutoUpdate(false);
    }
  };

  return (
    <div className="App">
      <div className="charts-area-container" style={{ marginTop: 80 }}>
        <MachineStatusInformation
          connectionStatusHandler={setStatus}
          machineData={machineData}
          connectionStatus={status}
        />
        <div className="pie-chart-needle-container" style={{ width: "45%" }}>
          <h2 className="pie-chart-header">Machine Status:</h2>
          {machineData.length > 0 ? (
            <PieChartComponent logs={machineData} />
          ) : (
            <p>No data yet</p>
          )}
        </div>
      </div>
      <ChartsChunkComponent
        changeHandler={handleSliderChange}
        marks={marks}
        selectedChunk={selectedChunk}
        chunkCount={chunkCount}
      />
      <div className="charts-area-container">
        {linecharts.map((chart) => (
          <div
            className="chart-card-container"
            style={{ width: chart.width }}
            key={chart.dataKey}
          >
            <p className="chart-card-p">{chart.name}</p>
            <LineChartComponent
              {...chart}
              data={currentChunk}
              name={chart.name}
            />
          </div>
        ))}
        <div className="chart-card-container" style={{ width: "27%" }}>
          {getTypeCounts().length > 0 ? (
            <>
              <p className="chart-card-p">Product Details</p>
              <BarChartComponent getCount={getTypeCounts} />
            </>
          ) : (
            <p>No data available for the bar chart.</p>
          )}
        </div>
      </div>
    </div>
  );
}
