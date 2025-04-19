import { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import { API_BASE_URL } from "../utils/API_URL";

const Qrpage = () => {
  const [randomString, setRandomString] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomString = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/random-string`);
        setRandomString(response?.data?.randomString);
        setLoading(false);
        if (response?.data?.generated) {
          console.log("New string generated!");
        }
      } catch (error) {
        console.error("Error fetching random string:", error);
        setLoading(false);
      }
    };

    fetchRandomString();
    const pollingInterval = 240 * 1000;
    const intervalId = setInterval(fetchRandomString, pollingInterval);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <div className="p-3">
        <h1 className="font-semibold uppercase">QR Code</h1>
      </div>
      <div className="flex flex-col justify-center items-center h-[calc(100dvh-7rem)] space-y-4">
        {loading ? (
          <p className="text-xl font-medium text-gray-500">
            Loading QR Code...
          </p>
        ) : randomString ? (
          <>
            <h1 className="text-2xl font-bold mb-4">
              Scan the QR Code to register your today attendance
            </h1>
            <QRCodeCanvas value={randomString} size={200} />
            <p className="text-lg font-semibold">
              {currentTime.toLocaleString()}
            </p>
          </>
        ) : (
          <h1 className="text-red-600 text-2xl font-semibold">
            There was na error generating QR Code
          </h1>
        )}
      </div>
    </>
  );
};

export default Qrpage;
