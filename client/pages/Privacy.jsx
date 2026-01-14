import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const Privacy = () => {
  const sections = [
    {
      title: "1. Introduction",
      content:
        "CareNest ('we', 'our', or 'us') operates the CareNest website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our website and the choices you have associated with that data.",
    },
    {
      title: "2. Information Collection and Use",
      content:
        "We collect several different types of information for various purposes to provide and improve our Service to you. Personal Data may include but is not limited to: Email address; First name and last name; Phone number; Address, State, Province, ZIP/Postal code, City; Cookies and Usage Data. Usage Data is collected automatically when using the Service and may include information such as your device's Internet Protocol address, browser type, browser version, pages visited, time and date of visit, and other diagnostic data.",
    },
    {
      title: "3. Use of Data",
      content:
        "CareNest uses the collected data for various purposes: To provide and maintain the Service; To notify you about changes to our Service; To allow you to participate in interactive features of our Service when you choose to do so; To provide customer care and support; To gather analysis or valuable information; To monitor the usage of our Service; To detect, prevent and address technical issues.",
    },
    {
      title: "4. Security of Data",
      content:
        "The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
    },
    {
      title: "5. Cookies",
      content:
        "Cookies are files with a small amount of data which may include an anonymous unique identifier. We use cookies to enhance your experience with our Service. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.",
    },
    {
      title: "6. Medical Information",
      content:
        "We handle medical information with the highest level of care and confidentiality. Your health records and medical history are protected under applicable healthcare privacy laws. This information is only shared with healthcare providers directly involved in your care and is never sold or transferred to third parties for marketing purposes.",
    },
    {
      title: "7. Links to Other Sites",
      content:
        "Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.",
    },
    {
      title: "8. Children's Privacy",
      content:
        "Our Service does not address anyone under the age of 18 ('Children'). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we discover that a child under 18 has provided us with Personal Data, we will delete such information immediately.",
    },
    {
      title: "9. Changes to This Privacy Policy",
      content:
        "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes.",
    },
    {
      title: "10. Contact Us",
      content:
        "If you have any questions about this Privacy Policy, please contact us at privacy@carenest.com. We will respond to your inquiry within a reasonable timeframe and take appropriate action to address your concerns.",
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
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-blue-100">
            Your privacy is important to us. Learn how we protect your data.
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg"
        >
          <p className="text-gray-700">
            <span className="font-semibold">Effective Date:</span> December 2024
          </p>
          <p className="text-gray-700 mt-2">
            At CareNest, we are committed to protecting your privacy and ensuring you
            have a positive experience on our platform. This Privacy Policy explains how
            we collect, use, disclose, and safeguard your information.
          </p>
        </motion.div>

        {/* Key Privacy Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-2">🔐</div>
            <h3 className="font-bold text-gray-900 mb-2">Encrypted Data</h3>
            <p className="text-sm text-gray-700">
              All sensitive information is encrypted using industry-standard protocols.
            </p>
          </Card>
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-2">🛡️</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure Transmission</h3>
            <p className="text-sm text-gray-700">
              Data transmitted between you and our servers is protected with SSL/TLS.
            </p>
          </Card>
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="text-3xl font-bold text-purple-600 mb-2">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">No Third Party Sales</h3>
            <p className="text-sm text-gray-700">
              We never sell your personal information to third parties.
            </p>
          </Card>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="p-6 border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Your Rights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-8 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">✓</span>
              <span>Right to access your personal information</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">✓</span>
              <span>Right to correct inaccurate information</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">✓</span>
              <span>Right to delete your information (subject to legal requirements)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">✓</span>
              <span>Right to opt-out of marketing communications</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold text-amber-600">✓</span>
              <span>Right to data portability</span>
            </li>
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-lg text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Data Protection Questions?
          </h3>
          <p className="text-gray-700 mb-4">
            If you have any concerns about how we handle your data or wish to exercise
            your privacy rights, please reach out to us:
          </p>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              <a
                href="mailto:privacy@carenest.com"
                className="text-blue-600 hover:text-blue-700"
              >
                privacy@carenest.com
              </a>
            </p>
            <p>
              <span className="font-semibold">Data Protection Officer:</span>{" "}
              <a
                href="mailto:dpo@carenest.com"
                className="text-blue-600 hover:text-blue-700"
              >
                dpo@carenest.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
