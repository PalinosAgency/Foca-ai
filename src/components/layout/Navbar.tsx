import { DesktopNavbar } from './DesktopNavbar';
import { MobileNavbar } from './MobileNavbar';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#040949] border-b border-white/10 shadow-md h-16 lg:h-20 transition-all">
      <div className="container mx-auto px-4 h-full">
        <DesktopNavbar />
        <MobileNavbar />
      </div>
    </nav>
  );
}