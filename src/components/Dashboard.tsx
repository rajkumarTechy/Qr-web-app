import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiUsers,
  FiFilter,
} from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "../utils/API_URL";

interface Recordprops {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    employeeId: string;
  };
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
}

const Dashboard = () => {
  const today = new Date();
  const todayStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const [filters, setFilters] = useState({
    day: "",
    month: `${today.getMonth() + 1}`,
    year: `${today.getFullYear()}`,
  });

  const [attendanceData, setAttendanceData] = useState<Recordprops[]>([]);
  const [usersLenth, setUsersLenth] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = attendanceData.filter((record) => {
    const [day, month, year] = record.date.split("/").map(Number);
    const selectedDay = Number(filters.day);
    const selectedMonth = Number(filters.month);
    const selectedYear = Number(filters.year);

    return (
      (!filters.day || selectedDay === day) &&
      (!filters.month || selectedMonth === month) &&
      (!filters.year || selectedYear === year)
    );
  });

  // const getStudents = () => {
  //   return [...new Set(filteredData.map((r) => r.userId.fullName))];
  // };

  const getMonthlyStatusCounts = () => {
    const presentCount = filteredData.filter((r) => r.status === "Present").length;
    const leaveCount = filteredData.filter((r) => r.status === "Leave").length;
    const checkedInCount = filteredData.filter((r) => r.status === "CheckedIn").length;
  
    return { presentCount, leaveCount, checkedInCount };
  };
  

  const [chartData, setChartData] = useState<any>({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 430,
      },
      colors: ["#10B981", "#F87171", "#60A5FA"],
      plotOptions: {
        bar: {
          distributed: true, // Each bar has its own color
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "14px",
          colors: ["#333"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: "14px",
          },
        },
      },
    },
  });
  

  const getAttendance = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/attendance`);
      setAttendanceData(res.data);
    } catch (err: any) {
      console.log(err);
    }
  };

  const todayPresent = attendanceData.filter(
    (a) => a.date === todayStr && (a.status === "CheckedIn" || "Present")
  );

  const todayLeave = attendanceData.filter(
    (a) => a.date === todayStr && a.status === "Leave"
  );

  useEffect(() => {
    getAttendance();
    getUsersList();
  }, []);

  useEffect(() => {
    const { presentCount, leaveCount, checkedInCount } = getMonthlyStatusCounts();
  
    setChartData({
      series: [
        {
          name: "Attendance",
          data: [presentCount, leaveCount, checkedInCount],
        },
      ],
      options: {
        ...chartData.options,
        xaxis: {
          categories: ["Present", "Leave", "CheckedIn"],
        },
      },
    });
  }, [attendanceData, filters]);
  

  const getUsersList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsersLenth(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 md:px-8  bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-semibold text-[#5D7285] ubuntu-regular">Dashboard</h1>

        {/* Filters Section */}
        <div className="flex gap-4 bg-white p-4 rounded-xl shadow-md border border-gray-200 w-full md:w-auto">
          <div className="flex items-center text-lg font-semibold text-gray-700">
            <FiFilter className="mr-2 text-indigo-600" /> 
          </div>

          {/* Month Filter */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="month"
              value={filters.month}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white text-gray-700"
            >
              <option value="">Month</option>
              {[
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December",
              ].map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Today's Present Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <FiCheckCircle className="text-3xl text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-600">Today's Present</h2>
            <p className="text-4xl font-bold text-green-600 mt-1">
              {todayPresent.length}
            </p>
          </div>
        </div>

        {/* Today's Leave Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full">
            <FiXCircle className="text-3xl text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-600">Today's Leave</h2>
            <p className="text-4xl font-bold text-red-500 mt-1">
              {todayLeave.length}
            </p>
          </div>
        </div>

        {/* Total Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <FiUsers className="text-3xl text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-600">Total Users</h2>
            <p className="text-4xl font-bold text-blue-600 mt-1">
              {usersLenth}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
          📊 MonthWise Review
        </h2>
        <div style={{ height: 400 }}>
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
