export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface Product {
  id: number;
  attributes: {
    id: number;
    lot_number: string;
    donor_name?: string;
    donor_phone?: string;
    minimum_value?: number;
    description?: string;
    sold_at?: number;
    auctioned: number;
    category_title: string;
    category_id: string;
    current_value?: number;
    winning_name?: string;
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
    product: number;
    lot_number: string;
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

export interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: number;
  profileUserId: number;
  currentValue: number;
}

export interface ProductCatalogProps {
  selectedCategory: string | null;
  profileUserId: number;
}

export interface ProductCardProps {
  product: Product;
  onBid: () => void;
}

export interface BidTableProps {
  fetchBids: boolean;
  showLotNumber?: boolean;
}

export interface AuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lotNumber: string;
  currentValue: number;
  winning_name: string;
}

export interface NavBarProps {
  onCategoryClick: (categoryId: string | null) => void;
  activeCategory: string | null;
}
