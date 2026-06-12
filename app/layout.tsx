import type { Metadata } from 'next';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/space-grotesk/300.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import './globals.css';
import { StacksProvider } from '@/components/providers/StacksProvider';

export const metadata: Metadata = {
  title: 'AetherOS — AI Network Intelligence on Stacks',
  description:
    'AetherOS is an AI-powered relationship strategist and network intelligence system built on the Stacks blockchain. Connect your wallet, deploy strategies, own your data.',
  keywords: [
    'AetherOS', 'Stacks blockchain', 'AI networking', 'Web3', 'STX', 'relationship intelligence',
    'professional networking', 'Bitcoin DeFi', 'Clarity smart contracts',
  ],
  openGraph: {
    title: 'AetherOS — AI Network Intelligence on Stacks',
    description: 'Elite AI-powered professional network strategist, fully on-chain on Stacks.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body bg-aether-black text-white antialiased">
        <StacksProvider>
          {children}
        </StacksProvider>
      </body>
    </html>
  );
}
