import { AppDataSource } from '@/config';
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
  ProductSummaryDTO,
  ProductTypeDTO,
  UpdateNamedResourceDTO,
  UpdateProductDTO,
  UpdateVariantGroupDTO,
  UpdateVariantValueDTO,
  UpdateVariantDTO,
  UpdateVariantStockDTO,
  UpdateVisibilityDTO,
} from '../application/dtos';
import { IProductRepository } from '../domain/interface';
import {
  CategoryEntity,
  ProductEntity,
  ProductTypeEntity,
  VariantDetailEntity,
  VariantEntity,
  VariantGroupEntity,
  VariantValueEntity,
} from './productEntity';

function normalizeListQuery(query: ProductListQueryDTO): ProductListQueryDTO {
  return {
    ...query,
    page: query.page > 0 ? query.page : 1,
    limit: query.limit > 0 ? Math.min(query.limit, 100) : 20,
    sortBy: query.sortBy ?? 'createdDate',
    sortOrder: query.sortOrder ?? 'desc',
  };
}

export class TypeORMProductRepository implements IProductRepository {
  private readonly productRepo = AppDataSource.getRepository(ProductEntity);
  private readonly variantRepo = AppDataSource.getRepository(VariantEntity);
  private readonly variantDetailRepo = AppDataSource.getRepository(VariantDetailEntity);
  private readonly categoryRepo = AppDataSource.getRepository(CategoryEntity);
  private readonly productTypeRepo = AppDataSource.getRepository(ProductTypeEntity);
  private readonly variantGroupRepo = AppDataSource.getRepository(VariantGroupEntity);
  private readonly variantValueRepo = AppDataSource.getRepository(VariantValueEntity);

