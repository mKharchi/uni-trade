import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-16">
      <div className="2xl:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Unitrade
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted campus marketplace for swapping, selling, and discovering products. Connect with students and find great deals.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaTwitter className="text-lg" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-slate-700 hover:bg-blue-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
              >
                <FaFacebookF className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  About Us
                </a>
              </li>
              <li>
                <a href="/how-it-works" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  How It Works
                </a>
              </li>
              <li>
                <a href="/marketplace" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Marketplace
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="/safety" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <FaMapMarkerAlt className="text-blue-400 mt-1 flex-shrink-0" />
                <span>Campus Building, University District</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <FaEnvelope className="text-blue-400 flex-shrink-0" />
                <a href="mailto:support@unitrade.com" className="hover:text-blue-400 transition-colors">
                  support@unitrade.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <FaPhone className="text-blue-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="hover:text-blue-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Unitrade. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/cookies" className="hover:text-white transition-colors">
              Cookie Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>

      {/* Decorative gradient line at the very bottom */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
};

export default Footer;