export interface Product {
  id: number;
  attributes: {
    id:number;
    lot_number: string;
    donor_name?: string;
    donor_phone?: string;
    minimum_value: number;
    bidder_name?: string;
    bidder_phone?: string;
    winning_value: number;
    description?: string;
    sold_at?: number;
    name: string;
    auctioned: number;
    category_title: string;
  };
}

export interface Category {
  id: number;
  attributes: {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
}
