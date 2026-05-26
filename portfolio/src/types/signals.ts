export interface GuestbookEntry {
  who: string;
  from: string;
  msg: string;
  when: string;
}

export interface CityEntry {
  city: string;
  country: string;
  x: number;
  y: number;
  count: number;
  top: string;
}

export interface VisitorStats {
  total: number;
  today: number;
  cities: number;
  countries: number;
}
