export default function Navbar() {
    return (
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 text-white">
        <div className="text-xl font-medium tracking-[0.2em]">ARAFT</div>
        <div className="hidden md:flex gap-8 text-xs tracking-widest uppercase font-light">
          <a href="#" className="hover:opacity-50 transition">Home</a>
          <a href="#" className="hover:opacity-50 transition">About</a>
          <a href="#" className="hover:opacity-50 transition">Portfolio</a>
          <a href="#" className="hover:opacity-50 transition">Contact</a>
        </div>
        <div className="md:hidden text-xs uppercase tracking-widest">Menu</div>
      </nav>
    );
  }