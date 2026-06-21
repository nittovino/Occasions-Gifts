import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicyPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2a4a] font-sans">
      <Helmet>
        <title>Privacy Policy - Occasions Gifts</title>
        <meta name="description" content="Read our Privacy Policy to understand how Occasions Gifts collects, uses, and protects your data in compliance with GDPR." />
      </Helmet>

      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-4 text-center">
            Privacy Policy
          </h1>
          <p className="text-center text-gray-500 mb-10">Last Updated: {currentDate}</p>

          <div className="bg-[#F9FAFB] p-6 rounded-xl mb-10 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-[#D4AF37]">
              <li><a href="#introduction" className="hover:underline">1. Introduction</a></li>
              <li><a href="#collection" className="hover:underline">2. Information We Collect</a></li>
              <li><a href="#usage" className="hover:underline">3. How We Use Your Information</a></li>
              <li><a href="#protection" className="hover:underline">4. Data Protection</a></li>
              <li><a href="#cookies" className="hover:underline">5. Cookies</a></li>
              <li><a href="#third-party" className="hover:underline">6. Third-Party Services</a></li>
              <li><a href="#rights" className="hover:underline">7. Your Rights</a></li>
              <li><a href="#contact" className="hover:underline">8. Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section id="introduction">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">1. Introduction</h2>
              <p>
                At Occasions Gifts, we take your privacy seriously. This Privacy Policy outlines how we collect, use, and safeguard your personal data in compliance with the General Data Protection Regulation (GDPR) and other applicable privacy laws.
              </p>
            </section>

            <section id="collection">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">2. Information We Collect</h2>
              <p className="mb-2">We collect the following types of information when you use our platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Personal Identification Data:</strong> Name, email address, phone number, and physical address provided during account creation or checkout.</li>
                <li><strong>Recipient Data:</strong> Information about the person receiving the gift, which is strictly used for delivery purposes.</li>
                <li><strong>Payment Data:</strong> We do not store your full credit card information. Payments are securely processed through our third-party payment providers.</li>
                <li><strong>Technical Data:</strong> IP addresses, browser types, device information, and interactions with our website.</li>
              </ul>
            </section>

            <section id="usage">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and fulfill your orders accurately and efficiently.</li>
                <li>To communicate with you regarding your order status, account updates, and support inquiries.</li>
                <li>To improve our website functionality, service offerings, and overall user experience.</li>
                <li>To send marketing communications, provided you have explicitly opted in to receive them.</li>
                <li>To comply with legal obligations and prevent fraudulent activities.</li>
              </ul>
            </section>

            <section id="protection">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">4. Data Protection</h2>
              <p>
                We implement robust security measures, including encryption and secure server protocols, to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Access to your personal data is restricted to authorized personnel who require it to perform their duties.
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">5. Cookies</h2>
              <p>
                Our website uses cookies to enhance your browsing experience and analyze site traffic. For detailed information on the types of cookies we use and how to manage your preferences, please review our <Link to="/cookie-policy" className="text-[#D4AF37] hover:underline">Cookie Policy</Link>.
              </p>
            </section>

            <section id="third-party">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">6. Third-Party Services</h2>
              <p className="mb-2">We utilize trusted third-party services to facilitate our operations. These include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Supabase:</strong> For secure database management and user authentication.</li>
                <li><strong>Stripe:</strong> For secure payment processing.</li>
                <li><strong>Resend:</strong> For transactional and marketing email delivery.</li>
              </ul>
              <p className="mt-2">These third parties are bound by strict data processing agreements and are not authorized to use your personal data for their own purposes.</p>
            </section>

            <section id="rights">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">7. Your Rights</h2>
              <p className="mb-2">Under the GDPR, you possess the following rights regarding your personal data:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Access:</strong> You can request a copy of the personal data we hold about you.</li>
                <li><strong>Right to Rectification:</strong> You have the right to request corrections to any inaccurate or incomplete data.</li>
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> You may request the deletion of your personal data, subject to certain legal conditions.</li>
                <li><strong>Right to Restrict Processing:</strong> You can request limitations on how we process your data.</li>
                <li><strong>Right to Data Portability:</strong> You have the right to receive your data in a structured, commonly used format.</li>
                <li><strong>Right to Object:</strong> You can object to our processing of your data for specific purposes, such as direct marketing.</li>
              </ul>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer at:
                <br /><br />
                <a href="mailto:contact@occasions.com" className="text-[#D4AF37] font-bold hover:underline">
                  contact@occasions.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;