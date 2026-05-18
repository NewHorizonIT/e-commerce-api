import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import authorizeRole from '@/shared/middleware/authorizeRole';
import { ProductController } from './controller';
import {
  categoryParamSchema,
  createNamedResourceSchema,
  createProductSchema,
  createVariantGroupSchema,
  createVariantValueSchema,
  createVariantSchema,
  deleteProductQuerySchema,
  groupParamSchema,
  idParamSchema,
  listProductsQuerySchema,
  productTypeParamSchema,
  updateNamedResourceSchema,
  updateProductSchema,
  updateVariantGroupSchema,
  updateVariantValueSchema,
  updateVariantSchema,
  updateVariantStockSchema,
  updateVisibilitySchema,
  validateRequest,
  valueParamSchema,
  variantParamSchema,
} from './validate';

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

  // ==================== PUBLIC ====================
  router.get(
    '/products',
    validateRequest({ query: listProductsQuerySchema }),
    controller.listPublicProducts.bind(controller)
  );
  router.get(
    '/products/:productId',
    validateRequest({ params: idParamSchema }),
    controller.getPublicProductById.bind(controller)
  );
  router.get('/categories', controller.listCategories.bind(controller));
  router.get('/product-types', controller.listProductTypes.bind(controller));

  // ==================== ADMIN ====================
  const adminRouter = Router();
  adminRouter.use(authenticate, authorizeRole('admin'));

  // Products
  adminRouter.get(
    '/products',
    validateRequest({ query: listProductsQuerySchema }),
    controller.listAdminProducts.bind(controller)
  );
  adminRouter.post(
    '/products',
    validateRequest({ body: createProductSchema }),
    controller.createProduct.bind(controller)
  );
  adminRouter.get(
    '/products/:productId',
    validateRequest({ params: idParamSchema }),
    controller.getAdminProductById.bind(controller)
  );
  adminRouter.patch(
    '/products/:productId',
    validateRequest({ params: idParamSchema, body: updateProductSchema }),
    controller.updateProduct.bind(controller)
  );
  adminRouter.patch(
    '/products/:productId/visibility',
    validateRequest({ params: idParamSchema, body: updateVisibilitySchema }),
    controller.updateVisibility.bind(controller)
  );
  adminRouter.delete(
    '/products/:productId',
    validateRequest({ params: idParamSchema, query: deleteProductQuerySchema }),
    controller.deleteProduct.bind(controller)
  );

  // Variants (nested under product)
  adminRouter.post(
    '/products/:productId/variants',
    validateRequest({ params: idParamSchema, body: createVariantSchema }),
    controller.createVariant.bind(controller)
  );
  adminRouter.patch(
    '/products/:productId/variants/:variantId',
    validateRequest({ params: variantParamSchema, body: updateVariantSchema }),
    controller.updateVariant.bind(controller)
  );
  adminRouter.delete(
    '/products/:productId/variants/:variantId',
    validateRequest({ params: variantParamSchema }),
    controller.deleteVariant.bind(controller)
  );
  adminRouter.patch(
    '/products/:productId/variants/:variantId/stock',
    validateRequest({ params: variantParamSchema, body: updateVariantStockSchema }),
    controller.updateVariantStock.bind(controller)
  );

  // Variant groups (nested under product)
  adminRouter.get(
    '/products/:productId/variant-groups',
    validateRequest({ params: idParamSchema }),
    controller.getVariantGroups.bind(controller)
  );
  adminRouter.post(
    '/products/:productId/variant-groups',
    validateRequest({ params: idParamSchema, body: createVariantGroupSchema }),
    controller.createVariantGroup.bind(controller)
  );
  adminRouter.patch(
    '/products/:productId/variant-groups/:groupId',
    validateRequest({ params: groupParamSchema, body: updateVariantGroupSchema }),
    controller.updateVariantGroup.bind(controller)
  );

  // Variant values (nested under variant group)
  adminRouter.post(
    '/products/:productId/variant-groups/:groupId/values',
    validateRequest({ params: groupParamSchema, body: createVariantValueSchema }),
    controller.createVariantValue.bind(controller)
  );
  adminRouter.patch(
    '/products/:productId/variant-groups/:groupId/values/:valueId',
    validateRequest({ params: valueParamSchema, body: updateVariantValueSchema }),
    controller.updateVariantValue.bind(controller)
  );
  adminRouter.delete(
    '/products/:productId/variant-groups/:groupId/values/:valueId',
    validateRequest({ params: valueParamSchema }),
    controller.deleteVariantValue.bind(controller)
  );

  // Categories
  adminRouter.post(
    '/categories',
    validateRequest({ body: createNamedResourceSchema }),
    controller.createCategory.bind(controller)
  );
  adminRouter.patch(
    '/categories/:categoryId',
    validateRequest({ params: categoryParamSchema, body: updateNamedResourceSchema }),
    controller.updateCategory.bind(controller)
  );
  adminRouter.delete(
    '/categories/:categoryId',
    validateRequest({ params: categoryParamSchema }),
    controller.deleteCategory.bind(controller)
  );

  // Product types
  adminRouter.post(
    '/product-types',
    validateRequest({ body: createNamedResourceSchema }),
    controller.createProductType.bind(controller)
  );
  adminRouter.patch(
    '/product-types/:productTypeId',
    validateRequest({ params: productTypeParamSchema, body: updateNamedResourceSchema }),
    controller.updateProductType.bind(controller)
  );
  adminRouter.delete(
    '/product-types/:productTypeId',
    validateRequest({ params: productTypeParamSchema }),
    controller.deleteProductType.bind(controller)
  );

  router.use('/admin', adminRouter);

  return router;
}
