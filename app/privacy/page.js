'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import { 
  Shield, 
  Lock, 
  Eye, 
  Mail, 
  Database, 
  UserCheck, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Heart,
  Zap
} from 'lucide-react';

export default function PrivacyPolicyPage() {// Simple fade-in animation for consistent experience
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };  // Simple Section component with consistent fade-in
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
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8 md:p-10">
          {children}
        </div>
      </motion.section>
    );
  };  // Simple DataPoint component
  const DataPoint = ({ icon: Icon, title, description, collected = true }) => (
    <div
      className={`flex items-start gap-4 p-6 rounded-2xl border-2 transition-colors duration-300 ${
        collected 
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
          : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 hover:border-red-300'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        collected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 mb-2">
          {title}
        </h4>
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
        collected ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
      }`}>
        {collected ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      </div>
    </div>
  );  // Simple Card component
  const Card = ({ children }) => (
    <div className="transition-transform duration-300 hover:scale-[1.02]">
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-[var(--primary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-[var(--secondary-light)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[10%] left-[35%] w-80 h-80 bg-[var(--accent)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>      {/* Header */}
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
      </header>      {/* Hero Section */}
      <motion.div
        {...fadeIn}
        className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl py-2 md:text-6xl font-bold bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Your privacy matters to us. Here&apos;s how we protect your personal information and what we do with the data you trust us with.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-red-500" />
            <span>Last updated: July 29, 2025</span>
          </div>
        </div>
      </motion.div>{/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Data Collection Section */}
        <Section id="data-collection" icon={Database} title="What Data We Collect" accent="blue">
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed mb-6">
              We believe in transparency. Here&apos;s exactly what information we collect and what we don&apos;t touch:
            </p>
          </div>
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="grid gap-6"
          >
            <DataPoint
              icon={UserCheck}
              title="Account Information"
              description="Your name, email address, and basic profile details when you sign up. We need this to create your account and communicate with you."
              collected={true}
            />
            
            <DataPoint
              icon={Eye}
              title="Usage Analytics"
              description="How you use our platform - which features you access, when you visit, and general usage patterns. This helps us improve the service."
              collected={true}
            />
            
            {/* <DataPoint
              icon={Database}
              title="Resume Content"
              description="The content you paste or upload for auditing. We analyze this to provide feedback, but we don't store it permanently."
              collected={true}
            /> */}
            
            <DataPoint
              icon={Mail}
              title="Resume Files"
              description="We never ask you to upload actual resume files. Everything happens through text-based analysis only."
              collected={false}
            />
            
            <DataPoint
              icon={Lock}
              title="Sensitive Personal Data"
              description="We don&apos;t collect sensitive information like social security numbers, financial data, or detailed personal history."
              collected={false}
            />
          </motion.div>
        </Section>

        {/* How We Use Data Section */}
        <Section id="data-usage" icon={Zap} title="How We Use Your Data" accent="purple">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              We use your information solely to provide and improve our service. Here&apos;s how:
            </p>
              <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="font-semibold text-gray-800 mb-3">Service Delivery</h4>
                  <p className="text-gray-600">Analyze your resume to provide personalized feedback and suggestions.</p>
                </div>
              </Card>
              
              <Card>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-3">Communication</h4>
                  <p className="text-gray-600">Send you important updates, tips, and respond to your support requests.</p>
                </div>
              </Card>
              
              <Card>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                  <h4 className="font-semibold text-gray-800 mb-3">Platform Improvement</h4>
                  <p className="text-gray-600">Understand how our tools are used to make them better and more helpful.</p>
                </div>
              </Card>
              
              <Card>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
                  <h4 className="font-semibold text-gray-800 mb-3">Security</h4>
                  <p className="text-gray-600">Protect your account and prevent unauthorized access or misuse.</p>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Data Security Section */}
        <Section id="data-security" icon={Lock} title="How We Keep Your Data Safe" accent="green">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Your data security is our top priority. We implement multiple layers of protection:
            </p>
            
            <div className="space-y-4">
              <Card delay={0.1}>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Encryption</h4>
                    <p className="text-gray-600">All data is encrypted both in transit and at rest using industry-standard protocols.</p>
                  </div>
                </div>
              </Card>
              
              <Card delay={0.2}>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Secure Infrastructure</h4>
                    <p className="text-gray-600">We use trusted cloud providers with robust security measures and regular audits.</p>
                  </div>
                </div>
              </Card>
              
              <Card delay={0.3}>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Access Control</h4>
                    <p className="text-gray-600">Only authorized team members can access user data, and only when necessary for support.</p>
                  </div>
                </div>
              </Card>
              
              <Card delay={0.4}>
                <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Regular Backups</h4>
                    <p className="text-gray-600">Your data is regularly backed up to prevent loss, with secure deletion when no longer needed.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Section>

        {/* Your Rights Section */}
        <Section id="your-rights" icon={UserCheck} title="Your Rights & Control" accent="indigo">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              You have full control over your personal information. Here&apos;s what you can do:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">              <div className="space-y-4">
                <Card>
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Access Your Data</h4>
                    <p className="text-gray-600 text-sm">Request a copy of all personal information we have about you.</p>
                  </div>
                </Card>
                
                <Card>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Update Information</h4>
                    <p className="text-gray-600 text-sm">Correct or update your personal information at any time.</p>
                  </div>
                </Card>
              </div>
                <div className="space-y-4">
                <Card>
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Delete Your Data</h4>
                    <p className="text-gray-600 text-sm">Request complete deletion of your account and all associated data.</p>
                  </div>
                </Card>
                
                <Card>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <h4 className="font-semibold text-gray-800 mb-2">Export Data</h4>
                    <p className="text-gray-600 text-sm">Download your data in a portable format to use elsewhere.</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" icon={Mail} title="Privacy Questions?" accent="pink">
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed mb-8">
              Have questions about this privacy policy or how we handle your data? We&apos;re here to help and believe in complete transparency.
            </p>            <div
              className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl border border-pink-100 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get in Touch</h3>
              
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
        </Section>        {/* Footer */}
        <div className="text-center py-12 border-t border-gray-200 mt-16">
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto">
            This privacy policy may be updated from time to time. We&apos;ll notify you of any significant changes via email or through our platform. 
            Your continued use of HireLift after such modifications constitutes acceptance of the updated policy.
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
