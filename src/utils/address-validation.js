export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export function validateAddressFields(values) {
  const errors = {};

  if (!(values.address1 || "").trim()) {
    errors.address1 = "Address line 1 is required.";
  }
  if (!(values.city || "").trim()) {
    errors.city = "Town / city is required.";
  }
  if (!(values.district || "").trim()) {
    errors.district = "District is required.";
  }
  const pin = String(values.pin_code || "").trim();
  if (!/^\d{6}$/.test(pin)) {
    errors.pin_code = "Enter a valid 6-digit pin code.";
  }
  if (!(values.state || "").trim()) {
    errors.state = "Select your state.";
  }

  return errors;
}
