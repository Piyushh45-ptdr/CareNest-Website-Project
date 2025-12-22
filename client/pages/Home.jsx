import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Clock, Users, Award, ArrowRight, Stethoscope, Shield, MapPin } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Stethoscope,
      title: "Expert Doctors",
      description: "Access to highly qualified doctors across various specializations",
    },
    {
      icon: Clock,
      title: "Quick Appointments",
      description: "Book appointments at your convenience with flexible scheduling",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your health data is protected with industry-standard security",
    },
    {
      icon: Heart,
      title: "Holistic Care",
      description: "Comprehensive healthcare services for your well-being",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Patients" },
    { number: "500+", label: "Expert Doctors" },
    { number: "100+", label: "Specializations" },
    { number: "24/7", label: "Support Available" },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />
        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
                Your Health, <span className="text-gradient">Our Priority</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with the best healthcare professionals and book appointments at your convenience. CareNest brings quality healthcare closer to you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate("/doctors")}
                  className="btn-primary flex items-center justify-center gap-2 group"
                >
                  Find a Doctor <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="btn-outline flex items-center justify-center gap-2"
                >
                  Get Started
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>500+ Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-secondary" />
                  <span>Verified & Certified</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-transparent rounded-3xl blur-3xl" />
                <div className="relative bg-gradient-to-br from-primary to-secondary rounded-3xl p-8 flex items-center justify-center h-full">
                  <div className="text-center">
                    <Heart className="w-24 h-24 text-white mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">Quality Healthcare</p>
                    <p className="text-white/80 text-sm">Just a Click Away</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={item}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-primary mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose <span className="text-gradient">CareNest</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive healthcare solutions tailored to your needs
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white p-8 rounded-2xl card-shadow hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Take Care of Your Health?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust CareNest for their healthcare needs
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/doctors")}
                className="px-8 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Doctors Now
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              What Makes Us <span className="text-gradient">Different</span>
            </h2>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Verified Professionals",
                description: "All doctors are verified, certified, and reviewed by our medical board",
              },
              {
                title: "Transparent Pricing",
                description: "Know exactly what you'll pay before booking an appointment",
              },
              {
                title: "Easy Rescheduling",
                description: "Change or cancel appointments up to 24 hours in advance",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={item}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl"
              >
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
