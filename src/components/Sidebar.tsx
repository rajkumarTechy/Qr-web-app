import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { GoHomeFill } from "react-icons/go";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { RiBookShelfLine } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { useAuth } from "./Context/AuthContext";
import { MdOutlinePhonelinkLock } from "react-icons/md";
import { IoTodaySharp } from "react-icons/io5";

const Sidebar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, isOpen, setIsOpen, setName } = useAuth();

  const handleLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setName('')
    }
    navigate("/login");
  };

  return (
    <div
      className={`${
        isOpen ? "w-64" : "w-18"
      } transition-all duration-150 h-screen bg-white text-gray-800 fixed top-0 left-0 flex flex-col p-4 shadow-md z-10`}
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-3 mb-6">
        <img
          onClick={() => setIsOpen(!isOpen)}
          src={Logo}
          alt="Logo"
          className="w-8 h-8 rounded cursor-pointer"
        />
        {isOpen ? <h1 className="text-xl font-bold">AttendanceApp</h1> : ""}
      </div>

      {/* Nav Links */}
      <div className="flex flex-col flex-grow">
        <NavLink
          to="dashboard"
          className={({ isActive }) =>
            `px-2 py-2 mb-2 rounded hover:bg-gray-100 flex items-center gap-x-3.5 text-[#5D7285] ${
              isActive ? "bg-[#E9F5FE] font-semibold text-blue-500" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex justify-center">
              <GoHomeFill color={isActive ? "#0C7FDA" : "#5D7285"} size={22} />
              </div>
              
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                }`}
              >
                Dashboard
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/qrcode"
          className={({ isActive }) =>
            `px-2 py-2 mb-2 rounded hover:bg-gray-100 flex items-center gap-x-3.5 text-[#5D7285] ${
              isActive ? "bg-[#E9F5FE] font-semibold text-blue-500" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
            <div className="flex justify-center">
            <MdOutlineQrCodeScanner
                color={isActive ? "#0C7FDA" : "#5D7285"}
                size={22}
              />
            </div>
              
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                }`}
              >
                QR Code
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/attendancerecord"
          className={({ isActive }) =>
            `px-2 py-2 mb-2 rounded hover:bg-gray-100 flex items-center gap-x-3.5 text-[#5D7285] ${
              isActive ? "bg-[#E9F5FE] font-semibold text-blue-500" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
            <div className="flex justify-center">
            <RiBookShelfLine
                color={isActive ? "#0C7FDA" : "#5D7285"}
                size={22}
              />
            </div>
              
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                }`}
              >
                Attendance Record
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="todayattendance"
          className={({ isActive }) =>
            `px-2 py-2 mb-2 rounded hover:bg-gray-100 flex items-center gap-x-3.5 text-[#5D7285] ${
              isActive ? "bg-[#E9F5FE] font-semibold text-blue-500" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex justify-center">
              <IoTodaySharp color={isActive ? "#0C7FDA" : "#5D7285"} size={22} />
              </div>
              
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                }`}
              >
                Today's Attendance
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="security"
          className={({ isActive }) =>
            `px-2 py-2 mb-2 rounded hover:bg-gray-100 flex items-center gap-x-3.5 text-[#5D7285] ${
              isActive ? "bg-[#E9F5FE] font-semibold text-blue-500" : ""
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex justify-center">
              <MdOutlinePhonelinkLock color={isActive ? "#0C7FDA" : "#5D7285"} size={22} />
              </div>
              
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                }`}
              >
                Device Security
              </span>
            </>
          )}
        </NavLink>



        {/* Spacer to push logout down */}
        <div className="flex-grow" />
      </div>

      {/* Logout Button */}
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className={`px-2.5 py-2 mt-auto rounded cursor-pointer flex items-center gap-x-3.5 text-white bg-[#667A8A] hover:bg-[#5a6e7d]`}
        >
          <div className="flex justify-center">
          <IoLogOut size={22} />
          </div>
          
          <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 ml-0"
                }`}
              >
                Logout
              </span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
