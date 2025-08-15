import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <div className="px-4 md:px-12 lg:px-24 relative w-full h-[70vh]">
      <div className=" absolute w-full h-full bg-amber-200 top-0 left-0 z-10">
        <Image
          src="/Footer.jpg"
          alt="footer-bg"
          fill
          className=" object-cover object-bottom"
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-30 h-full  flex flex-col justify-between py-6 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-800">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Coffee Corner</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Crafting the perfect cup since 2020. We source the finest beans
              and create memorable coffee experiences for our community.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer">
                <span className="text-white font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-900 transition-colors cursor-pointer">
                <span className="text-white font-bold">in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Menu
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Order Online
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Catering
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Coffee Classes
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Private Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Bean Subscription
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Contact Us</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>📍 123 Coffee Street</p>
              <p>☕ Downtown, CA 90210</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ hello@coffeecorner.com</p>
            </div>
            <div className="pt-2">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Hours
              </h5>
              <p className="text-xs text-gray-700">Mon-Fri: 6AM-8PM</p>
              <p className="text-xs text-gray-700">Sat-Sun: 7AM-9PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amber-300/30">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-amber-50">
            <p>&copy; 2024 Coffee Corner. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-amber-200 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-amber-200 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
