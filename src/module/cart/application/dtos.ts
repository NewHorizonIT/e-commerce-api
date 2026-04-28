export interface CartDTO {
    id: number;
    accountId: number
    items: CartItemDetailDTO[]
}

export interface CartItemDetailDTO {
    id: number;
    quantity: number;
    cartId: number;
    variantId: number;
}

export interface CreateCartDTO {
    accountId: number
}