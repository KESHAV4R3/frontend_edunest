// src/pages/ContactUs.jsx
import React from "react";
import ContactForm from "../components/aboutUsPage/ContactForm";
import ReviewSection from "../components/homePage/ReviewSection";
import Footer from "../components/application/Footer";

const ContactUsPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-dark_bg to-gray-900 text-white pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with animation */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We'd love to hear from you! Fill out the form below and we'll get
              back to you as soon as possible.
            </p>
          </div>

          {/* Content with subtle grid pattern */}
          <div className="relative">
            <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
              <div className="p-8 md:p-12">
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Additional contact info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-800 hover:scale-95 duration-300 cursor-pointer">
              <div className="text-primary mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-400">+91 ----------</p>
            </div>

            <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-800 hover:scale-95 duration-300 cursor-pointer">
              <div className="text-primary mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-400">Edunest Corporate Tower</p>
              <p className="text-gray-400">New Delhi , India</p>
            </div>
          </div>
        </div>
      </div>

      {/* review section */}
      <ReviewSection />
      <Footer />  
    </section>
  );
};

export default ContactUsPage;
