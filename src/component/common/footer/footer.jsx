// src/components/Footer.jsx
import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

// import certification logos
import dsir from '../../../assets/certs/dsir.png';
import fertilizers from '../../../assets/certs/fertilizers.png';
import cibrc from '../../../assets/certs/cibrc.png';
import iso9001 from '../../../assets/certs/iso9001.png';

export const Footer = () => {
  const certifications = [
    { src: dsir, alt: 'DSIR Recognized' },
    { src: fertilizers, alt: 'Department of Fertilizers' },
    { src: cibrc, alt: 'CIBRC Registered' },
    { src: iso9001, alt: 'ISO 9001:2015 Certified' },
  ];

  return (
    <footer className="bg-white-900 text-Black-300">
      {/* Certifications */}
      <div className="py-12 px-4 md:px-20 lg:px-32 ">
        <h3 className="text-xl font-semibold text-center text-Black mb-6">
          Our Certifications
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {certifications.map((cert, idx) => (
            <img
              key={idx}
              src={cert.src}
              alt={cert.alt}
              className="h-20 object-contain"
            />
          ))}
        </div>
      </div>

      {/* Footer content */}
      <div className="py-12 px-4 md:px-20 lg:px-32">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center">
    {/* Quick Links */}
    <div>
      <h4 className="text-lg font-semibold text-black mb-4">Quick Links</h4>
      <ul className="space-y-2">
        {['About', 'Products', 'News', 'Blog', 'Contact'].map((link) => (
          <li key={link}>
            <a href={`/${link.toLowerCase()}`} className="hover:text-green-500">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>

    {/* Follow Us */}
    <div>
      <h4 className="text-lg font-semibold text-black mb-4">Follow Us</h4>
      <div className="flex justify-center space-x-4 text-2xl">
        <a href="https://facebook.com" aria-label="Facebook" className="hover:text-green-500">
          <FaFacebookF />
        </a>
        <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-green-500">
          <FaLinkedinIn />
        </a>
        <a href="https://instagram.com" aria-label="Instagram" className="hover:text-green-500">
          <FaInstagram />
        </a>
        <a href="https://youtube.com" aria-label="YouTube" className="hover:text-green-500">
          <FaYoutube />
        </a>
      </div>
    </div>

    {/* Contacts */}
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-black mb-2">Head Office (Hyderabad)</h4>
        <p>+91-40-2407 4427</p>
        <p>
          <a href="mailto:customercare@varshabioscience.com" className="hover:text-green-500">
            customercare@varshabioscience.com
          </a>
        </p>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-black mb-2">Manufacturing Unit (Chennai)</h4>
        <p>+91-44-2655 7788</p>
        <p>
          <a href="mailto:info@varshabioscience.com" className="hover:text-green-500">
            info@varshabioscience.com
          </a>
        </p>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="bg-white-100 py-4">
    <p className="text-center text-sm text-white-600">
      &copy; 2025 Varsha Bioscience &amp; Technology India Pvt. Ltd. All rights reserved.
    </p>
  </div>
</div>

    </footer>
  );
};

export default Footer;
