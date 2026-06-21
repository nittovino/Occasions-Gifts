import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CookiePolicyPage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2a4a] font-sans">
      <Helmet>
        <title>Cookie Policy - Occasions Gifts</title>
        <meta name="description" content="Learn how Occasions Gifts uses cookies to improve your browsing experience." />
      </Helmet>

      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-4 text-center">
            Cookie Policy
          </h1>
          <p className="text-center text-gray-500 mb-10">Last Updated: {currentDate}</p>

          <div className="bg-[#F9FAFB] p-6 rounded-xl mb-10 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-[#D4AF37]">
              <li><a href="#introduction" className="hover:underline">1. Introduction</a></li>
              <li><a href="#what-are-cookies" className="hover:underline">2. What Are Cookies?</a></li>
              <li><a href="#types-of-cookies" className="hover:underline">3. Types of Cookies We Use</a></li>
              <li><a href="#managing-cookies" className="hover:underline">4. Managing Cookies</a></li>
              <li><a href="#third-party-cookies" className="hover:underline">5. Third-Party Cookies</a></li>
              <li><a href="#contact" className="hover:underline">6. Contact Us</a></li>
            </ul>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section id="introduction">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">1. Introduction</h2>
              <p>
                This Cookie Policy explains how Occasions Gifts uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are, why we use them, and your rights to control our use of them.
              </p>
            </section>

            <section id="what-are-cookies">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">2. What Are Cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p className="mt-2">
                Cookies set by the website owner (in this case, Occasions Gifts) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies".
              </p>
            </section>

            <section id="types-of-cookies">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">3. Types of Cookies We Use</h2>
              <ul className="space-y-4">
                <li>
                  <strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as accessing secure areas and maintaining your shopping cart.
                </li>
                <li>
                  <strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization, such as remembering your language preferences or region.
                </li>
                <li>
                  <strong>Analytical Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed, and in some cases selecting advertisements that are based on your interests.
                </li>
              </ul>
            </section>

            <section id="managing-cookies">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">4. Managing Cookies</h2>
              <p>
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in your browser. Most web browsers allow you to control cookies through their settings preferences.
              </p>
              <p className="mt-2">
                If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. As the means by which you can refuse cookies through your web browser controls vary from browser-to-browser, you should visit your browser's help menu for more information.
              </p>
            </section>

            <section id="third-party-cookies">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">5. Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements on and through the service, and so on. We do not control the setting of these cookies, so we suggest you check the third-party websites for more information about their cookies and how to manage them.
              </p>
            </section>

            <section id="contact">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please email us at:
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

export default CookiePolicyPage;