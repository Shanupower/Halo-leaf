import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.name) errs.name = "Name is required";
    if (!formData.email || !emailRegex.test(formData.email))
      errs.email = "Valid email is required";
    if (!formData.phone || !phoneRegex.test(formData.phone))
      errs.phone = "Valid 10-digit phone is required";
    if (!formData.location) errs.location = "Location is required";
    if (!formData.subject) errs.subject = "Subject is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Send form data to backend here
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        subject: "",
        message: "",
      });
    }
  };

  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4 leading-tight">
  Connect with Us -{" "}
  <a
    href="https://api.whatsapp.com/send/?phone=918285684222&text&type=phone_number&app_absent=0"
    target="_blank"
    rel="noopener noreferrer"
    className="text-green-700 hover:underline"
  >
    +91 8285684222
  </a>
</h2>
        <p className="text-gray-700 mb-10 text-base md:text-lg">
          Need help with a product or order? Reach out through the contact form below.
          <br />
          Our support team is ready to guide you and ensure a smooth experience with Varsha.
        </p>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="p-3 rounded-md border border-gray-300 w-full"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="p-3 rounded-md border border-gray-300 w-full"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="p-3 rounded-md border border-gray-300 w-full"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="p-3 rounded-md border border-gray-300 w-full"
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
          </div>

          <div>
            <input
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="p-3 rounded-md border border-gray-300 w-full"
            />
            {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
          </div>

          <div className="md:col-span-2">
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="p-3 rounded-md border border-gray-300 w-full"
            />
            <button
              type="submit"
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-full mx-auto block transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
