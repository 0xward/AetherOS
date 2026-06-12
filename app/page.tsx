import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Token from '@/components/Token';
import GrantsShowcase from '@/components/GrantsShowcase';
import About from '@/components/About';
import { Ticker, CTASection } from '@/components/CtaSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Ticker />
      <GrantsShowcase />
      <Features />
      <HowItWorks />
      <Token />
      <About />
      <CTASection />
      <Footer />
    </main>
  );
}
