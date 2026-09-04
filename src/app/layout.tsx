import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sampath Vishwa AR Games | Interactive Banking Kiosk Platform',
  description: 'Experience Sampath Vishwa Online Banking through cutting-edge AR games. Motion tracking utility bill payments, hands-free banking, e-FD wealth growth, and biometric cybersecurity defense.',
  keywords: 'Sampath Bank, Sampath Vishwa, AR Games, Fintech Kiosk, MediaPipe, Hand Tracking, Biometric Defense',
  authors: [{ name: 'Sampath Bank PLC' }],
  icons: {
    icon: '/brand/sampath-punkalasa.png',
    apple: '/brand/sampath-punkalasa.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-ambient-lights" aria-hidden="true">
          <div className="ambient-orb-1" />
          <div className="ambient-orb-2" />
          <div className="ambient-orb-3" />
          <div className="ambient-grid" />
        </div>
        <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
