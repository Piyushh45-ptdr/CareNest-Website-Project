import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Shield,
  Globe,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const [expandedMission, setExpandedMission] = useState(false);

  const values = [
    {
      icon: Heart,
      title: "Patient-Centric Care",
      description:
        "We prioritize patient health and satisfaction above all else.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Your medical data is protected with industry-leading encryption.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Award,
      title: "Expert Doctors",
      description: "Our network includes highly qualified and experienced doctors.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Quick appointment booking and responsive customer support.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const stats = [
    { number: "10K+", label: "Patients Served" },
    { number: "500+", label: "Expert Doctors" },
    { number: "50K+", label: "Appointments Booked" },
    { number: "4.8★", label: "Customer Rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* <Navbar /> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-5xl font-bold mb-4">About CareNest</h1>
          <p className="text-xl text-blue-100">
            Connecting Patients with Healthcare Excellence
          </p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Who We Are */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Who We Are
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                CareNest is a modern healthcare platform dedicated to bridging the
                gap between patients and quality medical professionals. Founded in
                2024, we've revolutionized how people access healthcare services.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Our mission is to make quality healthcare accessible, affordable, and
                convenient for everyone. With our user-friendly platform, patients
                can easily find and book appointments with qualified doctors from the
                comfort of their homes.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                We believe that healthcare should be simple, transparent, and
                patient-focused. Every feature we build is designed with you in mind.
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl transform rotate-6"></div>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg">
                <Globe className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                <p className="text-center text-gray-600 font-semibold">
                  Serving patients across multiple cities and regions
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16 bg-gray-50 py-12 rounded-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Our Values */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className={`p-6 h-full hover:shadow-lg transition-all ${value.bgColor}`}>
                    <IconComponent className={`w-12 h-12 ${value.color} mb-4`} />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-700">{value.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Our Mission */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-blue-100 leading-relaxed mb-6">
              To revolutionize healthcare accessibility by creating a seamless,
              trusted platform that connects patients with quality medical professionals.
              We believe every person deserves easy access to expert healthcare.
            </p>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <p className="text-blue-100">
                Making healthcare accessible to everyone, everywhere
              </p>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <p className="text-blue-100">
                Ensuring patient safety and data privacy at all times
              </p>
            </div>
            <div className="flex items-start gap-3 mt-4">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <p className="text-blue-100">
                Empowering doctors to provide better care to patients
              </p>
            </div>
          </Card>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Why Choose CareNest?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 border-gray-200 hover:border-blue-600 transition-colors">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Verified Doctors
              </h3>
              <p className="text-gray-700">
                All our doctors are verified professionals with proper credentials
                and experience in their respective fields.
              </p>
            </Card>
            <Card className="p-8 border-2 border-gray-200 hover:border-blue-600 transition-colors">
              <Zap className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Easy Booking
              </h3>
              <p className="text-gray-700">
                Simple and quick appointment booking process. Find a doctor and
                schedule your visit in just a few clicks.
              </p>
            </Card>
            <Card className="p-8 border-2 border-gray-200 hover:border-blue-600 transition-colors">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-700">
                Your health information is encrypted and secure. We comply with
                all healthcare privacy regulations.
              </p>
            </Card>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust CareNest for their healthcare needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/doctors">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Find a Doctor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.section>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default About;
