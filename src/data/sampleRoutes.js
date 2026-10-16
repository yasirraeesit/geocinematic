export const SAMPLE_STORIES = [
  {
    id: 'silk-road',
    title: 'The Ancient Silk Road',
    subtitle: 'Cross-continental trade arteries that connected East and West for centuries',
    era: '130 BCE – 1453 CE',
    color: '#f59e0b', // Amber/gold
    duration: 18,
    routes: [
      {
        id: 'sr-1',
        name: 'Chang\'an to Samarkand',
        from: 'beijing',
        to: 'samarkand',
        color: '#f59e0b',
        arcHeight: 0.22,
        label: 'Oasis Central Route'
      },
      {
        id: 'sr-2',
        name: 'Samarkand to Baghdad',
        from: 'samarkand',
        to: 'baghdad',
        color: '#fbbf24',
        arcHeight: 0.18,
        label: 'Persian Highway'
      },
      {
        id: 'sr-3',
        name: 'Baghdad to Constantinople',
        from: 'baghdad',
        to: 'istanbul',
        color: '#f59e0b',
        arcHeight: 0.15,
        label: 'Gateway to Byzantium'
      },
      {
        id: 'sr-4',
        name: 'Constantinople to Rome',
        from: 'istanbul',
        to: 'rome',
        color: '#eab308',
        arcHeight: 0.14,
        label: 'Mediterranean Inflow'
      }
    ]
  },
  {
    id: 'discovery-magellan',
    title: 'Magellan\'s Circumnavigation',
    subtitle: 'The first global voyage crossing the Atlantic and Pacific oceans',
    era: '1519 – 1522 CE',
    color: '#06b6d4', // Cyan
    duration: 20,
    routes: [
      {
        id: 'mag-1',
        name: 'Sanlúcar to Rio de Janeiro',
        from: 'madrid',
        to: 'riodejaneiro',
        color: '#06b6d4',
        arcHeight: 0.35,
        label: 'Atlantic Crossing'
      },
      {
        id: 'mag-2',
        name: 'Rio de Janeiro to Cape Horn (Lima corridor)',
        from: 'riodejaneiro',
        to: 'lima',
        color: '#22d3ee',
        arcHeight: 0.28,
        label: 'Strait of Magellan'
      },
      {
        id: 'mag-3',
        name: 'Pacific Voyage to Asia',
        from: 'lima',
        to: 'singapore',
        color: '#38bdf8',
        arcHeight: 0.45,
        label: 'Vast Pacific Passage'
      },
      {
        id: 'mag-4',
        name: 'Indian Ocean Return via Africa',
        from: 'singapore',
        to: 'capetown',
        color: '#0284c7',
        arcHeight: 0.32,
        label: 'Cape of Good Hope'
      },
      {
        id: 'mag-5',
        name: 'Final Leg to Europe',
        from: 'capetown',
        to: 'madrid',
        color: '#0ea5e9',
        arcHeight: 0.3,
        label: 'Return to Spain'
      }
    ]
  },
  {
    id: 'modern-supercorridors',
    title: 'Global Air Corridors & Megahubs',
    subtitle: 'The busiest intercontinental aviation routes linking the global economy',
    era: 'Modern Era',
    color: '#ec4899', // Vibrant Rose/Pink
    duration: 15,
    routes: [
      {
        id: 'air-1',
        name: 'London Heathrow to JFK New York',
        from: 'london',
        to: 'newyork',
        color: '#f43f5e',
        arcHeight: 0.25,
        label: 'North Atlantic Track'
      },
      {
        id: 'air-2',
        name: 'New York to Tokyo Haneda',
        from: 'newyork',
        to: 'tokyo',
        color: '#ec4899',
        arcHeight: 0.38,
        label: 'Polar Transpacific Route'
      },
      {
        id: 'air-3',
        name: 'Dubai Hub to Singapore',
        from: 'dubai',
        to: 'singapore',
        color: '#d946ef',
        arcHeight: 0.26,
        label: 'Asia-Middle East Corridor'
      },
      {
        id: 'air-4',
        name: 'Tokyo to Sydney',
        from: 'tokyo',
        to: 'sydney',
        color: '#a855f7',
        arcHeight: 0.32,
        label: 'West Pacific Line'
      }
    ]
  }
];
