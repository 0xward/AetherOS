import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AetherOS — AI Network Intelligence on Bitcoin';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #050507 0%, #0d0d18 50%, #050507 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow blobs */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(139,49,255,0.12)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '600px', height: '400px', borderRadius: '50%', background: 'rgba(255,45,155,0.10)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', width: '800px', height: '300px', borderRadius: '50%', background: 'rgba(0,255,140,0.04)', filter: 'blur(120px)' }} />

        {/* Grid pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Top badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', border: '1px solid rgba(139,49,255,0.3)', background: 'rgba(139,49,255,0.08)', marginBottom: '32px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00FF8C' }} />
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em' }}>
            STACKS MAINNET · LIVE
          </span>
        </div>

        {/* Logo + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'linear-gradient(135deg, #FF2D9B, #8B31FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 900, color: 'white', boxShadow: '0 0 40px rgba(139,49,255,0.5)' }}>
            A
          </div>
          <span style={{ fontSize: '72px', fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '-2px' }}>
            AetherOS
          </span>
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: '26px', fontWeight: 600, color: '#8B31FF', marginBottom: '16px' }}>
          AI Network Intelligence · Secured on Bitcoin
        </div>

        {/* Description */}
        <div style={{ display: 'flex', fontSize: '17px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', maxWidth: '700px', lineHeight: 1.5, marginBottom: '40px' }}>
          Generate elite 7-step professional networking strategies powered by Groq AI — anchored to Bitcoin via the Stacks blockchain.
        </div>

        {/* Tech badges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Stacks L2', color: '#FF5500' },
            { label: 'Groq AI', color: '#E8432D' },
            { label: 'SIP-010 Token', color: '#8B31FF' },
            { label: 'Gaia Storage', color: '#E91E8C' },
            { label: 'sBTC', color: '#F7931A' },
            { label: 'Clarity', color: '#00FF8C' },
          ].map((badge) => (
            <div
              key={badge.label}
              style={{ padding: '6px 14px', borderRadius: '8px', border: `1px solid ${badge.color}50`, background: `${badge.color}15`, fontSize: '13px', fontWeight: 600, color: badge.color, display: 'flex' }}
            >
              {badge.label}
            </div>
          ))}
        </div>

        {/* Bottom URL */}
        <div style={{ position: 'absolute', bottom: '28px', right: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.2)', display: 'flex' }}>
          aether-os-psi.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
