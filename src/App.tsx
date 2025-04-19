import { Route, Routes } from "react-router-dom";
import Qrpage from "./components/Qrpage";
import Record from "./components/Record";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AuthProvider, { useAuth } from "./components/Context/AuthContext";
import Unauthorized from "./components/Unauthorized";
import Sidebar from "./components/Sidebar";
import Security from "./components/Security";
import EmployeeTable from "./components/EmployeeTable";

// Wrapper for accessing Auth inside the provider
const AppContent = () => {
  const { isLoggedIn, isOpen } = useAuth();

  return (
    <>
      {isLoggedIn && <Sidebar />}
      <div className={isOpen ? "pl-64 transition-all" : isLoggedIn ? "pl-18" : ''}> 
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="qrcode" element={<Qrpage />} />
          <Route path="attendancerecord" element={<Record />} />
          <Route path="/" element={<Login />} />
          <Route path="security" element={<Security/>}/>
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="todayattendance" element={<EmployeeTable/>}/>
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
