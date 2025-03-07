'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Custom hook for reveal animations
function useRevealAnimation() {
  const createObserver = (
    elements: (HTMLElement | null)[],
    options: IntersectionObserverInit = {}
  ) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Unobserve after animation triggered to improve performance
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1, // Lower threshold makes it easier to trigger
      rootMargin: '0px 0px -10% 0px', // More generous margin
      ...options 
    });

    elements.filter(Boolean).forEach(el => el && observer.observe(el));
    
    // Fallback: Make all elements visible after a timeout
    setTimeout(() => {
      elements.filter(Boolean).forEach(el => {
        if (el && !el.classList.contains('reveal-visible')) {
          el.classList.add('reveal-visible');
        }
      });
    }, 2000); // 2 second fallback
    
    return observer;
  };

  return { createObserver };
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLElement | null>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const { createObserver } = useRevealAnimation();

  // Initial animation when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      const heroSection = sectionsRef.current[0];
      if (heroSection) {
        heroSection.classList.add('reveal-visible');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []); // Ensure this useEffect runs only once

  useEffect(() => {
    const elements = sectionsRef.current;
    if (elements.length === 0) return;
    
    const observer = createObserver(elements);
    
    return () => observer.disconnect();
  }, [createObserver]); // Add createObserver to the dependency array

  const CountUp = (end: number, duration: number): number => {
    const [count, setCount] = useState(0);
    const [startCount, setStartCount] = useState(false);
  
    useEffect(() => {
      if (!isVisible) return;
  
      let start = 0;
      const startTime = Date.now();
  
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        start = Math.min(end, (elapsedTime / duration) * end);
        setCount(Math.ceil(start));
  
        if (start >= end) {
          clearInterval(timer);
        }
      }, 10);
  
      return () => clearInterval(timer);
    }, [end, duration, isVisible, startCount]); // Add startCount to the dependency array
  
    useEffect(() => {
      const handleScroll = () => {
        const element = statsRef.current;
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            setStartCount(true);
            window.removeEventListener('scroll', handleScroll);
          }
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    return count;
  };

  // Function to set section ref with animation variant
  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    if (el) {
      sectionsRef.current[index] = el;
    }
  };

  // Add this useEffect to ensure images are properly loaded
  useEffect(() => {
    // Force all images to reload and ensure they appear
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.complete) return;
      img.addEventListener('error', () => {
        console.error(`Failed to load image: ${img.src}`);
        // Optionally set a placeholder or fallback image
      });
    });
    
    // Ensure all elements are visible after page load regardless of scroll position
    const timer = setTimeout(() => {
      sectionsRef.current.forEach(section => {
        if (section) section.classList.add('reveal-visible');
      });
    }, 3000); // 3 seconds fallback
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container hero py-20 mt-20 reveal reveal-fade" ref={setSectionRef(0)}>
        <div className="container text-center text-white max-w-4xl mx-auto rounded-lg overflow-hidden hero-content">
        <Image src="/inverse-logo.svg" alt="Logo" width={180} height={60} className="mx-auto mb-8" />
          <h1 className="text-6xl font-bold mb-6">Give. Thrift. Uplift.</h1><button className="btn rounded-full bg-white text-black hover:bg-opacity-90 px-8 py-3 font-medium">
            Donate your items
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section bg-gray-50 reveal reveal-slide-up" 
               ref={(el) => { 
                 sectionsRef.current[1] = el; 
                 statsRef.current = el; 
               }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 first-section">
            <div className="stats-card reveal reveal-zoom reveal-delay-200">
              <Image src="/icons/store.svg" alt="Store Icon" width={48} height={48} className="mb-4 text-primary" />
              <p className="text-4xl font-bold text-primary mb-2">Stores</p>
              <h3 className="text-gray-600">{CountUp(4, 2000)}</h3>
            </div>
            <div className="stats-card reveal reveal-zoom reveal-delay-400">
              <Image src="/icons/donation.svg" alt="Donation Icon" width={48} height={48} className="mb-4 text-primary" />
              <p className="text-4xl font-bold text-primary text-center mb-2">Donation Centres</p>
              <h3 className="text-gray-600">{CountUp(15, 2000)}</h3>
            </div>
            <div className="stats-card reveal reveal-zoom reveal-delay-600">
              <Image src="/icons/participants.svg" alt="Participants Icon" width={48} height={48} className="mb-4 text-primary" />
              <p className="text-4xl font-bold text-primary mb-2">Partners</p>
              <h3 className="text-gray-600">{CountUp(9, 2000)}</h3>
            </div>
            <div className="stats-card reveal reveal-zoom reveal-delay-800">
            <Image src="/icons/Community.svg" alt="Community Icon" width={48} height={48} className="mb-4 text-primary" />
              <p className="text-4xl font-bold text-primary mb-2">Community</p>
              <h3 className="text-gray-600">{CountUp(10000, 2000)}+</h3>
            </div>
          </div>
          <div className="text-center mt-12 reveal reveal-fade reveal-delay-200">
            <p className="text-lg text-gray-600 mb-6 max-w-4xl mx-auto">As the social enterprise arm of The Salvation Army, Re:Nue aims to deliver excellent donation-in-kind service that meets underserved needs within our community.</p>
            <button className="btn rounded-full bg-black text-white hover:bg-opacity-90 px-8 py-3 font-medium">About Re:Nue</button>
          </div>
        </div>
      </section>

      {/* Store Section */}
      <section className="section bg-primary text-white reveal reveal-slide-right" ref={setSectionRef(2)}>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:items-start md:gap-12">
            <div className="relative h-[556px] rounded-lg overflow-hidden shadow-xl reveal reveal-slide-left reveal-delay-400 md:order-2">
              <Image
                src="/contentRight.svg"
                alt="Store front"
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-xl reveal reveal-slide-up reveal-delay-200 md:order-1">
              <h2 className="text-4xl font-bold mb-4">Re:Nue pillars</h2>
              <h3 className="text-2xl font-semibold mb-4">Store</h3>
              <p className="text-xl mb-12 opacity-90 leading-relaxed">Creating a fun and interesting thrifting experience, targeted at current customers and reaching out to younger, new generations who are interested in thrifting and repurposing.</p>
              <button className="btn bg-white text-primary rounded-full hover:bg-opacity-90 text-lg px-10">Learn more</button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-gray-50 reveal reveal-fade" ref={setSectionRef(3)}>
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Our values</h2>
          <div className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            
            <div className="value-card group cursor-pointer reveal reveal-slide-up reveal-delay-200">
              <div className="flex items-start p-8">
                <div className="flex-shrink-0 mr-6">
                    <Image src="/icons/target.svg" alt="Icon" width={48} height={48} className="w-12 h-12 text-primary transform transition-transform group-hover:rotate-180" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Purposeful</h3>
                  <p className="text-gray-600 text-lg">Making positive impact in our community by supporting those in need.</p>
                </div>
              </div>
              <div className="px-8 pb-8 max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96">
                <p className="text-gray-600">We believe in the power of purposeful action. Through our thrift stores and community programs, we create meaningful change that directly benefits those in need. Every donation and purchase contributes to our mission of building a stronger, more supportive community.</p>
              </div>
            </div>
            <div className="value-card group cursor-pointer reveal reveal-slide-up reveal-delay-400">
              <div className="flex items-start p-8">
                <div className="flex-shrink-0 mr-6">
                <Image src="/icons/love.svg" alt="Icon" width={48} height={48} className="w-12 h-12 text-primary transform transition-transform group-hover:rotate-180" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Passionate</h3>
                  <p className="text-gray-600 text-lg">Dedicated to creating positive change through thrift and community service.</p>
                </div>
              </div>
              <div className="px-8 pb-8 max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96">
                <p className="text-gray-600">Our passion drives everything we do. From carefully selecting and organizing donations to creating engaging community events, we pour our hearts into every aspect of our work. This passion helps us build lasting relationships and create meaningful impact.</p>
              </div>
            </div>
            <div className="value-card group cursor-pointer reveal reveal-slide-up reveal-delay-600">
              <div className="flex items-start p-8">
                <div className="flex-shrink-0 mr-6">
                <Image src="/icons/loveyellow.svg" alt="Icon" width={48} height={48} className="w-12 h-12 text-primary transform transition-transform group-hover:rotate-180" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Caring</h3>
                  <p className="text-gray-600 text-lg">Showing compassion and empathy in everything we do.</p>
                </div>
              </div>
              <div className="px-8 pb-8 max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96">
                <p className="text-gray-600">Care is at the heart of our organization. We understand that every individual&apos;s journey is unique, and we strive to provide support that meets their specific needs. Our caring approach extends to both our community members and the environment.</p>
              </div>
            </div>
            <div className="value-card group cursor-pointer reveal reveal-slide-up reveal-delay-800">
              <div className="flex items-start p-8">
                <div className="flex-shrink-0 mr-6">
                <Image src="/icons/auth.svg" alt="Icon" width={48} height={48} className="w-12 h-12 text-primary transform transition-transform group-hover:rotate-180" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-primary">Authentic</h3>
                  <p className="text-gray-600 text-lg">Being true to our mission and values in all our actions.</p>
                </div>
              </div>
              <div className="px-8 pb-8 max-h-0 overflow-hidden transition-all duration-500 ease-in-out group-hover:max-h-96">
                <p className="text-gray-600">Authenticity guides our every decision. We maintain transparency in our operations and stay true to our core values. This commitment to authenticity helps us build trust and create genuine connections within our community.</p>
              </div>
            </div>
          </div>
          </div>
          </section>
      {/* Community Section */}
      <section className="bg-secondary py-20 reveal reveal-slide-up" ref={setSectionRef(4)}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden reveal reveal-slide-up reveal-delay-200">
              <Image
                src="/partCommunity.jpg"
                alt="Community"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-white p-10 rounded-lg shadow-lg reveal reveal-slide-up reveal-delay-400">
              <h2 className="text-3xl font-bold mb-4">Be part of the community</h2>
              <p className="text-gray-600 mb-8">Join the Re:Nue community and unlock a world of exclusive perks and discounts when you shop with us!</p>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                  <div className="flex flex-col sm:flex-row mt-1">
                    <select className="w-full sm:w-20 mb-2 sm:mb-0 sm:mr-2 px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>+65</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Enter your mobile number"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="flex items-start mt-6">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    By registering through this membership application form, you agree that The Salvation Army Red Shield Industries Singapore may collect, use and disclose your personal data, as provided in this application form, for the following purposes in accordance with the Personal Data Protection Act 2012.
                  </label>
                </div>
                <button type="submit" className="w-full mt-6 px-4 py-3 bg-black text-white rounded-md hover:bg-opacity-90 transition-colors font-medium">
                  Join now
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
