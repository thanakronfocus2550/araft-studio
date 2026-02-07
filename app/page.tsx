"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, X, Maximize2 } from 'lucide-react';
import { client } from '@/sanity/lib/client';

// --- Query ---
const PROJECTS_QUERY = `*[_type == "project"]{
  _id,
  title,
  category,
  location,
  "image": image.asset->url,
  concept,
  area
}`;

const LocalNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-8 text-white mix-blend-difference font-sans">
      <div className="text-lg md:text-xl font-medium tracking-[0.3em]">ARAFT</div>
      <div className="hidden md:flex gap-12 text-[10px] tracking-[0.3em] uppercase font-light">
        <a href="#" className="hover:opacity-50 transition">Home</a>
        <a href="#about" className="hover:opacity-50 transition">About</a>
        <a href="#portfolio" className="hover:opacity-50 transition">Portfolio</a>
        <a href="#contact" className="hover:opacity-50 transition">Contact</a>
      </div>
      <div className="md:hidden text-[9px] uppercase tracking-widest border border-white/20 px-3 py-1.5 text-white">Menu</div>
    </nav>
  );
};

const fadeInVariant: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await client.fetch(PROJECTS_QUERY);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter((p: any) => p.category === activeCategory);

  return (
    <div className="bg-[#111] selection:bg-white selection:text-black scroll-smooth overflow-x-hidden font-sans">
      <LocalNavbar />

      {/* --- POP-UP MODAL (Mobile Optimized) --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-12"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              className="bg-white w-full h-full md:h-auto md:max-w-6xl md:max-h-[90vh] overflow-y-auto relative text-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2.5 bg-black text-white rounded-full hover:scale-110 transition-transform"
                onClick={() => setSelectedProject(null)}
              >
                <X size={18} />
              </button>

              <div className="grid md:grid-cols-2">
                <div className="relative h-[300px] md:h-auto min-h-[300px] md:min-h-[500px]">
                  {selectedProject.image && (
                    <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover" />
                  )}
                </div>
                <div className="p-8 md:p-16 space-y-8 md:space-y-12 text-left">
                  <div className="space-y-3">
                    <p className="text-[9px] tracking-[0.4em] uppercase text-gray-400 font-bold">{selectedProject.category}</p>
                    <h2 className="text-3xl md:text-6xl font-extralight tracking-tighter leading-none uppercase">{selectedProject.title}</h2>
                  </div>

                  <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-6 md:py-8">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-1">Location</p>
                      <p className="text-xs md:text-sm font-light">{selectedProject.location || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase font-bold text-gray-400 mb-1">Total Area</p>
                      <p className="text-xs md:text-sm font-light">{selectedProject.area || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[9px] tracking-[0.4em] uppercase font-bold">Design Concept</h3>
                    <p className="text-gray-600 leading-relaxed font-light text-base md:text-lg">{selectedProject.concept || 'No concept description.'}</p>
                  </div>

                  <button 
                    className="w-full py-5 bg-black text-white text-[9px] tracking-[0.4em] uppercase hover:bg-gray-800 transition-colors font-bold"
                    onClick={() => setSelectedProject(null)}
                  >
                    Back to Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LINE FLOATING BUTTON --- */}
      <a 
        href="https://line.me/ti/p/@yourid" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-[#06C755] text-white p-3.5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
      >
        <MessageCircle size={22} fill="currentColor" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 text-[9px] tracking-[0.3em] uppercase font-bold text-white">
          Chat with us
        </span>
      </a>
      
      {/* 1. HERO SECTION */}
      <main className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image src="/architect-hero.jpg" alt="Araft Design Studio" fill className="object-cover object-center opacity-60" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative z-10 flex flex-col items-center px-8 text-center text-white">
          <span className="mb-4 text-[8px] md:text-[10px] tracking-[0.6em] uppercase opacity-60">Architecture & Interior Studio</span>
          <h1 className="mb-6 text-4xl md:text-8xl font-light tracking-[0.2em] md:tracking-[0.3em] uppercase leading-tight text-white">Araft Studio</h1>
          <p className="mb-10 max-w-lg text-[10px] md:text-sm font-light tracking-[0.3em] md:tracking-[0.4em] uppercase opacity-70 leading-loose">
            Crafting Spaces, Redefining Living. <br className="hidden md:block" />
            Modern & Sustainable Architecture.
          </p>
          <a href="#portfolio" className="group relative border border-white/40 px-10 py-3.5 transition-all duration-500 hover:border-white overflow-hidden">
            <span className="relative z-10 text-[9px] tracking-[0.3em] uppercase font-light group-hover:text-black transition-colors duration-500">Explore Works</span>
            <div className="absolute inset-0 z-0 scale-y-0 bg-white transition-transform duration-500 origin-bottom group-hover:scale-y-100" />
          </a>
        </motion.div>
      </main>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="bg-white text-black py-24 md:py-32 px-6 md:px-24 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center text-left">
          <motion.div variants={fadeInVariant} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="relative h-[400px] md:h-[600px] w-full bg-gray-100 overflow-hidden shadow-xl">
            <Image src="/skin.jpg" alt="PAMORN GRISAST" fill className="object-cover" />
          </motion.div>
          <motion.div variants={fadeInVariant} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="space-y-8 md:space-y-10">
            <div className="space-y-2">
              <h2 className="text-[9px] tracking-[0.4em] uppercase text-gray-400 font-bold">The Architect</h2>
              <h3 className="text-3xl md:text-6xl font-extralight tracking-tighter text-black uppercase">PAMORN GRISAST</h3>
            </div>
            <p className="text-gray-500 text-base md:text-lg leading-relaxed font-light italic border-l-4 border-black pl-6">"งานสถาปัตยกรรมคือการสร้างจิตวิญญาณให้แก่ผู้อยู่อาศัย"</p>
            <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">เราเน้นการใช้แสงธรรมชาติและวัสดุที่ยั่งยืน เพื่อสร้างสรรค์สถาปัตยกรรมที่เหนือกาลเวลา</p>
            <div className="pt-4">
              <div className="inline-block border border-black/10 px-6 py-5 md:px-8 md:py-6 bg-gray-50 group hover:bg-black transition-all cursor-pointer">
                <p className="text-[9px] tracking-[0.2em] uppercase font-bold mb-1 group-hover:text-white/50 text-black">Professional License</p>
                <p className="text-base md:text-lg font-light group-hover:text-white transition-colors uppercase tracking-widest text-black">License No. สถ. 25xx/xxxx</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. PORTFOLIO SECTION */}
      <section id="portfolio" className="py-24 md:py-32 px-6 md:px-24 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-8 md:gap-12 border-b border-gray-100 pb-10 text-left">
            <motion.div variants={fadeInVariant} initial="initial" whileInView="whileInView">
              <h2 className="text-[9px] tracking-[0.5em] uppercase text-gray-400 font-bold mb-3">Selected Portfolio</h2>
              <h3 className="text-3xl md:text-6xl font-extralight uppercase tracking-tighter text-black leading-none">Featured Projects</h3>
            </motion.div>

            <div className="flex flex-wrap gap-4 md:gap-8 text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-bold">
              {['All', 'Residential', 'Commercial', 'Renovation'].map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`transition-all duration-300 relative pb-1 ${activeCategory === cat ? 'text-black' : 'text-gray-300 hover:text-black'}`}>
                  {cat}
                  {activeCategory === cat && <motion.div layoutId="underline" className="absolute bottom-0 left-0 w-full h-[1.5px] bg-black" />}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 tracking-[0.4em] uppercase text-[9px]">Loading Works...</div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project: any) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group cursor-pointer text-left"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative overflow-hidden aspect-[16/10] mb-6 md:mb-8 bg-gray-100 shadow-sm">
                      {project.image ? (
                        <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-[10px] tracking-widest">No Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                          <Maximize2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" size={32} strokeWidth={1} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                        <div className="space-y-1">
                          <p className="text-[8px] tracking-[0.3em] uppercase text-gray-400 font-bold">{project.category}</p>
                          <h4 className="text-xl md:text-3xl font-light tracking-tight text-black">{project.title}</h4>
                        </div>
                        <p className="text-[9px] tracking-[0.1em] text-gray-400 italic">📍 {project.location || 'N/A'}</p>
                      </div>
                      
                      <div className="flex justify-between items-center group/btn">
                        <p className="text-xs md:text-sm text-gray-500 font-light max-w-[70%] line-clamp-1">
                          {project.concept || 'View details'}
                        </p>
                        <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] tracking-[0.3em] uppercase font-bold text-gray-300 group-hover/btn:text-black transition-colors">
                          Details <ArrowRight size={12} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredProjects.length === 0 && (
            <div className="py-20 text-center text-gray-400 font-light italic text-sm">No projects found.</div>
          )}
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-24 bg-[#fafafa] text-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32">
          <motion.div variants={fadeInVariant} initial="initial" whileInView="whileInView" className="space-y-10 md:space-y-12 text-left">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-[9px] tracking-[0.5em] uppercase text-gray-400 font-bold">Contact</h2>
              <h3 className="text-4xl md:text-7xl font-extralight uppercase tracking-tighter leading-none text-black">Let's Talk.</h3>
            </div>
            <div className="space-y-4 md:space-y-6 text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase text-gray-600">
              <p className="hover:text-black transition-colors cursor-pointer">hello@araftstudio.com</p>
              <p className="hover:text-black transition-colors cursor-pointer">+66 8x xxx xxxx</p>
              <p className="text-gray-400">Pathum Thani, Thailand</p>
            </div>
          </motion.div>

          <motion.form variants={fadeInVariant} initial="initial" whileInView="whileInView" className="space-y-6 md:space-y-8 text-left">
            <input type="text" placeholder="NAME" className="w-full bg-transparent border-b border-gray-200 py-3 md:py-4 text-[9px] md:text-[10px] tracking-[0.3em] focus:border-black outline-none transition-all" />
            <input type="email" placeholder="EMAIL" className="w-full bg-transparent border-b border-gray-200 py-3 md:py-4 text-[9px] md:text-[10px] tracking-[0.3em] focus:border-black outline-none transition-all" />
            <textarea placeholder="PROJECT DETAILS" rows={3} className="w-full bg-transparent border-b border-gray-200 py-3 md:py-4 text-[9px] md:text-[10px] tracking-[0.3em] focus:border-black outline-none transition-all resize-none"></textarea>
            <button className="w-full py-5 bg-black text-white text-[9px] md:text-[10px] tracking-[0.4em] uppercase hover:bg-gray-800 transition-all font-bold">Send Inquiry</button>
          </motion.form>
        </div>
      </section>

      <footer className="py-10 text-center bg-white text-gray-300">
        <p className="text-[8px] tracking-[0.5em] uppercase">© 2026 Araft Design Studio / Created by Thanakorn</p>
      </footer>
    </div>
  );
}