import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { API_BASE_URL } from "../utils/API_URL";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Context/AuthContext";
import { toast } from "react-toastify";
import Logo from '../assets/Logo.png'
import Btnspinner from "./Btnspinner";

interface FormValues {
  email: string;
  password: string;
  confirmpassword?: string;
}

const Login = () => {
  const [firstPassword, setFirstPassword] = useState(false);
  const [showPass, setShowPass] = useState({ pass: false, cpass: false });
  const [loading, setLoading] = useState(false);

  const  { setIsLoggedIn, setName } = useAuth();
 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    if (firstPassword) {
      if (data.password !== data.confirmpassword) {
        alert("Password doesn't match");
        return;
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/users/admin`, {
          email: data.email,
          password: data.password,
        });
        if (res.status === 201) {
          toast.success(res.data.message);
          setFirstPassword(false);
          navigate('/');
          
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err.response?.data?.message);
      }
    } else {
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE_URL}/users/admin/login`, {
          email: data.email,
          password: data.password,
        }, {withCredentials: true});
        if (res.status === 201) {
          toast.success(res.data.message);
          navigate('dashboard');
          setIsLoggedIn(true);
          setName(res.data.name);
        }
      } catch (err: any) {
        console.log(err);
        toast.error(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

  };

  return (
    <section style={{backgroundImage: "url('https://4kprojects.com/wp-content/uploads/2021/09/4K-Projects_Workplace_N-scaled.jpg')", backgroundRepeat: 'no-repeat' }} className="min-h-screen bg-center bg-cover">
      <div className="absolute inset-0 bg-black/60 z-0" />
      
      <div className="relative flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a className="flex items-center mb-6 text-2xl font-semibold text-white uppercase">
          <img
            className="w-8 h-8 mr-2"
            src={Logo}
            alt="logo"
          />
          Attendance App
        </a>
        <div className="w-full bg-white rounded-lg shadow  sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              {firstPassword
                ? "Set your first password"
                : "Sign in to your account"}
            </h1>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your email
                </label>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                  type="email"
                  id="email"
                  className={`bg-gray-50 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } text-gray-900 rounded-lg outline-blue-600 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1 absolute">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPass.pass ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } text-gray-900 rounded-lg outline-blue-600 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                />
                <div
                  className="absolute right-3 bottom-3 cursor-pointer"
                  onClick={() =>
                    setShowPass((prev) => ({ ...prev, pass: !prev.pass }))
                  }
                >
                  {showPass.pass ? (
                    <FaRegEye size={20} className="text-gray-400" />
                  ) : (
                    <FaRegEyeSlash size={20} className="text-gray-400" />
                  )}
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1 absolute">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              {firstPassword && (
                <div className="relative">
                  <label
                    htmlFor="confirmpassword"
                    className="block mb-2 text-sm font-medium text-gray-900 "
                  >
                    Confirm Password
                  </label>
                  <input
                    {...register("confirmpassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match",
                    })}
                    type={showPass.cpass ? "text" : "password"}
                    id="confirmpassword"
                    placeholder="••••••••"
                    className={`bg-gray-50 border ${
                      errors.confirmpassword
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-gray-900 rounded-lg outline-blue-600 focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5`}
                  />
                  <div
                    className="absolute right-3 bottom-3 cursor-pointer"
                    onClick={() =>
                      setShowPass((prev) => ({
                        ...prev,
                        cpass: !prev.cpass,
                      }))
                    }
                  >
                    {showPass.cpass ? (
                      <FaRegEye size={20} className="text-gray-400" />
                    ) : (
                      <FaRegEyeSlash size={20} className="text-gray-400" />
                    )}
                  </div>
                  {errors.confirmpassword && (
                    <p className="text-sm text-red-500 mt-1 absolute">
                      {errors.confirmpassword.message}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setFirstPassword(true)}
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Set password
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-x-2.5 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {loading ? (<Btnspinner/>) : '' }
                {firstPassword ? "Set Password" : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
