"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { MessageCircle, ArrowRight, X, Maximize2, Layout, Home as HomeIcon, Ruler, HardHat, Compass, ChevronLeft, ChevronRight } from 'lucide-react';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';

// --- Query ข้อมูล ---
const PROJECTS_QUERY = `*[_type == "project"]{
  _id, 
  title, 
  category, 
  location, 
  "image": image.asset->url,
  "gallery": gallery[].asset->url,
  concept, 
  area
}`;

const LocalNavbar = () => (
  <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 md:py-10 text-white mix-blend-difference font-sans text-left">
    <div className="text-xl md:text-2xl font-bold tracking-[0.4em]">ARAFT</div>
    <div className="hidden md:flex gap-12 text-[10px] tracking-[0.3em] uppercase font-medium text-left">
      <a href="#" className="hover:opacity-50 transition-opacity">Home</a>
      <a href="#about" className="hover:opacity-50 transition-opacity">About</a>
      <a href="#services" className="hover:opacity-50 transition-opacity">Services</a>
      <a href="#portfolio" className="hover:opacity-50 transition-opacity">Project</a>
      <a href="#contact" className="hover:opacity-50 transition-opacity">Contact</a>
    </div>
  </nav>
);

const fadeInVariant: Variants = {
  initial: { opacity: 0, y: 30 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const [projects, setProjects] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0); 

  // --- ข้อมูล Services (ห้ามลบเด็ดขาด ไม่งั้น Error แดง!) ---
  const services = [
    { icon: <HomeIcon size={28} strokeWidth={1} />, title: "Architectural Design", desc: "สร้างสรรค์โครงสร้างที่โดดเด่นและยั่งยืน" },
    { icon: <Layout size={28} strokeWidth={1} />, title: "Interior Design", desc: "เปลี่ยนพื้นที่ภายในให้ตอบโจทย์การใช้งาน" },
    { icon: <Compass size={28} strokeWidth={1} />, title: "Landscape Design", desc: "ออกแบบภูมิทัศน์ที่กลมกลืนกับธรรมชาติ" },
    { icon: <HardHat size={28} strokeWidth={1} />, title: "Construction Support", desc: "ให้คำปรึกษาและคุมงานก่อสร้างโดยผู้เชี่ยวชาญ" },
  ];

  useEffect(() => {
    client.fetch(PROJECTS_QUERY).then(data => setProjects(data));
  }, []);

  // ฟังก์ชันดึงรูปทั้งหมด
  const getProjectImages = useCallback(() => {
    if (!selectedProject) return [];
    const images = [];
    if (selectedProject.image) images.push(selectedProject.image);
    if (selectedProject.gallery && Array.isArray(selectedProject.gallery)) {
      images.push(...selectedProject.gallery);
    }
    return images.filter(Boolean);
  }, [selectedProject]);

  const projectImages = getProjectImages();

  const nextImg = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (projectImages.length > 1) {
      setCurrentImgIndex((prev) => (prev + 1) % projectImages.length);
    }
  };

  const prevImg = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (projectImages.length > 1) {
      setCurrentImgIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
    }
  };

  // Keyboard Control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowRight') nextImg();
      if (e.key === 'ArrowLeft') prevImg();
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, projectImages, currentImgIndex]);

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter((p: any) => p.category === activeCategory);

  const getCount = (cat: string) => cat === 'All' ? projects.length : projects.filter((p: any) => p.category === cat).length;

  return (
    <div className="bg-[#0c0c0c] selection:bg-white selection:text-black scroll-smooth font-sans text-white text-left">
      <LocalNavbar />

      {/* --- MODAL GALLERY --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-0 md:p-10" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full h-full md:h-auto md:max-w-7xl md:max-h-[90vh] overflow-y-auto relative text-black flex flex-col md:flex-row shadow-2xl" onClick={(e) => e.stopPropagation()}>
              
              <button className="absolute top-6 right-6 z-[210] p-3 bg-black text-white rounded-full" onClick={() => setSelectedProject(null)}><X size={20} /></button>
              
              <div className="md:w-3/5 relative h-[450px] md:h-auto bg-gray-100 group overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentImgIndex}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    {projectImages[currentImgIndex] && (
  <Image 
    src={urlFor(projectImages[currentImgIndex]).url()} 
    alt="Gallery" 
    fill 
    className="object-cover" 
  />
)} 
                  </motion.div>
                </AnimatePresence>
                
                {projectImages.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4 z-20">
                    <button onClick={prevImg} className="p-4 bg-white/20 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all active:scale-90"><ChevronLeft size={24} /></button>
                    <button onClick={nextImg} className="p-4 bg-white/20 hover:bg-white text-white hover:text-black rounded-full backdrop-blur-md transition-all active:scale-90"><ChevronRight size={24} /></button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-bold">{currentImgIndex + 1} / {projectImages.length}</div>
                  </div>
                )}
              </div>

              <div className="md:w-2/5 p-10 md:p-16 flex flex-col justify-center space-y-8 text-left">
                <div><p className="text-[12px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-4">{selectedProject.category}</p><h2 className="text-4xl md:text-6xl font-extralight tracking-tighter leading-none uppercase">{selectedProject.title}</h2></div>
                <div className="grid grid-cols-2 gap-8 border-y border-gray-100 py-10">
                  <div className="text-left"><p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Location</p><p className="text-sm font-light mt-1">{selectedProject.location || 'N/A'}</p></div>
                  <div className="text-left"><p className="text-[10px] tracking-[0.2em] uppercase font-bold text-gray-400">Area</p><p className="text-sm font-light mt-1">{selectedProject.area || 'N/A'}</p></div>
                </div>
                <p className="text-gray-600 leading-relaxed font-light text-lg text-left">{selectedProject.concept}</p>
                <button className="w-full py-6 bg-black text-white text-[10px] tracking-[0.4em] uppercase font-bold" onClick={() => setSelectedProject(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO --- */}
      <section className="relative h-screen flex items-center justify-center">
        <Image src="/architect-hero.jpg" alt="Hero" fill className="object-cover opacity-50" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-[12rem] font-extralight tracking-tighter uppercase mb-6">Araft Studio</h1>
          <p className="text-[10px] md:text-xs tracking-[0.6em] uppercase opacity-40 mb-12">Crafting the future of living spaces</p>
          <a href="#portfolio" className="inline-block border border-white/30 px-12 py-5 text-[10px] tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all">Explore Works</a>
        </motion.div>
      </section>

      {/* --- ABOUT --- */}
      <section id="about" className="py-32 bg-white text-black px-6 md:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeInVariant} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="relative h-[500px] md:h-[700px] bg-gray-100 overflow-hidden shadow-2xl">
            <Image src="/skin.jpg" alt="The Architect" fill className="object-cover" />
          </motion.div>
          <div className="space-y-12">
            <div className="text-left"><h2 className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-bold">The Architect</h2><h3 className="text-5xl md:text-7xl font-extralight uppercase">PAMORN GRISAST</h3></div>
            <p className="text-xl md:text-2xl text-gray-800 italic border-l-4 border-black pl-8 text-left uppercase">"สถาปัตยกรรมไม่ใช่แค่การสร้างอาคาร แต่คือการสร้างพื้นที่ที่มีจิตวิญญาณ"</p>
            <p className="text-gray-500 font-light text-lg text-left">เรามุ่งเน้นสถาปัตยกรรมที่ยั่งยืนและตอบสนองต่อผู้อยู่อาศัยในทุกมิติ</p>
          </div>
        </div>
      </section>

      {/* --- SERVICES (กู้คืนมาแล้ว!) --- */}
      <section id="services" className="py-32 bg-[#fafafa] text-black px-6 md:px-24 border-y border-gray-100 text-left">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInVariant} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="mb-20 text-left">
            <h2 className="text-[10px] tracking-[0.5em] uppercase text-gray-400 font-bold mb-4">Our Expertise</h2>
            <h3 className="text-4xl md:text-6xl font-extralight uppercase tracking-tighter leading-none">Professional Services</h3>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {services.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="space-y-6 group text-left">
                <div className="w-16 h-16 flex items-center justify-center bg-white border border-gray-100 group-hover:bg-black group-hover:text-white transition-all rounded-sm shadow-sm">{s.icon}</div>
                <h4 className="text-lg font-medium uppercase tracking-tight">{s.title}</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO --- */}
      <section id="portfolio" className="py-32 px-6 md:px-24 bg-white text-black text-left font-sans">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12 border-b border-gray-100 pb-12">
            <div className="space-y-4 text-left font-sans">
              <h2 className="text-[12px] tracking-[0.6em] uppercase text-gray-400 font-bold">Selected Archive</h2>
              <h3 className="text-6xl md:text-[8rem] font-extralight uppercase tracking-tighter">Project</h3>
            </div>
            <div className="flex gap-8 md:gap-12 text-[12px] md:text-[14px] font-bold uppercase tracking-widest overflow-x-auto no-scrollbar pb-2">
           {['All', 'Exterior', 'Interior', 'Exhibition'].map(cat => (
           <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)} 
      className={`transition-all duration-500 relative pb-4 flex items-center gap-3 whitespace-nowrap ${activeCategory === cat ? 'text-black scale-105' : 'text-gray-300 hover:text-gray-500'}`}
    >
      {cat} <span className="text-[10px] opacity-40">({getCount(cat)})</span>
      {activeCategory === cat && <motion.div layoutId="portLine" className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-black" />}
    </button>
  ))}
