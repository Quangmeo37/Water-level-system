import React, { useState, useEffect } from 'react';
import { controlDevice, toggleAutoMode } from '../api';

const DeviceControl = ({ device }) => {
  const [autoMode, setAutoMode] = useState(device.autoMode === "on"); // Lưu trạng thái chế độ tự động

  const handleControl = async (command) => {
    await controlDevice(device._id, command);
    alert(`Gửi lệnh ${command} đến thiết bị ${device.name}`);
  };

  const handleAutoModeChange = async () => {
    // Chuyển đổi chế độ tự động giữa on và off
    const newAutoMode = !autoMode;
    setAutoMode(newAutoMode);
    await toggleAutoMode(device._id, newAutoMode ? "on" : "off");
    alert(`Chế độ tự động ${newAutoMode ? "bật" : "tắt"} cho thiết bị ${device.name}`);
  };

  return (
    <div>
      <h3>Điều khiển thiết bị: {device.name}</h3>
      
      {/* Các nút điều khiển thủ công */}
      <button onClick={() => handleControl('on')}>Bật</button>
      <button onClick={() => handleControl('off')}>Tắt</button>

      {/* Chế độ tự động */}
      <div>
        <label>
          <input
            type="checkbox"
            checked={autoMode}
            onChange={handleAutoModeChange}
          />
          Chế độ tự động
        </label>
      </div>
    </div>
  );
};

export default DeviceControl;
