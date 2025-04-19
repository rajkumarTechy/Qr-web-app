import { useForm } from "react-hook-form";
import { useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/API_URL";

const Security = () => {
  const [tempCode, setTempCode] = useState("");
  const [btnloading, setBtnLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'all'
  });

  const handleReload = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setTempCode(newCode);
    setValue("tempCode", newCode, { shouldValidate: true }); 
  };

  const onSubmit = async (data: any) => {
    setBtnLoading(true);
  
    try {
      const res = await axios.post(`${API_BASE_URL}/users/security`, data);
  
      if (res.status === 201) {
        toast.success(res.data.message);
        toast.success('Temp code set successfully');
        reset();
        setTempCode('');

      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }finally{
        setBtnLoading(false);
    }
  };
  

  return (
    <>
    <div className="p-3" >
    <h1 className="font-semibold uppercase" >Device Security</h1>
    </div>
    <div className="h-[calc(100dvh-8rem)] bg-gray-50 px-4 mt-2">
          <h1 className="text-lg font-medium text-gray-800 text-center mb-6">
            <span className="font-semibold text-red-500">Note:</span> In case of a
            new mobile device or loss of the old one, this feature is used by the
            admin to reset the user's Phone ID.
          </h1>
  
          <form onSubmit={handleSubmit(onSubmit)} className="space-x-4.5 flex flex-row items-center justify-evenly">
            <div className="relative" >
              <label className="block text-left text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className={`mt-1 p-2 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none`}
                placeholder="Enter user email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 absolute">
                  {errors.email?.message?.toString()}
                </p>
              )}
            </div>
  
            <div>
              <label className="block text-left text-sm font-medium text-gray-700">
                Temp Code
              </label>
              <div className="flex  items-center space-x-2 relative">
                <input
                  type="text"
                  readOnly
                  {...register("tempCode", { required: "Temp Code is required" })}
                  value={tempCode}
                  className={`flex-1 mt-1 p-2 rounded-lg border ${
                    errors.tempCode ? "border-red-500" : "border-gray-300"
                  } shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none`}
                  placeholder="Click reload to generate"
                />
                <button
                  type="button"
                  onClick={handleReload}
                  className="mt-1 px-3 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                  <MdOutlineRefresh size={18} />
                </button>
              </div>
              {errors.tempCode && (
                <p className="text-red-500 text-sm mt-1 absolute">
                  {errors.tempCode?.message?.toString()}
                </p>
              )}
            </div>
  
            <div className="mt-5" >
            <button
              type="submit"
              disabled={btnloading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {btnloading ? 'Submitting....' : 'Submit'}
            </button>
            </div>
          </form>
        </div>
    </>
    
  );
};

export default Security;
