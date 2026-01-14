import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using CareNest, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
    },
    {
      title: "2. Use License",
      content:
        "Permission is granted to temporarily download one copy of the materials (information or software) on CareNest for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modifying or copying the materials; using the materials for any commercial purpose or for any public display; attempting to decompile, disassemble, or reverse engineer any software contained on CareNest; removing any copyright or other proprietary notations from the materials; transferring the materials to another person or 'mirroring' the materials on any other server.",
    },
    {
      title: "3. Disclaimer",
      content:
        "The materials on CareNest are provided 'as is'. CareNest makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
    },
    {
      title: "4. Limitations",
      content:
        "In no event shall CareNest or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CareNest, even if CareNest or an authorized representative has been notified orally or in writing of the possibility of such damage.",
    },
    {
      title: "5. Accuracy of Materials",
      content:
        "The materials appearing on CareNest could include technical, typographical, or photographic errors. CareNest does not warrant that any of the materials on CareNest are accurate, complete, or current. CareNest may make changes to the materials contained on its website at any time without notice.",
    },
    {
      title: "6. Links",
      content:
        "CareNest has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CareNest of the site. Use of any such linked website is at the user's own risk.",
    },
    {
      title: "7. Modifications",
      content:
        "CareNest may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
    },
    {
      title: "8. Governing Law",
      content:
        "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which CareNest operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
    },
    {
      title: "9. User Responsibilities",
      content:
        "You agree that you will not use CareNest for any unlawful purposes or in any way that violates the rights of others or restricts or inhibits the use and enjoyment of CareNest by any third party. Prohibited behavior includes: Harassing or causing distress or inconvenience to any person; Transmitting harmful or malicious code; Disrupting the normal flow of dialogue within CareNest.",
    },
    {
      title: "10. Medical Disclaimer",
      content:
        "CareNest is a platform for booking medical appointments and is not a substitute for professional medical advice. The information provided on CareNest is for informational purposes only and should not be considered as medical advice. Please consult with a qualified healthcare professional for medical advice.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-blue-100">
            Please read these terms carefully before using CareNest
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <p className="text-gray-700">
            <span className="font-semibold">Last Updated:</span> December 2024
          </p>
          <p className="text-gray-700 mt-2">
            These Terms of Service ('Terms') govern your use of CareNest and the
            services provided through it. By accessing or using CareNest, you agree to
            be bound by these Terms.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
            >
              <Card className="p-6 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Terms?
          </h3>
          <p className="text-gray-700 mb-4">
            If you have any questions or concerns regarding these Terms of Service,
            please contact us at:
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span>{" "}
            <a
              href="mailto:legal@carenest.com"
              className="text-blue-600 hover:text-blue-700"
            >
              legal@carenest.com
            </a>
          </p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
