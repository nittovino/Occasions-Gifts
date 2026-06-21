import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfServicePage = () => {
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2a4a] font-sans">
      <Helmet>
        <title>Terms of Service - Occasions Gifts</title>
        <meta name="description" content="Read the Terms of Service for using Occasions Gifts platform." />
      </Helmet>

      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-4 text-center">
            Terms of Service
          </h1>
          <p className="text-center text-gray-500 mb-10">Last Updated: {currentDate}</p>

          <div className="bg-[#F9FAFB] p-6 rounded-xl mb-10 border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
            <ul className="space-y-2 text-[#D4AF37]">
              <li><a href="#introduction" className="hover:underline">1. Introduction</a></li>
              <li><a href="#use-license" className="hover:underline">2. Use License</a></li>
              <li><a href="#disclaimer" className="hover:underline">3. Disclaimer</a></li>
              <li><a href="#limitations" className="hover:underline">4. Limitations of Liability</a></li>
              <li><a href="#accuracy" className="hover:underline">5. Accuracy of Materials</a></li>
              <li><a href="#links" className="hover:underline">6. Links</a></li>
              <li><a href="#modifications" className="hover:underline">7. Modifications</a></li>
              <li><a href="#governing-law" className="hover:underline">8. Governing Law</a></li>
            </ul>
          </div>

          <div className="space-y-10 text-gray-700 leading-relaxed">
            <section id="introduction">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">1. Introduction</h2>
              <p>
                By accessing the website at Occasions Gifts, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
              </p>
            </section>

            <section id="use-license">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">2. Use License</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Permission is granted to temporarily download one copy of the materials (information or software) on Occasions Gifts' website for personal, non-commercial transitory viewing only.</li>
                <li>This is the grant of a license, not a transfer of title, and under this license you may not:
                  <ul className="list-circle pl-6 mt-2 space-y-1 text-gray-600">
                    <li>modify or copy the materials;</li>
                    <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                    <li>attempt to decompile or reverse engineer any software contained on Occasions Gifts' website;</li>
                    <li>remove any copyright or other proprietary notations from the materials; or</li>
                    <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                  </ul>
                </li>
                <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Occasions Gifts at any time.</li>
              </ul>
            </section>

            <section id="disclaimer">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">3. Disclaimer</h2>
              <p>
                The materials on Occasions Gifts' website are provided on an 'as is' basis. Occasions Gifts makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section id="limitations">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">4. Limitations of Liability</h2>
              <p>
                In no event shall Occasions Gifts or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Occasions Gifts' website, even if Occasions Gifts or a Occasions Gifts authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section id="accuracy">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">5. Accuracy of Materials</h2>
              <p>
                The materials appearing on Occasions Gifts' website could include technical, typographical, or photographic errors. Occasions Gifts does not warrant that any of the materials on its website are accurate, complete or current. Occasions Gifts may make changes to the materials contained on its website at any time without notice. However Occasions Gifts does not make any commitment to update the materials.
              </p>
            </section>

            <section id="links">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">6. Links</h2>
              <p>
                Occasions Gifts has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Occasions Gifts of the site. Use of any such linked website is at the user's own risk.
              </p>
            </section>

            <section id="modifications">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">7. Modifications</h2>
              <p>
                Occasions Gifts may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section id="governing-law">
              <h2 className="text-2xl font-serif font-bold text-[#D4AF37] mb-4">8. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;