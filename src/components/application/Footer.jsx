import React, { memo } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaGoogle, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-10 w-full selection:bg-red-600/30">
<div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 text-center lg:text-left">
             
        {/* Column 1: Company & Brand */}
        <div className="flex flex-col items-center lg:items-start">
          <h3 className="text-gray-200 text-[13px] font-black uppercase mb-6">
            Platform <span className="text-red-500 ml-1">Core</span>
          </h3>
          <ul className="space-y-3 text-center lg:text-left">
            {["About Us", "Careers", "Affiliates"].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase().replace(" ", "-")}`} 
                  className="text-gray-500 hover:text-white text-sm font-medium transition-colors duration-200"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Unified Social Icons */}
          <div className="flex space-x-5 mt-8">
            {[FaFacebook, FaGoogle, FaXTwitter, FaYoutube].map((Icon, idx) => (
              <Link key={idx} to="#" className="text-gray-600 hover:text-red-600 transition-all duration-300 transform hover:-translate-y-1">
                <Icon size={20} />
              </Link>
            ))}
          </div>
        </div>

        {/* Column 2: Resources */}
        <div className="flex flex-col items-center lg:items-start">
         <h3 className="text-gray-200 text-[13px] font-black uppercase mb-6">
            Deployment <span className="text-red-500 ml-1">Assets</span>
          </h3>
          <ul className="space-y-3 text-center lg:text-left">
            {["Articles", "Blog", "Chart Sheet", "Code Challenges", "Docs", "Projects", "videos", "Workspaces"].map((item) => (
              <li key={item}>
                <Link to={`/${item.toLowerCase().replace(" ", "-")}`} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Subjects */}
        <div className="flex flex-col items-center lg:items-start">
 <h3 className="text-gray-200 text-[13px] font-black uppercase mb-6">            Sector <span className="text-red-500 ml-1">Inventory</span>
          </h3>
          <ul className="grid grid-cols-1 gap-3 text-center lg:text-left">
            {[
              "AI", "Cloud Computing", "Computer Science", "Cybersecurity", 
              "Data Science", "DevOps", "Game Development", "Web Development"
            ].map((subject) => (
              <li key={subject}>
                <Link
                  to={`/${subject.toLowerCase().replace(/ /g, "-")}`}
                  className="text-gray-500 hover:text-white text-sm font-medium transition-colors"
                >
                  {subject}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Languages */}
        <div className="flex flex-col items-center lg:items-start">
 <h3 className="text-gray-200 text-[13px] font-black uppercase mb-6">            Syntax <span className="text-red-500 ml-1">Protocols</span>
          </h3>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-x-8 gap-y-3 text-center lg:text-left">
            {[
              "Bash", "C++", "Go", "HTML & CSS", "Java", "JavaScript", "Python", "SQL"
            ].map((lang) => (
              <li key={lang}>
                <Link to={`/${lang.toLowerCase().replace(" & ", "-")}`} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">
                  {lang}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-[1400px] mx-auto px-6 border-t border-gray-800 mt-16 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-600 text-[10px] font-black tracking-widest order-2 md:order-1 text-center md:text-left">
            Made by <span className="text-gray-400">keshav kumar</span> 🦅 <br className="md:hidden"/> 
            © {new Date().getFullYear()} EDUNEST ARCHIVE
          </p>
          
          <div className="flex space-x-8 order-1 md:order-2">
            {["Privacy Policy", "Cookie Policy", "Terms"].map((legal) => (
              <Link 
                key={legal} 
                to={`/${legal.toLowerCase().replace(" ", "-")}`} 
                className="text-gray-600 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                {legal}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);