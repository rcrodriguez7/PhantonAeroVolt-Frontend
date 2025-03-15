import { useState, useEffect } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';

export default function Bids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newBid, setNewBid] = useState({
    companyId: '',
    estimatorId: '',
    projectName: '',
    projectLocation: '',
    bidDueDate: '',
    projectStartDate: '',
    bidAmount: '',
    status: 'Pending',
    trades: [],
    industry: 'Commercial',
    priority: 'Medium',
  });

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:3000/bids', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBids(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading bids');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBid = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await axios.post('http://localhost:3000/bids', newBid, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBids([...bids, response.data.bid]);
      setNewBid({
        companyId: '',
        estimatorId: '',
        projectName: '',
        projectLocation: '',
        bidDueDate: '',
        projectStartDate: '',
        bidAmount: '',
        status: 'Pending',
        trades: [],
        industry: 'Commercial',
        priority: 'Medium',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating bid');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bids - Phantom AeroVolt</h1>
      <form onSubmit={handleCreateBid} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Company ID"
          value={newBid.companyId}
          onChange={(e) => setNewBid({ ...newBid, companyId: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          placeholder="Estimator ID"
          value={newBid.estimatorId}
          onChange={(e) => setNewBid({ ...newBid, estimatorId: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          placeholder="Project Name"
          value={newBid.projectName}
          onChange={(e) => setNewBid({ ...newBid, projectName: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="text"
          placeholder="Project Location"
          value={newBid.projectLocation}
          onChange={(e) => setNewBid({ ...newBid, projectLocation: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="datetime-local"
          value={newBid.bidDueDate}
          onChange={(e) => setNewBid({ ...newBid, bidDueDate: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <input
          type="datetime-local"
          value={newBid.projectStartDate}
          onChange={(e) => setNewBid({ ...newBid, projectStartDate: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <input
          type="number"
          placeholder="Bid Amount"
          value={newBid.bidAmount}
          onChange={(e) => setNewBid({ ...newBid, bidAmount: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <select
          value={newBid.status}
          onChange={(e) => setNewBid({ ...newBid, status: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="text"
          placeholder="Trade IDs (comma-separated)"
          value={newBid.trades.join(',')}
          onChange={(e) => setNewBid({ ...newBid, trades: e.target.value.split(',').map(id => id.trim()) })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <select
          value={newBid.industry}
          onChange={(e) => setNewBid({ ...newBid, industry: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Commercial">Commercial</option>
          <option value="Residential">Residential</option>
          <option value="Industrial">Industrial</option>
          <option value="Government">Government</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Renewable Energy">Renewable Energy</option>
        </select>
        <select
          value={newBid.priority}
          onChange={(e) => setNewBid({ ...newBid, priority: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Bid
        </button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-2">Existing Bids</h2>
        {bids.map((bid) => (
          <div key={bid.id} className="border p-4 mb-2 rounded">
            <p>Project: {bid.projectName}</p>
            <p>Location: {bid.projectLocation}</p>
            <p>Due Date: {new Date(bid.bidDueDate).toLocaleString()}</p>
            {/* Agrega más detalles según necesites */}
          </div>
        ))}
      </div>
    </div>
  );
}