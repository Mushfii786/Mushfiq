import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  Home as HomeIcon,
  FolderGit2, 
  User, 
  Briefcase, 
  Mail,
  Instagram
} from 'lucide-react';
import { siteConfig } from '../config/site';
import { Logo } from './Logo';
import { useFirebaseData } from '../context/FirebaseDataContext';

export function Navigation() {
  const { siteProfile } = useFirebaseData();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNav, setShowNav] = useState(false);

  // Active section & navbar scroll visibility tracking
  useEffect(() => {
    const handleScroll = () => {
      // Hide navbar when at top / home section, reveal when scrolling down
      if (window.scrollY > 120) {
        setShowNav(true);
      } else {
        setShowNav(false);
        setMobileOpen(false);
      }

      const sections = ['about', 'projects', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 280 && rect.bottom >= 80) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About', href: '#about' },
    { id: 'projects', label: 'Works', href: '#projects' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <AnimatePresence>
        {showNav && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-5 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
          >
        <div className="relative flex items-center pointer-events-auto w-[94vw] max-w-3xl sm:w-auto">
          
          {/* Main Floating Glass Pill Bar - Ultra Premium & Sleek */}
          <div className="flex items-center justify-between sm:justify-start w-full gap-2 sm:gap-3.5 bg-neutral-950/85 text-white backdrop-blur-2xl border border-white/12 p-2 sm:p-2.5 px-3.5 sm:px-5 rounded-full shadow-[0_16px_50px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-all">
            
            {/* Brand Logo & Name - Mushfiq */}
            <a
              href="#home"
              className="px-2 sm:px-3 py-1 font-bold text-sm sm:text-base tracking-tight text-white rounded-full hover:bg-white/5 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <Logo className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-500 group-hover:scale-110" />
              </div>
              <span className="font-sans font-extrabold tracking-widest text-sm sm:text-base text-white group-hover:text-blue-400 transition-colors uppercase">{siteProfile.initials || siteConfig.initials}</span>
            </a>

            {/* Desktop Direct Links Navigation */}
            <nav className="hidden md:flex items-center space-x-1 sm:space-x-1.5">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`relative px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide rounded-full hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-neutral-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full -z-10 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            <div className="hidden md:block w-[1px] h-4 bg-white/15 mx-1" />

            {/* Social Quick Links - Instagram & WhatsApp */}
            <div className="flex items-center gap-1.5 sm:gap-2 pl-0.5 ml-auto md:ml-0">
              {/* Instagram */}
              <a
                href={siteProfile.socials?.instagram || siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-gradient-to-tr hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] border border-white/10 hover:border-transparent text-neutral-300 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(225,48,108,0.6)] cursor-pointer"
                title="Instagram @mushfiq_786"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ease-out group-hover:rotate-12 group-hover:scale-110" />
              </a>

              {/* WhatsApp */}
              <a
                href={siteProfile.socials?.whatsapp || siteConfig.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-emerald-500 border border-white/10 hover:border-transparent text-neutral-300 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] cursor-pointer"
                title="WhatsApp Chat"
                aria-label="WhatsApp Contact"
              >
                <svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current transition-transform duration-300 ease-out group-hover:-rotate-12 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.84L0 24l6.328-1.487C8.01 23.457 9.957 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.817 0-3.585-.483-5.132-1.402l-.368-.219-3.755.882.903-3.66-.24-.383C2.457 15.65 1.9 13.882 1.9 12c0-5.569 4.531-10.1 10.1-10.1 5.569 0 10.1 4.531 10.1 10.1 0 5.569-4.531 10.1-10.1 10.1z"/>
                </svg>
              </a>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-neutral-300 hover:bg-white/10 hover:scale-105 active:scale-95 rounded-full transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-22 z-40 p-4 rounded-3xl bg-neutral-950/95 border border-neutral-800 text-white backdrop-blur-3xl shadow-2xl md:hidden"
          >
            <nav className="flex flex-col space-y-2">
              <a
                href="#about"
                onClick={() => setMobileOpen(false)}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold text-white flex items-center justify-between hover:border-[#2563EB] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-[#2563EB]" />
                  <span>About</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>

              <a
                href="#projects"
                onClick={() => setMobileOpen(false)}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold text-white flex items-center justify-between hover:border-[#2563EB] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <FolderGit2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Works</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>

              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold text-white flex items-center justify-between hover:border-[#2563EB] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#2563EB]" />
                  <span>Contact</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-neutral-500" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
