import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [devices, setDevices] = useState([]);
  const [history, setHistory] = useState([]);
  const [deviceForm, setDeviceForm] = useState({ name: '', description: '', id: null }); // Dùng để thêm/sửa thiết bị
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa

  useEffect(() => {
    fetchDevices();
    fetchHistory();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/devices');
      setDevices(response.data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/water/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const controlDevice = async (id, status) => {
    try {
      await axios.post(`http://localhost:3000/api/devices/${id}/control`, { status });
      fetchDevices();
    } catch (error) {
      console.error('Error controlling device:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      // Cập nhật thiết bị
      try {
        await axios.put(`http://localhost:3000/api/devices/${deviceForm.id}`, {
          name: deviceForm.name,
          description: deviceForm.description,
        });
        fetchDevices();
        resetForm();
      } catch (error) {
        console.error('Error updating device:', error);
      }
    } else {
      // Thêm thiết bị mới
      try {
        await axios.post('http://localhost:3000/api/devices', {
          name: deviceForm.name,
          description: deviceForm.description,
        });
        fetchDevices();
        resetForm();
      } catch (error) {
        console.error('Error adding device:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/devices/${id}`);
      fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleEdit = (device) => {
    setDeviceForm({ name: device.name, description: device.description, id: device._id });
    setIsEditing(true);
  };

  const resetForm = () => {
    setDeviceForm({ name: '', description: '', id: null });
    setIsEditing(false);
  };

  return (
    <div className="container">
      <h1>IoT Water Management System</h1>

      <section>
        <h2>Manage Devices</h2>
        <form onSubmit={handleFormSubmit} className="device-form">
          <input
            type="text"
            placeholder="Device Name"
            value={deviceForm.name}
            onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Device Description"
            value={deviceForm.description}
            onChange={(e) => setDeviceForm({ ...deviceForm, description: e.target.value })}
            required
          />
          <button type="submit">{isEditing ? 'Update Device' : 'Add Device'}</button>
          {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>

        <div className="device-list">
          {devices.map((device) => (
            <div key={device._id} className="device">
              <h3>{device.name}</h3>
              <p>{device.description}</p>
              <p>Status: {device.status}</p>
              <button onClick={() => controlDevice(device._id, 'ON')}>Turn ON</button>
              <button onClick={() => controlDevice(device._id, 'OFF')}>Turn OFF</button>
              <button onClick={() => handleEdit(device)}>Edit</button>
              <button onClick={() => handleDelete(device._id)}>Delete</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Water History</h2>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Distance (cm)</th>
              <th>Pump Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record._id}>
                <td>{new Date(record.timestamp).toLocaleString()}</td>
                <td>{record.distance}</td>
                <td>{record.pumpStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
