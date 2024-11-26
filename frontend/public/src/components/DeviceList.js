import React, { useState, useEffect } from 'react';
import { fetchDevices, addDevice, deleteDevice } from '../api';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    _id: '',
    name: '',
    location: '',
    type: 'pump',
    threshold: { low: 20, high: 80 },
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const { data } = await fetchDevices();
    setDevices(data);
  };

  const handleAddDevice = async () => {
    await addDevice(newDevice);
    setNewDevice({
      _id: '',
      name: '',
      location: '',
      type: 'pump',
      threshold: { low: 20, high: 80 },
    });
    loadDevices();
  };

  const handleDeleteDevice = async (id) => {
    await deleteDevice(id);
    loadDevices();
  };

  return (
    <div>
      <h2>Danh sách thiết bị</h2>
      <ul>
        {devices.map((device) => (
          <li key={device._id}>
            {device.name} - {device.location} - Trạng thái: {device.status}{' '}
            <button onClick={() => handleDeleteDevice(device._id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <h3>Thêm thiết bị</h3>
      <input
        type="text"
        placeholder="ID thiết bị"
        value={newDevice._id}
        onChange={(e) => setNewDevice({ ...newDevice, _id: e.target.value })}
      />
      <input
        type="text"
        placeholder="Tên thiết bị"
        value={newDevice.name}
        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Vị trí"
        value={newDevice.location}
        onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
      />
      <button onClick={handleAddDevice}>Thêm thiết bị</button>
    </div>
  );
};

export default DeviceList;

