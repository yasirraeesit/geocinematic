export const ALLIANCE_PRESETS = [
  {
    id: 'middle-east-alignment',
    name: 'Middle East Geopolitical Divide',
    subtitle: 'Strategic alignment and regional security architecture',
    description: 'Regional confrontation, proxy networks, and defensive pacts across the Persian Gulf and Levant.',
    alliances: [
      {
        id: 'axis-resistance',
        name: 'Resistance Axis / Eastern Partners',
        color: '#dc2626', // Red
        countries: ['Iran', 'Syria', 'Iraq', 'Yemen']
      },
      {
        id: 'gulf-cooperation',
        name: 'Gulf Partners & Allies',
        color: '#2563eb', // Royal Blue
        countries: ['Saudi Arabia', 'United Arab Emirates', 'Israel', 'Jordan']
      },
      {
        id: 'neutral-mediators',
        name: 'Diplomatic Mediators',
        color: '#f59e0b', // Amber
        countries: ['Oman', 'Qatar', 'Kuwait']
      }
    ]
  },
  {
    id: 'nato-vs-russia',
    name: 'European Strategic Frontlines',
    subtitle: 'NATO Collective Defense vs. CSTO / Eastern Alignment',
    description: 'Post-Cold War geopolitical demarcation line spanning Scandinavia, Eastern Europe, and the Black Sea.',
    alliances: [
      {
        id: 'nato-members',
        name: 'NATO European Allies',
        color: '#0ea5e9', // Sky Blue
        countries: ['Poland', 'Germany', 'United Kingdom', 'France', 'Finland', 'Sweden', 'Norway', 'Estonia', 'Latvia', 'Lithuania']
      },
      {
        id: 'eastern-csto',
        name: 'Russian Sphere / CSTO',
        color: '#b91c1c', // Crimson
        countries: ['Russia', 'Belarus']
      },
      {
        id: 'contested-neutral',
        name: 'Frontline Nation',
        color: '#eab308', // Gold
        countries: ['Ukraine']
      }
    ]
  },
  {
    id: 'brics-vs-g7',
    name: 'BRICS+ vs. G7 Global Economy',
    subtitle: 'The multipolar shift in global economic trade and influence',
    description: 'Major emerging economies challenging Western financial architecture.',
    alliances: [
      {
        id: 'brics-core',
        name: 'BRICS+ Economies',
        color: '#d97706', // Gold / Amber
        countries: ['Brazil', 'Russia', 'India', 'China', 'South Africa', 'Iran', 'Egypt', 'United Arab Emirates']
      },
      {
        id: 'g7-core',
        name: 'G7 Western Bloc',
        color: '#4f46e5', // Indigo
        countries: ['United States', 'United Kingdom', 'France', 'Germany', 'Japan', 'Italy', 'Canada']
      }
    ]
  },
  {
    id: 'indo-pacific-theater',
    name: 'Indo-Pacific & South China Sea',
    subtitle: 'Maritime choke points and sovereign island disputes',
    description: 'Naval competition across the First Island Chain and Malacca Strait.',
    alliances: [
      {
        id: 'quad-allies',
        name: 'Quad & Western Pacific Partners',
        color: '#0284c7', // Cyan Blue
        countries: ['Japan', 'South Korea', 'Philippines', 'Australia', 'United States']
      },
      {
        id: 'china-prc',
        name: 'Mainland China & Regional Partners',
        color: '#dc2626', // Red
        countries: ['China', 'North Korea']
      },
      {
        id: 'taiwan-strait',
        name: 'Taiwan Strait Focal Point',
        color: '#10b981', // Emerald
        countries: ['Taiwan']
      }
    ]
  }
];
