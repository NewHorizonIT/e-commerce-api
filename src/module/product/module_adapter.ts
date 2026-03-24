import {
  CategoryDTO,
  CreateNamedResourceDTO,
  CreateProductDTO,
  CreateVariantGroupDTO,
  CreateVariantValueDTO,
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
} from './application/dtos';
import { IProductModulePort } from './application/module_port';
import ProductUseCases from './application/usecase/productUseCases';

export class ProductModuleAdapter implements IProductModulePort {
  constructor(private readonly productUseCases: ProductUseCases) {}

  listPublicProducts(query: ProductListQueryDTO): Promise<PaginatedProductsDTO> {
    return this.productUseCases.listPublicProducts(query);
  }

  listAdminProducts(query: ProductListQueryDTO): Promise<PaginatedProductsDTO> {
    return this.productUseCases.listAdminProducts(query);
  }

  getPublicProductById(productId: number): Promise<ProductDetailDTO> {
    return this.productUseCases.getPublicProductById(productId);
  }

  getAdminProductById(productId: number): Promise<ProductDetailDTO> {
    return this.productUseCases.getAdminProductById(productId);
  }

  createProduct(dto: CreateProductDTO): Promise<ProductDetailDTO> {
    return this.productUseCases.createProduct(dto);
  }

  updateProduct(productId: number, dto: UpdateProductDTO): Promise<ProductDetailDTO> {
    return this.productUseCases.updateProduct(productId, dto);
  }

  updateVisibility(productId: number, dto: UpdateVisibilityDTO): Promise<ProductDetailDTO> {
    return this.productUseCases.updateVisibility(productId, dto);
  }

  deleteProduct(productId: number, mode: 'soft' | 'hard'): Promise<void> {
    return this.productUseCases.deleteProduct(productId, mode);
  }

  createVariant(productId: number, dto: CreateVariantDTO): Promise<ProductDetailDTO> {
    return this.productUseCases.createVariant(productId, dto);
  }

  updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDTO
  ): Promise<ProductDetailDTO> {
    return this.productUseCases.updateVariant(productId, variantId, dto);
  }

  deleteVariant(productId: number, variantId: number): Promise<void> {
    return this.productUseCases.deleteVariant(productId, variantId);
  }

  updateVariantStock(variantId: number, dto: UpdateVariantStockDTO): Promise<void> {
    return this.productUseCases.updateVariantStock(variantId, dto);
  }

  createVariantGroup(productId: number, dto: CreateVariantGroupDTO): Promise<void> {
    return this.productUseCases.createVariantGroup(productId, dto);
  }

  updateVariantGroup(
    productId: number,
    groupId: number,
    dto: UpdateVariantGroupDTO
  ): Promise<void> {
    return this.productUseCases.updateVariantGroup(productId, groupId, dto);
  }

  createVariantValue(
    productId: number,
    groupId: number,
    dto: CreateVariantValueDTO
  ): Promise<void> {
    return this.productUseCases.createVariantValue(productId, groupId, dto);
  }

  updateVariantValue(
    productId: number,
    groupId: number,
    valueId: number,
    dto: UpdateVariantValueDTO
  ): Promise<void> {
    return this.productUseCases.updateVariantValue(productId, groupId, valueId, dto);
  }

  deleteVariantValue(productId: number, groupId: number, valueId: number): Promise<void> {
    return this.productUseCases.deleteVariantValue(productId, groupId, valueId);
  }

  listCategories(): Promise<CategoryDTO[]> {
    return this.productUseCases.listCategories();
  }

  createCategory(dto: CreateNamedResourceDTO): Promise<CategoryDTO> {
    return this.productUseCases.createCategory(dto);
  }

  updateCategory(categoryId: number, dto: UpdateNamedResourceDTO): Promise<CategoryDTO> {
    return this.productUseCases.updateCategory(categoryId, dto);
  }

  deleteCategory(categoryId: number): Promise<void> {
    return this.productUseCases.deleteCategory(categoryId);
  }

  listProductTypes(): Promise<ProductTypeDTO[]> {
    return this.productUseCases.listProductTypes();
  }

  createProductType(dto: CreateNamedResourceDTO): Promise<ProductTypeDTO> {
    return this.productUseCases.createProductType(dto);
  }

  updateProductType(productTypeId: number, dto: UpdateNamedResourceDTO): Promise<ProductTypeDTO> {
    return this.productUseCases.updateProductType(productTypeId, dto);
  }

  deleteProductType(productTypeId: number): Promise<void> {
    return this.productUseCases.deleteProductType(productTypeId);
  }
}
