import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/form/dashboard') 
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl">{stats.totalProducts}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Dispatched Products</h2>
          <p className="text-2xl">{stats.totalDispatched}</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Total Price</h2>
          <p className="text-2xl">₹{stats.totalPrice}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mt-8 mb-4">Latest Entries</h2>
        <ul className="space-y-2">
          {stats.latestEntries.map((entry:any) => (
            <li key={entry._id} className="p-4 border rounded">
              <p><strong>Product:</strong> {entry.productName}</p>
              <p><strong>Status:</strong> {entry.status}</p>
              <p><strong>Price:</strong> ₹{entry.price}</p>
              <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
