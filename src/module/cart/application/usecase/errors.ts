import { AppError } from "@/shared/error/error";

export class NotFoundCartErrorById extends AppError {
  constructor(id: number) {
    super(`Cart with ID ${id} not found`, 'NOT_FOUND_CART_BY_ID', 404);
  }
}

