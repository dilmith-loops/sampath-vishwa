import { GameInfo } from '@/types/game';
import { withBasePath } from '@/utils/paths';

export const GAMES: GameInfo[] = [
  {
    id: 'swipe-settle',
    title: 'The AR Swipe & Settle',
    subtitle: 'Smart Utility Settlements',
    tagline: 'Swipe away your utility bills instantly with Sampath Vishwa.',
    description: 'Pinch, drag, and swipe floating bills into the QuickPay zone to settle in seconds.',
    featurePillar: 'Instant Utility Payments',
    badge: 'Hand Motion Tracking',
    trackingTech: 'Google MediaPipe Hands',
    gestureType: 'hand',
    gestureName: 'Index Fingertip Pinch & Drag',
    accentColor: '#f37021',
    secondaryColor: '#ff8c42',
    iframePath: withBasePath('/games/swipe-settle/index.html'),
    durationSec: 30,
    howToPlay: [
      'Raise your hand in front of the webcam until your glowing fingertip cursor appears.',
      'Touch or hover over any hovering bill (Electricity, Water, Mobile, Internet) to grab it.',
      'Drag and swipe the bill down into the Vishwa QuickPay smartphone portal to settle.',
      'Earn +100 points for each utility bill cleared before the 30-second timer runs out!'
    ],
    benefits: [
      'Over 100+ billers connected instantly on Sampath Vishwa',
      'Real-time payment receipts and SMS confirmation',
      'Automated recurring payments and reminders'
    ],
    tips: 'Move smoothly and keep your hand within the camera frame for fast combos!'
  },
  {
    id: 'multitasker',
    title: 'The Multitasker’s Masterpiece',
    subtitle: 'Hands-Free Banking Hub',
    tagline: 'Banking so seamless, you can do it hands-free on the go.',
    description: 'Tilt your head left or right to approve or decline banking tasks hands-free.',
    featurePillar: 'Hands-Free Approvals',
    badge: 'Face & Head Angle Tracking',
    trackingTech: 'Google MediaPipe Face Mesh',
    gestureType: 'head',
    gestureName: 'Head Tilt Steering',
    accentColor: '#00ff88',
    secondaryColor: '#00b894',
    iframePath: withBasePath('/games/multitasker/index.html'),
    durationSec: 45,
    howToPlay: [
      'Center your face in the camera to activate your Sampath Vishwa AR Cyber Visor.',
      'Watch incoming banking tasks and promo cards falling from above.',
      'Tilt head RIGHT (↷) to Approve legitimate Vishwa transactions & e-FDs.',
      'Tilt head LEFT (↶) to Decline or Skip unknown spam prompts & fees.',
      'Build your multiplier streak up to x10 for maximum score!'
    ],
    benefits: [
      'Quick biometrics and facial verification',
      'One-tap transaction approval on mobile & smartwatch',
      'Context-aware smart banking dashboard'
    ],
    tips: 'A gentle 15° head tilt is enough to steer the falling bubble smoothly.'
  },
  {
    id: 'wealth-rain',
    title: 'Rain of Wealth',
    subtitle: 'Real-Time e-FD Savings Growth',
    tagline: 'Grow your savings in real-time with Sampath Vishwa.',
    description: 'Cup your hands together to catch falling gold coins and funnel wealth into the vault.',
    featurePillar: 'Fixed Deposits & Savings',
    badge: 'Two-Hand Motion & Physics',
    trackingTech: 'Google MediaPipe Hands Dual-Tracking',
    gestureType: 'two-hands',
    gestureName: 'Cupped Hands Energy Bridge',
    accentColor: '#d4af37',
    secondaryColor: '#f59e0b',
    iframePath: withBasePath('/games/wealth-rain/index.html'),
    durationSec: 45,
    howToPlay: [
      'Show both palms to the camera to generate a golden laser bridge between your hands.',
      'Position your hands to catch falling gold coins and interest badges (+10%, +12%, +15% p.a.).',
      'Funnel the bounces toward the central Sampath Vishwa Digital Vault.',
      'Fill the vault progress meter to 100% to maximize your digital wealth!'
    ],
    benefits: [
      'Open e-Fixed Deposits instantly with top market interest rates',
      'Flexible tenure options from 1 month to 5 years',
      'Instant loan against deposit available directly in Vishwa'
    ],
    tips: 'Hold both hands steady near the center to guide bonus rate badges into the safe!'
  },
  {
    id: 'biometric-shield',
    title: 'Biometric Security Shield',
    subtitle: 'Next-Gen Cyber & Fraud Defense',
    tagline: 'Your finances are shielded with world-class security.',
    description: 'Cross and raise your arms to project an energy shield that deflects cyber threats.',
    featurePillar: 'Multi-Layer Biometric Security',
    badge: 'Full-Body Pose & Arm Tracking',
    trackingTech: 'Google MediaPipe Pose',
    gestureType: 'pose',
    gestureName: 'Forearm Cyber Shield',
    accentColor: '#00f2ff',
    secondaryColor: '#0077b6',
    iframePath: withBasePath('/games/biometric-shield/index.html'),
    durationSec: 60,
    howToPlay: [
      'Step back slightly so the camera tracks your upper body and arms.',
      'Raise both wrists to generate a glowing hexagonal cyber energy shield.',
      'Move your shield to deflect RED cyber threats (Phishing, Malware, Fake SMS).',
      'Let GREEN verified tokens (OTP Verified, Bio Match) pass safely to your chest.',
      'Protect all 3 shield layers to keep your Vishwa Security Rating at 100%!'
    ],
    benefits: [
      'Multi-factor 2FA and Biometric Login protection',
      'Real-time AI behavioral fraud detection',
      'End-to-end 256-bit bank-grade encryption'
    ],
    tips: 'Cross your wrists or raise forearms high when multiple threats launch simultaneously!'
  }
];
