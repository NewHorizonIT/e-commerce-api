import { injectable } from "tsyringe";
import { ICartRepository } from "../domain/interface";
import { Cart } from '../domain/domain';
import { In, Not, Repository } from "typeorm";
import { AppDataSource } from "@/config";
import { CartEntity, CartItemDetailEntity, CartMapper } from "./cartEntity";

@injectable()
export class TypeORMCartRepository implements ICartRepository {
    private readonly cartRepo: Repository<CartEntity>;
    constructor() {
        this.cartRepo = AppDataSource.getRepository(CartEntity);
    }

    async findById(cartId: number): Promise<Cart | null> {
        const cartEntity = await this.cartRepo.findOne({
            where: { id: cartId },
            relations: ["cartItemDetails"]
        });

        return cartEntity ? CartMapper.toDomain(cartEntity, cartEntity.cartItemDetails) : null;
    }

    async findByAccountId(accountId: number): Promise<Cart | null> {
        const cartEntity = await this.cartRepo.findOne({
            where: { accountId: accountId },
            relations: ["cartItemDetails"]
        });

        return cartEntity ? CartMapper.toDomain(cartEntity, cartEntity.cartItemDetails) : null;
    }

    async save(cart: Cart): Promise<Cart> {

        const { cartEntity, itemEntities } = CartMapper.toEntity(cart);

        //dùng transactionalEntityManager để lưu dữ liệu, rollback tất cả khi lỗi 
        const updatedCartEntity = await AppDataSource.transaction(async (transactionalEntityManager) => {

            const savedCartEntity = await transactionalEntityManager.save(CartEntity, cartEntity);
            const cartId = savedCartEntity.id;

            //1.Xóa item cần xóa
            const currentItemIds = itemEntities.map(item => item.id).filter(id => id !== null);
            //not in có thể lỗi khi currentItemIds rỗng
            if (currentItemIds.length === 0) {
                await transactionalEntityManager.delete(CartItemDetailEntity, { cartId: cartId });
            } else {
                await transactionalEntityManager.delete(CartItemDetailEntity, {
                    cartId: cartId,
                    id: Not(In(currentItemIds))

                });
            }

            //2.Thêm hoặc cập nhật item mới
            itemEntities.forEach(item => item.cartId = cartId);
            const savedItemEntities = await transactionalEntityManager.save(CartItemDetailEntity, itemEntities);
            return { savedCartEntity, savedItemEntities };
        })

        return CartMapper.toDomain(updatedCartEntity.savedCartEntity, updatedCartEntity.savedItemEntities);
    }
}