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

export interface VariantValueSimpleDTO {
  id: number;
  value: string;
  imageUrl: string | null;
}

export interface ProductAttributeValueDTO {
  id: number;
  value: string;
}

export interface ProductAttributeDTO {
  id: number;
  name: string;
  dataType: string;
  values: ProductAttributeValueDTO[];
}

export interface VariantGroupDetailDTO {
  id: number;
  name: string;
  displayOrder: number;
  values: VariantValueSimpleDTO[];
}

export interface VariantValueDetailDTO {
  id: number;
  value: string;
  imageUrl: string | null;
  variantGroupId: number;
  variantGroupName: string;
}

export interface ProductVariantDTO {
  id: number;
  price: number;
  stockQuantity: number;
  isDefault: boolean;
  imageUrl: string | null;
  values: VariantValueDetailDTO[];
}

export interface ProductDetailDTO {
  id: number;
  name: string;
  description: string | null;
  totalSold: number;
  hasVariant: boolean;
  isHidden: boolean;
  averageRating: number;
  totalReviews: number;
  categoryId: number;
  productTypeId: number;
  attributes: ProductAttributeDTO[];
  variants: ProductVariantDTO[];
  variantGroups: VariantGroupDetailDTO[];
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
