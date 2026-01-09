'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePageLoading } from '@/hooks/usePageLoading';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import { 
  ArrowLeft,
  Mail,
  Clock,
  MapPin,
  Phone,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Award,
  Zap,
  Heart,
  MessageCircle
} from 'lucide-react';

export default function ContactPage() {
  const { executeWithLoading, navigateWithLoading } = usePageLoading();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [referenceId, setReferenceId] = useState(null);
  const [errors, setErrors] = useState({});

  // Simple fade-in animation for consistent experience
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  // Simple Section component with consistent fade-in
  const Section = ({ id, icon: Icon, title, children, accent = "blue" }) => {
    const accentColors = {
      blue: "from-blue-500 to-blue-600",
      purple: "from-purple-500 to-purple-600",
      green: "from-green-500 to-green-600",
      pink: "from-pink-500 to-pink-600",
      indigo: "from-indigo-500 to-indigo-600"
    };

    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-16"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${accentColors[accent]} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl border border-white/20 dark:border-gray-700/20 shadow-xl p-8 md:p-10">
          {children}
        </div>
      </motion.section>
    );
  };

  // Simple Card component
  const Card = ({ children }) => (
    <div className="transition-transform duration-300 hover:scale-[1.02]">
      {children}
    </div>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    } else if (formData.subject.trim().length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous status
    setSubmitStatus(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    await executeWithLoading(async () => {
      setIsSubmitting(true);
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          setSubmitStatus('success');
          setReferenceId(data.referenceId);
          setFormData({ name: '', email: '', subject: '', message: '' });
          setErrors({});
          
          // Scroll to success message
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Contact form error:', error);
        setSubmitStatus('error');
      } finally {
        setIsSubmitting(false);
      }
    }, 'Sending message...');
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      content: 'hirelift01@gmail.com',
      description: 'Get support within 24 hours',
      color: 'var(--primary)'
    },
    {
      icon: Clock,
      title: 'Response Time',
      content: '< 24 Hours',
      description: 'Fast and reliable support',
      color: 'var(--secondary)'
    },
    {
      icon: Users,
      title: 'Community',
      content: 'Increasing Users',
      description: 'Join our growing community',
      color: 'var(--accent-dark)'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Zap,
      title: 'Fast Processing',
      description: 'Get instant resume analysis and feedback'
    },
    {
      icon: Award,
      title: 'Expert Guidance',
      description: 'Professional insights from industry experts'
    },
    {
      icon: Heart,
      title: 'Built with Care',
      description: 'Designed to help you succeed in your career'
    }
  ];
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50 backdrop-blur-lg shadow-sm border-b border-opacity-20 border-[var(--gray-300)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white font-bold text-xl shadow-md mr-2">
                  <span className="z-10">H</span>
                </div>
                <h1 className="text-2xl font-bold gradient-text">
                  HireLift
                </h1>
              </Link>
            </div>
            <Link href="/dashboard">
              <button className="flex items-center px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-xl transition-all shadow-sm hover:shadow-md smooth btn">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.div
        {...fadeIn}
        className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl py-2 md:text-6xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8">
            Have questions about HireLift? Need support? We&apos;re here to help you elevate your hiring process and career journey.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-red-500" />
            <span>We typically respond within 24 hours</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Contact Form Section */}
        <Section id="contact-form" icon={MessageCircle} title="Send us a Message" accent="purple">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <div className="mb-6">
                <p className="text-gray-600 leading-relaxed">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      maxLength={100}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 transition-all duration-300 ${
                        errors.name 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 transition-all duration-300 ${
                        errors.email 
                          ? 'border-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    maxLength={200}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 transition-all duration-300 ${
                      errors.subject 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="How can we help you?"
                  />
                  {errors.subject && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.subject}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    maxLength={2000}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 transition-all duration-300 resize-none ${
                      errors.message 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    }`}
                    placeholder="Tell us more about your inquiry..."
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.message.length}/2000 characters
                  </p>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </motion.button>

                {/* Submit Status */}
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${
                      submitStatus === 'success' 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {submitStatus === 'success' ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Message sent successfully!</span>
                        </div>
                        <p className="text-sm">
                          We&apos;ll get back to you within 24 hours. Please check your email for a confirmation message.
                        </p>
                        {referenceId && (
                          <p className="text-xs opacity-75">
                            Reference ID: {referenceId}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-semibold">Failed to send message</span>
                        </div>
                        <p className="text-sm">
                          {errors.submit || 'Please try again or email us directly at hirelift01@gmail.com'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </form>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${info.color}20` }}
                    >
                      <info.icon 
                        className="w-5 h-5"
                        style={{ color: info.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{info.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{info.description}</p>
                      <p 
                        className="text-lg font-bold"
                        style={{ color: info.color }}
                      >
                        {info.content}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* About HireLift Section */}
        <Section id="about" icon={Heart} title="About HireLift" accent="indigo">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              HireLift is a modern hiring platform designed to elevate your career journey. We provide AI-powered resume analysis, ATS optimization, and personalized guidance to help you land your dream job.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to bridge the gap between talented professionals and great opportunities through innovative technology and expert insights.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {features.map((feature, index) => (
                <Card key={index}>
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Quick Contact Section */}
        <Section id="quick-contact" icon={Mail} title="Need Quick Help?" accent="pink">
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed mb-8">
              For urgent inquiries or immediate assistance, you can reach us directly via email.
            </p>
            
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl border border-pink-100 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">Direct Email</h3>
              
              <a
                href="mailto:hirelift01@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                hirelift01@gmail.com
              </a>
              
              <p className="text-sm text-gray-500 mt-4">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="text-center py-12 border-t border-gray-200 mt-16">
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
            Thank you for your interest in HireLift. We&apos;re committed to helping you succeed in your career journey. 
            Your questions and feedback help us improve our platform and serve you better.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">Made with care by the HireLift team</span>
          </div>
        </div>
      </div>

      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}
