import axios from 'axios';

// Base URL cho backend
const API = axios.create({ baseURL: 'http://localhost:3000' });

// API lấy danh sách thiết bị
export const fetchDevices = () => API.get('/api/devices');

// API thêm thiết bị
export const addDevice = (device) => API.post('/api/devices', device);

// API cập nhật thiết bị
export const updateDevice = (id, updates) => API.put(`/api/devices/${id}`, updates);

// API xóa thiết bị
export const deleteDevice = (id) => API.delete(`/api/devices/${id}`);

// API điều khiển thiết bị
export const controlDevice = (id, command) =>
  API.post(`/api/devices/${id}/control`, { command });

// API lấy lịch sử hoạt động
export const fetchLogs = (deviceId) => API.get(`/api/logs/${deviceId}`);
