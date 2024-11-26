import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DeviceList from './components/DeviceList';
import DeviceControl from './components/DeviceControl';
import Logs from './components/Logs';

const App = () => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [logs, setLogs] = useState([]);

  // Lấy danh sách thiết bị từ backend
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/devices');
        setDevices(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách thiết bị:', error);
      }
    };
    fetchDevices();
  }, []);

  // Lấy lịch sử log của thiết bị khi có thiết bị được chọn
  useEffect(() => {
    if (selectedDevice) {
      const fetchLogs = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/logs/${selectedDevice._id}`);
          setLogs(response.data);
        } catch (error) {
          console.error('Lỗi khi lấy lịch sử log:', error);
        }
      };
      fetchLogs();
    }
  }, [selectedDevice]);

  return (
    <div className="App">
      <h1>Hệ Thống Giám Sát Mực Nước</h1>

      {/* Hiển thị danh sách thiết bị */}
      <DeviceList devices={devices} onDeviceSelect={setSelectedDevice} />

      {/* Hiển thị thông tin và điều khiển máy bơm nếu có thiết bị được chọn */}
      {selectedDevice && (
        <>
          <DeviceControl device={selectedDevice} />
          <Logs logs={logs} />
        </>
      )}
    </div>
  );
};

export default App;
