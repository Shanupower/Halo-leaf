import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useRef, useState } from "react";
import { INDIAN_STATES, validateAddressFields } from "../../utils/address-validation";

const EMPTY_ADDRESS = {
  address1: "",
  address2: "",
  city: "",
  state: "",
  district: "",
  pin_code: "",
};

const DEFAULT_INITIAL = {};

export function AddressForm({
  initialValues = DEFAULT_INITIAL,
  onSubmit,
  loading = false,
  submitLabel = "Save",
  title = "Create Your Delivery Address",
  className = "",
}) {
  const [userAddress, setUserAddress] = useState({
    ...EMPTY_ADDRESS,
    ...initialValues,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const initialKeyRef = useRef(initialValues?.documentId || initialValues?.id || "");

  useEffect(() => {
    const nextKey = initialValues?.documentId || initialValues?.id || "";
    if (nextKey !== initialKeyRef.current) {
      initialKeyRef.current = nextKey;
      setUserAddress({ ...EMPTY_ADDRESS, ...initialValues });
      setFieldErrors({});
      setSubmitted(false);
    }
  }, [initialValues]);

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setUserAddress((prev) => ({ ...prev, [name]: value }));
    if (submitted) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setUserAddress((prev) => ({ ...prev, state: value }));
    if (submitted) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next.state;
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const errors = validateAddressFields(userAddress);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    onSubmit?.(userAddress);
  };

  return (
    <FormCard className={className}>
      <form onSubmit={handleSubmit} noValidate>
        <p className="mb-6 text-center text-2xl text-black-400">{title}</p>

        <div className="flex flex-col gap-3">
          <TextField
            label="Address line 1"
            variant="filled"
            className="w-full rounded bg-white"
            name="address1"
            value={userAddress.address1}
            onChange={handleOnchange}
            error={Boolean(fieldErrors.address1)}
            helperText={fieldErrors.address1 || " "}
          />

          <TextField
            label="Address line 2 (optional)"
            variant="filled"
            className="w-full rounded bg-white"
            name="address2"
            value={userAddress.address2}
            onChange={handleOnchange}
          />

          <TextField
            label="Town / City"
            variant="filled"
            className="w-full rounded bg-white"
            name="city"
            value={userAddress.city}
            onChange={handleOnchange}
            error={Boolean(fieldErrors.city)}
            helperText={fieldErrors.city || " "}
          />

          <TextField
            label="District"
            className="w-full rounded bg-white"
            name="district"
            value={userAddress.district}
            onChange={handleOnchange}
            error={Boolean(fieldErrors.district)}
            helperText={fieldErrors.district || " "}
          />

          <TextField
            label="Pin Code"
            variant="filled"
            className="w-full rounded border border-gray-500 bg-white"
            name="pin_code"
            inputProps={{ inputMode: "numeric", maxLength: 6 }}
            value={userAddress.pin_code}
            onChange={handleOnchange}
            error={Boolean(fieldErrors.pin_code)}
            helperText={fieldErrors.pin_code || "6-digit Indian pin code"}
          />

          <TextField
            select
            label="State"
            variant="filled"
            className="w-full rounded bg-white"
            name="state"
            value={userAddress.state}
            onChange={handleStateChange}
            error={Boolean(fieldErrors.state)}
            helperText={fieldErrors.state || " "}
            SelectProps={{
              MenuProps: { disablePortal: true },
            }}
          >
            <MenuItem value="">
              <em>Select state</em>
            </MenuItem>
            {INDIAN_STATES.map((stateName) => (
              <MenuItem key={stateName} value={stateName}>
                {stateName}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-xl bg-green-700 px-4 py-3 text-white hover:bg-gray-950 disabled:opacity-50"
          >
            {loading ? "Processing..." : submitLabel}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

function FormCard({ children, className = "" }) {
  return (
    <div
      className={`form_section w-full rounded-xl px-4 py-6 shadow-2xl ${className}`.trim()}
    >
      {children}
    </div>
  );
}
