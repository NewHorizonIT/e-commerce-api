export interface CartDTO {
  cart: {
    totalPrice: number;
    totalQuantity: number;
    items: CartItemDetailDTO[];
  };
}

export interface CartItemDetailDTO {
  cartItemId: number;
  variantId: number;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CreateCartDTO {
  accountId: number;
}
