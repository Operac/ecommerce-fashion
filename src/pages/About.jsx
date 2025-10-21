import Layout from "../Shared/Layout/Layout";
import { useState } from "react";
import { FaHeart, FaShippingFast, FaAward, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";



const About = () => {
  const [activeValue, setActiveValue] = useState(0);

  const stats = [
    { number: "10K+", label: "Happy Customers" },
    { number: "500+", label: "Products" },
    { number: "50+", label: "Countries" },
    { number: "5★", label: "Rating" }
  ];

  const values = [
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Quality First",
      description: "We handpick every item to ensure premium quality and lasting style for our customers."
    },
    {
      icon: <FaShippingFast className="w-8 h-8" />,
      title: "Fast Delivery",
      description: "Get your fashion favorites delivered quickly and safely, right to your doorstep."
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Authentic Brands",
      description: "Shop with confidence knowing all our products are 100% authentic and original."
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We're here to make your shopping experience perfect."
    }
  ];

  const team = [
    {
      name: "Opeyemi Akintomide",
      role: "Founder & CEO",
      image: "/images/Founder1.png",
      bio: "Passionate about bringing style to everyone"
    },
    {
      name: "Eunice Oladapo",
      role: "Head of Design",
      image: "/images/co-founder.png",
      bio: "Creating trends that inspire confidence"
    },
    {
      name: "Damilola Ajayi",
      role: "Customer Experience",
      image: "/images/marketing.jpeg",
      bio: "Ensuring every customer feels valued"
    }
  ];

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        
        {/* Hero Section */}
        <div className="relative bg-primary text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Our Story
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Where style meets expression, trends inspire, and fashion thrives
            </p>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Fashion for Everyone
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Founded in 2020, we started with a simple belief: everyone deserves to look and feel their best. What began as a small online boutique has grown into a vibrant fashion community serving thousands of customers worldwide.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We curate the latest trends in men's and women's fashion, from casual everyday wear to statement pieces that turn heads. Our mission is to make high-quality, stylish clothing accessible to everyone.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Every product we offer is carefully selected to meet our high standards of quality, comfort, and style. We're not just selling clothes – we're helping you express your unique personality.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop"
                  alt="Fashion Store"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-primary py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-white text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600">
              Our core values guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                onMouseEnter={() => setActiveValue(index)}
                className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                  activeValue === index
                    ? "bg-primary text-white shadow-2xl scale-105"
                    : "bg-gray-50 text-gray-900 hover:shadow-lg"
                }`}
              >
                <div className={`mb-4 ${activeValue === index ? "text-white" : "text-primary"}`}>
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className={activeValue === index ? "text-white" : "text-gray-600"}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-50 py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-600">
                The passionate people behind your style
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Join Our Fashion Community
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Be part of a movement where style meets individuality. Start your fashion journey with us today.
          </p>
          <Link to={"/newarrivals"} className="bg-primary g text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl">
            Shop Now
          </Link>
        </div>

      </div>
    </Layout>
  );
};

export default About;