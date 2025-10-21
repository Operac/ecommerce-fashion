import Layout from "../Shared/Layout/Layout";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: <FaPhone className="w-6 h-6" />,
      title: "Phone",
      info: "+234 8166598665",
      subInfo: "Mon-Fri 9am-6pm EST"
    },
    {
      icon: <FaEnvelope className="w-6 h-6" />,
      title: "Email",
      info: "support@granduer.com",
      subInfo: "We reply within 24 hours"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6" />,
      title: "Address",
      info: "4 Tosin Street",
      subInfo: "Ogba, Lagos, Nigeria."
    },
    {
      icon: <FaClock className="w-6 h-6" />,
      title: "Business Hours",
      info: "Mon - Fri: 9am - 6pm",
      subInfo: "Sat - Sun: 10am - 4pm"
    }
  ];

  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn items with tags attached."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 days."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes! We ship to over 50 countries worldwide. Shipping times vary by location."
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        
        {/* Hero Section */}
        <div className="relative bg-primary text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              We'd love to hear from you! Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-6xl mx-auto px-4 -mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="text-primary mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-900 font-semibold mb-1">{item.info}</p>
                <p className="text-gray-600 text-sm">{item.subInfo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              
              {submitted ? (
                <div className="bg-primary border border-green-200 rounded-lg p-6 text-center">
                  <div className="text-primary text-5xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-primary">
                    Thank you for contacting us. We'll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors"
                      placeholder="+234 800 123 4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors bg-white"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Question</option>
                      <option value="returns">Returns & Exchanges</option>
                      <option value="shipping">Shipping Information</option>
                      <option value="products">Product Information</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-primary transition-colors duration-300 shadow-lg hover:shadow-xl"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Right Side - FAQs & Social */}
            <div>
              {/* FAQ Section */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-primary rounded-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Follow Us
                </h3>
                <p className="mb-6 text-purple-100">
                  Stay connected with us on social media for the latest updates, trends, and exclusive offers!
                </p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors duration-300"
                  >
                    <FaFacebook className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors duration-300"
                  >
                    <FaInstagram className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors duration-300"
                  >
                    <FaTwitter className="w-6 h-6" />
                  </a>
                  <a
                    href="#"
                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors duration-300"
                  >
                    <FaPinterest className="w-6 h-6" />
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gray-200 rounded-xl overflow-hidden h-64">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <FaMapMarkerAlt className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">Map Integration</p>
                    <p className="text-sm">Add Google Maps or custom map here</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
};
export default Contact;