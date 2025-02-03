'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from './Link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="הלכה למעשה" className="h-24" />
          </Link>
          
          <nav className={`lg:flex ${isMenuOpen ? 'block' : 'hidden'} lg:items-center`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-5">
              <Link
                href="/shiurim"
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                שיעורי הרב ברחבי הארץ
              </Link>

              <Link 
                href="/books" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                ספרי הרב
              </Link>
              <Link 
                href="/downloads" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
              הורדות
              </Link>
              <Link 
                href="/rabbis" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                רבני בית ההוראה
              </Link>



              <Link 
                href="/Binyan" 
                className="text-xl font-bold relative overflow-hidden group px-8 py-3 rounded-lg shadow-lg"
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-gradient-to-r from-accent-gold-400 to-accent-gold-600 group-hover:bg-gradient-to-l"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-gradient-to-l from-accent-gold-600 to-accent-gold-400 opacity-0 group-hover:opacity-100"></span>
                <span className="relative text-burgundy-900 group-hover:text-burgundy-800">קרן לבניין</span>
              </Link>
              <Link 
                href="/questions" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                שאלות ותשובות
              </Link>
              <Link 
                href="/distributors" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                מפיצים
              </Link>
              <Link 
                href="/luach" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                לוח ברכות
              </Link>
              <Link 
                href="/muktzeh" 
                className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
              >
                לוח מוקצה
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsAboutOpen(!isAboutOpen)}
                  className="text-burgundy-700 hover:text-burgundy-500 text-lg py-2"
                >
                  אודות
                  <span className={`mr-1 transition-transform ${isAboutOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isAboutOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                    <Link
                      href="/about/rav"
                      className="block px-4 py-3 text-burgundy-700 hover:text-burgundy-500 text-base hover:bg-gray-50"
                    >
                      אודות רב בית ההוראה
                    </Link>
                    <Link
                      href="/about/beit-horaah"
                      className="block px-4 py-3 text-burgundy-700 hover:text-burgundy-500 text-base hover:bg-gray-50"
                    >
                      אודות בית ההוראה
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </nav>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://www.matara.pro/nedarimplus/online/?mosad=7008758"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-burgundy-700 text-white px-6 py-2 rounded-lg hover:bg-burgundy-600 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              תרומה
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;