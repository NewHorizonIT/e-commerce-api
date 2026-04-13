import { UnexpectedMissingCartIdError, UnexpectedMissingCartItemIdError } from "./errors";
import { Quantity } from "./value_objects";

export class Cart {
  private constructor(
    private id: number | null,
    private accountId: number,
    private items: CartItemDetail[] = []
  ) { }

  public static create(params: { accountId: number }): Cart {
    return new Cart(null, params.accountId, []);
  }

  public static rehydrate(params: {
    id: number;
    accountId: number;
    items: CartItemDetail[];
  }): Cart {
    return new Cart(
      params.id,
      params.accountId,
      params.items
    );
  }

  //bussiness
  public addItem(item: CartItemDetail): void {
    // nếu sản phẩm đã tồn tại thì cộng dồn số lượng
    const existingItem = this.items.find(i => i.getVariantId() === item.getVariantId());
    if (existingItem) {
      existingItem.updateQuantity(existingItem.getQuantity().add(item.getQuantity()));
    } else {
      this.items.push(item);
    }
  }

  public removeItem(variantId: number): void {
    this.items = this.items.filter(i => i.getVariantId() !== variantId);
  }

  // Getters and setters
  public getId(): number | null {
    return this.id;
  }
  public getRequiredId(): number {
    if(this.id === null){
      throw new UnexpectedMissingCartIdError();
    }
    return this.id;
  }
  public getAccountId(): number {
    return this.accountId;
  }
  public getItems(): CartItemDetail[]{
    return this.items
  }
}

export class CartItemDetail {
  private constructor(
    private id: number | null,
    private quantity: Quantity,
    private cartId: number,
    private variantId: number
  ) { }

  public static create(params: { quantity: Quantity, cartId: number, variantId: number }): CartItemDetail {
    return new CartItemDetail(null, params.quantity, params.cartId, params.variantId);
  }

  public static rehydrate(params: {
    id: number;
    quantity: Quantity;
    cartId: number;
    variantId: number;
  }): CartItemDetail {
    return new CartItemDetail(
      params.id,
      params.quantity,
      params.cartId,
      params.variantId
    );
  }

  //bussiness
  public updateQuantity(newRawQuantity: Quantity): void{
    this.quantity = newRawQuantity;
  }

  // Getters and setters
  public getId(): number | null {
    return this.id;
  }

  public getRequiredId(): number {
    if (this.id === null) {
      throw new UnexpectedMissingCartItemIdError();
    }
    return this.id;
  }

  public getQuantity(): Quantity {
    return this.quantity;
  }
  public getCartid(): number {
    return this.cartId;
  }
  public getVariantId(): number {
    return this.variantId;
  }
}