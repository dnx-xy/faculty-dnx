'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <div className="bg-black text-white">
          <div className="container mx-auto px-6">
            <div className={styles.marquee}>
              <div className={styles.marqueeContent}>
                Welcome to Re:nue! Check out our latest updates and offers.
                {/* Additional scrolling content */}
                <span> • New arrivals every week! </span>
                <span className={styles.separator}>•</span>
                <span> Join our community events! </span>
                <span className={styles.separator}>•</span>
                <span> Exclusive discounts for members! </span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Re:nue Logo" width={200} height={56} priority />
            </Link>
            
            <div className="navbar-center">
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="text-base font-medium text-gray-600 hover:text-primary transition-colors">
                  Thrift with us
                </Link>
                <Link href="/store" className="text-base font-medium text-gray-600 hover:text-primary transition-colors">
                  Donate
                </Link>
                <Link href="/donate" className="text-base font-medium text-gray-600 hover:text-primary transition-colors">
                  Impact
                </Link>
                <Link href="/donate" className="text-base font-medium text-gray-600 hover:text-primary transition-colors">
                  About us
                </Link>
                <Link 
                  href="/get-involved" 
                >
                  Get Involved
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/contact" 
                className="btn btn-primary rounded-full px-8">
                Contact
              </Link>
            </div>

            <button className="md:hidden p-2" aria-label="Menu">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}