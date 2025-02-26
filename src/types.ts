import { Dispatch, SetStateAction } from "react";
export interface DecodedToken {
  id: string;
  role: string;
  name: string;
}
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
  profileUserId: number | null;
  currentValue: number;
}

export interface ProductCatalogProps {
  selectedCategory: string | null;
  profileUserId: number | null;
}

export interface ProductCardProps {
  product: Product;
  isUpdated: boolean;
  onBid: () => void;
}

export interface BidTableProps {
  showLotNumber?: boolean;
  showName?: boolean;
  showPhone?: boolean;
  bids: Bid[];
  productId?: number;
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

export interface WebSocketContextProps {
  cable: ActionCable.Cable | null;
}

export interface MenuItemProps {
  to: string;
  icon: JSX.Element;
  label: string;
}

export interface SideBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export interface User {
  id: string;
  attributes: {
    id: number;
    name: string;
    cpf: string;
    birth: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    phone: string;
    user_attributes: {
      email: string;
      role: string;
    }
  };
}

export interface UsersResponse {
  data: User[];
  meta: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

export interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  ariaLabel: string;
  className?: string;
}

export interface UserAttributes {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
}

export interface ProfileUser {
  name: string;
  cpf: string;
  birth: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone: string;
  user_attributes: UserAttributes;
}

export interface InputFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export interface UserFormProps {
  initialProfileUser: ProfileUser;
  onSubmit: (profileUser: ProfileUser) => void;
  isSubmitting: boolean;
  currentUserRole: string;
}
