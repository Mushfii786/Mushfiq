import React from 'react';
import { motion } from 'motion/react';
import { siteConfig } from '../config/site';
import { Sparkles, ArrowUpRight, Globe, Instagram, Github, Linkedin, Mail, Twitter } from 'lucide-react';

function BehanceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-4.812 3-3.104 0-5.414-2.122-5.414-5.492 0-3.376 2.222-5.508 5.281-5.508 3.324 0 4.922 2.285 4.707 5.25h-7.668c.086 1.453 1.133 2.375 2.594 2.375 1.289 0 2.117-.586 2.453-1.625h2.859zm-4.984-5.805c-1.121 0-1.895.727-2.023 1.805h3.984c-.066-1.078-.816-1.805-1.961-1.805zM6.88 12.012c1.387-.41 2.305-1.422 2.305-2.906 0-2.348-1.777-3.606-4.57-3.606H0v12.999h5.121c2.812 0 4.883-1.375 4.883-3.832 0-1.574-.988-2.336-3.124-2.655zm-3.68-2.223h1.305c1.031 0 1.621.43 1.621 1.211 0 .809-.59 1.238-1.621 1.238H3.2V9.789zm1.508 6.211H3.2v-2.738h1.508c1.23 0 1.887.488 1.887 1.367 0 .898-.657 1.371-1.887 1.371z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345c-.091.379-.293 1.194-.333 1.362-.053.225-.173.271-.4.163-1.493-.695-2.427-2.877-2.427-4.631 0-3.774 2.742-7.237 7.901-7.237 4.15 0 7.375 2.957 7.375 6.91 0 4.123-2.599 7.441-6.206 7.441-1.212 0-2.352-.63-2.742-1.374l-.747 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function About() {
  const socialList = [
    { name: 'Instagram', url: siteConfig.socials.instagram, icon: Instagram },
    { name: 'WhatsApp', url: siteConfig.socials.whatsapp, icon: WhatsappIcon },
    { name: 'LinkedIn', url: siteConfig.socials.linkedin, icon: Linkedin },
    { name: 'GitHub', url: siteConfig.socials.github, icon: Github },
    { name: 'Pinterest', url: siteConfig.socials.pinterest, icon: PinterestIcon },
  ];
  const experiences = [
    {
      period: "2024 – Present",
      title: "Videographer & Visual Designer",
      company: "Freelance"
    },
    {
      period: "2024 – Present",
      title: "Digital Poster Designer",
      company: "College Media & Student Organizations"
    },
    {
      period: "2024 – Present",
      title: "Creative Video Editor",
      company: "Freelance"
    }
  ];

  const education = [
    {
      period: "2019 – Present",
      title: "Hudawi Course (Islamic Studies)",
      company: "Al Hidaya Islamic Academy, Kalamassery, Ernakulam",
      university: "Affiliated with Darul Huda Islamic University, Chemmad"
    }
  ];

  return (
    <section id="about" className="py-20 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto relative select-none w-full overflow-hidden sm:overflow-visible">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Header Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12 flex flex-col items-center justify-center gap-3"
      >
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white uppercase font-sans drop-shadow-md">
          About Me
        </h2>
      </motion.div>

      {/* Bento Grid Container */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        
        {/* ROW 1: LEFT CARD - Profile Avatar (Col 4) */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full col-span-1 md:col-span-5 lg:col-span-4 bg-neutral-950/85 border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] p-2.5 sm:p-4 flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Subtle Ambient Backing Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 via-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div className="w-full aspect-square rounded-[1.25rem] sm:rounded-[2rem] overflow-hidden bg-neutral-950 relative flex items-center justify-center group/img">
            {/* Image Container with Smooth Motion */}
            <motion.div className="w-full h-full relative overflow-hidden rounded-[1.25rem] sm:rounded-[2rem]">
              {siteConfig.avatarUrl ? (
                <img
                  src={siteConfig.avatarUrl}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover object-top filter saturate-[1.1] brightness-[1.02] group-hover/img:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform-gpu"
                />
              ) : null}
              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 opacity-90 group-hover/img:opacity-60 transition-opacity duration-500 pointer-events-none" />

              {/* Sweeping Premium Shimmer Reflection */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-100%] group-hover/img:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
            </motion.div>
          </div>
        </motion.div>

        {/* ROW 1: RIGHT CARD - Name & Bio (Col 8) */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full col-span-1 md:col-span-7 lg:col-span-8 bg-neutral-950/85 border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Subtle Inner Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-purple-600/15 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div className="space-y-3 sm:space-y-4 relative z-10">


            <div className="space-y-1.5 sm:space-y-2 pt-0.5">
              <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {siteConfig.name}
              </h3>
              <p className="text-[11px] sm:text-sm font-mono uppercase tracking-widest bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent font-bold">
                {siteConfig.title}
              </p>
            </div>

            <div className="text-neutral-300 text-xs sm:text-base font-light leading-relaxed pt-1">
              <p>{siteConfig.aboutIntro}</p>
            </div>
          </div>

          <div className="pt-4 sm:pt-6 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 text-[11px] sm:text-xs text-neutral-400 font-mono relative z-10 border-t border-white/5 mt-3 sm:mt-4">
            <span className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {siteConfig.location}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0 text-[10px] sm:text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Available for work
            </span>
          </div>
        </motion.div>

        {/* ROW 2: LEFT CARD - Experience (Col 6) */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 bg-neutral-950/85 border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Subtle Ambient Orb */}
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#8B5CF6]" />
              <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                EXPERIENCE
              </h4>
            </div>

            <div className="space-y-3 sm:space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx} className="space-y-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300 group/exp">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">{exp.period}</span>
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-white leading-snug group-hover/exp:text-purple-200 transition-colors">{exp.title}</h5>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-light">{exp.company}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ROW 2: RIGHT CARD - Education (Col 6) */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 bg-neutral-950/85 border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden"
        >
          {/* Subtle Ambient Orb */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#06B6D4]" />
              <h4 className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-neutral-300 font-semibold">
                EDUCATION
              </h4>
            </div>

            <div className="space-y-3 sm:space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="space-y-1 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all duration-300 group/edu">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">{edu.period}</span>
                  </div>
                  <h5 className="text-sm sm:text-base font-bold text-white leading-snug group-hover/edu:text-cyan-200 transition-colors">{edu.title}</h5>
                  <p className="text-[11px] sm:text-xs text-neutral-300 font-light">{edu.company}</p>
                  {edu.university && <p className="text-[10px] sm:text-xs text-neutral-400 font-light">{edu.university}</p>}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ROW 3: CARD 1 - Profiles / Socials */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5 lg:col-span-4 bg-neutral-950/85 border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden min-h-[180px] sm:min-h-[220px]"
        >
          {/* Social Icons grid */}
          <div className="flex flex-wrap items-center gap-2 py-1 relative z-10">
            {socialList.map((social) => {
              const IconComp = social.icon;
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-purple-500 hover:bg-gradient-to-tr hover:from-purple-600 hover:to-blue-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 shadow-md"
                  title={social.name}
                >
                  <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.a>
              );
            })}
          </div>

          {/* Footer Meta */}
          <div className="flex items-center justify-between pt-4 sm:pt-6 relative z-10 border-t border-white/5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                STAY WITH ME
              </span>
              <span className="text-sm sm:text-base font-bold text-white">Profiles</span>
            </div>
            <motion.a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-white group-hover:bg-[#8B5CF6] group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all duration-300"
            >
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.a>
          </div>
        </motion.div>

        {/* ROW 3: CARD 2 - Let's work together */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-7 lg:col-span-8 bg-neutral-950/85 border border-white/10 rounded-[1.75rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-purple-500/40 transition-all duration-500 group relative overflow-hidden min-h-[180px] sm:min-h-[220px]"
        >
          {/* Ambient Purple/Blue Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          <div className="space-y-1 relative z-10">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight pt-1 sm:pt-2">
              Let's <br />
              work <span className="bg-gradient-to-r from-[#8B5CF6] via-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent font-sans italic">together.</span>
            </h3>
          </div>

          <div className="flex justify-end pt-3 sm:pt-4 relative z-10">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-900/90 border border-white/15 text-neutral-300 flex items-center justify-center shadow-md focus:bg-gradient-to-r focus:from-[#8B5CF6] focus:via-[#3B82F6] focus:to-[#06B6D4] focus:text-white focus:border-transparent focus:shadow-[0_0_25px_rgba(139,92,246,0.6)] active:bg-gradient-to-r active:from-[#8B5CF6] active:via-[#3B82F6] active:to-[#06B6D4] active:text-white active:border-transparent active:shadow-[0_0_25px_rgba(139,92,246,0.6)] hover:bg-gradient-to-r hover:from-[#8B5CF6] hover:via-[#3B82F6] hover:to-[#06B6D4] hover:text-white hover:border-transparent hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all duration-300 outline-none"
            >
              <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.a>
          </div>
        </motion.div>

      </div>

    </section>
  );
}

