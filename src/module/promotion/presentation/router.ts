import { Router } from "express";
import { PromotionController } from "./controller";
import authenticate from "@/shared/middleware/authenticate";
import { createPromotionSchema, promotionIdParamSchema, removeDetailParamSchema, updatePromotionSchema, validateRequest } from "./validate";

export function createPromotionRouter(controller: PromotionController): Router {
    const router = Router();
    router.get('/admin/promotions', authenticate, controller.getAllPromotion.bind(controller));
    router.post('/admin/promotions', authenticate, validateRequest({ body: createPromotionSchema }), controller.createPromotion.bind(controller));
    router.put('/admin/promotions/:id', authenticate, validateRequest({ body: updatePromotionSchema, params: promotionIdParamSchema }), controller.updatePromotion.bind(controller));
    router.delete('/admin/promotions/:id', authenticate, validateRequest({ params: promotionIdParamSchema }), controller.deletePromotion.bind(controller));
    router.delete('/admin/promotion/:id/variant/:variantId', authenticate, validateRequest({ params: removeDetailParamSchema }))
    return router;
}