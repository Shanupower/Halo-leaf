import { useEffect, useState } from "react";
import "./style.css";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../feature/leafSlice";
import { toast } from "react-toastify";
import { fetchUserData } from "../../helper/helper";
import { PATHS } from "../../routes/paths";

export const SignIn = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { loading } = useSelector((state) => state?.leaf?.user);

  useEffect(() => {
    const { access_leaf } = fetchUserData();
    if (access_leaf) {
      navigate(PATHS.home);
    }
  }, []);
  const dispatch = useDispatch();
  const OnhandleChange = ({ target }) => {
    const { name, value } = target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(loginData))
      .unwrap()
      .then((res) => {
        toast.success("SignIn successful!", { toastId: "auth-success" });
        navigate(PATHS.home);
      })
      .catch((error) => {
        const msg =
          typeof error === "string"
            ? error
            : error?.message || "Sign in failed";
        toast.error(msg);
      });
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-8 pb-12">
      <div className="w-full max-w-[440px] rounded-xl shadow-2xl">
        <div className="form_section mt-6 w-full px-4 py-6">
          <h2 className="text-center text-2xl font-semibold text-black">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="mt-5">
            <TextField
              label="Email"
              variant="filled"
              className="w-full rounded-md border border-white p-2 outline-[var(--color-primary)]"
              name="email"
              required
              value={loginData?.email}
              onChange={OnhandleChange}
            />
            <TextField
              label="Password"
              variant="filled"
              className="mt-1 w-full border border-white"
              name="password"
              required
              value={loginData?.password}
              onChange={OnhandleChange}
            />
            <div className="ml-2 mt-4 text-sm font-semibold text-blue-500">
              <Link to="/email">Forgot Password</Link>
            </div>

            <button
              type="submit"
              className={`mt-6 w-full scroll-mb-8 cursor-pointer rounded-xl bg-green-700 py-3 text-white transition hover:bg-gray-950 ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>
          <p className="mt-5 text-black">
            Don't have an account? <Link to={PATHS.signup}>Sign-up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
