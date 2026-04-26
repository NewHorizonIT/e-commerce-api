import { PromotionProgram } from "./domain";

export interface IPromotionRepository {
  getAll(): Promise<PromotionProgram[]>
  findById(id: number): Promise<PromotionProgram | null>;
  save(promotion: PromotionProgram): Promise<PromotionProgram>;
  delete(id: number): Promise<void>;
}