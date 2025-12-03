'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText,
  Search,
  Mail,
  Users,
  Target,
  Award,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Clock,
  Star
} from 'lucide-react';

const FeaturesShowcaseStep = ({ onComplete, userInfo }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [hasViewed, setHasViewed] = useState(new Set());
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const features = [
    {
      id: 'ats-optimizer',
      title: 'AI-Powered ATS Optimization',
      subtitle: 'Get Past the Robots',
      description: 'Our advanced AI analyzes your resume against 100+ ATS systems to ensure it gets seen by human recruiters.',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        '95% ATS compatibility rate',
        'Keyword optimization for each job',
        'Format optimization for all systems',
        'Real-time ATS score feedback'
      ],
      demo: {
        type: 'score',
        before: 34,
        after: 87,
        label: 'ATS Score'
      },
      impact: 'Increases interview calls by 340%'
    },
    {
      id: 'hr-directory',
      title: '1,000+ HR Directory Access',
      subtitle: 'Direct Line to Decision Makers',
      description: 'Skip the black hole of job applications. Connect directly with hiring managers and HR professionals.',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'Verified HR contacts across industries',
        'LinkedIn profiles and direct emails',
        'Company insights and hiring patterns',
        'Updated weekly with new contacts'
      ],
      demo: {
        type: 'contacts',
        count: 1247,
        companies: ['Google', 'Microsoft', 'Meta', 'Amazon', 'Apple']
      },
      impact: 'Reduces job search time by 60%'
    },
    {
      id: 'email-templates',
      title: 'Proven Email Templates',
      subtitle: 'Messages That Get Responses',
      description: 'Access our library of cold email templates with 75% response rate from real hiring managers.',
      icon: Mail,
      color: 'from-green-500 to-emerald-500',
      benefits: [
        '50+ proven email templates',
        '75% average response rate',
        'Industry-specific variations',
        'Personalization guidelines'
      ],
      demo: {
        type: 'response-rate',
        rate: 75,
        templates: 52
      },
      impact: 'Gets you noticed 3x faster'
    },
    {
      id: 'career-coaching',
      title: 'Expert Career Guidance',
      subtitle: 'Professional Support When You Need It',
      description: 'Get personalized advice from career experts who have helped thousands land their dream jobs.',
      icon: Target,
      color: 'from-orange-500 to-red-500',
      benefits: [
        'Personalized career strategy',
        'Interview preparation guidance',
        'Salary negotiation tips',
        'Industry insights and trends'
      ],
      demo: {
        type: 'success-stories',
        hired: 2847,
        salaryIncrease: 45
      },
      impact: 'Average 45% salary increase'
    }
  ];

  // Auto-advance features
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, features.length]);

  // Track viewed features
  useEffect(() => {
    setHasViewed(prev => new Set([...prev, currentFeature]));
  }, [currentFeature]);

  const allFeaturesViewed = hasViewed.size >= features.length;

  const handleFeatureSelect = (index) => {
    setCurrentFeature(index);
    setIsAutoPlaying(false);
  };

  const handleComplete = () => {
    onComplete({ featuresViewed: Array.from(hasViewed) });
  };

  const currentFeatureData = features[currentFeature];

  const renderDemo = (demo) => {
    switch (demo.type) {
      case 'score':
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">Resume ATS Analysis</h4>
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500 mb-1">{demo.before}%</div>
                <div className="text-xs text-gray-600">Before</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">{demo.after}%</div>
                <div className="text-xs text-gray-600">After</div>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-red-100 to-green-100 h-2 rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-green-500 rounded-full"
                initial={{ width: `${demo.before}%` }}
                animate={{ width: `${demo.after}%` }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            </div>
          </div>
        );

      case 'contacts':
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">HR Directory Access</h4>
            <div className="text-center mb-4">
              <motion.div
                className="text-3xl font-bold text-purple-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 1 }}
              >
                {demo.count.toLocaleString()}+
              </motion.div>
              <div className="text-sm text-gray-600">Verified HR Contacts</div>
            </div>
            <div className="space-y-2">
              {demo.companies.slice(0, 3).map((company, index) => (
                <motion.div
                  key={company}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center justify-between text-sm bg-gray-50 rounded p-2"
                >
                  <span className="font-medium">{company}</span>
                  <span className="text-green-600">✓ Available</span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'response-rate':
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">Email Success Rate</h4>
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-green-600 mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 1 }}
              >
                {demo.rate}%
              </motion.div>
              <div className="text-sm text-gray-600 mb-4">Average Response Rate</div>
              <div className="bg-gray-200 rounded-full h-3">
                <motion.div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${demo.rate}%` }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {demo.templates} proven templates available
              </div>
            </div>
          </div>
        );

      case 'success-stories':
        return (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-4 text-center">Success Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <motion.div
                  className="text-2xl font-bold text-blue-600 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 1 }}
                >
                  {demo.hired.toLocaleString()}+
                </motion.div>
                <div className="text-xs text-gray-600">People Hired</div>
              </div>
              <div className="text-center">
                <motion.div
                  className="text-2xl font-bold text-orange-600 mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 1, delay: 0.3 }}
                >
                  +{demo.salaryIncrease}%
                </motion.div>
                <div className="text-xs text-gray-600">Salary Increase</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1 }}
            className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Career Transformation
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Starts Here
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {userInfo?.fullName ? `Hi ${userInfo.fullName.split(' ')[0]}, ` : 'See '}
            how HireLift's powerful features will accelerate your journey to {userInfo?.targetRole || 'your dream job'}
          </p>
        </motion.div>

        {/* Feature showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature content */}
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="text-white"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${currentFeatureData.color} flex items-center justify-center mb-6`}>
              <currentFeatureData.icon className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-2">{currentFeatureData.title}</h2>
            <h3 className="text-xl text-blue-300 mb-4">{currentFeatureData.subtitle}</h3>
            <p className="text-gray-300 text-lg mb-6">{currentFeatureData.description}</p>
            
            {/* Benefits list */}
            <div className="space-y-3 mb-6">
              {currentFeatureData.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-200">{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Impact statement */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${currentFeatureData.color} rounded-full text-white font-semibold`}
            >
              <TrendingUp className="w-4 h-4" />
              {currentFeatureData.impact}
            </motion.div>
          </motion.div>

          {/* Feature demo */}
          <motion.div
            key={`demo-${currentFeature}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {renderDemo(currentFeatureData.demo)}
            
            {/* Floating elements for visual appeal */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Star className="w-4 h-4 text-yellow-900" />
            </motion.div>
          </motion.div>
        </div>

        {/* Feature navigation */}
        <div className="mt-12">
          <div className="flex justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <button
                key={feature.id}
                onClick={() => handleFeatureSelect(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentFeature
                    ? 'bg-white scale-125'
                    : hasViewed.has(index)
                    ? 'bg-blue-400'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Progress indicator */}
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">
              {hasViewed.size} of {features.length} features explored
            </p>
          </div>

          {/* Continue button */}
          <div className="text-center">
            <motion.button
              onClick={handleComplete}
              disabled={!allFeaturesViewed}
              className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center gap-3 mx-auto ${
                allFeaturesViewed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={allFeaturesViewed ? { scale: 1.05 } : {}}
              whileTap={allFeaturesViewed ? { scale: 0.95 } : {}}
            >
              {allFeaturesViewed ? (
                <>
                  <span>Experience Your Free Resume Review</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Clock className="w-5 h-5" />
                  <span>Explore all features to continue</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Auto-play toggle */}
          <div className="text-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {isAutoPlaying ? 'Pause auto-advance' : 'Resume auto-advance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesShowcaseStep;