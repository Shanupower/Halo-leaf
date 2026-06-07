import { useEffect, useState } from "react";
import "./style.css";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { createUserData } from "../../feature/leafSlice";
import { fetchUserData } from "../../helper/helper";
import { PATHS } from "../../routes/paths";
export const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    age: "",
  });

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.leaf.user);
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  useEffect(() => {
    const { access_leaf } = fetchUserData();
    if (access_leaf) {
      navigate(PATHS.home);
    }
  }, []);
  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (String(user.phone).length !== 10) {
      toast.warn(" Please enter a valid 10-digit phone number");
      return;
    }

    dispatch(createUserData(user))
      .unwrap()
      .then(() => {
        toast.success("Signup successful!", { toastId: "auth-success" });
        navigate(PATHS.home);
      })
      .catch((err) => {
        const msg =
          typeof err === "string" ? err : err?.message || "Signup failed!";
        toast.error(msg);
      });
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-4 py-8 pb-12">
      <div className="w-full max-w-[440px] bg-primaryw sm:w-[440px]">
        <div className="form_section w-full rounded-xl px-4 py-6 shadow-2xl">
          <>
            <h2 className="text-2xl text-center text-black  font-semibold">
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 ">
              <TextField
                type="text"
                label="Name "
                variant="filled"
                className="w-full border  border-white p-2 rounded-md outline-[var(--color-primary)]"
                name="name"
                required
                value={user?.name}
                onChange={handleChange}
                style={{ backgroundColor: "white" }}
              />

              <TextField
                label="Phone "
                type="number"
                variant="filled"
                className="w-full border  border-white p-2 rounded-md outline-[var(--color-primary)]"
                name="phone"
                required
                value={user?.phone}
                onChange={handleChange}
              />
              <TextField
                label="Email "
                type="email"
                variant="filled"
                className="w-full border   border-white p-2 rounded-md outline-[var(--color-primary)]"
                name="email"
                required
                value={user?.email}
                onChange={handleChange}
              />

              <div className="w-full flex justify-between items-center  rounded-md outline-[var(--color-secondry)]">
                <TextField
                  label="Password "
                  variant="filled"
                  className="w-full border  mt-1 border-white"
                  name="password"
                  required
                  value={user?.password}
                  onChange={handleChange}
                  type={passwordShown ? "text" : "password"}
                />
                {passwordShown ? (
                  <RemoveRedEyeIcon onClick={() => setPasswordShown(false)} />
                ) : (
                  <VisibilityOffIcon onClick={() => setPasswordShown(true)} />
                )}
              </div>

              <TextField
                label="Age"
                type="number"
                variant="filled"
                className="w-full border  mt-1 border-white p-2 rounded-md outline-[var(--color-primary)]"
                name="age"
                required
                value={user?.age}
                onChange={handleChange}
              />
              <button
                type="submit"
                className={`mt-8 w-full scroll-mb-8 cursor-pointer rounded-xl bg-green-700 py-3 text-white transition hover:bg-gray-950 ${
                  loading ? "cursor-not-allowed opacity-50" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Loading.." : "Sign Up"}
              </button>
            </form>
            <p className="text-white mt-5">
              Already have an account? <Link to="/sign-in">Sign in</Link>
            </p>
          </>
        </div>
      </div>
    </div>
  );
};
