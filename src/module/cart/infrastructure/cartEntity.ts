import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cart, CartItemDetail } from "../domain/domain";
import { Quantity } from "../domain/value_objects";

@Entity('carts')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  //khóa ngoại khác module.
  @Column({ type: 'int', name: 'account_id' })
  accountId!: number;

  @OneToMany(() => CartItemDetailEntity, (cartItemDetail) => cartItemDetail.cart)
  cartItemDetails!: CartItemDetailEntity[];
}

@Entity('cart_item_details')
export class CartItemDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({ type: 'int', name: 'quantity' })
  quantity!: number;
  @Column({ type: 'int', name: 'cart_id' })
  cartId!: number;
  @Column({ type: 'int', name: 'variant_id' })
  variantId!: number;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItemDetails, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'cart_id' })
  cart!: CartEntity
}

// mapper
export class CartMapper {
  static toDomain(cartEntity: CartEntity, itemEntities: CartItemDetailEntity[]): Cart {
    const domainItems = itemEntities.map(item =>
      CartItemDetail.rehydrate({
        id: item.id,
        quantity: new Quantity(item.quantity),
        variantId: item.variantId,
        cartId: item.cartId
      })
    );

    return Cart.rehydrate({
      id: cartEntity.id,
      accountId: cartEntity.accountId,
      items: domainItems
    });
  }

  static toEntity(domain: Cart): { cartEntity: CartEntity, itemEntities: CartItemDetailEntity[] } {
    const cartEntity = new CartEntity();
    if (domain.getId() !== null) {
      cartEntity.id = domain.getId() as number;
    }
    cartEntity.accountId = domain.getAccountId();

    const itemEntities = domain.getItems().map(item => {
      const itemEntity = new CartItemDetailEntity();

      if (item.getId() !== null) {
        itemEntity.id = item.getId() as number;
      }

      itemEntity.quantity = item.getQuantity().getValue();
      itemEntity.variantId = item.getVariantId();

      if (domain.getId() !== null) {
        itemEntity.cartId = domain.getId() as number;
      }

      return itemEntity;
    });
    return { cartEntity, itemEntities };
  }
}