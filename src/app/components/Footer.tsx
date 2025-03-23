// Footer.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-black text-white p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <Image src="/images/logo.png" alt="Metasploit" width={150} height={50} className="mb-4" />
          <p>Metasploit</p>
        </div>
        <div>
          <h3 className="font-bold mb-3">Sklep</h3>
          <ul>
            <li>
              <Link href="/category/new-arrivals">
                <span className="cursor-pointer hover:underline">Nowości</span>
              </Link>
            </li>
            <li>
              <Link href="/category/sale">
                <span className="cursor-pointer hover:underline">Wyprzedaż</span>
              </Link>
            </li>
            <li>
              <Link href="/category/top-rated">
                <span className="cursor-pointer hover:underline">Najwyżej oceniane</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Informacje</h3>
          <ul>
            <li>
              <Link href="/about">
                <span className="cursor-pointer hover:underline">O nas</span>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <span className="cursor-pointer hover:underline">Kontakt</span>
              </Link>
            </li>
            <li>
              <Link href="/policy">
                <span className="cursor-pointer hover:underline">Polityka prywatności</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Konto</h3>
          <ul>
            <li>
              <Link href="/account/orders">
                <span className="cursor-pointer hover:underline">Moje zamówienia</span>
              </Link>
            </li>
            <li>
              <Link href="/account/settings">
                <span className="cursor-pointer hover:underline">Ustawienia konta</span>
              </Link>
            </li>
            <li>
              <Link href="/account/help">
                <span className="cursor-pointer hover:underline"></span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center pt-8 border-t border-gray-700 mt-8">
        <p>&copy; {new Date().getFullYear()} Metasploit</p>
      </div>
    </footer>
  );
};

export default Footer;