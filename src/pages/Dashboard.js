import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Search, Plus, Printer, Edit, Trash2, Users, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = ({ onAddClick, onEditClick, onDelete }) => {
    const { employees } = useContext(GlobalContext);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    // Track hover state for table action icons
    const [hoveredAction, setHoveredAction] = useState(null); // format: {id, type}

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filtered = employees.filter(emp => {
        const query = search.toLowerCase();
        const matchesGlobalSearch =
            emp.name.toLowerCase().includes(query) ||
            emp.id.toString().includes(query) ||
            emp.state.toLowerCase().includes(query);

        const matchesGender = genderFilter === 'All' || emp.gender === genderFilter;
        const matchesStatus = statusFilter === 'All' ||
            (statusFilter === 'Active' ? emp.isActive : !emp.isActive);

        return matchesGlobalSearch && matchesGender && matchesStatus;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filtered.length / itemsPerPage);

    const handleFilterChange = (setter, value) => {
        setter(value);
        setCurrentPage(1);
    };

    const stats = {
        total: employees.length,
        active: employees.filter(e => e.isActive).length,
        inactive: employees.filter(e => !e.isActive).length,
    };

    return (
        <div style={{ padding: '32px', maxWidth: '1300px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
                <StatCard label="Total Staff" value={stats.total} icon={<Users color="#2563eb" />} border="#2563eb" />
                <StatCard label="Active Now" value={stats.active} icon={<CheckCircle color="#10b981" />} border="#10b981" />
                <StatCard label="On Leave" value={stats.inactive} icon={<AlertCircle color="#f43f5e" />} border="#f43f5e" />
            </div>

            <div style={actionBarStyle}>
                <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1 1 300px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} size={18} />
                        <input
                            placeholder="Search Name, ID, or Region..."
                            style={searchInputStyle}
                            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                        />
                    </div>
                    {/* Added cursor: pointer in selectStyle below */}
                    <select style={selectStyle} onChange={(e) => handleFilterChange(setGenderFilter, e.target.value)}>
                        <option value="All">All Genders</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <select style={selectStyle} onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}>
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <button onClick={onAddClick} style={addBtnStyle}>
                    <Plus size={18} /> Add New Employee
                </button>
            </div>

            <div style={tableContainerStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={theadStyle}>
                        <tr>
                            <th style={thStyle}>Employee</th>
                            <th style={thStyle}>Gender</th>
                            <th style={thStyle}>Date of Birth</th>
                            <th style={thStyle}>Region</th>
                            <th style={thStyle}>Status</th>
                            <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(emp => (
                            <tr key={emp.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img src={emp.image || 'https://via.placeholder.com/40'} style={avatarStyle} alt="" />
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#1e293b' }}>{emp.name}</div>
                                            <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 'bold' }}>#{emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>{emp.gender}</td>
                                <td style={tdStyle}>{emp.dob}</td>
                                <td style={tdStyle}>{emp.state}</td>
                                <td style={tdStyle}>
                                    <span style={{
                                        ...statusBadgeStyle,
                                        backgroundColor: emp.isActive ? '#dcfce7' : '#fee2e2',
                                        color: emp.isActive ? '#166534' : '#991b1b'
                                    }}>
                                        {emp.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={actionIconsStyle}>
                                        <Edit
                                            size={18}
                                            onClick={() => onEditClick(emp)}
                                            onMouseEnter={() => setHoveredAction({ id: emp.id, type: 'edit' })}
                                            onMouseLeave={() => setHoveredAction(null)}
                                            style={{
                                                color: hoveredAction?.id === emp.id && hoveredAction?.type === 'edit' ? '#2563eb' : '#94a3b8',
                                                transform: hoveredAction?.id === emp.id && hoveredAction?.type === 'edit' ? 'scale(1.2)' : 'scale(1)',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                        <Trash2
                                            size={18}
                                            onClick={() => onDelete(emp.id)}
                                            onMouseEnter={() => setHoveredAction({ id: emp.id, type: 'delete' })}
                                            onMouseLeave={() => setHoveredAction(null)}
                                            style={{
                                                color: hoveredAction?.id === emp.id && hoveredAction?.type === 'delete' ? '#ef4444' : '#94a3b8',
                                                transform: hoveredAction?.id === emp.id && hoveredAction?.type === 'delete' ? 'scale(1.2)' : 'scale(1)',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                        <Printer
                                            size={18}
                                            onClick={() => window.print()}
                                            onMouseEnter={() => setHoveredAction({ id: emp.id, type: 'print' })}
                                            onMouseLeave={() => setHoveredAction(null)}
                                            style={{
                                                color: hoveredAction?.id === emp.id && hoveredAction?.type === 'print' ? '#1e293b' : '#94a3b8',
                                                transform: hoveredAction?.id === emp.id && hoveredAction?.type === 'print' ? 'scale(1.2)' : 'scale(1)',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={paginationWrapperStyle}>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filtered.length)} of {filtered.length} employees
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            style={{ ...pageBtnStyle, opacity: currentPage === 1 ? 0.5 : 1 }}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    ...pageBtnStyle,
                                    backgroundColor: currentPage === i + 1 ? '#2563eb' : 'white',
                                    color: currentPage === i + 1 ? 'white' : '#1e293b',
                                    borderColor: currentPage === i + 1 ? '#2563eb' : '#e2e8f0'
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            style={{ ...pageBtnStyle, opacity: currentPage === totalPages ? 0.5 : 1 }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Styles Updated ---
const actionBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', gap: '15px', flexWrap: 'wrap' };
const searchInputStyle = { padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '100%' };
const selectStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }; // Added cursor pointer
const addBtnStyle = { backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' };
const tableContainerStyle = { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' };
const theadStyle = { backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' };
const thStyle = { padding: '16px' };
const tdStyle = { padding: '16px', color: '#475569', fontSize: '14px' };
const avatarStyle = { width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' };
const statusBadgeStyle = { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' };
const actionIconsStyle = { display: 'flex', justifyContent: 'center', gap: '16px', cursor: 'pointer' };
const paginationWrapperStyle = { padding: '16px 24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' };
const pageBtnStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', backgroundColor: 'white', transition: 'all 0.2s' };

const StatCard = ({ label, value, icon, border }) => (
    <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', borderLeft: `6px solid ${border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
            <div style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{label}</div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b' }}>{value}</div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}>{icon}</div>
    </div>
);

export default Dashboard;