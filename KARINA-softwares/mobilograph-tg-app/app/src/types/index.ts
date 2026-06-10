export interface PortfolioItem {
  id: number;
  category: string;
  image: string;
  caption: string;
}

export interface PricingTier {
  name: string;
  price: number;
  duration: string;
  includes: string[];
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  emoji: string;
  image: string;
  pricing: PricingTier[];
  portfolioCategories: string[];
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  serviceId: string;
  date: string;
}

export interface Schedule {
  blockedDates: string[];
  blockedSlots: Record<string, string[]>;
  timeSlots: string[];
}

export interface AboutInfo {
  name: string;
  title: string;
  bio: string;
  experience: string;
  shoots: number;
  equipment: string[];
  photo: string;
  instagram: string;
  telegram: string;
  phone: string;
  kaspiPhone: string;
  city: string;
}

export interface BookingData {
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  comment: string;
}
