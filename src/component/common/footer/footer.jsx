// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FOOTER_LINKS } from '../../../routes/paths';

export const Footer = () => {
  return (
    <footer className="bg-white-900 text-Black-300">
      {/* Footer content */}
      <div className="py-12 px-4 md:px-20 lg:px-32">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center">
    {/* Quick Links */}
    <div>
      <h4 className="text-lg font-semibold text-black mb-4">Quick Links</h4>
      <ul className="space-y-2">
        {FOOTER_LINKS.map(({ label, to }) => (
          <li key={label}>
            {to.includes('#') ? (
              <a href={to} className="hover:text-green-500">
                {label}
              </a>
            ) : (
              <Link to={to} className="hover:text-green-500">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>

    {/* Follow Us */}
    <div>
      <h4 className="text-lg font-semibold text-black mb-4">Follow Us</h4>
      <div className="flex justify-center space-x-4 text-2xl">
        <a href="https://facebook.com/haloleaf" aria-label="Facebook" className="hover:text-green-500">
          <FaFacebookF />
        </a>
        <a href="https://linkedin.com/company/haloleaf" aria-label="LinkedIn" className="hover:text-green-500">
          <FaLinkedinIn />
        </a>
        <a href="https://instagram.com/haloleaf" aria-label="Instagram" className="hover:text-green-500">
          <FaInstagram />
        </a>
        <a href="https://youtube.com/haloleaf" aria-label="YouTube" className="hover:text-green-500">
          <FaYoutube />
        </a>
      </div>
    </div>

    {/* Contacts */}
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-black mb-2">Head Office (Hyderabad)</h4>
        <p>+91-8919123748</p>
        <p>
          <a href="mailto:info@haloleaf.com" className="hover:text-green-500">
            info@haloleaf.com
          </a>
        </p>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-black mb-2">Branch Office (Hyderabad)</h4>
        <p>+91-8919123748</p>
        <p>
          <a href="mailto:branch@haloleaf.com" className="hover:text-green-500">
            branch@haloleaf.com
          </a>
        </p>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="bg-white-100 py-4">
    <p className="text-center text-sm text-white-600">
      &copy; 2025 HaloLeaf Sustainable Solutions Pvt. Ltd. All rights reserved.
    </p>
  </div>
</div>

    </footer>
  );
};

export default Footer;
