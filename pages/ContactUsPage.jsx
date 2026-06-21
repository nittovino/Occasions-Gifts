import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, MapPin, Clock, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const faqs = [
  {
    question: "How long does delivery take?",
    answer: "We offer same-day delivery for orders placed before 2 PM local time in major cities. Standard delivery typically takes 1-2 business days depending on the location."
  },
  {
    question: "Can I track my order?",
    answer: "Yes! Once your order is confirmed, you will receive a tracking link via email. You can also view the status in your account dashboard."
  },
  {
    question: "Do you deliver on weekends?",
    answer: "Yes, we deliver on Saturdays and Sundays in most of our service areas. Please check specific vendor availability during checkout."
  },
  {
    question: "What if the recipient isn't home?",
    answer: "Our delivery partners will attempt to contact the recipient. If they cannot be reached, the gift will be returned to the local shop for redelivery the next day."
  }
];

const ContactUsPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please check the form for errors."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate Resend API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon!",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sending Failed",
        description: "There was an error sending your message. Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1a2a4a] font-sans">
      <Helmet>
        <title>Contact Us - Occasions Gifts</title>
        <meta name="description" content="Get in touch with Occasions Gifts. We'd love to hear from you. Send us a message!" />
      </Helmet>

      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-[#FEF3C7] py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-[#1a2a4a] leading-relaxed">
              We'd love to hear from you. Send us a message!
            </p>
          </div>
        </section>

        <section className="py-16 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-6">Contact Information</h2>
            
            <div className="flex items-start space-x-4">
              <div className="bg-[#FEF3C7] p-3 rounded-full text-[#D4AF37]">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email Us</h3>
                <a href="mailto:contact@occasions.com" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                  contact@occasions.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#FEF3C7] p-3 rounded-full text-[#D4AF37]">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Call Us</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#FEF3C7] p-3 rounded-full text-[#D4AF37]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Office Address</h3>
                <p className="text-gray-600">123 Gifting Avenue<br/>Suite 400<br/>New York, NY 10001</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#FEF3C7] p-3 rounded-full text-[#D4AF37]">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                <p className="text-gray-600">Monday–Friday: 9am–6pm (EST)<br/>Saturday–Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#F9FAFB] p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#1a2a4a] mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} bg-white text-[#1a2a4a] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} bg-white text-[#1a2a4a] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300'} bg-white text-[#1a2a4a] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none`}
                  placeholder="How can we help?"
                />
                {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message <span className="text-red-500">*</span></label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className={`w-full p-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} bg-white text-[#1a2a4a] focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none resize-y`}
                  placeholder="Write your message here..."
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#D4AF37] hover:bg-[#B48E2D] text-white font-bold py-6 rounded-lg text-lg flex justify-center items-center mt-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Send Message</>
                )}
              </Button>
            </form>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-[#F9FAFB] py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#D4AF37] mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-5 font-bold text-lg flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {openFaq === index ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {openFaq === index && (
                    <div className="p-5 pt-0 text-gray-600 border-t border-gray-100 mt-2">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ContactUsPage;