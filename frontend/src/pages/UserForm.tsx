import React, { useState, type FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserForm() {
  const [form, setForm] = useState<any>({
    date: '',
    productNo: '',
    productName: '',
    productDimension: '',
    status: '',
    price: '',
    plantName: '',
    notes: '',
    productDescription: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/form/submit', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Form submitted successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <button
        onClick={handleLogout}
        className="absolute top-5 right-5 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-purple-700 transition duration-200"
      >
        Logout
      </button>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-xl w-full max-w-xl p-5">
        <h2 className="text-3xl font-bold text-center text-indigo-700 p-1">
          Product Submission Form
        </h2>
        <div>
            <label className="block text-gray-700 mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: 'productNo', label: 'Product No.' },
            { name: 'productName', label: 'Product Name' },
            { name: 'productDimension', label: 'Product Dimension' },
            { name: 'status', label: 'Status' },
            { name: 'price', label: 'Price' },
            { name: 'plantName', label: 'Plant Name' },
            { name: 'notes', label: 'Notes' },
            { name: 'productDescription', label: 'Product Description' },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="block text-gray-700 mb-1 font-medium">{label}</label>
              {name === 'status' ? (
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        required
      >
        <option value="" disabled>Select Status</option>
        <option value="Available">Available</option>
        <option value="Out of Stock">Out of Stock</option>
        <option value="Discontinued">Discontinued</option>
      </select>
    ) : (
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder={label}
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                required={name !== 'notes' && name !== 'productDescription'}
              />
            )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
