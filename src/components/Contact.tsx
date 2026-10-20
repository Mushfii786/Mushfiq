import React, { useState, memo } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Instagram, Github, Linkedin, Check, Loader2 } from 'lucide-react';
import { siteConfig } from '../config/site';
import { saveContactMessage } from '../lib/firebase';

export const Contact = memo(function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const webhookUrl = 'https://script.google.com/macros/s/AKfycbwwCHspdtYFnMTKmZNdedj3vlMg8iF-fyYC3v_6P6ZaaEYgyzDfdf35DogIV54_maA/exec';

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      country: formData.location,
      Country: formData.location,
      location: formData.location,
      countryAndPlace: formData.location,
      place: formData.location,
      message: formData.message,
      timestamp: new Date().toLocaleString()
    };

    try {
      const params = new URLSearchParams(payload);

      // Save to Firebase Firestore
      try {
        await saveContactMessage({
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          location: payload.location,
          message: payload.message,
        });
      } catch (fbErr) {
        console.warn('Firestore message save note:', fbErr);
      }

      await fetch(`${webhookUrl}?${params.toString()}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      setFormSubmitted(true);
      try {
        const { default: confetti } = await import('canvas-confetti');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#10B981', '#3B82F6', '#F59E0B']
        });
      } catch (e) {}
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitError('Failed to send message. Please try again or reach out directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-28 px-4 sm:px-6 max-w-7xl mx-auto relative overflow-hidden select-none">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Column: Heading, Direct Info Cards & Networks */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Eyebrow & Headline */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#60A5FA] font-semibold shadow-inner"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse shadow-[0_0_8px_#2563EB]" />
              <span>START A CONVERSATION</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.08]"
            >
              Let's Build <br />
              Something <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
                Amazing.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-md"
            >
              Have a new venture, product redesign, or creative video concept in mind? Fill out the form or reach out directly.
            </motion.p>
          </div>

          {/* Direct Stacked Glass Cards */}
          <div className="space-y-3">
            
            {/* Email Card */}
            <motion.a
              href={`mailto:${siteConfig.email}`}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-950/90 border border-white/10 hover:border-blue-500/50 text-white flex items-center gap-4 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_35px_rgba(59,130,246,0.25)] group cursor-pointer backdrop-blur-md sm:backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/5 transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-md shrink-0">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="relative z-10 min-w-0">
                <p className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-blue-300/80 mb-0.5">
                  Direct Email
                </p>
                <p className="text-xs sm:text-base font-sans font-extrabold tracking-tight text-white group-hover:text-blue-300 transition-colors truncate">
                  {siteConfig.email}
                </p>
              </div>
            </motion.a>

            {/* Direct Line / WhatsApp Card */}
            <motion.a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-950/90 border border-white/10 hover:border-emerald-500/50 text-white flex items-center gap-4 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_35px_rgba(16,185,129,0.25)] group cursor-pointer backdrop-blur-md sm:backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/5 transform-gpu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-md shrink-0">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="relative z-10 min-w-0">
                <p className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-300/80 mb-0.5">
                  Direct Line / WhatsApp
                </p>
                <p className="text-xs sm:text-base font-sans font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors truncate">
                  {siteConfig.whatsapp}
                </p>
              </div>
            </motion.a>

            {/* Location Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-neutral-950/90 border border-white/10 hover:border-purple-500/50 text-white flex items-center gap-4 transition-all duration-300 shadow-[0_15px_35px_rgba(0,0,0,0.6)] group backdrop-blur-md sm:backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/5 transform-gpu"
            >
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.03] border border-white/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-md shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="relative z-10 min-w-0">
                <p className="text-[10px] sm:text-[11px] font-sans font-bold uppercase tracking-wider text-purple-300/80 mb-0.5">
                  Location
                </p>
                <p className="text-xs sm:text-base font-sans font-extrabold tracking-tight text-white truncate">
                  {siteConfig.location}
                </p>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Right Column: High-End Glassmorphic Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7"
        >
          <div className="p-4 sm:p-7 md:p-10 rounded-[1.75rem] sm:rounded-[2.5rem] bg-neutral-950/90 border border-white/15 backdrop-blur-md sm:backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.85)] ring-1 ring-white/10 text-white relative overflow-hidden group/form hover:border-purple-500/30 transition-all duration-500 transform-gpu">
            
            {/* Top Accent Gradient Border with Shimmer Pulse */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#8B5CF6] via-[#3B82F6] to-transparent animate-pulse duration-[3000ms]" />

            {/* Inner Ambient Glow Orbs inside card (Pure GPU Radial Gradients) */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.16)_0%,rgba(37,99,235,0.08)_45%,transparent_70%)] pointer-events-none group-hover/form:scale-125 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.14)_0%,rgba(147,51,234,0.08)_45%,transparent_70%)] pointer-events-none group-hover/form:scale-125 transition-transform duration-700" />

            {formSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="py-16 text-center space-y-5 relative z-10"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#8B5CF6]/30 to-[#06B6D4]/30 text-[#60A5FA] mx-auto flex items-center justify-center border border-purple-500/40 shadow-[0_0_35px_rgba(139,92,246,0.4)] animate-bounce duration-1000">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">
                  Message Dispatched!
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out, <span className="font-semibold text-white">{formData.firstName}</span>. I'll respond to <span className="text-[#60A5FA] font-mono">{formData.email}</span> within 24 hours.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ firstName: '', lastName: '', email: '', phone: '', location: '', message: '' });
                  }}
                  className="px-8 py-3.5 rounded-full bg-gradient-to-r from-white to-neutral-200 text-black font-extrabold text-xs hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 cursor-pointer shadow-xl mt-4"
                >
                  Send Another Message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Form Title & Subtitle */}
                <div className="space-y-0.5 sm:space-y-1 mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Send a Direct Inquiry</span>
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#06B6D4] animate-ping" />
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400">
                    Fill in your details below and I'll get back to you promptly.
                  </p>
                </div>

                {/* Row 1: First Name / Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group/input">
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder=" "
                      id="firstName"
                      className="peer w-full px-4 pt-4 pb-3 rounded-2xl bg-neutral-900/80 border border-white/10 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)] focus:bg-neutral-900/95 transition-all duration-300 transform-gpu"
                    />
                    <label
                      htmlFor="firstName"
                      className="absolute left-4 top-3.5 text-xs font-medium text-neutral-400 pointer-events-none border border-transparent rounded-lg px-1 py-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left peer-focus:-top-3.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-purple-300 peer-focus:font-semibold peer-focus:bg-neutral-950 peer-focus:border-purple-500/50 peer-focus:rounded-lg peer-focus:px-2.5 peer-focus:py-0.5 peer-focus:shadow-[0_0_15px_rgba(139,92,246,0.35)] peer-[&:not(:placeholder-shown)]:-top-3.5 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-purple-300 peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:bg-neutral-950 peer-[&:not(:placeholder-shown)]:border-purple-500/40 peer-[&:not(:placeholder-shown)]:rounded-lg peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:py-0.5 peer-[&:not(:placeholder-shown)]:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    >
                      First Name *
                    </label>
                  </div>
                  <div className="relative group/input">
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder=" "
                      id="lastName"
                      className="peer w-full px-4 pt-4 pb-3 rounded-2xl bg-neutral-900/80 border border-white/10 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)] focus:bg-neutral-900/95 transition-all duration-300 transform-gpu"
                    />
                    <label
                      htmlFor="lastName"
                      className="absolute left-4 top-3.5 text-xs font-medium text-neutral-400 pointer-events-none border border-transparent rounded-lg px-1 py-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left peer-focus:-top-3.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-purple-300 peer-focus:font-semibold peer-focus:bg-neutral-950 peer-focus:border-purple-500/50 peer-focus:rounded-lg peer-focus:px-2.5 peer-focus:py-0.5 peer-focus:shadow-[0_0_15px_rgba(139,92,246,0.35)] peer-[&:not(:placeholder-shown)]:-top-3.5 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-purple-300 peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:bg-neutral-950 peer-[&:not(:placeholder-shown)]:border-purple-500/40 peer-[&:not(:placeholder-shown)]:rounded-lg peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:py-0.5 peer-[&:not(:placeholder-shown)]:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    >
                      Last Name
                    </label>
                  </div>
                </div>

                {/* Row 2: Email / Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative group/input">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder=" "
                      id="email"
                      className="peer w-full px-4 pt-4 pb-3 rounded-2xl bg-neutral-900/80 border border-white/10 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)] focus:bg-neutral-900/95 transition-all duration-300 transform-gpu"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-3.5 text-xs font-medium text-neutral-400 pointer-events-none border border-transparent rounded-lg px-1 py-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left peer-focus:-top-3.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-purple-300 peer-focus:font-semibold peer-focus:bg-neutral-950 peer-focus:border-purple-500/50 peer-focus:rounded-lg peer-focus:px-2.5 peer-focus:py-0.5 peer-focus:shadow-[0_0_15px_rgba(139,92,246,0.35)] peer-[&:not(:placeholder-shown)]:-top-3.5 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-purple-400 peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:bg-neutral-950 peer-[&:not(:placeholder-shown)]:border-purple-500/40 peer-[&:not(:placeholder-shown)]:rounded-lg peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:py-0.5 peer-[&:not(:placeholder-shown)]:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    >
                      Email Address *
                    </label>
                  </div>
                  <div className="relative group/input">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder=" "
                      id="phone"
                      className="peer w-full px-4 pt-4 pb-3 rounded-2xl bg-neutral-900/80 border border-white/10 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)] focus:bg-neutral-900/95 transition-all duration-300 transform-gpu"
                    />
                    <label
                      htmlFor="phone"
                      className="absolute left-4 top-3.5 text-xs font-medium text-neutral-400 pointer-events-none border border-transparent rounded-lg px-1 py-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left peer-focus:-top-3.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-purple-300 peer-focus:font-semibold peer-focus:bg-neutral-950 peer-focus:border-purple-500/50 peer-focus:rounded-lg peer-focus:px-2.5 peer-focus:py-0.5 peer-focus:shadow-[0_0_15px_rgba(139,92,246,0.35)] peer-[&:not(:placeholder-shown)]:-top-3.5 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-purple-400 peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:bg-neutral-950 peer-[&:not(:placeholder-shown)]:border-purple-500/40 peer-[&:not(:placeholder-shown)]:rounded-lg peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:py-0.5 peer-[&:not(:placeholder-shown)]:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                    >
                      Phone Number
                    </label>
                  </div>
                </div>

                {/* Row 3: Country & Place */}
                <div className="relative group/input">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder=" "
                    id="location"
                    className="peer w-full px-4 pt-4 pb-3 rounded-2xl bg-neutral-900/80 border border-white/10 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)] focus:bg-neutral-900/95 transition-all duration-300 transform-gpu"
                  />
                  <label
                    htmlFor="location"
                    className="absolute left-4 top-3.5 text-xs font-medium text-neutral-400 pointer-events-none border border-transparent rounded-lg px-1 py-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left peer-focus:-top-3.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-purple-300 peer-focus:font-semibold peer-focus:bg-neutral-950 peer-focus:border-purple-500/50 peer-focus:rounded-lg peer-focus:px-2.5 peer-focus:py-0.5 peer-focus:shadow-[0_0_15px_rgba(139,92,246,0.35)] peer-[&:not(:placeholder-shown)]:-top-3.5 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-purple-400 peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:bg-neutral-950 peer-[&:not(:placeholder-shown)]:border-purple-500/40 peer-[&:not(:placeholder-shown)]:rounded-lg peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:py-0.5 peer-[&:not(:placeholder-shown)]:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                  >
                    Country / Location
                  </label>
                </div>

                {/* Row 4: Your Message */}
                <div className="relative group/input">
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder=" "
                    id="message"
                    className="peer w-full px-4 pt-4 pb-3 rounded-2xl bg-neutral-900/80 border border-white/10 text-sm text-white placeholder-transparent focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/30 focus:shadow-[0_0_25px_rgba(139,92,246,0.25)] focus:bg-neutral-900/95 transition-all duration-300 resize-none transform-gpu"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-4 top-3.5 text-xs font-medium text-neutral-400 pointer-events-none border border-transparent rounded-lg px-1 py-0 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform-gpu origin-left peer-focus:-top-3.5 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-purple-300 peer-focus:font-semibold peer-focus:bg-neutral-950 peer-focus:border-purple-500/50 peer-focus:rounded-lg peer-focus:px-2.5 peer-focus:py-0.5 peer-focus:shadow-[0_0_15px_rgba(139,92,246,0.35)] peer-[&:not(:placeholder-shown)]:-top-3.5 peer-[&:not(:placeholder-shown)]:left-3 peer-[&:not(:placeholder-shown)]:text-[11px] peer-[&:not(:placeholder-shown)]:text-purple-400 peer-[&:not(:placeholder-shown)]:font-semibold peer-[&:not(:placeholder-shown)]:bg-neutral-950 peer-[&:not(:placeholder-shown)]:border-purple-500/40 peer-[&:not(:placeholder-shown)]:rounded-lg peer-[&:not(:placeholder-shown)]:px-2.5 peer-[&:not(:placeholder-shown)]:py-0.5 peer-[&:not(:placeholder-shown)]:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
                  >
                    Your Message *
                  </label>
                </div>

                {/* Action Row */}
                <div className="pt-2 flex items-center justify-between">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="group/btn relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] text-white font-extrabold text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(139,92,246,0.45)] hover:shadow-[0_0_40px_rgba(59,130,246,0.75)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 sm:gap-2.5 overflow-hidden"
                  >
                    {/* Sweeping Shimmer Highlight across button */}
                    <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" />
                        <span className="relative z-10">Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">SEND MESSAGE</span>
                        <Send className="w-3.5 h-3.5 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5" />
                      </>
                    )}
                  </motion.button>

                  {submitError && (
                    <p className="text-xs text-red-400 font-mono">{submitError}</p>
                  )}
                </div>

              </form>
            )}
          </div>
        </motion.div>

      </div>

      {/* Premium Social Networks Row Centered Across the Page */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="pt-16 flex flex-col items-center justify-center text-center w-full mx-auto"
      >
        <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-bold mb-4">
          CONNECT ACROSS NETWORKS
        </p>

        <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap mx-auto">
          
          {/* Instagram */}
          <motion.a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 border border-white/10 hover:border-transparent hover:bg-gradient-to-tr hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(225,48,108,0.7)] group relative"
            title="Instagram"
          >
            <Instagram className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:rotate-6" />
          </motion.a>

          {/* Pinterest */}
          <motion.a
            href={siteConfig.socials.pinterest}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 border border-white/10 hover:border-transparent hover:bg-red-600 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(220,38,38,0.7)] group relative"
            title="Pinterest"
          >
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current transition-transform duration-300 group-hover:-rotate-6" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.224 7.462-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
            </svg>
          </motion.a>

          {/* LinkedIn */}
          <motion.a
            href={siteConfig.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 border border-white/10 hover:border-transparent hover:bg-sky-600 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(2,132,199,0.7)] group relative"
            title="LinkedIn"
          >
            <Linkedin className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:rotate-6" />
          </motion.a>

          {/* WhatsApp */}
          <motion.a
            href={siteConfig.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 border border-white/10 hover:border-transparent hover:bg-emerald-500 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(16,185,129,0.7)] group relative"
            title="WhatsApp"
          >
            <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current transition-transform duration-300 group-hover:-rotate-6" viewBox="0 0 24 24">
              <path d="M12.012 2c-5.508 0-9.989 4.478-9.99 9.984 0 1.762.459 3.481 1.332 4.993l-1.416 5.172 5.292-1.388c1.455.793 3.095 1.21 4.777 1.211h.005c5.508 0 9.99-4.478 9.99-9.985 0-2.668-1.039-5.176-2.927-7.063C17.188 3.039 14.68 2 12.012 2zm5.918 14.417c-.247.695-1.434 1.328-2.006 1.413-.512.076-1.16.108-1.872-.118-.431-.137-.985-.32-1.694-.626-2.981-1.287-4.927-4.289-5.076-4.487-.149-.198-1.213-1.611-1.213-3.074 0-1.463.768-2.181 1.04-2.479.272-.298.594-.372.792-.372.198 0 .396.003.57.01.182.009.427-.069.669.51.247.595.841 2.058.916 2.206.075.149.124.323.025.521-.099.199-.149.323-.3.495-.149.174-.312.388-.446.521-.148.148-.303.309-.13.606.173.298.77 1.271 1.653 2.059 1.135 1.013 2.093 1.326 2.39 1.475.297.149.471.124.644-.074.173-.198.743-.868.941-1.165.198-.298.396-.248.669-.149.273.099 1.734.818 2.031.967.298.149.496.223.57.347.075.124.075.719-.172 1.414z"/>
            </svg>
          </motion.a>

          {/* GitHub */}
          <motion.a
            href={siteConfig.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-900/90 border border-white/10 hover:border-transparent hover:bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group relative"
            title="GitHub"
          >
            <Github className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:rotate-6" />
          </motion.a>

        </div>
      </motion.div>
    </section>
  );
});
