'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import FeedbackButton from '../../components/feedback/FeedbackButton';
import { 
  RefreshCw, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Mail,
  ArrowLeft,
  Clock,
  Shield,
  DollarSign,
  FileText,
  Heart,
  HelpCircle
} from 'lucide-react';

export default function RefundCancellationPage() {
  const [activeSection, setActiveSection] = useState('');

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }  };

  // Optimized Section component for smooth scrolling
  const Section = ({ id, icon: Icon, title, children, accent = "blue" }) => {
    const ref = useRef(null);

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

    return (      <motion.section
        ref={ref}
        id={id}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
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

  // Policy card component
  const PolicyCard = ({ icon: Icon, title, description, type = "info" }) => {
    const cardStyles = {
      info: "from-blue-50 to-indigo-50 border-blue-200",
      success: "from-green-50 to-emerald-50 border-green-200",
      warning: "from-orange-50 to-red-50 border-orange-200",
      neutral: "from-gray-50 to-slate-50 border-gray-200"
    };

    const iconStyles = {
      info: "bg-blue-100 text-blue-600",
      success: "bg-green-100 text-green-600",
      warning: "bg-orange-100 text-orange-600",
      neutral: "bg-gray-100 text-gray-600"
    };

    return (
      <motion.div
        className={`p-6 rounded-2xl border-2 bg-gradient-to-r ${cardStyles[type]} hover:scale-[1.02] transition-all duration-300`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconStyles[type]}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Timeline step component
  const TimelineStep = ({ step, title, description, isLast = false }) => (
    <motion.div
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {step}
        </div>
        {!isLast && <div className="w-px h-16 bg-gradient-to-b from-purple-300 to-blue-300 mt-2"></div>}
      </div>
      <div className="flex-1 pb-8">
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );

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
        className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <RefreshCw className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6"
          >
            Refund & Cancellation
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            We believe in transparency and fairness. Here&apos;s our honest policy on refunds and cancellations - no confusing terms, just clear information.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Heart className="w-4 h-4 text-green-500" />
            <span>Updated: July 29, 2025</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Quick Summary */}
        <Section id="summary" icon={FileText} title="Quick Summary" accent="blue">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed text-lg">
              Here&apos;s what you need to know about refunds and cancellations at HireLift:
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-3 gap-6"
            >
              <motion.div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">Cancel Anytime</h4>
                <p className="text-gray-600 text-sm">Cancel your subscription before the next billing cycle - no questions asked.</p>
              </motion.div>
              
              <motion.div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">No Refund Guarantee</h4>
                <p className="text-gray-600 text-sm">Our paid features currently do not contain any money-back guarantee.</p>
              </motion.div>
              
              <motion.div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-800 mb-2">Always Here to Help</h4>
                <p className="text-gray-600 text-sm">Questions or issues? Our support team is ready to help you out.</p>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Digital Services Policy */}
        <Section id="digital-services" icon={Shield} title="Digital Services Policy" accent="purple">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              Since HireLift provides digital services that are delivered instantly, our refund policy reflects the nature of these services:
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <PolicyCard
                icon={CheckCircle}
                title="What You Get Immediately"
                description="Resume audits, template access, and HR contact lists are available instantly once you subscribe. These are digital services that provide immediate value."
                type="success"
              />
              
              <PolicyCard
                icon={AlertTriangle}
                title="Our Honest Policy"
                description="Once you&apos;ve received and used our digital services, we generally cannot offer refunds. This is because the value has been delivered to you immediately. However, we do have exceptions..."
                type="warning"
              />
              
              <PolicyCard
                icon={Heart}
                title="We Care About Your Experience"
                description="If you&apos;re not satisfied with our service quality or encounter technical issues that prevent you from using our features, we&apos;ll work with you to find a solution that&apos;s fair for everyone."
                type="info"
              />
            </motion.div>
          </div>
        </Section>

        {/* Cancellation Process */}
        <Section id="cancellation" icon={XCircle} title="How to Cancel Your Subscription" accent="green">
          <div className="space-y-8">
            <p className="text-gray-600 leading-relaxed">
              Canceling your HireLift subscription is straightforward. You can cancel anytime before your next billing cycle:
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <TimelineStep
                step="1"
                title="Go to Your Dashboard"
                description="Log in to your HireLift account and navigate to your dashboard settings."
              />
              
              <TimelineStep
                step="2"
                title="Find Subscription Settings"
                description="Look for &apos;Subscription&apos; or &apos;Billing&apos; in your account settings menu."
              />
              
              <TimelineStep
                step="3"
                title="Click Cancel Subscription"
                description="Hit the cancel button and confirm your choice. Your subscription will remain active until the end of your current billing period."
              />
              
              <TimelineStep
                step="4"
                title="Confirmation Email"
                description="You&apos;ll receive an email confirming your cancellation and the date when your subscription will end."
                isLast={true}
              />
            </motion.div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What Happens After Cancellation?</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• You keep access to paid features until your billing period ends</li>
                    <li>• Your account automatically switches to the free tier</li>
                    <li>• No surprise charges or hidden fees</li>
                    <li>• You can resubscribe anytime if you change your mind</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Refund Scenarios */}
        <Section id="refund-scenarios" icon={DollarSign} title="When Refunds Are Possible" accent="indigo">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              While we don&apos;t typically refund digital services once delivered, there are specific situations where we&apos;ll gladly process a refund:
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              {/* <PolicyCard
                icon={Clock}
                title="7-Day Money-Back Guarantee"
                description="New subscribers can request a full refund within 7 days of their first payment if they're not satisfied with our service quality."
                type="success"
              /> */}
              
              <PolicyCard
                icon={AlertTriangle}
                title="Technical Issues"
                description="If technical problems prevent you from accessing or using our services for an extended period, we&apos;ll issue appropriate refunds or service credits."
                type="warning"
              />
              
              <PolicyCard
                icon={XCircle}
                title="Billing Errors"
                description="Accidental double charges, wrong plan selections, or payment processing errors will be promptly refunded once verified."
                type="info"
              />
              
              <PolicyCard
                icon={Shield}
                title="Service Unavailability"
                description="If our service is down for extended periods or we fail to deliver promised features, we&apos;ll provide proportional refunds or credits."
                type="neutral"
              />
            </motion.div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-8 h-8 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Special Circumstances?</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Every situation is unique. If you have special circumstances not covered here, please reach out to us. 
                    We&apos;re reasonable people and will work with you to find a fair solution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Refund Process */}
        <Section id="refund-process" icon={CreditCard} title="How Refunds Work" accent="orange">
          <div className="space-y-6">
            <p className="text-gray-600 leading-relaxed">
              If you qualify for a refund, here&apos;s what you can expect from our process:
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-4">Refund Timeline</h4>
                <ul className="space-y-3 text-gray-600 text-sm">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Request processed within 1-2 business days</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Refund initiated within 3-5 business days</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Money appears in your account within 5-7 business days</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                <h4 className="font-semibold text-gray-800 mb-4">What We Need</h4>
                <ul className="space-y-3 text-gray-600 text-sm">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Your account email address</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Reason for the refund request</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Any relevant details or issues faced</span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" icon={Mail} title="Need Help or Have Questions?" accent="pink">
          <div className="text-center">
            <p className="text-gray-600 leading-relaxed mb-8">
              We&apos;re here to help! If you have questions about cancellations, refunds, or need assistance with your account, don&apos;t hesitate to reach out.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-pink-50 to-purple-50 p-8 rounded-3xl border border-pink-100 max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get in Touch</h3>
              
              <motion.a
                href="mailto:hirelift01@gmail.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                hirelift01@gmail.com
              </motion.a>
              
              <p className="text-sm text-gray-500 mt-6">
                We typically respond within 24 hours and will work with you to resolve any issues fairly and quickly.
              </p>
            </motion.div>
          </div>
        </Section>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 border-t border-gray-200 mt-16"
        >
          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl mx-auto mb-6">
            This refund and cancellation policy may be updated from time to time. We&apos;ll notify you of any significant changes. 
            We believe in treating our users fairly and building long-term relationships based on trust and mutual respect.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/support" className="hover:text-gray-700 transition-colors">Support</Link>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600">Built with honesty and care by the HireLift team</span>
          </div>        </motion.div>
      </div>

      {/* Floating Feedback Button */}
      <FeedbackButton variant="floating" />
    </div>
  );
}
