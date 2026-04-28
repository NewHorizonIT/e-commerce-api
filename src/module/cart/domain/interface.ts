import { Cart } from "./domain";

export interface ICartRepository {
  findById(id: number): Promise<Cart | null>;
  findByAccountId(accountId: number): Promise<Cart | null>;
  save(cart: Cart): Promise<Cart>;
}