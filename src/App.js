import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GlobalProvider, GlobalContext } from './context/GlobalContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeModal from './components/EmployeeModal';

// Auth Guard Component
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(GlobalContext);
  return user ? children : <Navigate replace to="/" />;
};

const MainContent = () => {
  const { employees, setEmployees, logout } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAddOrEdit = (data) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === data.id ? data : emp));
    } else {
      setEmployees([...employees, { ...data, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const deleteEmployee = (id) => {
    if (window.confirm("Confirm delete for Employee #" + id + "?")) {
      setEmployees(employees.filter(emp => emp.id !== id));

      // Snackbar logic
      setMessage("Employee deleted successfully!");
      setTimeout(() => setMessage(null), 3000); // Hide after 3 seconds
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {message && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', backgroundColor: '#334155',
          color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 2000,
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)', animation: 'slideIn 0.3s ease'
        }}>
          {message}
        </div>
      )}
      {/* Enhanced Navigation */}
      <nav style={{
        backgroundColor: 'white', padding: '16px 32px', borderBottom: '1px solid #e2e8f0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: '#2563eb', borderRadius: '8px' }}></div>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 }}>HRMS Portal</h1>
        </div>
        <button
          onMouseEnter={() => setIsLogoutHovered(true)}
          onMouseLeave={() => setIsLogoutHovered(false)}
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: isLogoutHovered ? '#b91c1c' : '#ef4444', // Darker red on hover
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '15px',
            transition: 'color 0.2s ease',
            textDecoration: isLogoutHovered ? 'underline' : 'none'
          }}
        >
          Logout
        </button>
      </nav>

      <Routes>
        <Route path="/dashboard" element={
          <Dashboard
            onAddClick={() => { setEditingEmployee(null); setIsModalOpen(true); }}
            onEditClick={(emp) => { setEditingEmployee(emp); setIsModalOpen(true); }}
            onDelete={deleteEmployee}
          />
        } />
      </Routes>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddOrEdit}
        initialData={editingEmployee}
      />
    </div>
  );
};

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainContent />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;