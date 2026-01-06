import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ContactForm from "../components/aboutUsPage/ContactForm";
import Footer from "../components/application/Footer";
import { useNavigate } from "react-router-dom";
import ReviewSection from "../components/homePage/ReviewSection";
import { 
  FaRocket, 
  FaUsers, 
  FaGraduationCap, 
  FaAward,
  FaHeart,
  FaLightbulb,
  FaHandshake,
  FaChartLine
} from "react-icons/fa";

// Memoize static data
const STATIC_DATA = {
  heroImages: [
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Team Collaboration",
      title: "Together We Grow"
    },
    {
      url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Learning Success",
      title: "Unlocking Potential"
    },
    {
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Innovation",
      title: "Driving Innovation"
    },
    {
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Success Stories",
      title: "Building Success"
    }
  ],
  
  statsTargets: [50, 10, 300, 500],
  statsLabels: ["Courses", "Years Experience", "Instructors", "Students"],
  
  successStories: [
    {
      name: "Sarah Johnson",
      role: "Full-Stack Developer",
      story: "From complete beginner to landing a job at Google in 9 months. The structured learning path changed my career trajectory.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      before: "Marketing Manager",
      after: "Senior Developer"
    },
    {
      name: "Michael Chen",
      role: "Data Scientist",
      story: "The practical projects and mentorship helped me transition from finance to tech. Now I lead AI initiatives at a Fortune 500 company.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      before: "Financial Analyst",
      after: "Lead Data Scientist"
    },
    {
      name: "Priya Sharma",
      role: "Cloud Architect",
      story: "As a working mother, the flexible schedule and hands-on labs made it possible to upskill while managing family responsibilities.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      before: "IT Support",
      after: "Cloud Architect"
    }
  ],
  
  values: [
    {
      icon: <FaHeart />,
      title: "Passion for Education",
      description: "We believe learning should be engaging, exciting, and transformative.",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <FaLightbulb />,
      title: "Innovation First",
      description: "Constantly evolving our platform with cutting-edge technology.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <FaUsers />,
      title: "Community Driven",
      description: "Learning is better together. We foster collaboration and support.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: <FaHandshake />,
      title: "Student Success",
      description: "Your achievements are our ultimate measure of success.",
      color: "from-green-400 to-emerald-500"
    }
  ]
};

const AboutUsPage = () => { 
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [stats, setStats] = useState(
    STATIC_DATA.statsLabels.map((label) => ({ number: "0", label }))
  );
  const [loading, setLoading] = useState(false);

  // Auto-slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === STATIC_DATA.heroImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats
  useEffect(() => {
    const animateStats = () => {
      let startTime;
      const duration = 2000;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setStats((prev) =>
          prev.map((stat, i) => ({
            ...stat,
            number: Math.floor(progress * STATIC_DATA.statsTargets[i]).toString(),
          }))
        );

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const timer = setTimeout(() => {
      animateStats();
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <div className="w-full bg-dark_bg text-white py-12 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="h-64 bg-gray-800 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-6 bg-gray-800 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-800 rounded animate-pulse w-5/6"></div>
            </div>
            <div className="h-48 bg-gray-800 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-dark_bg text-white min-h-screen">
      {/* Hero Section with Image Slider */}
      <section className="relative h-[70vh] overflow-hidden">
        {STATIC_DATA.heroImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100 }}
            animate={{ 
              opacity: currentImageIndex === index ? 1 : 0,
              x: currentImageIndex === index ? 0 : 100,
              scale: currentImageIndex === index ? 1 : 1.1
            }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 ${currentImageIndex === index ? 'z-10' : 'z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: currentImageIndex === index ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute inset-0 z-20 flex items-center"
            >
              <div className="max-w-6xl mx-auto px-6">
                <h1 className="text-5xl md:text-7xl font-bold mb-4">
                  {image.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
                  Every success story begins with a decision to try.
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
        
        {/* Image indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {STATIC_DATA.heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentImageIndex === index 
                  ? 'bg-white w-8' 
                  : 'bg-gray-500 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Our Story - Personal Connection */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Journey</span> Together
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full mb-8" />
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hi, I'm Keshav Kumar. Like many of you, I started my journey feeling overwhelmed by 
            the vast world of technology. The turning point came when I realized that learning 
            shouldn't be a lonely struggle—it should be an exciting adventure shared with 
            mentors and peers who genuinely care about your success.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <FaRocket className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">The Spark</h3>
                <p className="text-gray-300">
                  In 2015, after helping dozens of friends transition into tech careers, 
                  I discovered the power of structured, hands-on learning combined with 
                  community support.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
                <FaChartLine className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">The Growth</h3>
                <p className="text-gray-300">
                  What started as weekend workshops grew into a full-fledged platform, 
                  evolving with feedback from thousands of learners worldwide.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center">
                <FaAward className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Today's Impact</h3>
                <p className="text-gray-300">
                  We've helped transform careers, launch startups, and build 
                  confidence in learners from diverse backgrounds.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
              <div className="aspect-video rounded-xl overflow-hidden mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Learning Community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h4 className="text-2xl font-bold mb-3">Your Success is Our Story</h4>
                <p className="text-gray-300">
                  Every student's achievement adds a new chapter to our collective journey.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Values</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATIC_DATA.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className={`bg-gradient-to-br ${value.color} bg-opacity-10 rounded-2xl p-6 border border-gray-700 hover:border-gray-500 transition-all duration-300`}
            >
              <div className={`text-3xl mb-4 text-transparent bg-clip-text bg-gradient-to-r ${value.color}`}>
                {value.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-gradient-to-b from-gray-900/50 to-dark_bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Impact</span> in Numbers
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 rounded-xl bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}+
                  </div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl text-gray-300">
            Have questions? Want to share your story? We'd love to hear from you.
          </p>
        </motion.div>
        <ContactForm />
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-12 text-center border border-gray-700 shadow-2xl"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Write <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">Your Success Story?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands who have transformed their careers and lives through education.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              Start Your Journey Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* Reviews & Footer */}
      <ReviewSection />
      <Footer />
    </div>
  );
};

export default AboutUsPage;