import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserDetails } from "../../feature/leafSlice";
import { toast } from "react-toastify";

const fields = [
  { name: "name", label: "Full name" },
  { name: "email", label: "Email address", type: "email" },
  { name: "phone", label: "Phone number", type: "tel" },
  { name: "alternatePhone", label: "Alternate phone", type: "tel" },
];

export const AccountSetting = () => {
  const [editMode, setEditMode] = useState(false);
  const user = useSelector((state) => state.leaf.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        alternatePhone: user?.alternatePhone || "",
      });
    }
  }, [user]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleEdit = () => {
    setEditMode((prev) => !prev);
  };

  const handleSave = () => {
    dispatch(UpdateUserDetails({ id: user?.id, data: formData }))
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully.");
        setEditMode(false);
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to update profile.");
      });
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="mx-auto max-w-xl space-y-5">
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              {field.label}
            </span>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              disabled={!editMode}
              className="w-full rounded-xl border border-green-100 bg-[#f7fbf4] px-4 py-3 text-gray-900 outline-none transition focus:border-green-700 disabled:cursor-not-allowed disabled:opacity-80"
            />
          </label>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-full border border-green-200 px-5 py-2.5 text-sm font-semibold text-green-800 transition hover:border-green-700"
          >
            {editMode ? "Cancel" : "Edit profile"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={handleSave}
              className="rounded-full bg-green-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-950"
            >
              Save changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
