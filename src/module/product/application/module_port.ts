import {
  CategoryDTO,
  CreateNamedResourceDTO,
  CreateProductDTO,
  CreateVariantDTO,
  PaginatedProductsDTO,
  ProductDetailDTO,
  ProductListQueryDTO,
  ProductTypeDTO,
  CreateVariantGroupDTO,
  CreateVariantValueDTO,
  UpdateNamedResourceDTO,
  UpdateProductDTO,
  UpdateVariantGroupDTO,
  UpdateVariantValueDTO,
  UpdateVariantDTO,
  UpdateVariantStockDTO,
  UpdateVisibilityDTO,
} from './dtos';

export interface IProductModulePort {
  listPublicProducts(query: ProductListQueryDTO): Promise<PaginatedProductsDTO>;
  listAdminProducts(query: ProductListQueryDTO): Promise<PaginatedProductsDTO>;
  getPublicProductById(productId: number): Promise<ProductDetailDTO>;
  getAdminProductById(productId: number): Promise<ProductDetailDTO>;

  createProduct(dto: CreateProductDTO): Promise<ProductDetailDTO>;
  updateProduct(productId: number, dto: UpdateProductDTO): Promise<ProductDetailDTO>;
  updateVisibility(productId: number, dto: UpdateVisibilityDTO): Promise<ProductDetailDTO>;
  deleteProduct(productId: number, mode: 'soft' | 'hard'): Promise<void>;

  createVariant(productId: number, dto: CreateVariantDTO): Promise<ProductDetailDTO>;
  updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDTO
  ): Promise<ProductDetailDTO>;
  deleteVariant(productId: number, variantId: number): Promise<void>;
  updateVariantStock(variantId: number, dto: UpdateVariantStockDTO): Promise<void>;

  createVariantGroup(productId: number, dto: CreateVariantGroupDTO): Promise<void>;
  updateVariantGroup(productId: number, groupId: number, dto: UpdateVariantGroupDTO): Promise<void>;
  createVariantValue(productId: number, groupId: number, dto: CreateVariantValueDTO): Promise<void>;
  updateVariantValue(
    productId: number,
    groupId: number,
    valueId: number,
    dto: UpdateVariantValueDTO
  ): Promise<void>;
  deleteVariantValue(productId: number, groupId: number, valueId: number): Promise<void>;

  listCategories(): Promise<CategoryDTO[]>;
  createCategory(dto: CreateNamedResourceDTO): Promise<CategoryDTO>;
  updateCategory(categoryId: number, dto: UpdateNamedResourceDTO): Promise<CategoryDTO>;
  deleteCategory(categoryId: number): Promise<void>;

  listProductTypes(): Promise<ProductTypeDTO[]>;
  createProductType(dto: CreateNamedResourceDTO): Promise<ProductTypeDTO>;
  updateProductType(productTypeId: number, dto: UpdateNamedResourceDTO): Promise<ProductTypeDTO>;
  deleteProductType(productTypeId: number): Promise<void>;
}
