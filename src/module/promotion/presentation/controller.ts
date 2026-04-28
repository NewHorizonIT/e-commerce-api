import { inject, injectable } from "tsyringe";
import { PROMOTION_TOKENS } from "../tokens";
import { IPromotionModulePort } from "../application/module_port";
import SuccessResponse from "@/shared/response/writeResponse";
import { StatusCode } from "@/shared/response/statusCode";
import { Request, Response } from "express";

@injectable()
export class PromotionController {
    constructor(
        @inject(PROMOTION_TOKENS.IPromotionModulePort) private readonly promotionModulePort: IPromotionModulePort
    ) { }

    async getAllPromotion(res: Response): Promise<void> {
        const promotions = await this.promotionModulePort.getAllPromotion();
        new SuccessResponse(promotions, undefined, StatusCode.OK).send(res);
    }

    async createPromotion(req: Request, res: Response): Promise<void> {
        const promotion = await this.promotionModulePort.createPromotion(req.body);
        new SuccessResponse(promotion, 'Promotion created successfully', StatusCode.CREATED).send(res);
    }

    async updatePromotion(req: Request, res: Response): Promise<void> {
        const { id } = req.params as { id: string };
        const promotion = await this.promotionModulePort.updatePromotion(req.body, Number(id));
        new SuccessResponse(promotion, 'Promotion updated successfully', StatusCode.OK).send(res);
    }

    async deletePromotion(req: Request, res: Response): Promise<void> {
        const { id } = req.params as { id: string };
        await this.promotionModulePort.deletePromotion(Number(id));
        res.status(204).send();
    }
}