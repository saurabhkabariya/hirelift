'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import { 
  FileText, 
  Shield, 
  CreditCard, 
  AlertTriangle, 
  Users, 
  XCircle,
  Scale,
  ArrowLeft,
  CheckCircle,
  Info,
  Zap,
  Building,
  Calendar,
  Target,
  UserX
} from 'lucide-react';

export default function TermsConditionsPage() {
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
      indigo: "from-indigo-500 to-indigo-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600",
      emerald: "from-emerald-500 to-emerald-600"
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
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 md:p-10">
          {children}
        </div>
      </motion.section>
    );
  };

  // Simple Service feature component
  const ServiceFeature = ({ icon: Icon, title, description }) => (
    <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:border-blue-300 transition-all duration-300">
      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>
    </div>
  );
  // Simple InfoBox component
  const InfoBox = ({ type = "info", icon: Icon, title, children }) => {
    const styles = {
      info: "from-blue-50 to-indigo-50 border-blue-200 text-blue-800",
      warning: "from-orange-50 to-red-50 border-orange-200 text-orange-800",
      success: "from-green-50 to-emerald-50 border-green-200 text-green-800",
      danger: "from-red-50 to-pink-50 border-red-200 text-red-800"
    };

    const iconColors = {
      info: "bg-blue-100 text-blue-600",
      warning: "bg-orange-100 text-orange-600",
      success: "bg-green-100 text-green-600",
      danger: "bg-red-100 text-red-600"
    };

    return (
      <div className={`p-6 rounded-2xl border-2 bg-gradient-to-r ${styles[type]} transition-all duration-300`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors[type]}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-3">{title}</h4>
            <div className="space-y-3 text-sm leading-relaxed">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass sticky top-0 z-50 backdrop-blur-lg shadow-sm border-b border-opacity-20 border-[var(--gray-300)]"
      >
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
              <motion.button
                whileHover={{ scale: 1.05, x: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-5 py-2 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white rounded-xl transition-all shadow-sm hover:shadow-md smooth btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
          >
            Terms & Conditions
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            Please read these terms carefully before using HireLift. By using our service, you agree to be bound by these terms and conditions.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Effective Date: July 29, 2025</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Introduction Section */}
        <Section id="introduction" icon={FileText} title="Introduction & Acceptance" accent="blue">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Welcome to HireLift! These Terms and Conditions (&quot;Terms&quot;) govern your use of our job support platform and services. 
              By accessing or using HireLift, you agree to comply with and be bound by these terms.
            </p>
            
            <InfoBox type="info" icon={Info} title="Agreement to Terms">
              <p>By creating an account, accessing our website, or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
              <p>If you do not agree with any part of these terms, you must not use our services.</p>
            </InfoBox>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6 mt-8"
            >
              <motion.div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                <CheckCircle className="w-8 h-8 text-green-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">Acceptance Required</h4>
                <p className="text-gray-600 text-sm">You must agree to these terms to use HireLift services.</p>
              </motion.div>
              
              <motion.div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <Calendar className="w-8 h-8 text-blue-600 mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">Regular Updates</h4>
                <p className="text-gray-600 text-sm">We may update these terms periodically with advance notice.</p>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Service Description Section */}
        <Section id="services" icon={Zap} title="Our Services" accent="purple">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              HireLift provides comprehensive job search support tools designed to help you optimize your job applications and improve your chances of landing interviews.
            </p>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-4"
            >
              <ServiceFeature
                icon={FileText}
                title="Resume Audit & Analysis"
                description="AI-powered analysis of your resume content, formatting, and ATS compatibility with personalized improvement suggestions."
              />
              
              {/* <ServiceFeature
                icon={Users}
                title="LinkedIn Profile Optimization"
                description="Comprehensive review of your LinkedIn profile with recommendations for better visibility and engagement."
              /> */}
              
              <ServiceFeature
                icon={Building}
                title="HR Contact Lists"
                description="Access to curated lists of HR professionals and recruiters across various industries and companies."
              />
              
              <ServiceFeature
                icon={Target}
                title="Outreach Templates"
                description="Professional email and LinkedIn message templates customized for different roles and industries."
              />
              
              <ServiceFeature
                icon={Shield}
                title="ATS Scoring"
                description="Applicant Tracking System compatibility scoring to help your resume pass initial screening filters."
              />
            </motion.div>
          </div>
        </Section>

        {/* Payment Terms Section */}
        <Section id="payment" icon={CreditCard} title="Payment Terms" accent="green">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              HireLift operates on a freemium model with both free and paid subscription tiers. Here are our payment terms:
            </p>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <InfoBox type="success" icon={CheckCircle} title="Subscription Model">
                <p><strong>Free Tier:</strong> Limited access to basic resume audit and templates.</p>
                <p><strong>Pro Tier:</strong> ₹99/month - Unlimited audits, premium templates, and HR contact lists.</p>
                <p><strong>AI Assistant:</strong> ₹499/month - Advanced AI features (coming soon).</p>
              </InfoBox>
              
              <motion.div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Payment Processing</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• All payments processed securely through trusted payment gateways</li>
                    <li>• Subscription charges are billed monthly in advance</li>
                    <li>• Indian Rupees (₹) is our primary currency</li>
                    <li>• All prices include applicable taxes</li>
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Refund Policy</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {/* <li>• 7-day money-back guarantee for new subscribers</li> */}
                    <li>• No refunds for partial month usage</li>
                    {/* <li>• Refunds processed within 5-7 business days</li> */}
                    <li>• Free tier users are not eligible for refunds</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Job Placement Disclaimer */}
        <Section id="disclaimer" icon={AlertTriangle} title="Important Disclaimers" accent="orange">
          <div className="space-y-6">
            <InfoBox type="warning" icon={AlertTriangle} title="No Job Guarantee">
              <p><strong>HireLift does not guarantee job placement or interview calls.</strong></p>
              <p>Our services are designed to improve your job application materials and provide you with better tools and strategies. However, securing employment depends on many factors including market conditions, your qualifications, competition, and employer decisions.</p>
              <p>We provide guidance and optimization tools, but success in your job search ultimately depends on your effort, qualifications, and market factors beyond our control.</p>
            </InfoBox>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-200">
                <h4 className="font-semibold text-gray-800 mb-3">Service Limitations</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Results may vary based on individual circumstances</li>
                  <li>• Market conditions affect job availability</li>
                  <li>• We cannot control employer hiring decisions</li>
                  <li>• Success depends on user effort and implementation</li>
                </ul>
              </motion.div>
              
              <motion.div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                <h4 className="font-semibold text-gray-800 mb-3">Best Efforts</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• We provide industry-best practices and guidance</li>
                  <li>• Our tools are based on current market research</li>
                  <li>• We continuously improve our recommendations</li>
                  <li>• Support team available for guidance</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* User Responsibilities Section */}
        <Section id="responsibilities" icon={Users} title="User Responsibilities" accent="indigo">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              As a HireLift user, you have certain responsibilities to ensure the platform works effectively for everyone.
            </p>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <InfoBox type="info" icon={Shield} title="Acceptable Use">
                <p>You agree to use HireLift services only for legitimate job search and career development purposes.</p>
                <p>Prohibited activities include spamming, sharing account credentials, reverse engineering our platform, or using our services for any illegal or harmful activities.</p>
              </InfoBox>
              
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <h4 className="font-semibold text-gray-800 mb-3">✅ Allowed Activities</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Using templates for legitimate job applications</li>
                    <li>• Sharing general tips (not account access)</li>
                    <li>• Providing feedback to improve our service</li>
                    <li>• Using HR contacts for professional outreach</li>
                  </ul>
                </motion.div>
                
                <motion.div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                  <h4 className="font-semibold text-gray-800 mb-3">❌ Prohibited Activities</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Sharing account login credentials</li>
                    <li>• Spam or harassment using our templates</li>
                    <li>• Scraping or copying our database</li>
                    <li>• Using service for fraudulent applications</li>
                  </ul>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Termination Section */}
        <Section id="termination" icon={XCircle} title="Account Termination" accent="red">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Either party may terminate the service relationship under certain conditions. Here&apos;s how termination works:
            </p>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h4 className="font-semibold text-gray-800 mb-3">User-Initiated Termination</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Cancel subscription anytime from your dashboard</li>
                    <li>• Access continues until end of billing period</li>
                    <li>• Account deletion available upon request</li>
                    <li>• Data export available before deletion</li>
                  </ul>
                </motion.div>
                
                <motion.div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-200">
                  <h4 className="font-semibold text-gray-800 mb-3">HireLift-Initiated Termination</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Violation of terms and conditions</li>
                    <li>• Suspicious or fraudulent activity</li>
                    <li>• Non-payment of subscription fees</li>
                    <li>• Abuse of platform or other users</li>
                  </ul>
                </motion.div>
              </div>
              
              <InfoBox type="warning" icon={UserX} title="Termination Process">
                <p>We reserve the right to suspend or terminate accounts that violate these terms, but we&apos;ll provide notice when possible and work with users to resolve issues.</p>
                <p>Upon termination, your access to paid features will end immediately, though you may retain access to free features unless your account is completely banned.</p>
              </InfoBox>
            </motion.div>
          </div>
        </Section>

        {/* Governing Law Section */}
        <Section id="governing-law" icon={Scale} title="Governing Law" accent="emerald">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or your use of HireLift will be resolved under Indian jurisdiction.
            </p>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                <h4 className="font-semibold text-gray-800 mb-3">Jurisdiction</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Indian laws and regulations apply</li>
                  <li>• Disputes resolved in Indian courts</li>
                  <li>• Compliance with Indian data protection laws</li>
                  <li>• Tax obligations as per Indian regulations</li>
                </ul>
              </motion.div>
              
              <motion.div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-3">Dispute Resolution</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• First attempt resolution through support</li>
                  <li>• Mediation preferred over litigation</li>
                  <li>• Arbitration clause for major disputes</li>
                  <li>• Delhi courts have exclusive jurisdiction</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" icon={Info} title="Questions About These Terms?" accent="pink">
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed mb-8">
              If you have any questions about these Terms and Conditions or need clarification on any point, please don&apos;t hesitate to reach out to our team.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl border border-pink-100 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Info className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">Need Help?</h3>
              
              <motion.a
                href="mailto:legal@hirelift.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Info className="w-4 h-4" />
                legal@hirelift.com
              </motion.a>
              
              <p className="text-sm text-gray-500 mt-4">
                We&apos;re here to help clarify any terms
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 border-t border-gray-200 mt-16"
        >
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
            These Terms and Conditions may be updated from time to time to reflect changes in our services or legal requirements. 
            We&apos;ll notify you of any significant changes via email or through our platform. Continued use of HireLift after such changes constitutes acceptance of the updated terms.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/support" className="hover:text-gray-700 transition-colors">Support</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-gray-700 transition-colors">Contact</Link>
          </div>        </motion.div>
      </div>

      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}
