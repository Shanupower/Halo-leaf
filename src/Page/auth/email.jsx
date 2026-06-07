import { useEffect, useState } from "react";
import "./style.css";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../helper/helper";
import { toast } from "react-toastify";
import Cookies from "js-cookie"; // Import js-cookie
import axios from "axios";

export const EmailComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const { access_leaf } = fetchUserData();
    if (access_leaf) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpBase = import.meta.env.VITE_OTP_SERVICE_URL;
    if (!otpBase) {
      toast.error(
        "OTP is not configured. Set VITE_OTP_SERVICE_URL or use Medusa customer login."
      );
      return;
    }
    try {
      const res = await axios.post(`${otpBase.replace(/\/$/, "")}/send-otp`, {
        email: email,
      });

      if (res.status === 200) {
        const otpValue = res.data.otp;
        Cookies.set("otp", otpValue, { expires: 1 / 288 });
        navigate("/otp");

        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      toast.error("Error sending OTP.");
    }
  };
  return (
    <div className=" flex flex-col items-center py-6">
      <div className=" rounded-xl shadow-2xl sm:w-[440px] w-[320px]">
        <div className=" px-4 py-6 w-full mt-6 form_section">
          <h2 className="text-2xl text-center text-black font-semibold">
            Enter Your Email
          </h2>

          <form onSubmit={handleSubmit} className="mt-5">
            <TextField
              label="Email "
              variant="filled"
              className="w-full border   border-white p-2 rounded-md outline-[var(--color-primary)]"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <p className="mt-6">
              We’ll send a verification code to this email if it matches an
              existing Helo-leaf account.
            </p>

            <button
              type="submit"
              className={`bg-[var(--color-primary)] w-full cursor-pointer mt-6 py-2 rounded-xl text-white `}
            >
              {"Submit"}
            </button>
          </form>
          <p className=" mt-5 text-blue-500">
            Go back <Link to="/sign-in">login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
