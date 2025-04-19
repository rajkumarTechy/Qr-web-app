import { CiCalendarDate } from "react-icons/ci";
import { LiaIdCard } from "react-icons/lia";
import { CiLogin } from "react-icons/ci";
import { CiLogout } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/API_URL";
import Spinner from "./Spinner";
import nodata from "../assets/nodata.png";
import { toast } from "react-toastify";

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

const Record = () => {
  const [recordData, setRecordData] = useState<Recordprops[]>([]);
  const [loading, setLoading] = useState(true);
  const [Filteration, setFilteration] = useState<Recordprops[]>([]);
  const [searchName, setSearchName] = useState("");

  const [Dates, setDate] = useState({
    startDate: "",
    endDate: "",
  });

  const [statusFill, setStatusFill] = useState("");

  const getAllAttendance = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/attendance`);
      setRecordData(res.data);
      setFilteration(res.data);
      console.log(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } 
  };

  const parseDDMMYYYY = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleFilters = () => {
    if (!searchName && !Dates.startDate && !Dates.endDate && !statusFill) {
      toast.warn("Please fill any of the fields");
      return;
    }

    if (new Date(Dates.startDate) > new Date(Dates.endDate)) {
      toast.warn('End date should be greater than or equal to Start date');
      return;
    }

    let filtered = recordData;

    if (Dates.startDate && Dates.endDate) {
      const start = new Date(Dates.startDate);
      const end = new Date(Dates.endDate);

      filtered = filtered.filter((record) => {
        const recordDate = parseDDMMYYYY(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }

    if (statusFill && statusFill !== "all") {
      filtered = filtered.filter(
        (record) => record.status.toLowerCase() === statusFill.toLowerCase()
      );
    }

    if (searchName.trim() !== "") {
      filtered = filtered.filter((record) =>
        record.userId.fullName
          .trim()
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    setFilteration(filtered);
  };

  const handleReset = () => {
    setFilteration(recordData);
    setDate({
      startDate: "",
      endDate: "",
    });
    setSearchName("");
    setStatusFill("");
  };

  useEffect(() => {
    getAllAttendance();
  }, []);

  return (
    <>
    <div className="p-3" >
    <h1 className="font-semibold uppercase" >Attendance Record</h1>
    </div>
      <div className="h-auto">
        <div
          className="flex justify-between  mt-5
         flex-wrap items-end gap-4 p-4 max-w-full"
        >
          {/* From Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">From</label>
            <input
              value={Dates.startDate}
              onChange={(e) => setDate({ ...Dates, startDate: e.target.value })}
              type="date"
              className="border border-gray-300 rounded px-4 py-2.5 min-w-[150px]"
            />
          </div>

          {/* To Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">To</label>
            <input
              value={Dates.endDate}
              onChange={(e) => setDate({ ...Dates, endDate: e.target.value })}
              type="date"
              className="border border-gray-300 rounded px-4 py-2.5 min-w-[150px]"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Status</label>
            <select
              value={statusFill}
              onChange={(e) => setStatusFill(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2.5 min-w-[150px]"
            >
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="checkedin">Checked In</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
              placeholder="Enter fullname"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2.5 min-w-[150px] outline-0 focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            onClick={handleFilters}
            className="rounded px-8 py-2.5 bg-gray-500 text-white hover:bg-blue-600 cursor-pointer transition-all duration-200"
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="rounded px-8 py-2.5 bg-red-500 text-white hover:bg-red-600 cursor-pointer transition-all duration-200"
          >
            Clear
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-3  flex justify-center">
              <Spinner />
            </div>
          ) : Filteration.length === 0 ? (
            <div className="col-span-3 flex justify-center">
              <img width={500} height={500} src={nodata} />
            </div>
          ) : (
            Filteration.map((record, index) => (
              <div
                key={index}
                className={`rounded-xl bg-white relative shadow-lg border-l-4 ${
                  record.status === "Present"
                    ? "border-green-600"
                    : record.status === "Leave"
                    ? "border-red-600"
                    : "border-yellow-600"
                } p-6 max-w-sm w-full mx-auto my-4 flex flex-col gap-4`}
              >
                {/* Person Info */}
                <div className="text-center border-b border-dashed border-gray-300 pb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {record.userId.fullName}
                  </h3>
                  <div className="flex justify-center items-center gap-1 text-sm text-gray-500">
                    <LiaIdCard />
                    <span>{record.userId.employeeId}</span>
                  </div>
                </div>

                {/* Timing Info */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 text-center">
                    <CiLogin />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check In:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {record.checkInTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 text-center">
                    <CiLogout />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <span className="text-sm text-gray-600">Check Out:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {record.checkOutTime || "Not checkedout"}
                    </span>
                  </div>
                </div>

                {/* Date Info */}
                <div className="flex items-center gap-3 border-t border-dashed border-gray-300 pt-4">
                  <div className="flex-shrink-0 w-6 text-center">
                    <CiCalendarDate />
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {record.date}
                    </span>
                  </div>
                </div>
                <div className="absolute flex flex-row items-center gap-1.5 right-8">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      record.status === "Present"
                        ? "bg-green-600"
                        : record.status === "Leave"
                        ? "bg-red-600"
                        : "bg-yellow-600"
                    }`}
                  ></div>
                  <h2
                    className={`text-sm ${
                      record.status === "Present"
                        ? "text-green-600"
                        : record.status === "Leave"
                        ? "text-red-600"
                        : "text-yellow-600"
                    } font-semibold`}
                  >
                    {record.status}
                  </h2>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Record;
