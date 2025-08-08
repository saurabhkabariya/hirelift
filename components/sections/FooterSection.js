'use client';

import Link from 'next/link';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";

const scrollToSection = (sectionId) => {
  const element = document.querySelector(sectionId);
  if (element) {
    const headerHeight = 70;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default function FooterSection() {
  return (
    <footer className="bg-slate-950 text-white py-16 px-6 border-t border-white/10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                H
              </div>
              <span className="text-2xl font-bold">HireLift</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your career acceleration partner. Get noticed by recruiters with optimized resumes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors">
                <FaSquareXTwitter className="w-5 h-5" />
              </a>
              <a href="mailto:hirelift01@gmail.com" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors">
                <FaEnvelope className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: "Features", action: () => scrollToSection('#features') },
                { name: "How it Works", action: () => scrollToSection('#how-it-works') },
                { name: "Pricing", action: () => scrollToSection('#pricing') },
                { name: "Get Started", href: "/auth" }
              ].map((link) => (
                link.href ? (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <button
                    key={link.name}
                    onClick={link.action}
                    className="block text-gray-400 hover:text-white transition-colors text-left"
                  >
                    {link.name}
                  </button>
                )
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6">Services</h4>
            <div className="space-y-3">
              {[
                { name: "Resume Audit", href: "/audit", badge: "FREE" },
                { name: "Template Playground", href: "/playground", badge: "FREE" },
                { name: "Pricing Plans", href: "/pricing" },
                { name: "HR Directory", href: "#", badge: "PRO" }
              ].map((service) => (
                <div key={service.name} className="flex items-center gap-2">
                  <Link 
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                  {service.badge && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      service.badge === "FREE" ? "bg-green-500 text-white" : "bg-purple-500 text-white"
                    }`}>
                      {service.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-6">Legal & Support</h4>
            <div className="space-y-3">
              {[
                { name: "Contact Us", href: "mailto:hirelift01@gmail.com" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms & Conditions", href: "/terms" },
                { name: "Refund Policy", href: "/refund" }
              ].map((legal) => (
                <a
                  key={legal.name}
                  href={legal.href}
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  {legal.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-400">
            &copy; {new Date().getFullYear()} HireLift. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            Made with <span className="text-red-400">❤️</span> for job seekers
          </div>
        </div>
      </div>
    </footer>
  );
}
