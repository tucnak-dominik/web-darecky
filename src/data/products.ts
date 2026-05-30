import type { Product } from '@/types/product';

const IMG_BASE = '/products';
const TODAY = '2026-05-30';

export const products: Product[] = [
  // ── 🍬 Drobnost (< 500 Kč) ────────────────────────────────
  {
    id: 'jordan-ponozky-3pack',
    name: 'Jordan ponožky (3-pack)',
    description:
      'Nejlepší ponožky na nožky v nejlepší barvě, které jsou na trhu!',
    price: 400,
    category: 'small',
    images: [`${IMG_BASE}/ponozky-jordan-scaled.webp`],
    buyUrl:
      'https://www.zalando.cz/jordan-everyday-crew-socks-3-pack-sportovni-ponozky-whiteblack-joc42j00p-a11.html',
    addedAt: TODAY,
  },
  {
    id: 'old-spice-whitewater-2l',
    name: 'Old Spice Whitewater sprchový gel 3v1 (2 l)',
    description:
      '2 litry toho nejlepšího mýdla, šampónu a ještě něčeho. Vystačí na měsíce.',
    price: 490,
    category: 'small',
    images: [`${IMG_BASE}/SG1146ss.webp`],
    buyUrl:
      'https://www.alza.cz/old-spice-whitewater-sprchovy-gel-3v1-2-1000-ml-d12920818.htm',
    addedAt: TODAY,
  },
  {
    id: 'taft-molding-clay',
    name: 'Schwarzkopf Taft Looks Molding Clay',
    description: 'Modelovací hlína na dokonalý účes.',
    price: 139,
    category: 'small',
    images: [`${IMG_BASE}/STL158.webp`],
    buyUrl:
      'https://www.alza.cz/maxi/schwarzkopf-taft-looks-molding-clay-75-ml-d5301705.htm',
    addedAt: TODAY,
  },

  // ── 🎁 Hezký dárek (500 – 1 999 Kč) ──────────────────────
  {
    id: 'hendricks-flora-adora',
    name: "Hendrick's Flora Adora Gin",
    description: 'S Trpitelkou máme rádi tento gin!',
    price: 679,
    category: 'medium',
    images: [`${IMG_BASE}/thumb_1000_700_1680248418hendricks_floraadora_70cl_front.jpg`],
    buyUrl: 'https://www.alkohol.cz/produkty/hendrick-s-gin-flora-adora-20933',
    addedAt: TODAY,
  },
  {
    id: 'kolo-casu-7-koruna-mecu',
    name: 'Kolo času: Koruna mečů (7. díl)',
    description:
      'Sedmý díl ságy — pouze pokud už mám 4., 5. a 6. díl, ať mi navazují.',
    price: 805,
    category: 'medium',
    images: [`${IMG_BASE}/koruna-z-mecu-1.jpg`],
    buyUrl:
      'https://www.knihydobrovsky.cz/kniha/kolo-casu-koruna-mecu-731242188',
    addedAt: TODAY,
  },
  {
    id: 'seladon-barbers-club-poukaz',
    name: 'Poukaz do Seladon Barbers Club',
    description: 'Úprava vlasů a vousů od profíků.',
    price: 820,
    category: 'medium',
    images: [`${IMG_BASE}/DSC08799.jpg`],
    buyUrl: 'https://www.google.com/maps/place/Seladon+Barbers+Club/',
    addedAt: TODAY,
  },
  {
    id: 'kolo-casu-5-ohen-z-nebes',
    name: 'Kolo času: Oheň z nebes (5. díl)',
    description: 'Pátý díl ságy — pouze pokud už mám 4. díl, ať navazují.',
    price: 894,
    category: 'medium',
    images: [`${IMG_BASE}/kolo-casu-ohen-z-nebes-9788024292830_5.jpg`],
    buyUrl:
      'https://www.knihydobrovsky.cz/kniha/kolo-casu-ohen-z-nebes-559031964',
    addedAt: TODAY,
  },
  {
    id: 'kolo-casu-6-pan-chaosu',
    name: 'Kolo času: Pán chaosu (6. díl)',
    description: 'Šestý díl ságy — pouze pokud už mám 4. a 5. díl.',
    price: 894,
    category: 'medium',
    images: [`${IMG_BASE}/kolo-casu-pan-chaosu-9788024261997_7.jpg`],
    buyUrl:
      'https://www.knihydobrovsky.cz/kniha/kolo-casu-6-pan-chaosu-101514436',
    addedAt: TODAY,
  },
  {
    id: 'lego-lednacek-10331',
    name: 'LEGO Ledňáček (10331)',
    description: 'Ledňáček je zkrátka nádherný a dodá oživení.',
    price: 1219,
    category: 'medium',
    images: [`${IMG_BASE}/10331.webp`],
    buyUrl: 'https://www.lego.com/cs-cz/product/kingfisher-bird-10331',
    addedAt: TODAY,
  },
  {
    id: 'death-stranding-2-ps5',
    name: 'Death Stranding 2: On The Beach (PS5)',
    description:
      'Druhý díl tě vezme do Austrálie, kde budeš propojovat chirální síť.',
    price: 1529,
    category: 'medium',
    images: [`${IMG_BASE}/PSV0370.webp`],
    buyUrl:
      'https://www.alza.cz/gaming/death-stranding-2-on-the-beach-ps5-d7580284.htm',
    addedAt: TODAY,
  },
  {
    id: 'moschino-toy-boy-edp',
    name: 'Moschino Toy Boy — parfémovaná voda',
    description: 'Tuto parfémovanou vodu jsem využíval celý rok.',
    price: 1583,
    category: 'medium',
    images: [`${IMG_BASE}/toy-boy___200115.webp`],
    buyUrl: 'https://www.notino.cz/moschino/toy-boy-parfemovana-voda-pro-muze/',
    addedAt: TODAY,
  },
  {
    id: 'borderlands-4-ps5',
    name: 'Borderlands 4 (PS5)',
    description: 'Pokračování oblíbené série looter-shooterů.',
    price: 1899,
    category: 'medium',
    images: [`${IMG_BASE}/PSV0756.webp`],
    buyUrl: 'https://www.alza.cz/gaming/borderlands-4-ps5-d12509018.htm',
    addedAt: TODAY,
  },

  // ── 🎀 Větší radost (2 000 – 4 999 Kč) ───────────────────
  {
    id: 'lego-mars-rover-perseverance-42158',
    name: 'LEGO NASA Mars Rover Perseverance (42158)',
    description:
      'Velmi komplexní a zabaví na dlouhou dobu. A ještě k tomu je plně pojízdné!',
    price: 2299,
    category: 'large',
    images: [`${IMG_BASE}/42158.webp`],
    buyUrl:
      'https://www.lego.com/cs-cz/product/nasa-mars-rover-perseverance-42158',
    addedAt: TODAY,
  },
  {
    id: 'lego-hokusai-velka-vlna-31208',
    name: 'LEGO Hokusai — Velká vlna (31208)',
    description:
      'Nádherný umělecký kousek. Dobře vypadá a ještě k tomu je 3D!',
    price: 2369,
    category: 'large',
    images: [`${IMG_BASE}/31208.webp`],
    buyUrl: 'https://www.lego.com/cs-cz/product/hokusai-the-great-wave-31208',
    addedAt: TODAY,
  },
  {
    id: 'lego-hogwarts-castle-76419',
    name: 'LEGO Hogwarts Castle and Grounds (76419)',
    description: 'Set ze světa Harryho Pottera. Nádherný doplněk do poličky.',
    price: 4199,
    category: 'large',
    images: [`${IMG_BASE}/76419.webp`],
    buyUrl:
      'https://www.lego.com/cs-cz/product/hogwarts-castle-and-grounds-76419',
    addedAt: TODAY,
  },
  {
    id: 'rock-for-people-vstupenka',
    name: 'Rock for People — vstupenka',
    description: 'Festival je už pravidelným zpříjemněním léta.',
    price: 4790,
    category: 'large',
    images: [`${IMG_BASE}/RFP-square.jpg`],
    buyUrl: 'https://rockforpeople.cz/tickets/',
    addedAt: TODAY,
  },
  {
    id: 'lego-concorde-10318',
    name: 'LEGO Concorde (10318)',
    description: 'Nádherný sběratelský set pro milovníky letadel.',
    price: 4899,
    category: 'large',
    images: [`${IMG_BASE}/10318.webp`],
    buyUrl: 'https://www.lego.com/cs-cz/product/concorde-10318',
    addedAt: TODAY,
  },

  // ── ✨ Splněné přání (≥ 5 000 Kč) ────────────────────────
  {
    id: 'lego-lunar-roving-vehicle-42182',
    name: 'LEGO NASA Apollo Lunar Roving Vehicle (42182)',
    description: 'Lunochod! Dokonce může sbírat i měsíční horniny!',
    price: 5499,
    category: 'premium',
    images: [`${IMG_BASE}/42182.webp`],
    buyUrl:
      'https://www.lego.com/cs-cz/product/nasa-apollo-lunar-roving-vehicle-lrv-42182',
    addedAt: TODAY,
  },
  {
    id: 'lego-t-rex-fossils-76968',
    name: 'LEGO Dinosaur Fossils — T-Rex (76968)',
    description:
      'Věrná fosílie Tyrannousaura Rexe — z LEGO kostiček!',
    price: 6299,
    category: 'premium',
    images: [`${IMG_BASE}/76968_Prod.webp`],
    buyUrl:
      'https://www.lego.com/cs-cz/product/dinosaur-fossils-tyrannosaurus-rex-76968',
    addedAt: TODAY,
  },
  {
    id: 'apple-airpods-pro-3',
    name: 'Apple AirPods Pro 3',
    description: 'Dvakrát lepší potlačení hluku a real-time překlad.',
    price: 6490,
    category: 'premium',
    images: [`${IMG_BASE}/JA940k4a.webp`],
    buyUrl: 'https://www.alza.cz/apple-airpods-pro-3-d13078758.htm',
    addedAt: TODAY,
  },
  {
    id: 'lego-artemis-sls-10341',
    name: 'LEGO NASA Artemis Space Launch System (10341)',
    description:
      'Velmi kompaktní set. Zabírá prostoru ale hlavně do výšky!',
    price: 6499,
    category: 'premium',
    images: [`${IMG_BASE}/10341.webp`],
    buyUrl:
      'https://www.lego.com/cs-cz/product/nasa-artemis-space-launch-system-10341',
    addedAt: TODAY,
  },
  {
    id: 'lego-titanic-10294',
    name: 'LEGO Titanic (10294)',
    description: 'Chceš nasrat Trpitelku a zároveň mě velmi potěšit?',
    price: 16999,
    category: 'premium',
    images: [`${IMG_BASE}/10294_Prod.webp`],
    buyUrl: 'https://www.lego.com/cs-cz/product/lego-titanic-10294',
    addedAt: TODAY,
  },
  {
    id: 'hamilton-khaki-field-bronze',
    name: 'Hamilton Khaki Field Mechanical Bronze (H69459530)',
    description:
      'Mechanické hodinky s bronzovým pouzdrem, které si časem vyvinou vlastní patinu. Ruční nátah, 80hodinová rezerva chodu — autentická reedice vojenských hodinek.',
    price: 25800,
    category: 'premium',
    images: [`${IMG_BASE}/hamilton-khaki-field-bronze.jpg`],
    buyUrl:
      'https://www.hodinky-365.cz/hamilton-khaki-field-mechanical-bronze-h69459530-x1212397',
    addedAt: TODAY,
  },
  {
    id: 'iphone-17-pro-max-256',
    name: 'Apple iPhone 17 Pro Max 256 GB',
    description: 'Nový kousek z dílny Applu. Velký, pěkný, drahý.',
    price: 34990,
    category: 'premium',
    images: [`${IMG_BASE}/RI056b1.webp`],
    buyUrl: 'https://www.alza.cz/iphone-17-pro-max-256gb-stribrna-d13078799.htm',
    addedAt: TODAY,
  },
];
