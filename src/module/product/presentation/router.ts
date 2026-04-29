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
  variantStockParamSchema,
} from './validate';

export function createProductRouter(controller: ProductController): Router {
  const router = Router();

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

  router.get(
    '/admin/products',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: listProductsQuerySchema }),
    controller.listAdminProducts.bind(controller)
  );
  router.post(
    '/admin/products',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ body: createProductSchema }),
    controller.createProduct.bind(controller)
  );
  router.get(
    '/admin/products/:productId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: idParamSchema }),
    controller.getAdminProductById.bind(controller)
  );
  router.patch(
    '/admin/products/:productId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: idParamSchema, body: updateProductSchema }),
    controller.updateProduct.bind(controller)
  );
  router.patch(
    '/admin/products/:productId/visibility',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: idParamSchema, body: updateVisibilitySchema }),
    controller.updateVisibility.bind(controller)
  );
  router.delete(
    '/admin/products/:productId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: idParamSchema, query: deleteProductQuerySchema }),
    controller.deleteProduct.bind(controller)
  );

  router.post(
    '/admin/products/:productId/variants',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: idParamSchema, body: createVariantSchema }),
    controller.createVariant.bind(controller)
  );
  router.patch(
    '/admin/products/:productId/variants/:variantId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: variantParamSchema, body: updateVariantSchema }),
    controller.updateVariant.bind(controller)
  );
  router.delete(
    '/admin/products/:productId/variants/:variantId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: variantParamSchema }),
    controller.deleteVariant.bind(controller)
  );

  router.patch(
    '/admin/variants/:variantId/stock',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: variantStockParamSchema, body: updateVariantStockSchema }),
    controller.updateVariantStock.bind(controller)
  );

  router.post(
    '/admin/products/:productId/variant-groups',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: idParamSchema, body: createVariantGroupSchema }),
    controller.createVariantGroup.bind(controller)
  );
  router.patch(
    '/admin/products/:productId/variant-groups/:groupId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: groupParamSchema, body: updateVariantGroupSchema }),
    controller.updateVariantGroup.bind(controller)
  );
  router.post(
    '/admin/products/:productId/variant-groups/:groupId/values',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: groupParamSchema, body: createVariantValueSchema }),
    controller.createVariantValue.bind(controller)
  );
  router.patch(
    '/admin/products/:productId/variant-groups/:groupId/values/:valueId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: valueParamSchema, body: updateVariantValueSchema }),
    controller.updateVariantValue.bind(controller)
  );
  router.delete(
    '/admin/products/:productId/variant-groups/:groupId/values/:valueId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: valueParamSchema }),
    controller.deleteVariantValue.bind(controller)
  );

  router.get('/admin/categories', authenticate, authorizeRole('admin'), controller.listCategories.bind(controller));
  router.post(
    '/admin/categories',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ body: createNamedResourceSchema }),
    controller.createCategory.bind(controller)
  );
  router.patch(
    '/admin/categories/:categoryId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: categoryParamSchema, body: updateNamedResourceSchema }),
    controller.updateCategory.bind(controller)
  );
  router.delete(
    '/admin/categories/:categoryId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: categoryParamSchema }),
    controller.deleteCategory.bind(controller)
  );

  router.get('/admin/product-types', authenticate, authorizeRole('admin'), controller.listProductTypes.bind(controller));
  router.post(
    '/admin/product-types',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ body: createNamedResourceSchema }),
    controller.createProductType.bind(controller)
  );
  router.patch(
    '/admin/product-types/:productTypeId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: productTypeParamSchema, body: updateNamedResourceSchema }),
    controller.updateProductType.bind(controller)
  );
  router.delete(
    '/admin/product-types/:productTypeId',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ params: productTypeParamSchema }),
    controller.deleteProductType.bind(controller)
  );

  return router;
}
