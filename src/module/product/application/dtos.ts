export interface PaginationQueryDTO {
  page: number;
  limit: number;
}

export interface ProductListQueryDTO extends PaginationQueryDTO {
  q?: string;
  categoryId?: number;
  productTypeId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdDate' | 'price' | 'sold';
  sortOrder?: 'asc' | 'desc';
  isHidden?: boolean;
}

export interface ProductSummaryDTO {
  id: number;
  name: string;
  description: string | null;
  totalSold: number;
  hasVariant: boolean;
  isHidden: boolean;
  thumbnailUrl: string | null;
  averageRating: number;
  totalReviews: number;
  minPrice: number | null;
  maxPrice: number | null;
  category: {
    id: number;
    name: string;
  };
  productType: {
    id: number;
    name: string;
  };
}

export interface ProductVariantDTO {
  id: number;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
  imageUrl: string | null;
  valueIds: number[];
}

export interface ProductDetailDTO {
  id: number;
  name: string;
  description: string | null;
  totalSold: number;
  hasVariant: boolean;
  isHidden: boolean;
  categoryId: number;
  productTypeId: number;
  variants: ProductVariantDTO[];
}

export interface PaginatedProductsDTO {
  items: ProductSummaryDTO[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateProductDTO {
  name: string;
  description?: string;
  totalSold?: number;
  hasVariant?: boolean;
  isHidden?: boolean;
  categoryId: number;
  productTypeId: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  totalSold?: number;
  hasVariant?: boolean;
  categoryId?: number;
  productTypeId?: number;
}

export interface UpdateVisibilityDTO {
  isHidden: boolean;
}

export interface CreateVariantDTO {
  price: number;
  stockQuantity: number;
  isDefault?: boolean;
  imageUrl?: string;
  variantValueIds?: number[];
}

export interface UpdateVariantDTO {
  price?: number;
  stockQuantity?: number;
  isDefault?: boolean;
  imageUrl?: string;
  variantValueIds?: number[];
}

export interface UpdateVariantStockDTO {
  stockQuantity?: number;
  adjustment?: number;
  reason?: string;
}

export interface CreateVariantGroupDTO {
  name: string;
  displayOrder?: number;
}

export interface UpdateVariantGroupDTO {
  name?: string;
  displayOrder?: number;
}

export interface CreateVariantValueDTO {
  value: string;
  imageUrl?: string;
}

export interface UpdateVariantValueDTO {
  value?: string;
  imageUrl?: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
}

export interface ProductTypeDTO {
  id: number;
  name: string;
}

export interface CreateNamedResourceDTO {
  name: string;
}

export interface UpdateNamedResourceDTO {
  name: string;
}
