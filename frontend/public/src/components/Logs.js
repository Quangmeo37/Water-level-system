  import React, { useState, useEffect } from 'react';
  import { fetchLogs } from '../api';

  const Logs = ({ deviceId }) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
      loadLogs();
    }, [deviceId]);

    const loadLogs = async () => {
      const { data } = await fetchLogs(deviceId);
      setLogs(data);
    };

    return (
      <div>
        <h3>Lịch sử hoạt động</h3>
        <ul>
          {logs.map((log) => (
            <li key={log._id}>
              {log.timestamp} - {log.action} - Trạng thái: {log.status}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  export default Logs;

