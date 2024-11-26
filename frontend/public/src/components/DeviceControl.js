import React from 'react';
import { controlDevice } from '../api';

const DeviceControl = ({ device }) => {
  const handleControl = async (command) => {
    await controlDevice(device._id, command);
    alert(`Gửi lệnh ${command} đến thiết bị ${device.name}`);
  };

  return (
    <div>
      <h3>Điều khiển thiết bị: {device.name}</h3>
      <button onClick={() => handleControl('on')}>Bật</button>
      <button onClick={() => handleControl('off')}>Tắt</button>
    </div>
  );
};

export default DeviceControl;
