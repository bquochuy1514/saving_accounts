import { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    fullName: [],
    email: [],
    password: [],
    confirmPassword: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear lỗi của field đang nhập
    if (errors[name]?.length) {
      setErrors((prev) => ({ ...prev, [name]: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors trước mỗi lần submit
    setErrors({
      fullName: [],
      email: [],
      password: [],
      confirmPassword: [],
    });

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Kiểu 2: message là string (vd: email đã tồn tại)
      if (typeof data.message === "string") {
        toast.error(data.message);
      }
      // Kiểu 1: message là object theo từng field
      else if (typeof data.message === "object") {
        setErrors((prev) => ({ ...prev, ...data.message }));
      }
      return;
    }

    toast.success("Đăng ký thành công!");
    console.log("Đăng ký thành công:", data);

    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center px-4 py-12 font-sans">
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 pt-10 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FaMoneyBillWave className="w-5 h-5 text-white" />
            </div>
            <span className="text-white/80 text-sm font-semibold tracking-widest uppercase">
              SổTiếtKiệm
            </span>
          </div>
          <h1 className="text-white text-3xl font-bold leading-tight">
            Tạo tài khoản
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Đăng ký để bắt đầu quản lý tiết kiệm của bạn
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
          {/* Họ tên */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-slate-700"
            >
              Họ và tên
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <FaUser className="w-4 h-4" />
              </span>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${errors.fullName?.length ? "border-red-400" : "border-slate-200"}`}
              />
            </div>
            <p className="text-xs text-red-500 mt-1">{errors?.fullName[0]}</p>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-700"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <FaEnvelope className="w-4 h-4" />
              </span>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${errors.email?.length ? "border-red-400" : "border-slate-200"}`}
              />
            </div>
            <p className="text-xs text-red-500 mt-1">{errors?.email[0]}</p>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-700"
            >
              Mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <FaLock className="w-4 h-4" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${errors.password?.length ? "border-red-400" : "border-slate-200"}`}
              />
            </div>
            <p className="text-xs text-red-500 mt-1">{errors?.password[0]}</p>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-semibold text-slate-700"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <FaShieldAlt className="w-4 h-4" />
              </span>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition ${errors.confirmPassword?.length ? "border-red-400" : "border-slate-200"}`}
              />
            </div>
            <p className="text-xs text-red-500 mt-1">
              {errors?.confirmPassword[0]}
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 active:scale-[0.98]"
          >
            Tạo tài khoản
          </button>

          {/* Login redirect */}
          <p className="text-center text-sm text-slate-500 pt-1">
            Đã có tài khoản?{" "}
            <a
              href="/login"
              className="text-emerald-600 font-semibold hover:underline"
            >
              Đăng nhập
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
