import React from "react";
import { FAQ } from "../../component";

export const ContactUs = () => {
  // Define offices
  const offices = [
    {
      name: "Head Office (Hyderabad)",
      phone: "+91-40-24074427",
      email: "customercare@varshabioscience.com",
      address: "Hyderabad",
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.5785097939047!2d78.56447399999999!3d17.335874!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcba3075e06d0bb%3A0xfd5a4edefede821!2sDasari%E2%80%99s%20Nilayam!5e0!3m2!1sen!2sin!4v1751183513381!5m2!1sen!2sin",
    },
    {
      name: "Manufacturing Unit (Chennai)",
      phone: "+91-44-26557788",
      email: "info@varshabioscience.com",
      address: "Chennai",
      mapSrc:
        "https://www.google.com/maps?q=H.+no:+5,+Halo+Leaf+Plates,+Ashirvad+Nilayam,+2-175%2F24%2625,+Road+No.4,+Gandhi+Nagar+South+Colony,+Vanasthalipuram,+Hyderabad,+Telangana+500070&output=embed",
    },
  ];

  // FAQ entries
  const faqs = [
    {
      question: "What are biofertilizers and how do they work?",
      answer:
        "Biofertilizers are living microbial formulations—such as Rhizobium, Azospirillum, and phosphate-solubilizing bacteria—that colonize the plant root zone. They enhance nutrient availability by fixing atmospheric nitrogen, solubilizing soil phosphates, and producing growth-promoting substances, leading to healthier plants and improved yields without chemical residues.",
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
  ];

  return (
    <div style={{ marginTop: "80px", marginBottom: "40px" }} className="md:px-[10%] sm:px-[5%] px-2 py-4">
      <h2 className="md:text-2xl text-xl font-semibold mb-6">CONTACT US</h2>

      {/* Office Details and Maps */}
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
        {offices.map((office, idx) => (
          <div key={idx} className="border rounded-lg overflow-hidden p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{office.name}</h3>
            <p>
              <strong>Phone:</strong> {office.phone}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${office.email}`} className="text-blue-600 hover:underline">
                {office.email}
              </a>
            </p>
            <div className="mb-2">
              <strong>Address:</strong> {office.address}
            </div>
            <div className="w-full h-48">
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
