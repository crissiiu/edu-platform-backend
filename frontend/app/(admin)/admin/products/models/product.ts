export interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  originalPrice: number;
  commissionRate: number; // percentage, e.g. 15 for 15%
  affiliateUrl: string;
  status: "active" | "inactive";
  createdAt: string;
}
