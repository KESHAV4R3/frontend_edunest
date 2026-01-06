// src/pages/ContactUs.jsx
import React, { useState } from "react";
import ContactForm from "../components/aboutUsPage/ContactForm";
import ReviewSection from "../components/homePage/ReviewSection";
import Footer from "../components/application/Footer";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";

const ContactUsPage = () => {
  const [activeInfo, setActiveInfo] = useState(null);

  const contactInfo = [
    {
      id: 1,
      icon: <FaPhoneAlt className="text-2xl" />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 12345 67890"],
      color: "from-blue-500 to-cyan-500",
      hoverColor: "hover:from-blue-600 hover:to-cyan-600",
    },
    {
      id: 2,
      icon: <FaEnvelope className="text-2xl" />,
      title: "Email Us",
      details: ["support@edunest.com", "info@edunest.com"],
      color: "from-purple-500 to-pink-500",
      hoverColor: "hover:from-purple-600 hover:to-pink-600",
    },
    {
      id: 3,
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: "Visit Us",
      details: ["Edunest Corporate Tower", "Connaught Place", "New Delhi 110001, India"],
      color: "from-green-500 to-emerald-500",
      hoverColor: "hover:from-green-600 hover:to-emerald-600",
    },
    {
      id: 4,
      icon: <FaClock className="text-2xl" />,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM", "Sun: Closed"],
      color: "from-orange-500 to-red-500",
      hoverColor: "hover:from-orange-600 hover:to-red-600",
    },
  ];

  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond within 24 hours on business days.",
    },
    {
      question: "Do you offer support for technical issues?",
      answer: "Yes, our technical support team is available 24/7 for urgent issues.",
    },
    {
      question: "Can I schedule a demo or consultation?",
      answer: "Absolutely! Use the form above to request a personalized demo.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white overflow-hidden bg-gray-900">
      {/* Simple background with subtle gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0c] to-[#111114] -z-10"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              Get in Touch
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Have questions, feedback, or just want to say hello? We're here to help 
            you succeed on your learning journey.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <MdSupportAgent className="text-3xl text-blue-400" />
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Form Card */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Send us a Message
                </h2>
                <p className="text-gray-400">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
              <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300"
                  >
                    <h4 className="font-semibold text-lg mb-2 text-blue-300">
                      {faq.question}
                    </h4>
                    <p className="text-gray-400">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info) => (
                <motion.div
                  key={info.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onMouseEnter={() => setActiveInfo(info.id)}
                  onMouseLeave={() => setActiveInfo(null)}
                  className={`bg-gradient-to-br ${info.color} bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-transparent transition-all duration-300 cursor-pointer group ${info.hoverColor}`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full bg-gradient-to-br ${info.color} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">{info.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                    <div className="space-y-1">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-300 group-hover:text-white transition-colors">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map/Office Info */}
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Our Headquarters
              </h3>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
                {/* Placeholder for map image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <FaMapMarkerAlt className="text-6xl text-blue-400 mx-auto mb-4" />
                    <p className="text-xl font-semibold">Edunest Corporate Tower</p>
                    <p className="text-gray-300">New Delhi, India</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <FaMapMarkerAlt className="text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Prime Location</h4>
                    <p className="text-gray-400 text-sm">Centrally located in Delhi's business district</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <MdSupportAgent className="text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Visitor Friendly</h4>
                    <p className="text-gray-400 text-sm">Schedule your visit through our concierge</p>
                  </div>
                </div>
              </div>
            </div>

       
          </motion.div>
        </div>

      </div>

      {/* Review Section */}
      <ReviewSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactUsPage;