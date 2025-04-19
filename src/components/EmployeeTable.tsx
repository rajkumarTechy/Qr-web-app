import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../utils/API_URL";

const EmployeeTable = () => {
  const [employees, setEmployeeData] = useState<any[]>([]);
  const [filteredData, setFiltered] = useState<any[]>([]);

  const getAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/attendance/today`);
      setEmployeeData(res.data);
      console.log(res.data);
    } catch (err: any) {
      console.log(err);
    }
  };

  const ProcessUserData = () => {
    const employee_data = new Set();

  }

  useEffect(() => {
    getAttendance();
  }, []);

  return (
    <div>
      <h1 className="p-2 font-semibold uppercase">Today's Attendance</h1>
      <div className="overflow-x-auto relative m-12 sm:rounded-lg border border-gray-400">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-800 uppercase bg-blue-500">
            <tr>
              <th scope="col" className="py-3 px-6">
                Name
              </th>
              <th scope="col" className="py-3 px-6">
                Employee ID
              </th>
              <th scope="col" className="py-3 px-6">
                Check-in Time
              </th>
              <th scope="col" className="py-3 px-6">
                Check-out Time
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td className="p-2.5 text-center" colSpan={5}>
                  No data found
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr
                  key={index}
                  className={`bg-white ${
                    index === employees.length - 1
                      ? ""
                      : "border-b  border-gray-400"
                  } hover:bg-gray-50 `}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {employee.fullName}
                  </th>
                  <td className="py-4 px-6">{employee.employeeId}</td>
                  <td className="py-4 px-6">{employee.checkInTime || 'Not updated'}</td>
                  <td className="py-4 px-6">
                    {employee.checkOutTime || "Not updated"}
                  </td>
                  <td
                    className={`py-4 px-6 font-medium ${
                      employee.status === "Present"
                        ? "text-green-500"
                        : employee.status === "CheckedIn"
                        ? "text-yellow-600"
                        : "text-red-500"
                    } `}
                  >
                    {employee.status || "Not updated"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
