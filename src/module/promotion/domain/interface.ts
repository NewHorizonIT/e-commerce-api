import { PromotionDetail, PromotionProgram } from "./domain";

export interface IPromotionRepository {
  findById(id: number): Promise<PromotionProgram | null>;
  findByAccountId(accountId: number): Promise<PromotionProgram[] | null>
  save(promotion: PromotionProgram): Promise<PromotionProgram>;
  delete(id: number): Promise<void>;
}