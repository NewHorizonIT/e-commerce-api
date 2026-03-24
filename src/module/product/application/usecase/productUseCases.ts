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
} from '../dtos';
import {
  CategoryNotFoundError,
  ProductHardDeleteBlockedError,
  ProductNotFoundError,
  ProductTypeNotFoundError,
  ResourceDeleteBlockedError,
  VariantGroupNotFoundError,
  VariantNotFoundError,
  VariantValueNotFoundError,
} from './errors';
import { IProductRepository } from '../../domain/interface';

export default class ProductUseCases {
  constructor(private readonly productRepository: IProductRepository) {}

  listPublicProducts(query: ProductListQueryDTO): Promise<PaginatedProductsDTO> {
    return this.productRepository.listProducts(query, false);
  }

  listAdminProducts(query: ProductListQueryDTO): Promise<PaginatedProductsDTO> {
    return this.productRepository.listProducts(query, true);
  }

  async getPublicProductById(productId: number): Promise<ProductDetailDTO> {
    const product = await this.productRepository.findProductById(productId, false);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    return product;
  }

  async getAdminProductById(productId: number): Promise<ProductDetailDTO> {
    const product = await this.productRepository.findProductById(productId, true);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    return product;
  }

  createProduct(dto: CreateProductDTO): Promise<ProductDetailDTO> {
    return this.productRepository.createProduct(dto);
  }

  async updateProduct(productId: number, dto: UpdateProductDTO): Promise<ProductDetailDTO> {
    const product = await this.productRepository.updateProduct(productId, dto);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    return product;
  }

  async updateVisibility(productId: number, dto: UpdateVisibilityDTO): Promise<ProductDetailDTO> {
    const product = await this.productRepository.updateVisibility(productId, dto);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    return product;
  }

  async deleteProduct(productId: number, mode: 'soft' | 'hard'): Promise<void> {
    if (mode === 'hard') {
      const hasReferences = await this.productRepository.hasOrderOrCartReferences(productId);

      if (hasReferences) {
        throw new ProductHardDeleteBlockedError(productId);
      }

      const hardDeleted = await this.productRepository.hardDeleteProduct(productId);

      if (!hardDeleted) {
        throw new ProductNotFoundError(productId);
      }

      return;
    }

    const deleted = await this.productRepository.softDeleteProduct(productId);

    if (!deleted) {
      throw new ProductNotFoundError(productId);
    }
  }

  async createVariant(productId: number, dto: CreateVariantDTO): Promise<ProductDetailDTO> {
    const product = await this.productRepository.createVariant(productId, dto);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    return product;
  }

  async updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDTO
  ): Promise<ProductDetailDTO> {
    const product = await this.productRepository.updateVariant(productId, variantId, dto);

    if (!product) {
      throw new VariantNotFoundError(variantId);
    }

    return product;
  }

  async deleteVariant(productId: number, variantId: number): Promise<void> {
    const deleted = await this.productRepository.deleteVariant(productId, variantId);

    if (!deleted) {
      throw new VariantNotFoundError(variantId);
    }

    const product = await this.productRepository.findProductById(productId, true);

    if (!product) {
      throw new ProductNotFoundError(productId);
    }
  }

  async updateVariantStock(variantId: number, dto: UpdateVariantStockDTO): Promise<void> {
    const updated = await this.productRepository.updateVariantStock(variantId, dto);

    if (!updated) {
      throw new VariantNotFoundError(variantId);
    }
  }

  async createVariantGroup(productId: number, dto: CreateVariantGroupDTO): Promise<void> {
    const created = await this.productRepository.createVariantGroup(productId, dto);

    if (!created) {
      throw new ProductNotFoundError(productId);
    }
  }

  async updateVariantGroup(
    productId: number,
    groupId: number,
    dto: UpdateVariantGroupDTO
  ): Promise<void> {
    const updated = await this.productRepository.updateVariantGroup(productId, groupId, dto);

    if (!updated) {
      throw new VariantGroupNotFoundError(groupId);
    }
  }

  async createVariantValue(
    productId: number,
    groupId: number,
    dto: CreateVariantValueDTO
  ): Promise<void> {
    const created = await this.productRepository.createVariantValue(productId, groupId, dto);

    if (!created) {
      throw new VariantGroupNotFoundError(groupId);
    }
  }

  async updateVariantValue(
    productId: number,
    groupId: number,
    valueId: number,
    dto: UpdateVariantValueDTO
  ): Promise<void> {
    const updated = await this.productRepository.updateVariantValue(
      productId,
      groupId,
      valueId,
      dto
    );

    if (!updated) {
      throw new VariantValueNotFoundError(valueId);
    }
  }

  async deleteVariantValue(productId: number, groupId: number, valueId: number): Promise<void> {
    const deleted = await this.productRepository.deleteVariantValue(productId, groupId, valueId);

    if (!deleted) {
      throw new VariantValueNotFoundError(valueId);
    }
  }

  listCategories(): Promise<CategoryDTO[]> {
    return this.productRepository.listCategories();
  }

  createCategory(dto: CreateNamedResourceDTO): Promise<CategoryDTO> {
    return this.productRepository.createCategory(dto);
  }

  async updateCategory(categoryId: number, dto: UpdateNamedResourceDTO): Promise<CategoryDTO> {
    const category = await this.productRepository.updateCategory(categoryId, dto);

    if (!category) {
      throw new CategoryNotFoundError(categoryId);
    }

    return category;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    const hasProducts = await this.productRepository.hasProductsByCategory(categoryId);

    if (hasProducts) {
      throw new ResourceDeleteBlockedError('category');
    }

    const deleted = await this.productRepository.deleteCategory(categoryId);

    if (!deleted) {
      throw new CategoryNotFoundError(categoryId);
    }
  }

  listProductTypes(): Promise<ProductTypeDTO[]> {
    return this.productRepository.listProductTypes();
  }

  createProductType(dto: CreateNamedResourceDTO): Promise<ProductTypeDTO> {
    return this.productRepository.createProductType(dto);
  }

  async updateProductType(
    productTypeId: number,
    dto: UpdateNamedResourceDTO
  ): Promise<ProductTypeDTO> {
    const productType = await this.productRepository.updateProductType(productTypeId, dto);

    if (!productType) {
      throw new ProductTypeNotFoundError(productTypeId);
    }

    return productType;
  }

  async deleteProductType(productTypeId: number): Promise<void> {
    const hasProducts = await this.productRepository.hasProductsByProductType(productTypeId);

    if (hasProducts) {
      throw new ResourceDeleteBlockedError('product type');
    }

    const deleted = await this.productRepository.deleteProductType(productTypeId);

    if (!deleted) {
      throw new ProductTypeNotFoundError(productTypeId);
    }
  }
}