  async listProducts(
    rawQuery: ProductListQueryDTO,
    includeHidden: boolean
  ): Promise<PaginatedProductsDTO> {
    const query = normalizeListQuery(rawQuery);
    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoin('p.variants', 'v')
      .leftJoin('p.category', 'c')
      .leftJoin('p.productType', 'pt');

    if (!includeHidden) {
      qb.andWhere('p.is_hidden = :isHidden', { isHidden: false });
    } else if (typeof query.isHidden === 'boolean') {
      qb.andWhere('p.is_hidden = :isHidden', { isHidden: query.isHidden });
    }

    if (query.q) {
      qb.andWhere('LOWER(p.name) LIKE :q', { q: `%${query.q.toLowerCase()}%` });
    }

    if (query.categoryId) {
      qb.andWhere('p.category_id = :categoryId', { categoryId: query.categoryId });
    }

    if (query.productTypeId) {
      qb.andWhere('p.product_type_id = :productTypeId', { productTypeId: query.productTypeId });
    }

    if (typeof query.minPrice === 'number') {
      qb.andWhere('v.price >= :minPrice', { minPrice: query.minPrice });
    }

    if (typeof query.maxPrice === 'number') {
      qb.andWhere('v.price <= :maxPrice', { maxPrice: query.maxPrice });
    }

    qb.select([
      'p.id AS p_id',
      'p.name AS p_name',
      'p.description AS p_description',
      'p.total_sold AS p_total_sold',
      'p.has_variant AS p_has_variant',
      'p.is_hidden AS p_is_hidden',
      'c.id AS c_id',
      'c.name AS c_name',
      'pt.id AS pt_id',
      'pt.name AS pt_name',
      'MIN(v.price) AS min_price',
      'MAX(v.price) AS max_price',
    ])
      .groupBy('p.id')
      .addGroupBy('c.id')
      .addGroupBy('pt.id');

    if (query.sortBy === 'price') {
      qb.orderBy('MIN(v.price)', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    } else if (query.sortBy === 'sold') {
      qb.orderBy('p.total_sold', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('p.id', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    }

    qb.skip((query.page - 1) * query.limit).take(query.limit);

    const rows = await qb.getRawMany();

    const countQb = this.productRepo.createQueryBuilder('p');

    if (!includeHidden) {
      countQb.andWhere('p.is_hidden = :isHidden', { isHidden: false });
    } else if (typeof query.isHidden === 'boolean') {
      countQb.andWhere('p.is_hidden = :isHidden', { isHidden: query.isHidden });
    }

    if (query.q) {
      countQb.andWhere('LOWER(p.name) LIKE :q', { q: `%${query.q.toLowerCase()}%` });
    }

    if (query.categoryId) {
      countQb.andWhere('p.category_id = :categoryId', { categoryId: query.categoryId });
    }

    if (query.productTypeId) {
      countQb.andWhere('p.product_type_id = :productTypeId', {
        productTypeId: query.productTypeId,
      });
    }

    const totalItems = await countQb.getCount();

    const items: ProductSummaryDTO[] = rows.map((row) => ({
      id: Number(row.p_id),
      name: row.p_name,
      description: row.p_description,
      totalSold: Number(row.p_total_sold),
      hasVariant: Boolean(row.p_has_variant),
      isHidden: Boolean(row.p_is_hidden),
      minPrice: row.min_price !== null ? Number(row.min_price) : null,
      maxPrice: row.max_price !== null ? Number(row.max_price) : null,
      category: {
        id: Number(row.c_id),
        name: row.c_name,
      },
      productType: {
        id: Number(row.pt_id),
        name: row.pt_name,
      },
    }));

    return {
      items,
      page: query.page,
      limit: query.limit,
      totalItems,
      totalPages: Math.ceil(totalItems / query.limit),
    };
  }

  async findProductById(
    productId: number,
    includeHidden: boolean
  ): Promise<ProductDetailDTO | null> {
    const product = await this.productRepo.findOne({
      where: includeHidden ? { id: productId } : { id: productId, isHidden: false },
      relations: ['variants'],
    });

    if (!product) {
      return null;
    }

    const variantIds = product.variants.map((variant) => variant.id);
    const details =
      variantIds.length > 0
        ? await this.variantDetailRepo.find({ where: variantIds.map((id) => ({ variantId: id })) })
        : [];

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      totalSold: product.totalSold,
      hasVariant: product.hasVariant,
      isHidden: product.isHidden,
      categoryId: product.categoryId,
      productTypeId: product.productTypeId,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        price: Number(variant.price),
        stockQuantity: variant.stockQuantity,
        isDefault: variant.isDefault,
        imageUrl: variant.imageUrl,
        valueIds: details
          .filter((detail) => detail.variantId === variant.id)
          .map((d) => d.variantValueId),
      })),
    };
  }

  async createProduct(dto: CreateProductDTO): Promise<ProductDetailDTO> {
    const created = await this.productRepo.save(
      this.productRepo.create({
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        totalSold: dto.totalSold ?? 0,
        hasVariant: dto.hasVariant ?? true,
        isHidden: dto.isHidden ?? true,
        categoryId: dto.categoryId,
        productTypeId: dto.productTypeId,
      })
    );

    const product = await this.findProductById(created.id, true);

    if (!product) {
      throw new Error('Unexpected error: product not found after creation');
    }

    return product;
  }

  async updateProduct(productId: number, dto: UpdateProductDTO): Promise<ProductDetailDTO | null> {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      return null;
    }

    if (dto.name !== undefined) {
      product.name = dto.name.trim();
    }

    if (dto.description !== undefined) {
      product.description = dto.description.trim() || null;
    }

    if (dto.totalSold !== undefined) {
      product.totalSold = dto.totalSold;
    }

    if (dto.hasVariant !== undefined) {
      product.hasVariant = dto.hasVariant;
    }

    if (dto.categoryId !== undefined) {
      product.categoryId = dto.categoryId;
    }

    if (dto.productTypeId !== undefined) {
      product.productTypeId = dto.productTypeId;
    }

    await this.productRepo.save(product);

    return this.findProductById(productId, true);
  }

  async updateVisibility(
    productId: number,
    dto: UpdateVisibilityDTO
  ): Promise<ProductDetailDTO | null> {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      return null;
    }

    product.isHidden = dto.isHidden;
    await this.productRepo.save(product);

    return this.findProductById(productId, true);
  }

  async softDeleteProduct(productId: number): Promise<boolean> {
    const result = await this.productRepo.update({ id: productId }, { isHidden: true });
    return (result.affected ?? 0) > 0;
  }

  async hardDeleteProduct(productId: number): Promise<boolean> {
    const result = await this.productRepo.delete({ id: productId });
    return (result.affected ?? 0) > 0;
  }

  async createVariant(productId: number, dto: CreateVariantDTO): Promise<ProductDetailDTO | null> {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      return null;
    }

    const variant = await this.variantRepo.save(
      this.variantRepo.create({
        productId,
        price: dto.price,
        stockQuantity: dto.stockQuantity,
        isDefault: dto.isDefault ?? false,
        imageUrl: dto.imageUrl ?? null,
      })
    );

    if (dto.variantValueIds?.length) {
      const details = dto.variantValueIds.map((valueId) =>
        this.variantDetailRepo.create({ variantId: variant.id, variantValueId: valueId })
      );
      await this.variantDetailRepo.save(details);
    }

    return this.findProductById(productId, true);
  }

  async updateVariant(
    productId: number,
    variantId: number,
    dto: UpdateVariantDTO
  ): Promise<ProductDetailDTO | null> {
    const variant = await this.variantRepo.findOne({ where: { id: variantId, productId } });

    if (!variant) {
      return null;
    }

    if (dto.price !== undefined) {
      variant.price = dto.price;
    }

    if (dto.stockQuantity !== undefined) {
      variant.stockQuantity = dto.stockQuantity;
    }

    if (dto.isDefault !== undefined) {
      variant.isDefault = dto.isDefault;
    }

    if (dto.imageUrl !== undefined) {
      variant.imageUrl = dto.imageUrl || null;
    }

    await this.variantRepo.save(variant);

    if (dto.variantValueIds) {
      await this.variantDetailRepo.delete({ variantId });

      if (dto.variantValueIds.length) {
        const details = dto.variantValueIds.map((valueId) =>
          this.variantDetailRepo.create({ variantId, variantValueId: valueId })
        );
        await this.variantDetailRepo.save(details);
      }
    }

    return this.findProductById(productId, true);
  }

  async deleteVariant(productId: number, variantId: number): Promise<boolean> {
    const result = await this.variantRepo.delete({ id: variantId, productId });
    return (result.affected ?? 0) > 0;
  }

  async updateVariantStock(variantId: number, dto: UpdateVariantStockDTO): Promise<boolean> {
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });

    if (!variant) {
      return false;
    }

    if (typeof dto.stockQuantity === 'number') {
      variant.stockQuantity = dto.stockQuantity;
    } else if (typeof dto.adjustment === 'number') {
      variant.stockQuantity = Math.max(variant.stockQuantity + dto.adjustment, 0);
    }

    await this.variantRepo.save(variant);
    return true;
  }

  async createVariantGroup(productId: number, dto: CreateVariantGroupDTO): Promise<boolean> {
    const product = await this.productRepo.findOne({ where: { id: productId } });

    if (!product) {
      return false;
    }

    await this.variantGroupRepo.save(
      this.variantGroupRepo.create({
        productId,
        name: dto.name.trim(),
        displayOrder: dto.displayOrder ?? 0,
      })
    );

    return true;
  }

  async updateVariantGroup(
    productId: number,
    groupId: number,
    dto: UpdateVariantGroupDTO
  ): Promise<boolean> {
    const group = await this.variantGroupRepo.findOne({ where: { id: groupId, productId } });

    if (!group) {
      return false;
    }

    if (dto.name !== undefined) {
      group.name = dto.name.trim();
    }

    if (dto.displayOrder !== undefined) {
      group.displayOrder = dto.displayOrder;
    }

    await this.variantGroupRepo.save(group);
    return true;
  }

  async createVariantValue(
    productId: number,
    groupId: number,
    dto: CreateVariantValueDTO
  ): Promise<boolean> {
    const group = await this.variantGroupRepo.findOne({ where: { id: groupId, productId } });

    if (!group) {
      return false;
    }

    await this.variantValueRepo.save(
      this.variantValueRepo.create({
        variantGroupId: groupId,
        value: dto.value.trim(),
        imageUrl: dto.imageUrl ?? null,
      })
    );

    return true;
  }

  async updateVariantValue(
    productId: number,
    groupId: number,
    valueId: number,
    dto: UpdateVariantValueDTO
  ): Promise<boolean> {
    const group = await this.variantGroupRepo.findOne({ where: { id: groupId, productId } });

    if (!group) {
      return false;
    }

    const value = await this.variantValueRepo.findOne({
      where: { id: valueId, variantGroupId: groupId },
    });

    if (!value) {
      return false;
    }

    if (dto.value !== undefined) {
      value.value = dto.value.trim();
    }

    if (dto.imageUrl !== undefined) {
      value.imageUrl = dto.imageUrl || null;
    }

    await this.variantValueRepo.save(value);
    return true;
  }

  async deleteVariantValue(productId: number, groupId: number, valueId: number): Promise<boolean> {
    const group = await this.variantGroupRepo.findOne({ where: { id: groupId, productId } });

    if (!group) {
      return false;
    }

    const result = await this.variantValueRepo.delete({ id: valueId, variantGroupId: groupId });
    return (result.affected ?? 0) > 0;
  }

  async listCategories(): Promise<CategoryDTO[]> {
    const categories = await this.categoryRepo.find({ order: { id: 'ASC' } });
    return categories.map((category) => ({ id: category.id, name: category.name }));
  }

  async createCategory(dto: CreateNamedResourceDTO): Promise<CategoryDTO> {
    const category = await this.categoryRepo.save(
      this.categoryRepo.create({ name: dto.name.trim() })
    );
    return { id: category.id, name: category.name };
  }

  async updateCategory(
    categoryId: number,
    dto: UpdateNamedResourceDTO
  ): Promise<CategoryDTO | null> {
    const category = await this.categoryRepo.findOne({ where: { id: categoryId } });

    if (!category) {
      return null;
    }

    category.name = dto.name.trim();
    await this.categoryRepo.save(category);
    return { id: category.id, name: category.name };
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    const result = await this.categoryRepo.delete({ id: categoryId });
    return (result.affected ?? 0) > 0;
  }

  async hasProductsByCategory(categoryId: number): Promise<boolean> {
    const count = await this.productRepo.count({ where: { categoryId } });
    return count > 0;
  }

  async listProductTypes(): Promise<ProductTypeDTO[]> {
    const types = await this.productTypeRepo.find({ order: { id: 'ASC' } });
    return types.map((type) => ({ id: type.id, name: type.name }));
  }

  async createProductType(dto: CreateNamedResourceDTO): Promise<ProductTypeDTO> {
    const type = await this.productTypeRepo.save(
      this.productTypeRepo.create({ name: dto.name.trim() })
    );
    return { id: type.id, name: type.name };
  }

  async updateProductType(
    productTypeId: number,
    dto: UpdateNamedResourceDTO
  ): Promise<ProductTypeDTO | null> {
    const type = await this.productTypeRepo.findOne({ where: { id: productTypeId } });

    if (!type) {
      return null;
    }

    type.name = dto.name.trim();
    await this.productTypeRepo.save(type);
    return { id: type.id, name: type.name };
  }

  async deleteProductType(productTypeId: number): Promise<boolean> {
    const result = await this.productTypeRepo.delete({ id: productTypeId });
    return (result.affected ?? 0) > 0;
  }

  async hasProductsByProductType(productTypeId: number): Promise<boolean> {
    const count = await this.productRepo.count({ where: { productTypeId } });
    return count > 0;
  }

  async hasOrderOrCartReferences(productId: number): Promise<boolean> {
    try {
      const orderRows = await AppDataSource.query(
        `
        SELECT COUNT(*)::int AS count
        FROM order_items oi
        INNER JOIN variants v ON v.id = oi.variant_id
        WHERE v.product_id = $1
        `,
        [productId]
      );

      const cartRows = await AppDataSource.query(
        `
        SELECT COUNT(*)::int AS count
        FROM cart_item_details cid
        INNER JOIN variants v ON v.id = cid.variant_id
        WHERE v.product_id = $1
        `,
        [productId]
      );

      const reviewRows = await AppDataSource.query(
        `
        SELECT COUNT(*)::int AS count
        FROM product_reviews pr
        WHERE pr.product_id = $1
        `,
        [productId]
      );

      const orderCount = Number(orderRows[0]?.count ?? 0);
      const cartCount = Number(cartRows[0]?.count ?? 0);
      const reviewCount = Number(reviewRows[0]?.count ?? 0);

      return orderCount > 0 || cartCount > 0 || reviewCount > 0;
    } catch {
      // Keep deletion workflow resilient in early schema stages.
      return false;
    }
  }
}
