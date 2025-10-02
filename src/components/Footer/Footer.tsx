import React from 'react';
import { Github, Mail, Twitter } from 'lucide-react';

interface FooterProps {
  isMobile: boolean;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="mt-auto py-4 md:py-3 px-0 w-full text-center border-t border-neutral-800 bg-gradient-to-b from-transparent to-[#000000]">
      <div className="footer-text text-[15px] md:text-base text-neutral-500 mb-2">
        / Made with <span className="text-red-500">♥️</span> & caffeine // Manasvi /
      </div>
      <div className="flex justify-center items-center gap-1 mt-2 -mb-2">
        <a 
          href="https://github.com/manasvitwr" 
          className="text-neutral-600 hover:text-white transition-colors duration-200"
        >
          <Github size={20} />
        </a>
        <span className="text-neutral-600 text-sm">/</span>
        <a 
          href="https://x.com/manasvitwr" 
          className="text-neutral-600 hover:text-white transition-colors duration-200"
        >
          <Twitter size={20} />
        </a>
        <span className="text-neutral-600 text-sm">/</span>
        <a 
          href="mailto:manasvi.tiwari@proton.me" 
          className="text-neutral-600 hover:text-white transition-colors duration-200"
        >
          <Mail size={20} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
