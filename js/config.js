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
      officialNameVi: 'Cộng hòa Xã hội chủ nghĩa Việt Nam',
      code: 'VN',
      flagUrl: 'assets/flags/vn.png',
      host: true,
      joinYear: 1998,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Host Economy — APEC 2027 Phú Quốc',
      themeVi: 'Nền kinh tế Chủ nhà — APEC 2027 Phú Quốc',
      color: '#DA251D'
    },
    {
      id: 'us',
      name: 'United States',
      nameVi: 'Hoa Kỳ',
      officialName: 'United States of America',
      officialNameVi: 'Hợp chúng quốc Hoa Kỳ',
      code: 'US',
      flagUrl: 'assets/flags/us.png',
      host: false,
      joinYear: 1989,
      region: 'North America',
      regionVi: 'Bắc Mỹ',
      theme: 'Global Technology, Capital & Innovation',
      themeVi: 'Công nghệ toàn cầu, Nguồn vốn & Đổi mới sáng tạo',
      color: '#0A3161'
    },
    {
      id: 'mx',
      name: 'Mexico',
      nameVi: 'Mexico',
      officialName: 'United Mexican States',
      officialNameVi: 'Hợp chúng quốc Mexico',
      code: 'MX',
      flagUrl: 'assets/flags/mx.png',
      host: false,
      joinYear: 1993,
      region: 'North America',
      regionVi: 'Bắc Mỹ',
      theme: 'Cross-Pacific Nearshoring & Cultural Heritage',
      themeVi: 'Chuỗi sản xuất xuyên Thái Bình Dương & Di sản văn hóa',
      color: '#006847'
    },
    {
      id: 'au',
      name: 'Australia',
      nameVi: 'Australia',
      officialName: 'Commonwealth of Australia',
      officialNameVi: 'Thịnh vượng chung Australia',
      code: 'AU',
      flagUrl: 'assets/flags/au.png',
      host: false,
      joinYear: 1989,
      region: 'Oceania',
      regionVi: 'Châu Đại Dương',
      theme: 'Founding Member Economy & Clean Energy Transition',
      themeVi: 'Nền kinh tế sáng lập & Chuyển dịch năng lượng sạch',
      color: '#00247D'
    },
    {
      id: 'jp',
      name: 'Japan',
      nameVi: 'Nhật Bản',
      officialName: 'Japan',
      officialNameVi: 'Nhật Bản',
      code: 'JP',
      flagUrl: 'assets/flags/jp.png',
      host: false,
      joinYear: 1989,
      region: 'East Asia',
      regionVi: 'Đông Á',
      theme: 'Technological Excellence & Green Transformation',
      themeVi: 'Đỉnh cao công nghệ & Chuyển đổi xanh (GX)',
      color: '#BC002D'
    },
    {
      id: 'cl',
      name: 'Chile',
      nameVi: 'Chile',
      officialName: 'Republic of Chile',
      officialNameVi: 'Cộng hòa Chile',
      code: 'CL',
      flagUrl: 'assets/flags/cl.png',
      host: false,
      joinYear: 1994,
      region: 'South America',
      regionVi: 'Nam Mỹ',
      theme: 'Pacific Gateway & Sustainable Mining',
      themeVi: 'Cửa ngõ Nam Mỹ & Khai khoáng bền vững',
      color: '#0039A6'
    },
    {
      id: 'cn',
      name: 'China',
      nameVi: 'Trung Quốc',
      officialName: "People's Republic of China",
      officialNameVi: 'Cộng hòa Nhân dân Trung Hoa',
      code: 'CN',
      flagUrl: 'assets/flags/cn.png',
      host: false,
      joinYear: 1991,
      region: 'East Asia',
      regionVi: 'Đông Á',
      theme: 'Global Trade & High-Tech Manufacturing',
      themeVi: 'Thương mại toàn cầu & Sản xuất công nghệ cao',
      color: '#DE2910'
    },
    {
      id: 'kr',
      name: 'Republic of Korea',
      nameVi: 'Hàn Quốc',
      officialName: 'Republic of Korea',
      officialNameVi: 'Đại Hàn Dân Quốc',
      code: 'KR',
      flagUrl: 'assets/flags/kr.png',
      host: false,
      joinYear: 1989,
      region: 'East Asia',
      regionVi: 'Đông Á',
      theme: 'Digital Economy & Semiconductor Leadership',
      themeVi: 'Kinh tế số & Tiên phong công nghiệp bán dẫn',
      color: '#0047A0'
    },
    {
      id: 'ca',
      name: 'Canada',
      nameVi: 'Canađa',
      officialName: 'Canada',
      officialNameVi: 'Canada',
      code: 'CA',
      flagUrl: 'assets/flags/ca.png',
      host: false,
      joinYear: 1989,
      region: 'North America',
      regionVi: 'Bắc Mỹ',
      theme: 'Innovation & Clean Energy',
      themeVi: 'Đổi mới sáng tạo & Năng lượng sạch',
      color: '#FF0000'
    },
    {
      id: 'id',
      name: 'Indonesia',
      nameVi: 'Indonesia',
      officialName: 'Republic of Indonesia',
      officialNameVi: 'Cộng hòa Indonesia',
      code: 'ID',
      flagUrl: 'assets/flags/id.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Maritime Archipelagic Economy & Digital Growth',
      themeVi: 'Kinh tế biển đảo & Tăng trưởng số',
      color: '#CE1126'
    },
    {
      id: 'sg',
      name: 'Singapore',
      nameVi: 'Singapore',
      officialName: 'Republic of Singapore',
      officialNameVi: 'Cộng hòa Singapore',
      code: 'SG',
      flagUrl: 'assets/flags/sg.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Global Trade Hub & Smart Nation Infrastructure',
      themeVi: 'Trung tâm tài chính - thương mại & Quốc gia thông minh',
      color: '#ED2939'
    },
    {
      id: 'my',
      name: 'Malaysia',
      nameVi: 'Malaysia',
      officialName: 'Malaysia',
      officialNameVi: 'Malaysia',
      code: 'MY',
      flagUrl: 'assets/flags/my.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Sustainable Supply Chains & Halal Economy',
      themeVi: 'Chuỗi cung ứng bền vững & Kinh tế Halal toàn cầu',
      color: '#010066'
    },
    {
      id: 'th',
      name: 'Thailand',
      nameVi: 'Thái Lan',
      officialName: 'Kingdom of Thailand',
      officialNameVi: 'Vương quốc Thái Lan',
      code: 'TH',
      flagUrl: 'assets/flags/th.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Bio-Circular-Green (BCG) Economic Model',
      themeVi: 'Mô hình kinh tế Sinh học - Tuần hoàn - Xanh (BCG)',
      color: '#2D2A4A'
    },
    {
      id: 'ph',
      name: 'Philippines',
      nameVi: 'Philippines',
      officialName: 'Republic of the Philippines',
      officialNameVi: 'Cộng hòa Philippines',
      code: 'PH',
      flagUrl: 'assets/flags/ph.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Services, IT-BPO & Resilient Communities',
      themeVi: 'Dịch vụ, CNTT-BPO & Cộng đồng kiên cường',
      color: '#0038A8'
    },
    {
      id: 'nz',
      name: 'New Zealand',
      nameVi: 'New Zealand',
      officialName: 'New Zealand / Aotearoa',
      officialNameVi: 'New Zealand / Aotearoa',
      code: 'NZ',
      flagUrl: 'assets/flags/nz.png',
      host: false,
      joinYear: 1989,
      region: 'Oceania',
      regionVi: 'Châu Đại Dương',
      theme: 'Indigenous Trade & Climate Resilience',
      themeVi: 'Thương mại bản địa & Thích ứng biến đổi khí hậu',
      color: '#00247D'
    },
    {
      id: 'ru',
      name: 'Russia',
      nameVi: 'Nga',
      officialName: 'Russian Federation',
      officialNameVi: 'Liên bang Nga',
      code: 'RU',
      flagUrl: 'assets/flags/ru.png',
      host: false,
      joinYear: 1998,
      region: 'Eurasia',
      regionVi: 'Á - Âu',
      theme: 'Trans-Pacific Transport & Natural Resources',
      themeVi: 'Hành lang vận tải xuyên Thái Bình Dương & Năng lượng',
      color: '#0039A6'
    },
    {
      id: 'hk',
      name: 'Hong Kong, China',
      nameVi: 'Hồng Kông, Trung Quốc',
      officialName: 'Hong Kong Special Administrative Region',
      officialNameVi: 'Đặc khu Hành chính Hồng Kông',
      code: 'HK',
      flagUrl: 'assets/flags/hk.png',
      host: false,
      joinYear: 1991,
      region: 'East Asia',
      regionVi: 'Đông Á',
      theme: 'International Finance & Maritime Logistics',
      themeVi: 'Trung tâm tài chính quốc tế & Hậu cần hàng hải',
      color: '#C8102E'
    },
    {
      id: 'tw',
      name: 'Chinese Taipei',
      nameVi: 'Đài Bắc - Trung Hoa',
      officialName: 'Chinese Taipei',
      officialNameVi: 'Đài Bắc - Trung Hoa',
      code: 'TW',
      flagUrl: 'assets/flags/tw.png',
      host: false,
      joinYear: 1991,
      region: 'East Asia',
      regionVi: 'Đông Á',
      theme: 'Semiconductors & ICT Hardware Ecosystems',
      themeVi: 'Chíp bán dẫn & Hệ sinh thái phần cứng ICT',
      color: '#000095'
    },
    {
      id: 'pe',
      name: 'Peru',
      nameVi: 'Peru',
      officialName: 'Republic of Peru',
      officialNameVi: 'Cộng hòa Peru',
      code: 'PE',
      flagUrl: 'assets/flags/pe.png',
      host: false,
      joinYear: 1998,
      region: 'South America',
      regionVi: 'Nam Mỹ',
      theme: 'Sustainable Agriculture & Megadiverse Resources',
      themeVi: 'Nông nghiệp bền vững & Nguồn lợi đa dạng sinh học',
      color: '#D91023'
    },
    {
      id: 'bn',
      name: 'Brunei Darussalam',
      nameVi: 'Brunei',
      officialName: 'Nation of Brunei, the Abode of Peace',
      officialNameVi: 'Nhà nước Brunei Darussalam',
      code: 'BN',
      flagUrl: 'assets/flags/bn.png',
      host: false,
      joinYear: 1989,
      region: 'Southeast Asia',
      regionVi: 'Đông Nam Á',
      theme: 'Energy & Regional Connectivity',
      themeVi: 'Năng lượng sạch & Kết nối tiểu vùng',
      color: '#F7E017'
    },
    {
      id: 'pg',
      name: 'Papua New Guinea',
      nameVi: 'Papua New Guinea',
      officialName: 'Independent State of Papua New Guinea',
      officialNameVi: 'Nhà nước Độc lập Papua New Guinea',
      code: 'PG',
      flagUrl: 'assets/flags/pg.png',
      host: false,
      joinYear: 1993,
      region: 'Oceania',
      regionVi: 'Châu Đại Dương',
      theme: 'Biodiversity & Pacific Blue Economy',
      themeVi: 'Bảo tồn đa dạng sinh học & Kinh tế biển xanh',
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
      groupY: -0.4,
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
