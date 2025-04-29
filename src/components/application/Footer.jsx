import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-gray-900 py-10 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col items-center">
          <h3 className="text-gray-300 text-[20px] font-[600]">Company</h3>
          <ul className="mt-2 space-y-2 text-gray-400">
            <li>
              <Link to="/about-us" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link to="/careers" className="hover:text-white">
                Careers
              </Link>
            </li>
            <li>
              <Link to="/affiliates" className="hover:text-white">
                Affiliates
              </Link>
            </li>
          </ul>
          <div className="flex space-x-4 mt-4">
            <Link to="#" className="hover:text-white">
              <FaFacebook className="text-blue-500 text-[21px]" />
            </Link>
            <Link to="#" className="hover:text-white">
              <FaGoogle className="text-green-500 text-[21px]" />
            </Link>
            <Link to="#" className="text-white">
              <FaXTwitter className=" text-[21px]" />
            </Link>
            <Link to="#" className="hover:text-white">
              <FaYoutube className="text-red-500 text-[21px]" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-gray-300 text-[20px] font-[600]">Resources</h3>
          <ul className="mt-2 space-y-2 text-center text-gray-400">
            <li>
              <Link to="/articles" className="hover:text-white">
                Articles
              </Link>
            </li>
            <li>
              <Link to="/blog" className="hover:text-white">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/chart-sheet" className="hover:text-white">
                Chart Sheet
              </Link>
            </li>
            <li>
              <Link to="/code-challenges" className="hover:text-white">
                Code Challenges
              </Link>
            </li>
            <li>
              <Link to="/docs" className="hover:text-white">
                Docs
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-white">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/videos" className="hover:text-white">
                Videos
              </Link>
            </li>
            <li>
              <Link to="/workspaces" className="hover:text-white">
                Workspaces
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-gray-300 text-[20px] font-[600]">Subjects</h3>
          <ul className="mt-2 space-y-2 text-center">
            {[
              "AI",
              "Cloud Computing",
              "Code Foundations",
              "Computer Science",
              "Cybersecurity",
              "Data Analytics",
              "Data Science",
              "Data Visualization",
              "Developer Tools",
              "DevOps",
              "Game Development",
              "IT",
              "Machine Learning",
              "Math",
              "Mobile Development",
              "Web Design",
              "Web Development",
            ].map((subject, index) => (
              <li key={index}>
                <Link
                  to={`/${subject.toLowerCase().replace(/ /g, "-")}`}
                  className="hover:text-white text-gray-400"
                >
                  {subject}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-gray-300 text-[20px] font-[600]">Languages</h3>
          <ul className="mt-2 space-y-2 text-center">
            {[
              "Bash",
              "C++",
              "C#",
              "Go",
              "HTML & CSS",
              "Java",
              "JavaScript",
              "Kotlin",
              "PHP",
              "Python",
              "R",
              "Ruby",
              "SQL",
              "Swift",
            ].map((lang, index) => (
              <li key={index}>
                <Link
                  to={`/${lang.toLowerCase()}`}
                  className="hover:text-white text-gray-400"
                >
                  {lang}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p className="text-gray-500">Made by keshav kumar 🦅 © 2023 EduNest</p>
        <div className="mt-4 flex justify-center space-x-6 text-gray-400">
          <Link to="/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/cookie-policy" className="hover:text-white">
            Cookie Policy
          </Link>
          <Link to="/terms" className="hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