</div>
</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p: any, index: number) => (
               <motion.div 
               key={p._id} 
               layout 
               initial={{ opacity: 0, y: 40 }} 
               whileInView={{ opacity: 1, y: 0 }} 
               transition={{ duration: 0.8, delay: (index % 2) * 0.2 }} 
               onClick={() => { setSelectedProject(p); setCurrentImgIndex(0); }} 
               className="group cursor-pointer relative"
             >
               <div className="relative aspect-[16/11] overflow-hidden bg-gray-100 mb-10 shadow-sm">
                 {p.image && (
                   <Image 
                     src={urlFor(p.image).url()} 
                     alt={p.title} 
                     fill 
                     className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                   />
                 )}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Maximize2 size={24} className="text-white" />
                 </div>
               </div>
               
               <div className="flex justify-between items-end border-l-2 border-gray-100 pl-8 group-hover:border-black transition-colors duration-700">
                 <div className="space-y-4">
                   <div className="space-y-1">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] block">
                       {p.category}
                     </span>
                     <h4 className="text-4xl md:text-6xl font-extralight uppercase tracking-tight">
                       {p.title}
                     </h4>
                   </div>
                   <p className="text-sm text-gray-400 font-light italic">
                     📍 {p.location || 'BANGKOK, TH'}
                   </p>
                 </div>
                 <ArrowRight size={32} strokeWidth={1} className="text-gray-200 group-hover:text-black transition-all" />
               </div>
             </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="py-32 px-6 md:px-24 bg-[#0a0a0a] text-left">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-32 items-center text-left">
          <div className="space-y-12 text-left font-sans">
            <h3 className="text-6xl md:text-[10rem] font-extralight uppercase tracking-tighter leading-none text-white">Let's <br/> Work.</h3>
            <div className="space-y-6 text-xs tracking-widest uppercase text-white/30"><div className="space-y-2"><p className="text-white/60">Email Inquiry</p><p className="text-white hover:text-white/60 transition-colors tracking-[0.2em]">hello@araftstudio.com</p></div><div className="space-y-2"><p className="text-white/60">Office Location</p><p className="text-white tracking-[0.2em]">Pathum Thani, Thailand</p></div></div>
          </div>
          <form className="space-y-12 text-left">
            <div className="group space-y-2 text-left font-bold"><p className="text-[9px] tracking-[0.3em] text-white/20 uppercase group-focus-within:text-white transition-colors">Full Name</p><input type="text" className="w-full bg-transparent border-b border-white/10 py-4 text-[11px] tracking-widest outline-none focus:border-white uppercase text-white" /></div>
            <div className="group space-y-2 text-left font-bold"><p className="text-[9px] tracking-[0.3em] text-white/20 uppercase group-focus-within:text-white transition-colors">Email Address</p><input type="email" className="w-full bg-transparent border-b border-white/10 py-4 text-[11px] tracking-widest outline-none focus:border-white uppercase text-white" /></div>
            <div className="group space-y-2 text-left font-bold"><p className="text-[9px] tracking-[0.3em] text-white/20 uppercase group-focus-within:text-white transition-colors">Project Brief</p><textarea rows={2} className="w-full bg-transparent border-b border-white/10 py-4 text-[11px] tracking-widest outline-none focus:border-white transition-all resize-none uppercase text-white"></textarea></div>
            <button className="w-full py-6 bg-white text-black text-[11px] font-bold tracking-[0.5em] uppercase hover:bg-gray-200 transition-all shadow-2xl">Send Inquiry</button>
          </form>
        </div>
      </section>

      <footer className="py-20 text-center border-t border-white/5 bg-[#0a0a0a]"><p className="text-[9px] tracking-[0.5em] uppercase text-white/20 font-bold">© 2026 Araft Studio / Crafted by Thanakorn</p></footer>
      <a href="https://line.me/ti/p/@yourid" target="_blank" className="fixed bottom-10 right-10 z-[100] bg-[#06C755] text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center group"><MessageCircle size={24} fill="white" /><span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-4 transition-all uppercase text-[10px] tracking-widest font-bold whitespace-nowrap">Connect via Line</span></a>
    </div>
  );
}