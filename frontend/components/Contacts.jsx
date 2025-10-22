import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Contacts({ onSelectContact }) {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', address: '' });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const savedContacts = localStorage.getItem('sentechain_contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  };

  const saveContacts = (updatedContacts) => {
    localStorage.setItem('sentechain_contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  const handleAddContact = (e) => {
    e.preventDefault();

    if (!newContact.name || !newContact.address) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic address validation
    if (!newContact.address.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Invalid Ethereum address');
      return;
    }

    // Check for duplicates
    if (contacts.find(c => c.address.toLowerCase() === newContact.address.toLowerCase())) {
      toast.error('Contact already exists');
      return;
    }

    const updatedContacts = [
      ...contacts,
      {
        id: Date.now(),
        name: newContact.name,
        address: newContact.address
      }
    ];

    saveContacts(updatedContacts);
    setNewContact({ name: '', address: '' });
    setShowAddForm(false);
    toast.success('Contact added successfully');
  };

  const handleDeleteContact = (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== id);
      saveContacts(updatedContacts);
      toast.success('Contact deleted');
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (address) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Contacts</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          {showAddForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <form onSubmit={handleAddContact} className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3">
          <div>
            <label className="label">Contact Name</label>
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="John Doe"
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Wallet Address</label>
            <input
              type="text"
              value={newContact.address}
              onChange={(e) => setNewContact({ ...newContact, address: e.target.value })}
              placeholder="0x..."
              className="input-field"
            />
          </div>
          <button type="submit" className="w-full btn-primary">
            Save Contact
          </button>
        </form>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No contacts yet</p>
          <p className="text-sm mt-2">Add contacts to send money faster</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-500 truncate">{formatAddress(contact.address)}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {onSelectContact && (
                  <button
                    onClick={() => onSelectContact(contact)}
                    className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary-dark transition-colors"
                  >
                    Send
                  </button>
                )}
                <button
                  onClick={() => copyToClipboard(contact.address)}
                  className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
                >
                  Copy
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
