import {
  CategoryDTO,
  CreateNamedResourceDTO,
  CreateVariantGroupDTO,
  CreateVariantValueDTO,
  CreateProductDTO,
  CreateVariantDTO,
  PaginatedProductsDTO,
  ProductDetailDTO,
  ProductListQueryDTO,
  ProductTypeDTO,
  UpdateNamedResourceDTO,
  UpdateProductDTO,
  UpdateVariantGroupDTO,
  UpdateVariantValueDTO,
  UpdateVariantDTO,
  UpdateVariantStockDTO,
  UpdateVisibilityDTO,
} from '../application/dtos';

export interface IProductRepository {
  listProducts(query: ProductListQueryDTO, includeHidden: boolean): Promise<PaginatedProductsDTO>;
  findProductById(productId: number, includeHidden: boolean): Promise<ProductDetailDTO | null>;

  createProduct(dto: CreateProductDTO): Promise<ProductDetailDTO>;
  updateProduct(productId: number, dto: UpdateProductDTO): Promise<ProductDetailDTO | null>;
  updateVisibility(productId: number, dto: UpdateVisibilityDTO): Promise<ProductDetailDTO | null>;
  softDeleteProduct(productId: number): Promise<boolean>;
  hardDeleteProduct(productId: number): Promise<boolean>;

  createVariant(productId: number, dto: CreateVariantDTO): Promise<ProductDetailDTO | null>;
  updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDTO
  ): Promise<ProductDetailDTO | null>;
  deleteVariant(productId: number, variantId: number): Promise<boolean>;
  updateVariantStock(variantId: number, dto: UpdateVariantStockDTO): Promise<boolean>;
  createVariantGroup(productId: number, dto: CreateVariantGroupDTO): Promise<boolean>;
  updateVariantGroup(
    productId: number,
    groupId: number,
    dto: UpdateVariantGroupDTO
  ): Promise<boolean>;
  createVariantValue(
    productId: number,
    groupId: number,
    dto: CreateVariantValueDTO
  ): Promise<boolean>;
  updateVariantValue(
    productId: number,
    groupId: number,
    valueId: number,
    dto: UpdateVariantValueDTO
  ): Promise<boolean>;
  deleteVariantValue(productId: number, groupId: number, valueId: number): Promise<boolean>;

  listCategories(): Promise<CategoryDTO[]>;
  createCategory(dto: CreateNamedResourceDTO): Promise<CategoryDTO>;
  updateCategory(categoryId: number, dto: UpdateNamedResourceDTO): Promise<CategoryDTO | null>;
  deleteCategory(categoryId: number): Promise<boolean>;
  hasProductsByCategory(categoryId: number): Promise<boolean>;

  listProductTypes(): Promise<ProductTypeDTO[]>;
  createProductType(dto: CreateNamedResourceDTO): Promise<ProductTypeDTO>;
  updateProductType(
    productTypeId: number,
    dto: UpdateNamedResourceDTO
  ): Promise<ProductTypeDTO | null>;
  deleteProductType(productTypeId: number): Promise<boolean>;
  hasProductsByProductType(productTypeId: number): Promise<boolean>;

  hasOrderOrCartReferences(productId: number): Promise<boolean>;
}
