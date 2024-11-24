import React from 'react';

const HistoryTable = ({ history }) => {
  return (
    <div>
      <h2>History</h2>
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
    </div>
  );
};

export default HistoryTable;
