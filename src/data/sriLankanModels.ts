/** Offline reference listings. These models never enter the generic sizing or energy engine. */
export interface SriLankanACModel {
  id: string;
  profileId: string;
  brand: string;
  model: string;
  listedCapacityBTU: number;
  detail: string;
  source: string;
  sourceUrl: string;
  caution?: string;
}

export const modelResearchDate = '15 November 2026';

export const sriLankanModels: readonly SriLankanACModel[] = [
  { id: 'singer-sas09tcnr', profileId: 'SPL-09-STD', brand: 'Singer', model: 'SAS09TCNR', listedCapacityBTU: 9000, detail: 'Non-inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/singer-air-conditioner-non-inverter-9000-btu-sas09tcnr' },
  { id: 'gree-gwc09awaxa-k6nna1b', profileId: 'SPL-09-STD', brand: 'Gree Cosmo', model: 'GWC09AWAXA-K6NNA1B', listedCapacityBTU: 9000, detail: 'Non-inverter wall mount', source: 'Gree Airtech', sourceUrl: 'https://www.mygree.lk/ac-price/9000-btu' },
  { id: 'midea-msez1a09crdn8', profileId: 'SPL-09-INV', brand: 'Midea Klyma', model: 'MSEZ1A09CRDN8', listedCapacityBTU: 9000, detail: 'Inverter split', source: 'Laksela', sourceUrl: 'https://laksela.lk/product/midea-klyma-inverter-ac-with-kit-9000btu-msez1a09crdn8/' },
  { id: 'gree-gwc09atbxa-k6dna4a', profileId: 'SPL-09-INV', brand: 'Gree Charmo', model: 'GWC09ATBXA-K6DNA4A', listedCapacityBTU: 9000, detail: 'Inverter wall mount', source: 'Gree Airtech', sourceUrl: 'https://www.mygree.lk/ac-price/9000-btu' },
  { id: 'lg-s3-q09ja3bd', profileId: 'SPL-09-ECO', brand: 'LG Dual Cool', model: 'S3-Q09JA3BD', listedCapacityBTU: 9000, detail: 'Dual inverter; retailer lists 9,130 BTU/h rated cooling', source: 'Jungle.lk', sourceUrl: 'https://www.jungle.lk/product/lg-air-conditioner-9000btu-dual-cool-std-plus-r32-inverter-s3-q09ja3bd_72241/' },

  { id: 'singer-sas12tcnr', profileId: 'SPL-12-STD', brand: 'Singer', model: 'SAS12TCNR', listedCapacityBTU: 12000, detail: 'Non-inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/singer-air-conditioner-non-inverter-12000-btu-sas12tcnr' },
  { id: 'sisil-sl-elite12', profileId: 'SPL-12-STD', brand: 'Sisil', model: 'SL-ELITE12', listedCapacityBTU: 12000, detail: 'Non-inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/sisil-air-conditioner-non-inverter-12000-btu-sl-elite12' },
  { id: 'singer-sasi12inpro', profileId: 'SPL-12-INV', brand: 'Singer', model: 'SASI12INPRO', listedCapacityBTU: 12000, detail: 'Smart Wi-Fi inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/singer-air-conditioner-smart-wifi-inverter-12000-btu-sasi12inpro' },
  { id: 'gree-gwc12atbxb-k6dna4g', profileId: 'SPL-12-INV', brand: 'Gree Charmo', model: 'GWC12ATBXB-K6DNA4G', listedCapacityBTU: 12000, detail: 'Inverter wall mount', source: 'Gree Airtech', sourceUrl: 'https://www.mygree.lk/ac-price/12000-btu' },
  { id: 'lg-s3-q12ja17c', profileId: 'SPL-12-ECO', brand: 'LG', model: 'S3-Q12JA17C', listedCapacityBTU: 12000, detail: 'Dual inverter; published ISEER 4.7', source: 'LG Sri Lanka', sourceUrl: 'https://www.lg.com/lk/home-air-conditioners/lg-s3-q12ja17c' },
  { id: 'singer-sas-gri12vn', profileId: 'SPL-12-ECO', brand: 'Singer Green', model: 'SAS-GRI12VN', listedCapacityBTU: 12000, detail: 'Inverter; brochure lists 5-star rating', source: 'Singer Sri Lanka brochure', sourceUrl: 'https://www.singersl.com/brochure/download/SAS-GRI12VN' },

  { id: 'singer-sas18tcnr', profileId: 'SPL-18-STD', brand: 'Singer', model: 'SAS18TCNR', listedCapacityBTU: 18000, detail: 'Non-inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/singer-air-conditioner-non-inverter-18000-btu-sas18tcnr' },
  { id: 'sisil-sl-elite18', profileId: 'SPL-18-STD', brand: 'Sisil', model: 'SL-ELITE18', listedCapacityBTU: 18000, detail: 'Non-inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/sisil-air-conditioner-non-inverter-18000-btu-sl-elite18' },
  { id: 'samsung-smgar50h19d1j', profileId: 'SPL-18-INV', brand: 'Samsung', model: 'SMGAR50H19D1J', listedCapacityBTU: 18000, detail: 'Wi-Fi inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/samsung-air-conditioner-inverter-18000-btu-wi-fi-smgar50h19d1j' },
  { id: 'hitachi-h-rsqg018mfeoe', profileId: 'SPL-18-INV', brand: 'Hitachi', model: 'H-RSQG018MFEOE', listedCapacityBTU: 18000, detail: 'Wi-Fi inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/hitachi-air-conditioner-inverter-18000-btu-with-wifi-h-rsqg018mfeoe' },
  { id: 'lg-s3-q18kl17e', profileId: 'SPL-18-ECO', brand: 'LG', model: 'S3-Q18KL17E', listedCapacityBTU: 18000, detail: 'Dual inverter; published ISEER 4.73', source: 'LG Sri Lanka', sourceUrl: 'https://www.lg.com/lk/home-air-conditioners/lg-s3-q18kl17e', caution: 'Marketed as 18K; a local retailer lists 17,060 BTU/h rated cooling.' },
  { id: 'whites-wis18k-i5', profileId: 'SPL-18-ECO', brand: 'Whites', model: 'WIS18K-I5', listedCapacityBTU: 18000, detail: 'Inverter; brochure lists 18,015 BTU/h and ISEER 4.65', source: 'Singer Sri Lanka brochure', sourceUrl: 'https://www.singersl.com/brochure/download/WIS18K-I5' },

  { id: 'singer-sas24tcnrn', profileId: 'SPL-24-STD', brand: 'Singer', model: 'SAS24TCNRN', listedCapacityBTU: 24000, detail: 'Non-inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/singer-air-conditioner-non-inverter-24000-btu-sas24tcnrn' },
  { id: 'gree-gwc24awexf-k6nna1d', profileId: 'SPL-24-STD', brand: 'Gree Cosmo', model: 'GWC24AWEXF-K6NNA1D', listedCapacityBTU: 24000, detail: 'Non-inverter wall mount', source: 'Gree Airtech', sourceUrl: 'https://www.mygree.lk/ac-price/24000-btu' },
  { id: 'hitachi-h-rmrg024mfeoe', profileId: 'SPL-24-INV', brand: 'Hitachi', model: 'H-RMRG024MFEOE', listedCapacityBTU: 24000, detail: 'Wi-Fi inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/hitachi-air-conditioner-inverter-24000-btu-with-wifi-h-rmrg024mfeoe' },
  { id: 'singer-sasi24ab', profileId: 'SPL-24-INV', brand: 'Singer', model: 'SASI24AB', listedCapacityBTU: 24000, detail: 'Inverter split', source: 'Singer Sri Lanka', sourceUrl: 'https://www.singersl.com/product/singer-air-conditioner-inverter-24000-btu-sasi24ab' },
  { id: 'singer-sas-gri24v', profileId: 'SPL-24-ECO', brand: 'Singer Green', model: 'SAS-GRI24V', listedCapacityBTU: 24000, detail: 'Inverter; brochure lists 5-star rating', source: 'Singer Sri Lanka brochure', sourceUrl: 'https://www.singersl.com/brochure/download/SAS-GRI24V' },

  { id: 'super-general-sgp92t', profileId: 'POR-09-CMP', brand: 'Super General', model: 'SGP92T', listedCapacityBTU: 9000, detail: 'Portable; 220–240 V', source: 'Dhabione', sourceUrl: 'https://dhabione.lk/product/super-general-0-75-ton-air-conditioner/' },
  { id: 'hisense-ap-12cr4rnxs01', profileId: 'POR-12-PLUS', brand: 'Hisense', model: 'AP-12CR4RNXS01', listedCapacityBTU: 12000, detail: 'Portable; cooling, dry and fan modes', source: 'Tudo.lk', sourceUrl: 'https://tudo.lk/product/hisense-12000-btu-portable-air-conditioner' },
  { id: 'gree-r12c1', profileId: 'POR-12-PLUS', brand: 'Gree C’matic', model: 'R12C1', listedCapacityBTU: 12000, detail: 'Portable floor unit', source: 'Dhabione', sourceUrl: 'https://dhabione.lk/si/shop/air-conditioner/portable-air-conditioners/' },
];

export function getSriLankanModels(profileId: string | null | undefined): SriLankanACModel[] {
  return profileId ? sriLankanModels.filter((item) => item.profileId === profileId) : [];
}
