/**
 * APEC VIET NAM 2027 — Configuration & Member Economies Data
 * Host City: Phú Quốc, Viet Nam
 * 21 Member Economies of the Asia-Pacific Economic Cooperation
 */

const APEC_CONFIG = {
  // Summit metadata
  summit: {
    year: '2027',
    host: 'Phú Quốc, Kiên Giang, Việt Nam',
    themeVi: 'Hội tụ sức mạnh — Kiến tạo tương lai',
    themeEn: 'Converging Strength — Shaping the Future',
    subtitleVi: 'Diễn đàn Hợp tác Kinh tế châu Á – Thái Bình Dương hội tụ tại Đảo Ngọc Phú Quốc, cùng 21 nền kinh tế thành viên kiến tạo tương lai phát triển bền vững và thịnh vượng.',
    subtitleEn: 'The Asia-Pacific Economic Cooperation summit convenes in the Pearl Island of Phu Quoc, uniting 21 member economies to foster resilient, inclusive and sustainable shared prosperity.'
  },

  // 21 APEC Member Economies (Official APEC designation: "Member Economies")
  memberEconomies: [
    {
      id: 'vn',
      name: 'Viet Nam',
      nameVi: 'Việt Nam',
      officialName: 'Socialist Republic of Viet Nam',
      code: 'VN',
      flagUrl: 'assets/flags/vn.png',
      host: true,
      joinYear: 1998,
      region: 'Southeast Asia',
      theme: 'Host Economy — APEC 2027 Phú Quốc',
      color: '#DA251D'
    },
    {
      id: 'us',
      name: 'United States',
      nameVi: 'Hoa Kỳ',
      officialName: 'United States of America',
      code: 'US',
      flagUrl: 'assets/flags/us.png',
      host: false,
      joinYear: 1989,
      region: 'North America',
      theme: 'Global Technology, Capital & Innovation',
      color: '#0A3161'
    },
    {
      id: 'mx',
      name: 'Mexico',
      nameVi: 'Mê-hi-cô',
      officialName: 'United Mexican States',
      code: 'MX',
      flagUrl: 'assets/flags/mx.png',
      host: false,
      joinYear: 1993,
      region: 'North America',
      theme: 'Cross-Pacific Nearshoring & Cultural Heritage',
      color: '#006847'
    },
    {
      id: 'au',
      name: 'Australia',
      nameVi: 'Úc',
      officialName: 'Commonwealth of Australia',
      code: 'AU',
      flagUrl: 'assets/flags/au.png',
      host: false,
      joinYear: 1989,
      region: 'Oceania',
      theme: 'Founding Member Economy',
      color: '#00247D'
    },
    {
      id: 'jp',
      name: 'Japan',
      nameVi: 'Nhật Bản',
      officialName: 'Japan',
      code: 'JP',
      flagUrl: 'assets/flags/jp.png',
      host: false,
      joinYear: 1989,
      region: 'East Asia',
      theme: 'Technological Excellence & Green Transformation',
      color: '#BC002D'
    },
    {
      id: 'cl',
      name: 'Chile',
      nameVi: 'Chi-lê',
      officialName: 'Republic of Chile',
      code: 'CL',
      flagUrl: 'assets/flags/cl.png',
      host: false,
      joinYear: 1994,
      region: 'South America',
      theme: 'Pacific Gateway & Sustainable Mining',
      color: '#0039A6'
    },
    {
      id: 'cn',
      name: 'China',
      nameVi: 'Trung Quốc',
      officialName: "People's Republic of China",
      code: 'CN',
      flagUrl: 'assets/flags/cn.png',
      host: false,
      joinYear: 1991,
      region: 'East Asia',
      theme: 'Global Trade & High-Tech Manufacturing',
      color: '#DE2910'
    },
    {
      id: 'kr',
      name: 'Republic of Korea',
      nameVi: 'Hàn Quốc',
      officialName: 'Republic of Korea',
      code: 'KR',
      flagUrl: 'assets/flags/kr.png',
      host: false,
      joinYear: 1989,
      region: 'East Asia',
      theme: 'Digital Economy & Semiconductor Leadership',
      color: '#0047A0'
    },
    {
      id: 'ca',
      name: 'Canada',
      nameVi: 'Ca-na-đa',
      officialName: 'Canada',
      code: 'CA',
      flagUrl: 'assets/flags/ca.png',
      host: false,
      joinYear: 1989,
      region: 'North America',
      theme: 'Innovation & Clean Energy',
      color: '#FF0000'
    },
    {
      id: 'id',
      name: 'Indonesia',
      nameVi: 'In-đô-nê-xi-a',
      officialName: 'Republic of Indonesia',
      code: 'ID',
      flagUrl: 'assets/flags/id.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      theme: 'Maritime Archipelagic Economy & Digital Growth',
      color: '#CE1126'
    },
    {
      id: 'sg',
      name: 'Singapore',
      nameVi: 'Xin-ga-po',
      officialName: 'Republic of Singapore',
      code: 'SG',
      flagUrl: 'assets/flags/sg.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      theme: 'Global Trade Hub & Smart Nation Infrastructure',
      color: '#ED2939'
    },
    {
      id: 'my',
      name: 'Malaysia',
      nameVi: 'Ma-lai-xi-a',
      officialName: 'Malaysia',
      code: 'MY',
      flagUrl: 'assets/flags/my.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      theme: 'Sustainable Supply Chains & Halal Economy',
      color: '#010066'
    },
    {
      id: 'th',
      name: 'Thailand',
      nameVi: 'Thái Lan',
      officialName: 'Kingdom of Thailand',
      code: 'TH',
      flagUrl: 'assets/flags/th.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      theme: 'Bio-Circular-Green (BCG) Economic Model',
      color: '#2D2A4A'
    },
    {
      id: 'ph',
      name: 'Philippines',
      nameVi: 'Phi-líp-pin',
      officialName: 'Republic of the Philippines',
      code: 'PH',
      flagUrl: 'assets/flags/ph.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      theme: 'Services, IT-BPO & Resilient Communities',
      color: '#0038A8'
    },
    {
      id: 'nz',
      name: 'New Zealand',
      nameVi: 'Niu Di-lân',
      officialName: 'New Zealand / Aotearoa',
      code: 'NZ',
      flagUrl: 'assets/flags/nz.png',
      host: false,
      joinYear: 1989,
      region: 'Oceania',
      theme: 'Indigenous Trade & Climate Resilience',
      color: '#00247D'
    },
    {
      id: 'ru',
      name: 'Russia',
      nameVi: 'Nga',
      officialName: 'Russian Federation',
      code: 'RU',
      flagUrl: 'assets/flags/ru.png',
      host: false,
      joinYear: 1998,
      region: 'Eurasia',
      theme: 'Trans-Pacific Transport & Natural Resources',
      color: '#0039A6'
    },
    {
      id: 'hk',
      name: 'Hong Kong, China',
      nameVi: 'Hồng Kông, Trung Quốc',
      officialName: 'Hong Kong Special Administrative Region',
      code: 'HK',
      flagUrl: 'assets/flags/hk.png',
      host: false,
      joinYear: 1991,
      region: 'East Asia',
      theme: 'International Finance & Maritime Logistics',
      color: '#C8102E'
    },
    {
      id: 'tw',
      name: 'Chinese Taipei',
      nameVi: 'Đài Bắc - Trung Hoa',
      officialName: 'Chinese Taipei',
      code: 'TW',
      flagUrl: 'assets/flags/tw.png',
      host: false,
      joinYear: 1991,
      region: 'East Asia',
      theme: 'Semiconductors & ICT Hardware Ecosystems',
      color: '#000095'
    },
    {
      id: 'pe',
      name: 'Peru',
      nameVi: 'Pê-ru',
      officialName: 'Republic of Peru',
      code: 'PE',
      flagUrl: 'assets/flags/pe.png',
      host: false,
      joinYear: 1998,
      region: 'South America',
      theme: 'Sustainable Agriculture & Megadiverse Resources',
      color: '#D91023'
    },
    {
      id: 'bn',
      name: 'Brunei Darussalam',
      nameVi: 'Bru-nây Đa-rút-xa-lam',
      officialName: 'Nation of Brunei, the Abode of Peace',
      code: 'BN',
      flagUrl: 'assets/flags/bn.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      theme: 'Energy & Regional Connectivity',
      color: '#F7E017'
    },
    {
      id: 'pg',
      name: 'Papua New Guinea',
      nameVi: 'Pa-pua Niu Ghi-nê',
      officialName: 'Independent State of Papua New Guinea',
      code: 'PG',
      flagUrl: 'assets/flags/pg.png',
      host: false,
      joinYear: 1993,
      region: 'Oceania',
      theme: 'Biodiversity & Pacific Blue Economy',
      color: '#CE1126'
    }
  ],

  // 3D Scene Mathematical & Aesthetic Settings
  scene: {
    // Camera
    cameraFov: 42,
    cameraNear: 0.1,
    cameraFar: 2000,
    cameraBasePos: { x: 0, y: 0.9, z: 19.8 },
    cameraBaseLookAt: { x: 0, y: -2.0, z: 0 },
    
    // Central Phu Quoc World (Foreground)
    phuquoc: {
      radius: 10.5,
      yOffset: -7.5,
      groupY: -3.5,
      zOffset: 0.0,
      rotationX: -0.32,
      domeCoords: { x: -0.084, y: -6.488, z: -0.352 }
    },

    // Curved 3D Marquee System (Behind the sphere as requested)
    marquee: {
      cardWidth: 3.3,         // Standard 3:2 ratio width
      cardHeight: 2.2,        // Standard 3:2 ratio height (3.3 / 1.5)
      spacing: 4.1,           // Center-to-center pitch between cards
      curveRadius: 28.0,      // Concave cylindrical radius matching reference image
      zBase: -3.8,            // Positioned BEHIND the central Phu Quoc world
      yBase: -0.42,           // Lowered so flags sit behind the island horizon with full clearance for hero CTA
      speed: 1.8,             // Linear units per second
      hoverDecelFactor: 0.15  // Slowdown when inspecting a card
    },

    // Atmospheric Lighting
    lighting: {
      sunColor: 0xfff4dc,
      sunIntensity: 1.55,
      sunPos: { x: 10, y: 15, z: 12 },
      ambientColor: 0x98bfe8,
      ambientIntensity: 0.85,
      hemiSky: 0xc8e4ff,
      hemiGround: 0x092648,
      hemiIntensity: 0.7
    }
  }
};

window.APEC_CONFIG = APEC_CONFIG;
