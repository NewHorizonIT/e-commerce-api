import type { Request, Response } from 'express';
import { IProductModulePort } from '../application/module_port';
import { appLogger } from '@/shared/logging/appLogger';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';

export class ProductController {
  constructor(private readonly productModulePort: IProductModulePort) {}

  async listPublicProducts(req: Request, res: Response): Promise<void> {
    const products = await this.productModulePort.listPublicProducts(req.query as never);
    new SuccessResponse(products, undefined, StatusCode.OK).send(res);
  }

  async getPublicProductById(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const product = await this.productModulePort.getPublicProductById(Number(productId));
    new SuccessResponse(product, undefined, StatusCode.OK).send(res);
  }

  async listAdminProducts(req: Request, res: Response): Promise<void> {
    const products = await this.productModulePort.listAdminProducts(req.query as never);
    new SuccessResponse(products, undefined, StatusCode.OK).send(res);
  }

  async getAdminProductById(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const product = await this.productModulePort.getAdminProductById(Number(productId));
    new SuccessResponse(product, undefined, StatusCode.OK).send(res);
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const product = await this.productModulePort.createProduct(req.body);
    appLogger.info('Product created', { productId: product.id });
    new SuccessResponse(product, 'Product created successfully', StatusCode.CREATED).send(res);
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const product = await this.productModulePort.updateProduct(Number(productId), req.body);
    new SuccessResponse(product, 'Product updated successfully', StatusCode.OK).send(res);
  }

  async updateVisibility(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const product = await this.productModulePort.updateVisibility(Number(productId), req.body);
    new SuccessResponse(product, 'Product visibility updated', StatusCode.OK).send(res);
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const { mode = 'soft' } = req.query as { mode?: 'soft' | 'hard' };

    await this.productModulePort.deleteProduct(Number(productId), mode);
    res.status(204).send();
  }

  async createVariant(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const product = await this.productModulePort.createVariant(Number(productId), req.body);
    new SuccessResponse(product, 'Variant created successfully', StatusCode.CREATED).send(res);
  }

  async updateVariant(req: Request, res: Response): Promise<void> {
    const { productId, variantId } = req.params as { productId: string; variantId: string };
    const product = await this.productModulePort.updateVariant(
      Number(productId),
      Number(variantId),
      req.body
    );
    new SuccessResponse(product, 'Variant updated successfully', StatusCode.OK).send(res);
  }

  async deleteVariant(req: Request, res: Response): Promise<void> {
    const { productId, variantId } = req.params as { productId: string; variantId: string };
    await this.productModulePort.deleteVariant(Number(productId), Number(variantId));
    res.status(204).send();
  }

  async updateVariantStock(req: Request, res: Response): Promise<void> {
    const { variantId } = req.params as { variantId: string };
    await this.productModulePort.updateVariantStock(Number(variantId), req.body);
    res.status(204).send();
  }

  async createVariantGroup(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    await this.productModulePort.createVariantGroup(Number(productId), req.body);
    res.status(201).json({ isSuccess: true });
  }

  async updateVariantGroup(req: Request, res: Response): Promise<void> {
    const { productId, groupId } = req.params as { productId: string; groupId: string };
    await this.productModulePort.updateVariantGroup(Number(productId), Number(groupId), req.body);
    res.status(204).send();
  }

  async createVariantValue(req: Request, res: Response): Promise<void> {
    const { productId, groupId } = req.params as { productId: string; groupId: string };
    await this.productModulePort.createVariantValue(Number(productId), Number(groupId), req.body);
    res.status(201).json({ isSuccess: true });
  }

  async updateVariantValue(req: Request, res: Response): Promise<void> {
    const { productId, groupId, valueId } = req.params as {
      productId: string;
      groupId: string;
      valueId: string;
    };
    await this.productModulePort.updateVariantValue(
      Number(productId),
      Number(groupId),
      Number(valueId),
      req.body
    );
    res.status(204).send();
  }

  async deleteVariantValue(req: Request, res: Response): Promise<void> {
    const { productId, groupId, valueId } = req.params as {
      productId: string;
      groupId: string;
      valueId: string;
    };
    await this.productModulePort.deleteVariantValue(
      Number(productId),
      Number(groupId),
      Number(valueId)
    );
    res.status(204).send();
  }

  async listCategories(_req: Request, res: Response): Promise<void> {
    const categories = await this.productModulePort.listCategories();
    new SuccessResponse(categories, undefined, StatusCode.OK).send(res);
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    const category = await this.productModulePort.createCategory(req.body);
    new SuccessResponse(category, 'Category created successfully', StatusCode.CREATED).send(res);
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params as { categoryId: string };
    const category = await this.productModulePort.updateCategory(Number(categoryId), req.body);
    new SuccessResponse(category, 'Category updated successfully', StatusCode.OK).send(res);
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { categoryId } = req.params as { categoryId: string };
    await this.productModulePort.deleteCategory(Number(categoryId));
    res.status(204).send();
  }

  async listProductTypes(_req: Request, res: Response): Promise<void> {
    const productTypes = await this.productModulePort.listProductTypes();
    new SuccessResponse(productTypes, undefined, StatusCode.OK).send(res);
  }

  async createProductType(req: Request, res: Response): Promise<void> {
    const productType = await this.productModulePort.createProductType(req.body);
    new SuccessResponse(productType, 'Product type created successfully', StatusCode.CREATED).send(
      res
    );
  }

  async updateProductType(req: Request, res: Response): Promise<void> {
    const { productTypeId } = req.params as { productTypeId: string };
    const productType = await this.productModulePort.updateProductType(
      Number(productTypeId),
      req.body
    );
    new SuccessResponse(productType, 'Product type updated successfully', StatusCode.OK).send(res);
  }

  async deleteProductType(req: Request, res: Response): Promise<void> {
    const { productTypeId } = req.params as { productTypeId: string };
    await this.productModulePort.deleteProductType(Number(productTypeId));
    res.status(204).send();
  }
}
