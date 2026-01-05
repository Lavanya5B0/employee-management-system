import React, { useState, useEffect } from 'react';
import { X, Camera } from 'lucide-react';
// IMPORT FIXED HERE
import { REGIONS } from '../utils/mockData';

const EmployeeModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [regionQuery, setRegionQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '', gender: 'Male', dob: '', state: REGIONS[0], isActive: true, image: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                gender: 'Male',
                dob: '',
                state: REGIONS[0], // Default to first region
                isActive: true,
                image: ''
            });
        }
        setErrors({});
        setRegionQuery('');
    }, [initialData, isOpen]);

    // Logic for searchable region dropdown
    const filteredRegions = REGIONS.filter(r =>
        r.toLowerCase().includes(regionQuery.toLowerCase())
    );

    const validate = () => {
        let newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.dob) newErrors.dob = "Date of Birth is required";
        if (!formData.image && !initialData) newErrors.image = "Profile image is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) onSave(formData);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFormData({ ...formData, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <div style={headerStyle}>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
                        {initialData ? 'Update Employee Details' : 'Register New Employee'}
                    </h2>
                    <button onClick={onClose} style={closeBtnStyle}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={avatarPreviewStyle}>
                                {formData.image ? (
                                    <img src={formData.image} alt="Preview" style={imgStyle} />
                                ) : (
                                    <Camera size={32} color="#94a3b8" />
                                )}
                            </div>
                            <input
                                type="file" accept="image/*" onChange={handleImage}
                                style={fileInputStyle} id="file-upload"
                            />
                            <label htmlFor="file-upload" style={uploadLabelStyle}>Upload Photo</label>
                        </div>
                        {errors.image && <p style={errorText}>{errors.image}</p>}
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Full Name</label>
                        <input
                            style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : '#e2e8f0' }}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ex: Arjun Mehta"
                        />
                        {errors.name && <span style={errorText}>{errors.name}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={labelStyle}>Gender</label>
                            <select style={inputStyle} value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label style={labelStyle}>Date of Birth</label>
                            <input
                                type="date" style={{ ...inputStyle, borderColor: errors.dob ? '#ef4444' : '#e2e8f0' }}
                                value={formData.dob}
                                onChange={e => setFormData({ ...formData, dob: e.target.value })}
                            />
                            {errors.dob && <span style={errorText}>{errors.dob}</span>}
                        </div>
                    </div>

                    <div style={formGroup}>
                        <label style={labelStyle}>Region / State</label>
                        {/* REGION SEARCH BAR */}
                        <input
                            placeholder="Type to filter regions..."
                            style={{ ...inputStyle, marginBottom: '8px', fontSize: '12px', height: '35px', backgroundColor: '#f8fafc' }}
                            value={regionQuery}
                            onChange={(e) => setRegionQuery(e.target.value)}
                        />
                        <select
                            style={inputStyle}
                            value={formData.state}
                            onChange={e => setFormData({ ...formData, state: e.target.value })}
                        >
                            {filteredRegions.map(region => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                            {filteredRegions.length === 0 && <option disabled>No regions found</option>}
                        </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                        <input
                            type="checkbox" checked={formData.isActive} id="status"
                            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="status" style={{ fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Set as Active Employee</label>
                    </div>

                    <button type="submit" style={submitBtnStyle}>
                        {initialData ? 'Update Profile' : 'Add to Directory'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles (unchanged from your previous logic)
const overlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalStyle = { backgroundColor: 'white', width: '100%', maxWidth: '480px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' };
const headerStyle = { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const avatarPreviewStyle = { width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', boxSizing: 'border-box' };
const formGroup = { marginBottom: '16px' };
const errorText = { color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' };
const closeBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' };
const submitBtnStyle = { width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', marginTop: '24px', cursor: 'pointer' };
const uploadLabelStyle = { fontSize: '12px', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px', display: 'block' };
const fileInputStyle = { display: 'none' };

export default EmployeeModal;