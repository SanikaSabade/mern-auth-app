import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [forms, setForms] = useState<any[]>([]);
  const [editingForm, setEditingForm] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8000/api/admin/forms', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForms(res.data.forms);
    } catch (error: any) {
      console.error('Error fetching forms:', error.message);
      alert('Failed to load submitted forms');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this form?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/admin/forms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Form deleted successfully');
      fetchForms();
    } catch (err) {
      console.error(err);
      alert('Failed to delete form');
    }
  };

  const handleEdit = (form: any) => {
    setEditingForm(form);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8000/api/admin/forms/${editingForm._id}`, editingForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Form updated successfully');
      setShowModal(false);
      fetchForms();
    } catch (err) {
      console.error(err);
      alert('Failed to update form');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Submitted Product Forms</h2>

        <div className="overflow-x-auto bg-white shadow rounded-lg ">
          <table className="min-w-full divide-y divide-gray-200 bg-blue-50">
            <thead className=" text-black">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Product No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Dimension</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Plant</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Notes</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100 text-center">
              {forms.map((form, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{form.email}</td>
                  <td className="px-4 py-2">{form.productNo}</td>
                  <td className="px-4 py-2">{form.productName}</td>
                  <td className="px-4 py-2">{form.productDimension}</td>
                  <td className="px-4 py-2">{form.status}</td>
                  <td className="px-4 py-2">{form.price}</td>
                  <td className="px-4 py-2">{form.plantName}</td>
                  <td className="px-4 py-2">{form.notes}</td>
                  <td className="px-4 py-2">{form.productDescription}</td>
                  <td className="px-4 py-2">{form.date}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleEdit(form)}
                      className="bg-blue-400 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(form._id)}
                      className="bg-red-400 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {forms.length === 0 && (
                <tr>
                  <td colSpan={11} className="text-center text-gray-500 py-6">
                    No forms submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && editingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                'productNo',
                'productName',
                'productDimension',
                'status',
                'price',
                'plantName',
                'notes',
                'productDescription',
                'date'
              ].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={editingForm[field]}
                    onChange={(e) =>
                      setEditingForm({ ...editingForm, [field]: e.target.value })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
