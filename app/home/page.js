"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newContact, setNewContact] = useState({ name: "", email: "", phone: "", address: "", timezone: "" });
    const [isCreating, setIsCreating] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            const jwtToken = localStorage.getItem('jwt');

            if (!jwtToken) {
                setError("No authorization token found");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('/api/contacts', {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                        Accept: 'application/json',
                        "Content-Type": "application/json"
                    },
                });
                console.log(response);
                setContacts(response.data.contacts);
            } catch (err) {
                console.log(err);
                setError("Failed to fetch contacts");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewContact({ ...newContact, [name]: value });
    };

    const handleCreateContact = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        const jwtToken = localStorage.getItem('jwt');

        try {
            const response = await axios.post('/api/contacts', newContact, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
            });
            setContacts([...contacts, response.data.contact]); // Add the new contact to the contacts list
            setNewContact({ name: "", email: "", phone: "", address: "", timezone: "" }); // Reset form
        } catch (err) {
            console.log(err);
            setError("Failed to create contact");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEditContact = (contact) => {
        setEditingContact(contact);
        setNewContact(contact); // Populate form with current contact details
        setIsEditing(true);
    };

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        const jwtToken = localStorage.getItem('jwt');

        try {
            const response = await axios.put(`/api/contacts/${editingContact._id}`, newContact, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
            });
            
            console.log(response)
            setIsEditing(false);
            setEditingContact(null);
            location.reload();
        } catch (err) {
            console.log(err);
            setError("Failed to update contact");
        }
    };

    const handleDeleteContact = async (contactId) => {
        const jwtToken = localStorage.getItem('jwt');

        try {
            const res = await axios.delete(`/api/contacts/${contactId}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    Accept: 'application/json',
                    "Content-Type": "application/json"
                },
            });
            console.log(res)
            location.reload()
        
        } catch (err) {
            console.log(err);
            setError("Failed to delete contact");
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 mt-10">{error}</div>;
    }

    return (
        <div className="container mx-auto mt-5 px-4">
            
            
            {/* Create/Edit Contact Form */}
            <form onSubmit={isEditing ? handleUpdateContact : handleCreateContact} className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Contact" : "Add New Contact"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        value={newContact.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        required
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="email"
                        name="email"
                        value={newContact.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="phone"
                        value={newContact.phone}
                        onChange={handleInputChange}
                        placeholder="Phone"
                        required
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="address"
                        value={newContact.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        name="timezone"
                        value={newContact.timezone}
                        onChange={handleInputChange}
                        placeholder="Timezone"
                        className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isCreating}
                    className={`mt-4 w-full p-2 border rounded-md ${isCreating ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors duration-200`}
                >
                    {isCreating ? "Creating..." : isEditing ? "Updating..." : "Create Contact"}
                </button>
            </form>

            {contacts ? <h1 className="text-3xl font-bold text-center mb-6">Contacts</h1>:<h1 className="text-3xl font-bold text-center mb-6">No Contacts</h1>}

            <ul className="space-y-4">
                {contacts.length > 0 ? (
                    contacts.map((contact) => (
                        <li key={contact._id} className="p-4 border rounded-lg shadow-md bg-white">
                            <h2 className="text-xl font-semibold">{contact.name}</h2>
                            <p>Email: {contact.email}</p>
                            <p>Phone: {contact.phone}</p>
                            <p>Address: {contact.address}</p>
                            <p>Timezone: {contact.timezone}</p>
                            <div className="mt-4 flex justify-between">
                                <button onClick={() => handleEditContact(contact)} className="text-blue-500 hover:underline">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteContact(contact._id)} className="text-red-500 hover:underline">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="p-4 text-gray-500 bg-white rounded-lg">No Contacts</li>
                )}
            </ul>
        </div>
    );
};

export default Home;
