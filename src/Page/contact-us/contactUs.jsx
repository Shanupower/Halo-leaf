import React from "react";
import { FAQ } from "../../component";

export const ContactUs = () => {
  // Offices grouped as required
  const corporateAndManufacturing = [
    {
      name: "Corporate Communication",
      phone: "+91-40-24074427 | +91-8285684222",
      email: "customercare@varshabioscience.com",
      address:
        "#17-1-383/36/2, 2nd Main Road, Vinay Nagar Colony, Saidabad, Hyderabad, Telangana – 500059, INDIA",
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d60932.077490700176!2d78.511217!3d17.351466!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9865a56b1b8d%3A0x3a15ede53360f7e6!2sVarsha%20Bioscience%20And%20Technology%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1754910338197!5m2!1sen!2sin",
    },
    {
      name: "Manufacturing Unit",
      address:
        "Survey no: 253/A, Anthammagudem village, Pochampally mandal, Nalgonda dist, Telangana-508284, INDIA",
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d121910.5621503968!2d78.843796!3d17.281498!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb120b884df3f9%3A0x48891029712b00b2!2sVarsha%20Bioscience%20And%20Technology%20India%20Pvt.Ltd.!5e0!3m2!1sen!2sin!4v1754910368889!5m2!1sen!2sin",
    },
  ];

  const bottomOffices = [
    {
      name: "International Tie-ups",
      phone: "+91-8285684222",
      email: "sales@varshabioscience.com",
      address: "Hyderabad, Telangana, INDIA",
    },
    {
      name: "B2B Tie-ups",
      phone: "+91-9849438410",
      email: "b2b@varshabioscience.com",
      address: "Hyderabad, Telangana, INDIA",
    },
    {
      name: "Procurements",
      phone: "+91-9345647270",
      email: "procurements@varshabioscience.com",
      address: "Hyderabad, Telangana, INDIA",
    },
  ];

 const faqs = [
    {
      question: "What are biofertilizers and how do they work?",
      answer:
        "Biofertilizers are living microbial formulations— that ensure continues plant nutriton through their enzymatic reactions that solubulize,mobilize and fix essential nutrients like Nitrogen , Phosphurus , Pottasium , zinc , Ferrous and many more.",
    },
        {
      question: "How do your bio-insecticides differ from conventional pesticides?",
      answer:
        "Varsha’s bio-insecticides leverage naturally occurring bacteria (e.g., Bacillus thuringiensis) to target specific pests, disrupting their life cycles without harming beneficial insects, soil fauna, or water bodies. Unlike broad-spectrum chemicals, our biocontrol agents leave zero toxic residue and integrate seamlessly into IPM and organic farming programs.",
    },
    {
      question: "Are Varsha Bioscience products safe for humans, animals, and the environment?",
      answer:
        "Absolutely. All our bio-inputs are derived from non-pathogenic, eco-certified microbes and botanical extracts. They carry no harmful residues, pose minimal risk to non-target organisms, and comply with stringent regulatory standards (FCO, CIB&RC, Ecocert, ISO).",
    },
    {
      question: "How should I apply your bio-solutions for best results?",
      answer:
        "Each product category includes detailed application guidelines:\n\n• Timing: Apply at early growth stages or upon initial pest/disease detection.\n• Dosage: Follow label-recommended rates (e.g., spores per hectare or ml per liter of spray).\n• Method: Use seed treatment, soil drench, or foliar spray as specified.\nFor tailored advice, consult our agronomy experts via the “Ask an Expert” chat or contact form.",
    },
    {
      question: "Can I mix Varsha products with chemical fertilizers or other bio-inputs?",
      answer:
        "Yes—most of our products are compatible with standard fertilizers, micronutrients, and bio-stimulators. However, avoid tank-mixing with harsh fungicides or disinfectants. Always perform a small-scale compatibility test before bulk application, or reach out to our technical support for a customized compatibility chart.",
    },
    {
      question: "What are the storage and shelf-life requirements?",
      answer:
        "To preserve microbial viability:\n\n• Store in a cool, dry place (10–30 °C), away from direct sunlight.\n• Keep packaging sealed until use.\n• Use within the printed shelf-life (typically 12–24 months).\nAvoid freezing or extreme heat, which can reduce product efficacy.",
    },
    {
      question: "Do you offer custom or bulk formulations?",
      answer:
        "Yes. In addition to our nine standard product lines, we provide custom-blended solutions—such as tailored microbial consortia or pond bioremediation kits—based on soil tests, regional conditions, and crop requirements. Contact our sales team to discuss bulk orders, private-labeling, or R&D collaborations.",
    },
    {
      question: "How do I track my order or request technical support?",
      answer:
        "After placing an order, you’ll receive a tracking link via email or SMS. For technical queries, application guidance, or troubleshooting, use our online support portal or call our agronomy hotline. We aim to respond within 24 hours to ensure your operations remain uninterrupted.",
    },
    {
      question: "Where can I purchase Varsha Bioscience products?",
      answer:
        "Our products are available through:\n\n• Authorized distributors and agri-input dealers nationwide\n• Direct sales from our Hyderabad and Chennai offices\n• Online via our e-commerce portal (launching soon!)\nUse the “Find a Distributor” tool on our website or contact us for the nearest reseller.",
    },
    {
      question: "How can I stay updated on new launches and research insights?",
      answer:
        "Subscribe to our quarterly newsletter for the latest product innovations, field success stories, and agronomy tips. You can also follow us on LinkedIn, Facebook, and YouTube for webinars, case studies, and live Q&A sessions with our R&D team.",
    },
  ];;

  return (
    <div style={{ marginTop: "80px", marginBottom: "40px" }} className="md:px-[10%] sm:px-[5%] px-2 py-4">
      <h2 className="md:text-2xl text-xl font-semibold mb-6">CONTACT US</h2>

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
