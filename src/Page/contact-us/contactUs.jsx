import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Img1 from "../../assets/contact1.png";
import Img2 from "../../assets/contact2.png";
import Img3 from "../../assets/contact3.png";
import { FAQ } from "../../component";

export const ContactUs = () => {
  const images = [Img1, Img2, Img3];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Change image every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  // Transition variants for slideshow
  const transitionVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 0.95, transition: { duration: 1, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 1, ease: "easeInOut" } },
  };
  // Offices grouped as required
  const corporateAndManufacturing = [
    {
      name: "HaloLeaf Head Office",
      phone: "+91-8919123748",
      email: "info@haloleaf.com",
      address:
        "5, 5-400/733, Prashanth Nagar, Vanasthalipuram, Hyderabad, Telangana 500070, INDIA",
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.5785097939047!2d78.56447399999999!3d17.335874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba3075e06d0bb%3A0xfd5a4edefede821!2sDasari%E2%80%99s%20Nilayam!5e0!3m2!1sen!2sin!4v1751183513381!5m2!1sen!2sin",
    },
    {
      name: "HaloLeaf Branch Office",
      phone: "+91-8919123748",
      email: "branch@haloleaf.com",
      address:
        "H. no: 5, Ashirvad Nilayam, 2-175/ 24&25, Road No.4, Gandhi Nagar South Colony, Vanasthalipuram, Hyderabad, Telangana 500070, INDIA",
      mapSrc:
        "https://www.google.com/maps?q=H.+no:+5,+Halo+Leaf+Plates,+Ashirvad+Nilayam,+2-175%2F24%2625,+Road+No.4,+Gandhi+Nagar+South+Colony,+Vanasthalipuram,+Hyderabad,+Telangana+500070&output=embed",
    },
  ];

  const bottomOffices = [
    {
      name: "International Sales",
      phone: "+91-8919123748",
      email: "international@haloleaf.com",
      address: "Hyderabad, Telangana, INDIA",
    },
    {
      name: "B2B Partnerships",
      phone: "+91-8919123748",
      email: "partnerships@haloleaf.com",
      address: "Hyderabad, Telangana, INDIA",
    },
    {
      name: "Supply Chain",
      phone: "+91-8919123748",
      email: "supply@haloleaf.com",
      address: "Hyderabad, Telangana, INDIA",
    },
  ];

 const faqs = [
    {
      question: "What are Halo Leaf Siali Leaf Plates?",
      answer:
        "Halo Leaf Siali leaf plates are eco-friendly, 100% natural dining solutions crafted from Siali leaves. They offer a biodegradable and chemical-free alternative to traditional plastic or paper tableware, ensuring a safe and sustainable dining experience.",
    },
    {
      question: "How are these leaf plates made?",
      answer:
        "Our plates are made using traditional methods passed down through generations. Artisans carefully collect Siali leaves from forests, then clean, dry, and stitch them together with natural fibers such as bamboo or sal bark. This meticulous process not only creates a durable product but also honors ancient craftsmanship.",
    },
    {
      question: "What benefits do Siali leaf plates offer?",
      answer:
        "The plates provide multiple benefits: Eco-Friendly & Biodegradable, Chemical-Free & Non-Toxic, and Naturally Antibacterial, which helps maintain food hygiene while enhancing taste and aroma.",
    },
    {
      question: "How does Halo Leaf promote sustainability?",
      answer:
        "By offering a zero-waste, renewable alternative to disposable tableware, Halo Leaf helps reduce plastic waste and its environmental impact. Each plate is designed to leave no lasting footprint on the planet, aligning with eco-conscious and sustainable living practices.",
    },
    {
      question: "Who crafts these plates?",
      answer:
        "Our plates are handcrafted by skilled artisans from indigenous and rural communities. These craftspeople, many of whom are women, bring traditional expertise and dedication to every piece, transforming natural Siali leaves into functional, eco-friendly tableware.",
    },
    {
      question: "How does Halo Leaf support local communities?",
      answer:
        "Halo Leaf is committed to uplifting rural communities by providing steady employment and fair wages to its artisans. This not only sustains an age-old craft but also empowers women and supports local economies, creating a positive social impact alongside environmental benefits.",
    },
    {
      question: "What makes dining on Siali leaf plates a healthier choice?",
      answer:
        "Eating on Siali leaf plates is beneficial because they are free from harmful chemicals and are naturally antibacterial. This ensures that your food retains its natural taste and aroma, offering a clean and health-conscious alternative to conventional tableware.",
    },
  ];;

  return (
    <div style={{ marginTop: "80px", marginBottom: "40px" }} className="md:px-[10%] sm:px-[5%] px-2 py-4">
      <h2 className="md:text-2xl text-xl font-semibold mb-6">CONTACT US</h2>

      {/* Image Slideshow */}
      <div className="rounded-xl overflow-hidden mt-4 relative md:h-[60vh] h-[40vh]">
        <AnimatePresence exitBeforeEnter>
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="absolute top-0 left-0 -z-10 object-contain h-full w-full"
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          />
        </AnimatePresence>
      </div>

      {/* Corporate & Manufacturing in one row */}
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-6 mb-8">
        {corporateAndManufacturing.map((office, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden p-4 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{office.name}</h3>
            {office.phone && <p><strong>Phone:</strong> {office.phone}</p>}
            {office.email && (
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${office.email}`} className="text-blue-600 hover:underline">
                  {office.email}
                </a>
              </p>
            )}
            <div className="mb-2"><strong>Address:</strong> {office.address}</div>
            {office.mapSrc && (
              <div className="w-full h-48 mt-auto">
                <iframe
                  src={office.mapSrc}
                  width="100%"
                  height="100%"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map - ${office.name}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom 3 offices in equal boxes */}
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6 mb-8">
        {bottomOffices.map((office, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{office.name}</h3>
              {office.phone && <p><strong>Phone:</strong> {office.phone}</p>}
              {office.email && (
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${office.email}`} className="text-blue-600 hover:underline">
                    {office.email}
                  </a>
                </p>
              )}
              <div className="mb-2"><strong>Address:</strong> {office.address}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-8">
        <h2 className="md:text-2xl text-xl font-semibold mb-4">FAQ</h2>
        {faqs.map((faq, index) => (
          <FAQ key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default ContactUs;
