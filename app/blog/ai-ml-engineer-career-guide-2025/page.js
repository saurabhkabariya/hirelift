'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaClock, FaUser, FaShare, FaBookmark, FaArrowLeft, FaRobot, FaBrain, FaChartLine } from 'react-icons/fa';
import RelatedArticles from '@/components/RelatedArticles';

export default function AIMLCareerGuide2025() {
  const toc = [
    { id: "market-demand", title: "AI/ML Job Market 2025" },
    { id: "top-roles", title: "Hottest AI/ML Roles" },
    { id: "salary-guide", title: "AI/ML Engineer Salaries" },
    { id: "skills-roadmap", title: "Essential Skills & Learning Path" },
    { id: "companies-hiring", title: "Top Companies Hiring" },
    { id: "portfolio-tips", title: "Building AI/ML Portfolio" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
            <FaArrowLeft className="w-4 h-4" />Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <motion.header initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">AI/ML Careers 2025</span>
            <span className="text-gray-500">Future of Tech</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            AI/ML Engineer Career Guide 2025: $150K-$350K Salaries, Skills & Job Market
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Complete guide to AI and Machine Learning engineering careers in 2025. Learn required skills, salary ranges, top companies hiring, and proven paths from beginner to AI engineer in US & UK markets.
          </p>
          
          <div className="flex items-center justify-between flex-wrap gap-4 p-6 bg-white rounded-xl border">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2"><FaUser className="w-4 h-4" />AI Career Experts</span>
              <span className="flex items-center gap-2"><FaClock className="w-4 h-4" />19 min read</span>
              <span>Dec 15, 2025</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FaShare className="w-4 h-4" />Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                <FaBookmark className="w-4 h-4" />Save
              </button>
            </div>
          </div>
        </motion.header>

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="mb-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {toc.map((item, index) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-blue-600 hover:text-blue-700 hover:underline">
                  {index + 1}. {item.title}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="prose prose-lg max-w-none">
          
          <section id="market-demand" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">AI/ML Job Market 2025</h2>
            <p className="text-gray-700 mb-6">
              AI and Machine Learning are no longer buzzwords - they're core business technologies. The 2025 job market shows explosive growth with demand for AI engineers outpacing supply by 4:1 ratio.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
                <FaRobot className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">250K+</h3>
                <p className="text-purple-100">AI/ML jobs globally (2025)</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 text-center">
                <FaBrain className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">56%</h3>
                <p className="text-blue-100">Year-over-year growth</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6 text-center">
                <FaChartLine className="w-10 h-10 mx-auto mb-3" />
                <h3 className="font-bold text-3xl mb-2">$175K</h3>
                <p className="text-green-100">Avg AI engineer salary (US)</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">🚀 Why AI/ML is the Hottest Career in 2025</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full p-2 mt-1">✓</span>
                    <div>
                      <p className="font-semibold">ChatGPT Effect</p>
                      <p className="text-sm text-indigo-100">Every company needs AI integration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full p-2 mt-1">✓</span>
                    <div>
                      <p className="font-semibold">Massive Investment</p>
                      <p className="text-sm text-indigo-100">$200B+ in AI funding (2024-2025)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full p-2 mt-1">✓</span>
                    <div>
                      <p className="font-semibold">Talent Shortage</p>
                      <p className="text-sm text-indigo-100">4 jobs for every qualified candidate</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full p-2 mt-1">✓</span>
                    <div>
                      <p className="font-semibold">Remote-Friendly</p>
                      <p className="text-sm text-indigo-100">75% of AI roles offer remote options</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full p-2 mt-1">✓</span>
                    <div>
                      <p className="font-semibold">Premium Salaries</p>
                      <p className="text-sm text-indigo-100">30-50% higher than standard SWE</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="bg-white/20 rounded-full p-2 mt-1">✓</span>
                    <div>
                      <p className="font-semibold">Future-Proof</p>
                      <p className="text-sm text-indigo-100">AI will create 97M new jobs by 2030</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="top-roles" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Hottest AI/ML Roles in 2025</h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-blue-900">1. Machine Learning Engineer</h3>
                  <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">High Demand</span>
                </div>
                <p className="text-gray-700 mb-3">Build, train, and deploy ML models in production systems.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Key Skills:</p>
                    <p className="text-sm text-gray-600">Python, TensorFlow, PyTorch, scikit-learn, MLOps, Docker</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Salary Range:</p>
                    <p className="text-sm text-blue-700">US: $140K-$250K • UK: £80K-£140K</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-purple-900">2. AI Research Engineer</h3>
                  <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">PhD Preferred</span>
                </div>
                <p className="text-gray-700 mb-3">Develop novel AI algorithms and push state-of-the-art research.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Key Skills:</p>
                    <p className="text-sm text-gray-600">Deep Learning, NLP, Computer Vision, Research, Papers</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Salary Range:</p>
                    <p className="text-sm text-purple-700">US: $160K-$350K • UK: £90K-£180K</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-green-900">3. LLM Engineer (Hot in 2025!)</h3>
                  <span className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Trending</span>
                </div>
                <p className="text-gray-700 mb-3">Build applications using Large Language Models (GPT, Claude, Llama).</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Key Skills:</p>
                    <p className="text-sm text-gray-600">OpenAI API, LangChain, Vector DB, Prompt Engineering, RAG</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Salary Range:</p>
                    <p className="text-sm text-green-700">US: $150K-$280K • UK: £85K-£150K</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl text-orange-900 mb-3">4. Computer Vision Engineer</h3>
                <p className="text-gray-700 mb-3">Build systems that understand images and videos (autonomous vehicles, AR/VR).</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Key Skills:</p>
                    <p className="text-sm text-gray-600">OpenCV, CNNs, Object Detection, Image Segmentation, YOLO</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Salary Range:</p>
                    <p className="text-sm text-orange-700">US: $145K-$260K • UK: £75K-£135K</p>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
                <h3 className="font-bold text-xl text-pink-900 mb-3">5. MLOps Engineer</h3>
                <p className="text-gray-700 mb-3">Deploy, monitor, and maintain ML models in production at scale.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Key Skills:</p>
                    <p className="text-sm text-gray-600">Kubernetes, MLflow, Kubeflow, CI/CD, AWS SageMaker, Monitoring</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 mb-1">Salary Range:</p>
                    <p className="text-sm text-pink-700">US: $135K-$220K • UK: £70K-£120K</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="salary-guide" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">AI/ML Engineer Salaries 2025</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 text-xl mb-4">🇺🇸 United States</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Junior AI/ML (0-2 yrs)</p>
                    <p className="text-2xl font-bold text-blue-600">$110K - $160K</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Mid-Level (3-5 yrs)</p>
                    <p className="text-2xl font-bold text-blue-600">$150K - $230K</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Senior (5-10 yrs)</p>
                    <p className="text-2xl font-bold text-blue-600">$200K - $350K</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Staff/Principal (10+ yrs)</p>
                    <p className="text-2xl font-bold text-blue-600">$280K - $500K+</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6">
                <h3 className="font-bold text-green-900 text-xl mb-4">🇬🇧 United Kingdom</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Junior AI/ML (0-2 yrs)</p>
                    <p className="text-2xl font-bold text-green-600">£45K - £70K</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Mid-Level (3-5 yrs)</p>
                    <p className="text-2xl font-bold text-green-600">£70K - £110K</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Senior (5-10 yrs)</p>
                    <p className="text-2xl font-bold text-green-600">£100K - £160K</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Lead/Principal (10+ yrs)</p>
                    <p className="text-2xl font-bold text-green-600">£140K - £220K</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-3">💰 Additional Compensation Factors</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Equity/RSUs:</strong> AI startups often offer 0.5-2% equity for senior engineers</li>
                <li>• <strong>Signing Bonuses:</strong> $20K-$100K common at FAANG for AI talent</li>
                <li>• <strong>Annual Bonus:</strong> 10-30% of base salary performance-based</li>
                <li>• <strong>Research Budget:</strong> $5K-$15K/year for conferences, courses, GPUs</li>
              </ul>
            </div>
          </section>

          <section id="skills-roadmap" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Essential Skills & Learning Path</h2>
            
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-6">🎓 6-Month AI/ML Engineer Roadmap</h3>
              
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3">Months 1-2: Foundations</h4>
                  <div className="space-y-2 text-purple-100">
                    <p>• <strong>Math:</strong> Linear Algebra, Calculus, Probability/Statistics</p>
                    <p>• <strong>Python:</strong> NumPy, Pandas, Matplotlib (data manipulation)</p>
                    <p>• <strong>ML Basics:</strong> Supervised/Unsupervised learning, algorithms</p>
                    <p className="text-sm mt-2">📚 Resources: Andrew Ng's ML Course, 3Blue1Brown</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3">Months 3-4: Deep Learning</h4>
                  <div className="space-y-2 text-purple-100">
                    <p>• <strong>Frameworks:</strong> TensorFlow, PyTorch (pick one to master)</p>
                    <p>• <strong>Neural Networks:</strong> CNNs, RNNs, Transformers</p>
                    <p>• <strong>Projects:</strong> Image classifier, text generator, recommendation system</p>
                    <p className="text-sm mt-2">📚 Resources: Fast.ai, Deeplearning.ai Specialization</p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur rounded-lg p-5">
                  <h4 className="font-bold text-lg mb-3">Months 5-6: Specialization & Production</h4>
                  <div className="space-y-2 text-purple-100">
                    <p>• <strong>Choose Path:</strong> NLP (LLMs), Computer Vision, or MLOps</p>
                    <p>• <strong>Production:</strong> Model deployment, APIs, Docker, cloud (AWS/GCP)</p>
                    <p>• <strong>Portfolio:</strong> 2-3 end-to-end projects with deployments</p>
                    <p className="text-sm mt-2">📚 Resources: Hugging Face, Made With ML</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="font-bold text-orange-900 mb-4">🔥 Must-Learn Technologies (2025)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-orange-800 mb-2">Core ML:</p>
                  <p className="text-sm text-gray-700">Python, PyTorch/TensorFlow, scikit-learn, XGBoost, Jupyter</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800 mb-2">LLM Stack:</p>
                  <p className="text-sm text-gray-700">OpenAI API, LangChain, Vector DBs (Pinecone, Weaviate), RAG</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800 mb-2">MLOps:</p>
                  <p className="text-sm text-gray-700">Docker, Kubernetes, MLflow, Weights & Biases, DVC</p>
                </div>
                <div>
                  <p className="font-semibold text-orange-800 mb-2">Cloud Platforms:</p>
                  <p className="text-sm text-gray-700">AWS (SageMaker), GCP (Vertex AI), Azure ML</p>
                </div>
              </div>
            </div>
          </section>

          <section id="companies-hiring" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Companies Hiring AI/ML Engineers</h2>
            
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold mb-4">🏢 FAANG+ AI Labs</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-1">OpenAI</h4>
                  <p className="text-sm text-blue-100">ChatGPT creators • $200K-$500K TC</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-1">Google DeepMind</h4>
                  <p className="text-sm text-blue-100">AlphaGo, Gemini • $180K-$400K TC</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-1">Meta AI (FAIR)</h4>
                  <p className="text-sm text-blue-100">LLaMA, PyTorch • $170K-$380K TC</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-1">Anthropic</h4>
                  <p className="text-sm text-blue-100">Claude AI • $190K-$450K TC</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-1">Microsoft Research</h4>
                  <p className="text-sm text-blue-100">Copilot, Azure AI • $160K-$350K TC</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-1">Apple ML</h4>
                  <p className="text-sm text-blue-100">Siri, Vision Pro • $170K-$380K TC</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-900 mb-4">🚀 AI-First Startups (High Growth)</h3>
              <div className="grid md:grid-cols-2 gap-3 text-gray-700">
                <div>• <strong>Hugging Face</strong> - ML models hub</div>
                <div>• <strong>Midjourney</strong> - AI image generation</div>
                <div>• <strong>Stability AI</strong> - Stable Diffusion</div>
                <div>• <strong>Cohere</strong> - Enterprise LLMs</div>
                <div>• <strong>Adept AI</strong> - AI agents</div>
                <div>• <strong>Character.AI</strong> - Conversational AI</div>
              </div>
            </div>
          </section>

          <section id="portfolio-tips" className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Building AI/ML Portfolio</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">🎯 3 Portfolio Projects That Land Jobs</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-2">1. End-to-End ML Pipeline</h4>
                  <p className="text-gray-700 mb-2">Build complete system: data collection → model training → deployment</p>
                  <p className="text-sm text-gray-600">Example: House price predictor with web interface, deployed on AWS</p>
                </div>
                <div className="bg-white rounded-lg p-5 border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-800 mb-2">2. LLM Application</h4>
                  <p className="text-gray-700 mb-2">Use GPT-4 API or open-source LLM for real application</p>
                  <p className="text-sm text-gray-600">Example: AI code reviewer, document Q&A system with RAG</p>
                </div>
                <div className="bg-white rounded-lg p-5 border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-2">3. Research Replication</h4>
                  <p className="text-gray-700 mb-2">Implement paper from scratch, document learnings</p>
                  <p className="text-sm text-gray-600">Example: Implement Attention Is All You Need, share on GitHub</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="font-bold text-purple-900 mb-3">💡 Portfolio Best Practices</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>GitHub:</strong> Clean code, detailed README, requirements.txt</li>
                <li>• <strong>Blog:</strong> Write technical posts explaining your projects (Medium, Dev.to)</li>
                <li>• <strong>Kaggle:</strong> Compete in competitions, share notebooks</li>
                <li>• <strong>Demos:</strong> Deploy live demos (Hugging Face Spaces, Streamlit)</li>
                <li>• <strong>Documentation:</strong> Explain decisions, results, improvements</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-8 mt-8">
              <h3 className="text-2xl font-bold mb-4">🚀 Start Your AI/ML Career Journey</h3>
              <p className="text-lg mb-6">
                Get personalized career guidance and connect with AI companies hiring engineers.
              </p>
              <div className="flex gap-4">
                <Link href="/audit" className="inline-block px-8 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-50">
                  Resume Review →
                </Link>
                <Link href="/company-search" className="inline-block px-8 py-3 bg-white/10 backdrop-blur text-white font-bold rounded-lg hover:bg-white/20 border border-white/30">
                  Find AI Companies →
                </Link>
              </div>
            </div>
          </section>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-16 p-8 bg-white rounded-xl border">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FaRobot className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Career Specialists</h3>
              <p className="text-gray-600 mb-4">
                Written by ML engineers from OpenAI, Google AI, and Meta FAIR with 15+ years combined experience. We've helped 1,000+ engineers transition into AI careers.
              </p>
              <div className="flex gap-4">
                <Link href="/blog" className="text-blue-600 hover:underline">More AI Guides</Link>
                <Link href="/pricing" className="text-green-600 hover:underline">Career Coaching</Link>
              </div>
            </div>
          </div>
        </motion.div>
      </article>

      <RelatedArticles currentSlug="ai-ml-engineer-career-guide-2025" category="AI/ML Careers" />
    </div>
  );
}
