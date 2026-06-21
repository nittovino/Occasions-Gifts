import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowRight, CheckCircle, Heart, Star, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2a4a] font-sans">
      <Helmet>
        <title>About Us - Occasions Gifts</title>
        <meta name="description" content="Learn about Occasions Gifts, our mission, values, and the team behind the premium gift delivery service." />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#FEF3C7] py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-6">
              About Occasions Gifts
            </h1>
            <p className="text-xl text-[#1a2a4a] leading-relaxed">
              Premium gift delivery service for every occasion. Connecting loved ones across distances with thoughtful, high-quality gifts.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-6 text-lg leading-relaxed">
            <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-8 text-center">Our Story</h2>
            <p>
              Founded in 2020, Occasions Gifts began with a simple yet powerful idea: to make it easier for the diaspora to stay connected with their roots, families, and friends back home. We recognized the challenges of sending high-quality, meaningful gifts across borders and set out to bridge that gap with a reliable, premium service.
            </p>
            <p>
              Our mission is to deliver joy and foster connections through thoughtfully curated gifts. Whether it's a birthday, anniversary, cultural holiday, or a moment of sympathy, we believe that distance should never prevent you from showing you care.
            </p>
            <p>
              Over the years, we've partnered with the finest local florists, bakers, and artisans in Albania, Kosovo, and North Macedonia to ensure that every item delivered meets our rigorous standards. We handle the logistics so you can focus on the sentiment.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-[#F9FAFB] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-12 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
                <Star className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Quality</h3>
                <p className="text-gray-600">We source only the finest products to ensure your gifts leave a lasting impression.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
                <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Reliability</h3>
                <p className="text-gray-600">You can count on us for timely, secure, and accurate deliveries every single time.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
                <Heart className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Customer Focus</h3>
                <p className="text-gray-600">Your satisfaction and the joy of the recipient are at the heart of everything we do.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
                <Users className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Innovation</h3>
                <p className="text-gray-600">We continually improve our platform and services to offer the best gifting experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-10 text-center">Why Choose Occasions Gifts</h2>
            <ul className="space-y-6">
              {[
                "Fast Delivery: Same-day and next-day options available for most locations.",
                "Premium Selection: Handpicked flowers, gourmet cakes, and artisan gifts.",
                "Personalization: Add custom messages and choose specific delivery windows.",
                "Secure Payment: Enterprise-grade encryption for all your transactions.",
                "24/7 Support: Our dedicated team is always here to assist you with your orders."
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-[#D4AF37] mr-4 flex-shrink-0 mt-1" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-[#F9FAFB] py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-6">Our Team</h2>
            <p className="text-lg leading-relaxed text-gray-700">
              Behind Occasions Gifts is a passionate team of logistics experts, customer care specialists, and technology enthusiasts. We work tirelessly across multiple time zones to ensure our platform runs smoothly and your gifts are delivered perfectly. Together with our network of local vendor partners, we make the magic happen.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-8">Ready to send a smile?</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/browse">
              <Button size="lg" className="bg-[#D4AF37] hover:bg-[#B48E2D] text-white font-bold px-8 py-6 rounded-full w-full sm:w-auto">
                Shop Products <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact-us">
              <Button size="lg" variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#FEF3C7] font-bold px-8 py-6 rounded-full w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default AboutUsPage;