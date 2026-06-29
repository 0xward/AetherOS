import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AetherOS App',
  description: 'Generate strategies, stake tokens, vote on governance, and discover grants.',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
