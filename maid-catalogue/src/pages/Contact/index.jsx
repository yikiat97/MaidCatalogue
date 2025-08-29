import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Alert } from '../../components/ui/alert';
import Card from '../../components/ui/Card';
import { useAnimation } from '../../hooks/useAnimation';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    urgency: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { elementRef: titleRef, isVisible: isTitleVisible } = useAnimation(0.3);
  const { elementRef: formRef, isVisible: isFormVisible } = useAnimation(0.2);
  const { elementRef: infoRef, isVisible: isInfoVisible } = useAnimation(0.1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      urgency: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setShowAlert(true);
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        urgency: ''
      });
      
      // Hide alert after 5 seconds
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }, 1000);
  };


  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        {/* Contact Hero Section - Two Column Layout */}
        <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-blue-50">
          <div className="max-w-[1440px] w-full px-4 mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Left Column - Contact Information */}
              <div 
                ref={titleRef}
                className={`transition-all duration-1000 ease-out ${
                  isTitleVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-inter font-extrabold leading-tight mb-6">
                    <span className="text-gray-900">Get In </span>
                    <span className="text-[#ff690d]">Touch</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg">
                    Connect with our experienced team. We're here to help you find the perfect domestic helper for your family's needs.
                  </p>
                </div>

                {/* Contact Cards - Enhanced Design */}
                <div className="space-y-6 mb-8">
                  {/* Email Card */}
                  <Card variant="elevated" className="p-6 border-l-4 border-l-[#ff690d] bg-gradient-to-r from-white to-orange-50/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">📧</div>
                      <div>
                        <h3 className="text-lg font-inter font-bold text-gray-900">Email</h3>
                        <p className="text-[#ff690d] font-semibold text-xl">hello@easyhire.sg</p>
                        <p className="text-sm text-gray-600">We respond within 24 hours</p>
                      </div>
                    </div>
                  </Card>

                  {/* Office Hours Card */}
                  <Card variant="elevated" className="p-6 border-l-4 border-l-[#ff690d] bg-gradient-to-r from-white to-orange-50/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">🕒</div>
                      <div>
                        <h3 className="text-lg font-inter font-bold text-gray-900">Office Hours</h3>
                        <p className="text-[#ff690d] font-semibold text-lg">Mon - Fri: 9AM - 6PM</p>
                        <p className="text-sm text-gray-600">Saturday: 9AM - 1PM</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* WhatsApp Button */}
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg font-semibold flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    onClick={() => window.open('https://wa.me/6591234567', '_blank')}
                  >
                    <span className="text-2xl">💬</span>
                    <span>WhatsApp Us Now</span>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      💡 <span className="font-medium">Quick response guaranteed!</span> Get instant help via WhatsApp
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Team Photos */}
              <div 
                ref={infoRef}
                className={`transition-all duration-500 ease-out ${
                  isInfoVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                }`}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-inter font-extrabold leading-tight mb-6">
                    <span className="text-gray-900">Our </span>
                    <span className="text-[#ff690d]">Team</span>
                  </h2>
                  <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto">
                    Dedicated professionals ready to help you.
                  </p>
                </div>

                {/* Team Photo Display */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <img 
                    src="/images/all-staff.PNG" 
                    alt="EasyHire Team"
                    className="w-full h-auto rounded-lg"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                  
                  <div className="mt-4 text-center">
                    <p className="text-gray-600 font-medium">
                      Your Trusted EasyHire Team
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Experienced professionals since 2018
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Form and Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-[1440px] w-full mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div 
                ref={formRef}
                className={`transition-all duration-1000 ease-out ${
                  isFormVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <Card variant="elevated" className="p-6 lg:p-8 h-full">
                  <h2 className="text-2xl sm:text-3xl font-inter font-bold text-gray-900 mb-6">
                    Send us a Message
                  </h2>

                  {showAlert && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                      <div className="flex items-center">
                        <span className="mr-2">✓</span>
                        Thank you for your message! We'll get back to you within 24 hours.
                      </div>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="border-gray-200 focus:border-gray-400 focus:ring-0"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="How can we help you?"
                          className="border-gray-200 focus:border-gray-400 focus:ring-0"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select value={formData.urgency} onValueChange={handleSelectChange}>
                          <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-0">
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - General inquiry</SelectItem>
                            <SelectItem value="medium">Medium - Within 3 days</SelectItem>
                            <SelectItem value="high">High - Within 24 hours</SelectItem>
                            <SelectItem value="urgent">Urgent - Same day</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide details about your inquiry, including any specific requirements or preferences..."
                        rows={8}
                        className="border-gray-200 focus:border-gray-400 focus:ring-0 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>

                    <p className="text-sm text-gray-600 text-center">
                      We typically respond within 2-4 hours during business hours.
                    </p>
                  </form>
                </Card>
              </div>

              {/* Office Information & Map */}
              <div className="h-full flex flex-col space-y-8">
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h3 className="text-xl font-inter font-bold text-gray-900 mb-4">
                    Visit Our Office
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Address</h4>
                      <p className="text-gray-700">
                        123 Orchard Road<br />
                        #12-34 Plaza Singapura<br />
                        Singapore 238123
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900">Nearest MRT</h4>
                      <p className="text-gray-700">
                        Dhoby Ghaut MRT Station (NS24/NE6/CC1)<br />
                        5 minutes walk from Exit B
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900">Parking</h4>
                      <p className="text-gray-700">
                        Plaza Singapura has ample parking<br />
                        Validation available for consultations
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-[#ff690d] hover:bg-[#e55a0a] text-white"
                    onClick={() => window.open('https://maps.google.com/?q=Orchard+Road+Singapore', '_blank')}
                  >
                    Open in Google Maps
                  </Button>
                </Card>

                {/* Office Hours Card */}
                <Card variant="elevated" className="p-6 lg:p-8">
                  <h3 className="text-xl font-inter font-bold text-gray-900 mb-4">
                    Office Hours
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Monday - Friday</span>
                      <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Saturday</span>
                      <span className="font-semibold text-gray-900">9:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Sunday</span>
                      <span className="font-semibold text-red-600">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-[#ff690d]/10 border border-[#ff690d]/20 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Emergency Support:</strong> 24/7 hotline available for existing clients experiencing urgent situations.
                    </p>
                  </div>
                </Card>

              </div>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
};

export default ContactPage;