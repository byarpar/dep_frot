import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [contacts, setContacts] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
    });
    const [editingContactId, setEditingContactId] = useState(null);

    const API_URL = 'https://depbackend-production-c4f0.up.railway.app/contact'; // Your Railway backend URL

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get(API_URL);
            setContacts(response.data);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContactId) {
                // Update contact
                await axios.put(`${API_URL}/${editingContactId}`, formData);
            } else {
                // Create new contact
                await axios.post(API_URL, formData);
            }
            resetForm();
            fetchContacts();
        } catch (error) {
            console.error('Error saving contact:', error);
        }
    };

    const handleEdit = (contact) => {
        setFormData(contact);
        setEditingContactId(contact.id);
    };

    const handleDelete = async (contactId) => {
        try {
            await axios.delete(`${API_URL}/${contactId}`);
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    const resetForm = () => {
        setFormData({ firstName: '', lastName: '', email: '', company: '', phone: '' });
        setEditingContactId(null);
    };

    return (
        <div className="container">
            <h1>Contact Management</h1>
            <form className="contact-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={handleInputChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                />
                <button type="submit">{editingContactId ? 'Update Contact' : 'Add Contact'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>

            <h2>Contacts List</h2>
            <ul className="contact-list">
                {contacts.map((contact) => (
                    <li key={contact.id} className="contact-item">
                        <div className="contact-details">
                            <span className="contact-name">{contact.firstName} {contact.lastName}</span>
                            <span className="contact-email">{contact.email}</span>
                            <span className="contact-company">{contact.company}</span>
                            <span className="contact-phone">{contact.phone}</span>
                        </div>
                        <div className="contact-actions">
                            <button className="edit-button" onClick={() => handleEdit(contact)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(contact.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
