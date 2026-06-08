import Layout from "../Shared/Layout/Layout";
import { Link } from "react-router-dom";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">{title}</h2>
    <div className="text-gray-600 leading-7 space-y-3">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="bg-primary text-white py-16 px-6 text-center">
          <h1 className="text-4xl font-bold font-serif italic mb-3">Privacy Policy</h1>
          <p className="text-gray-300 text-sm">Last updated: June 2025</p>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">

          <Section title="1. Introduction">
            <p>
              Welcome to <strong>Granduer</strong>. We are committed to protecting your personal
              information and your right to privacy. This Privacy Policy explains how we collect,
              use, and safeguard your information when you visit our website and make purchases.
            </p>
            <p>
              If you have any questions, please contact us at{" "}
              <a href="mailto:afrikannapride@gmail.com" className="text-primary underline">
                afrikannapride@gmail.com
              </a>.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>We collect information you provide directly when you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Create an account (name, email address, phone number, delivery address)</li>
              <li>Place an order (billing details, items purchased)</li>
              <li>Contact us for support</li>
              <li>Subscribe to our newsletter</li>
            </ul>
            <p>
              We also automatically collect certain technical information when you visit our site,
              including your IP address, browser type, device type, and pages visited.
            </p>
          </Section>

          <Section title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Verify your email address and authenticate your account</li>
              <li>Respond to your questions and provide customer support</li>
              <li>Send promotional emails (only if you opt in)</li>
              <li>Improve our website and product offerings</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </Section>

          <Section title="4. Payment Information">
            <p>
              All payments are processed securely through our third-party payment provider
              (Flutterwave). We do <strong>not</strong> store your card number, CVV, or any
              sensitive payment details on our servers. Payment transactions are encrypted and
              handled entirely by the payment gateway.
            </p>
          </Section>

          <Section title="5. Sharing Your Information">
            <p>We do not sell or rent your personal information. We may share it with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Payment processors</strong> — to complete your transactions securely
              </li>
              <li>
                <strong>Delivery partners</strong> — to ship your orders to you
              </li>
              <li>
                <strong>Legal authorities</strong> — when required by law or to protect our rights
              </li>
            </ul>
          </Section>

          <Section title="6. Data Storage & Security">
            <p>
              Your data is stored on secure servers. We use industry-standard measures including
              HTTPS encryption and JWT-based authentication to protect your account. However, no
              method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
            <p>
              We retain your personal data for as long as your account is active or as needed to
              provide services. You may request deletion at any time.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Our website uses browser storage (localStorage and sessionStorage) to keep you
              logged in and remember your cart between sessions. We do not use third-party
              tracking cookies for advertising purposes.
            </p>
          </Section>

          <Section title="8. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of marketing emails at any time</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:afrikannapride@gmail.com" className="text-primary underline">
                afrikannapride@gmail.com
              </a>.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              Our services are not directed to children under the age of 13. We do not knowingly
              collect personal information from children. If you believe a child has provided us
              with personal data, please contact us and we will delete it immediately.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the
              "Last updated" date at the top of this page. We encourage you to review this policy
              periodically.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>If you have any questions about this Privacy Policy, please reach out:</p>
            <ul className="list-none space-y-1">
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:afrikannapride@gmail.com" className="text-primary underline">
                  afrikannapride@gmail.com
                </a>
              </li>
              <li><strong>Phone:</strong> +2348166598665</li>
            </ul>
          </Section>

          <div className="mt-10 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/"
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition"
            >
              Back to Shopping
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
