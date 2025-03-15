import { useState, useEffect } from 'react';
import { getToken } from '../services/auth';
import axios from 'axios';

export default function Proposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProposal, setNewProposal] = useState({
    bidId: '',
    content: '',
    documents: [],
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const token = getToken();
      const response = await axios.get('http://localhost:3000/proposals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProposals(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error loading proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await axios.post('http://localhost:3000/proposals', newProposal, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProposals([...proposals, response.data.proposal]);
      setNewProposal({ bidId: '', content: '', documents: [] });
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating proposal');
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Proposals - Phantom AeroVolt</h1>
      <form onSubmit={handleCreateProposal} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Bid ID"
          value={newProposal.bidId}
          onChange={(e) => setNewProposal({ ...newProposal, bidId: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <textarea
          placeholder="Proposal Content"
          value={newProposal.content}
          onChange={(e) => setNewProposal({ ...newProposal, content: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Proposal
        </button>
      </form>
      <div>
        <h2 className="text-xl font-bold mb-2">Existing Proposals</h2>
        {proposals.map((proposal) => (
          <div key={proposal.id} className="border p-4 mb-2 rounded">
            <p>Content: {proposal.content}</p>
            <p>Bid: {proposal.bid.projectName}</p>
            <p>Status: {proposal.status}</p>
            {/* Agrega más detalles según necesites */}
          </div>
        ))}
      </div>
    </div>
  );
}