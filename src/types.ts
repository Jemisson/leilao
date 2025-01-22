export interface Product {
  id: number;
  attributes: {
    id: number;
    lot_number: string;
    donor_name?: string;
    donor_phone?: string;
    minimum_value: number;
    description?: string;
    sold_at?: number;
    auctioned: number;
    category_title: string;
    category_id: string;
    images?: Array<{
        id: string;
        url: string;
      }>;
  }
}

export interface Category {
  id: string;
  attributes: {
    id: number;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface Bid {
  id: number;
  attributes: {
    id: number;
    name: string;
    value: number;
    phone: string;
    created_at: string;
  }
}

export interface ProductFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: Partial<Product["attributes"]>;
  isSubmitting: boolean;
  mode: "create" | "edit";
}

export interface NoDataProps {
  className?: string;
}
