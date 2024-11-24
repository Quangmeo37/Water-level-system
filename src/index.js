import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng createRoot từ react-dom/client
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root bằng createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
