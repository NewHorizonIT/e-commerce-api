import { AppDataSource } from '@/config';
import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { IOrderRepository } from '../domain/interface';
import { OrderEntity, OrderItemEntity, OrderStatusHistoryEntity } from './order-entity';
import {
  OrderListQueryDTO,
  PaginatedOrdersDTO,
  OrderDetailDTO,
  CreateOrderDTO,
  UpdateOrderStatusDTO,
  UpdateOrderPaymentDTO,
} from '../application/dtos';
import { ORDER_STATUS_VALUE, OrderStatus, PaymentMethod } from '../domain/value_objects';
import { VariantEntity } from '@/module/product/infarstructure/productEntity';
import { VariantNotFoundError } from '@/module/product/application/usecase/errors';
import { FailedOrderCreationError } from '../domain/errors';
import { DiscountType } from '@/module/discount/domain/value_objects';
import { DiscountCodeEntity } from '@/module/discount/infrastructure/discount-entity';
import { DiscountCode } from '@/module/discount/domain/domain';

/***
 *
 * CÁC VẤN ĐỀ CẦN SỬA:
 * - BẢN GHI TÊN BIẾN THỂ SẢN PHẨM: DÒNG 170
 * - GIÁ TIỀN KHI ÁP DỤNG MÃ GIẢM GIÁ: DÒNG 171 - 172
 *
 * ***/

@injectable()
export class TypeORMOrderRepository implements IOrderRepository {
  constructor(
    private readonly orderRepo: Repository<OrderEntity> = AppDataSource.getRepository(OrderEntity),
    private readonly variantRepo: Repository<VariantEntity> = AppDataSource.getRepository(
      VariantEntity
    )
  ) {}

  // async listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO> {
  //   const page = query.page > 0 ? query.page : 1;
  //   const limit = query.limit > 0 ? Math.min(query.limit, 100) : 20;

  //   const qb = this.orderRepo.createQueryBuilder('o');

  //   if (query.accountId) {
  //     qb.andWhere('o.account_id = :accountId', { accountId: query.accountId });
  //   }

  //   if (query.shippingInfoId) {
  //     qb.andWhere('o.shipping_info_id = :shippingInfoId', {
  //       shippingInfoId: query.shippingInfoId,
  //     });
  //   }

  //   if (query.discountCodeId) {
  //     qb.andWhere('o.discount_code_id = :discountCodeId', {
  //       discountCodeId: query.discountCodeId,
  //     });
  //   }

  //   if (query.status) {
  //     qb.andWhere('o.status = :status', { status: query.status });
  //   }

  //   if (query.sortBy === 'totalAmount') {
  //     qb.orderBy('o.total_amount', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
  //   } else {
  //     qb.orderBy('o.order_date', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
  //   }

  //   qb.skip((page - 1) * limit).take(limit);

  //   const [rows, total] = await qb.getManyAndCount();

  //   return {
  //     items: rows.map((o) => ({
  //       id: o.id,
  //       status: o.status as OrderStatus,
  //       orderDate: new Date(o.orderDate).toISOString(),
  //       totalProductAmount: o.totalProductAmount,
  //       shippingFee: o.shippingFee,
  //       discountAmount: o.discountAmount,
  //       totalAmount: o.totalAmount,
  //       isPaid: o.isPaid,
  //     })),
  //     page,
  //     limit,
  //     totalItems: total,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  async listOrders(query: OrderListQueryDTO): Promise<PaginatedOrdersDTO> {
    const page = query.page > 0 ? query.page : 1;
    const limit = query.limit > 0 ? Math.min(query.limit, 100) : 20;

    const qb = this.orderRepo.createQueryBuilder('o');
    qb.leftJoinAndSelect('o.items', 'items').leftJoinAndSelect('o.histories', 'histories');
    // .leftJoin('o.account', 'account')
    // .leftJoin('o.shippingInfo', 'shippingInfo')
    // .leftJoin('o.discountCode', 'discountCode');

    if (query.accountId) {
      qb.andWhere('o.account_id = :accountId', { accountId: query.accountId });
    }
    if (query.shippingInfoId) {
      qb.andWhere('o.shipping_info_id = :shippingInfoId', {
        shippingInfoId: query.shippingInfoId,
      });
    }
    if (query.discountCodeId) {
      qb.andWhere('o.discount_code_id = :discountCodeId', {
        discountCodeId: query.discountCodeId,
      });
    }
    if (query.status) {
      qb.andWhere('o.status = :status', { status: query.status });
    }

    if (query.sortBy === 'totalAmount') {
      qb.orderBy('o.totalAmount', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('o.orderDate', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    qb.distinct(true);

    const [rows, total] = await qb.getManyAndCount();

    return {
      items: rows.map((o) => ({
        id: o.id,
        status: o.status as OrderStatus,
        orderDate: new Date(o.orderDate).toISOString(),
        totalProductAmount: o.totalProductAmount,
        shippingFee: o.shippingFee,
        discountAmount: o.discountAmount,
        totalAmount: o.totalAmount,
        isPaid: o.isPaid,
        paymentMethod: o.paymentMethod as PaymentMethod,
        bankTransferTime: o.bankTransferTime ? new Date(o.bankTransferTime).toISOString() : null,
        bankTransferTransactionCode: o.bankTransferTransactionCode,
        note: o.note,
        accountId: o.accountId,
        shippingInfoId: o.shippingInfoId,
        discountCodeId: o.discountCodeId,
        items: (o.items || []).map((i) => ({
          id: i.id,
          productNameSnapshot: i.productNameSnapshot,
          variantNameSnapshot: i.variantNameSnapshot,
          priceBeforeDiscount: Number(i.priceBeforeDiscount),
          priceAfterDiscount: Number(i.priceAfterDiscount),
          quantity: i.quantity,
          totalAmount: Number(i.totalAmount),
          variantId: i.variantId,
        })),
        histories: (o.histories || []).map((h) => ({
          id: h.id,
          note: h.note,
          oldStatus: h.oldStatus,
          newStatus: h.newStatus,
          changedAt: new Date(h.changedAt).toISOString(),
        })),
      })),
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOrderById(orderId: number): Promise<OrderDetailDTO | null> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ['items', 'histories'],
    });

    if (!order) return null;

    return {
      id: order.id,
      status: order.status as OrderStatus,
      orderDate: new Date(order.orderDate).toISOString(),
      totalProductAmount: order.totalProductAmount,
      shippingFee: order.shippingFee,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      isPaid: order.isPaid,
      paymentMethod: order.paymentMethod as PaymentMethod,
      bankTransferTime: order.bankTransferTime?.toISOString() ?? null,
      bankTransferTransactionCode: order.bankTransferTransactionCode,
      note: order.note,
      accountId: order.accountId,
      shippingInfoId: order.shippingInfoId,
      discountCodeId: order.discountCodeId,
      items: order.items.map((i) => ({
        id: i.id,
        productNameSnapshot: i.productNameSnapshot,
        variantNameSnapshot: i.variantNameSnapshot,
        priceBeforeDiscount: i.priceBeforeDiscount,
        priceAfterDiscount: i.priceAfterDiscount,
        quantity: i.quantity,
        totalAmount: i.totalAmount,
        variantId: i.variantId,
      })),
      histories: order.histories.map((h) => ({
        id: h.id,
        note: h.note,
        changedAt: h.changedAt.toISOString(),
        oldStatus: h.oldStatus,
        newStatus: h.newStatus,
      })),
    };
  }

  async createOrder(dto: CreateOrderDTO): Promise<OrderDetailDTO> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(OrderEntity, {
        status: ORDER_STATUS_VALUE.PENDING,
        orderDate: new Date(),
        totalProductAmount: 0,
        shippingFee: dto.shippingFee ?? 0,
        discountAmount: dto.discountAmount ?? 0,
        totalAmount: 0,
        isPaid: false,
        paymentMethod: dto.paymentMethod,
        note: dto.note?.trim() || null,
        accountId: dto.accountId,
        shippingInfoId: dto.shippingInfoId,
        discountCodeId: dto.discountCodeId ?? null,
      });
      const savedOrder = await queryRunner.manager.save(order);

      let totalProductAmount = 0;

      for (const item of dto.items) {
        const variant = await this.variantRepo.findOne({
          where: { id: item.variantId },
          relations: ['product', 'details', 'details.value', 'details.value.group'],
        });
        if (!variant) throw new VariantNotFoundError(item.variantId);

        const total = Number(variant.price) * item.quantity;
        totalProductAmount += total;

        await queryRunner.manager.insert(OrderItemEntity, {
          productNameSnapshot: variant.product.name,
          variantNameSnapshot: variant.details
            .sort((a, b) => a.value.group.displayOrder - b.value.group.displayOrder) // optional: đúng thứ tự
            .map((detail) => detail.value.value)
            .join(' / '),
          priceBeforeDiscount: Number(variant.price),
          priceAfterDiscount: Number(variant.price),
          quantity: item.quantity,
          totalAmount: total,
          orderId: savedOrder.id,
          variantId: item.variantId,
        });
      }

      // Calculate order-level discount if discount code applied
      let discountAmount = 0;
      if (dto.discountCodeId) {
        // lazy import of discount entity/domain to avoid circular deps
        // const { DiscountCodeEntity } =
        //   await import('@/module/discount/infrastructure/discount-entity');
        // const { DiscountCode } = await import('@/module/discount/domain/domain');

        const discountEntity = await AppDataSource.getRepository(DiscountCodeEntity).findOne({
          where: { id: dto.discountCodeId },
        });
        if (discountEntity) {
          const discountDomain = DiscountCode.rehydrate({
            id: discountEntity.id,
            name: discountEntity.name,
            discountCode: discountEntity.discountCode,
            type: discountEntity.type as DiscountType,
            discountValue: Number(discountEntity.discountValue),
            minimumOrderValue: Number(discountEntity.minimumOrderValue),
            maximumDiscount: Number(discountEntity.maximumDiscount),
            maximumUsage: discountEntity.maximumUsage,
            startTime: discountEntity.startTime,
            endTime: discountEntity.endTime,
            isActive: discountEntity.isActive,
            allowSaveBefore: discountEntity.allowSaveBefore,
          });

          discountAmount = discountDomain.calculateDiscount(totalProductAmount);
        }
      }

      const totalAmount = totalProductAmount + Number(savedOrder.shippingFee) - discountAmount;

      savedOrder.totalProductAmount = totalProductAmount;
      savedOrder.totalAmount = totalAmount;
      savedOrder.discountAmount = discountAmount;

      await queryRunner.manager.save(savedOrder);
      await queryRunner.commitTransaction();

      const result = await this.findOrderById(savedOrder.id);
      if (!result) throw new FailedOrderCreationError();

      return result;
    } catch (err) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderStatus(
    orderId: number,
    dto: UpdateOrderStatusDTO
  ): Promise<OrderDetailDTO | null> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(OrderEntity, {
        where: { id: orderId },
      });
      if (!order) {
        await queryRunner.rollbackTransaction();
        return null;
      }

      const oldStatus = order.status;
      order.status = dto.status;

      await queryRunner.manager.save(order);

      await queryRunner.manager.insert(OrderStatusHistoryEntity, {
        note: dto.note ?? null,
        changedAt: new Date(),
        oldStatus: oldStatus,
        newStatus: dto.status,
        orderId: orderId,
      });

      await queryRunner.commitTransaction();

      return this.findOrderById(orderId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderPayment(
    orderId: number,
    dto: UpdateOrderPaymentDTO
  ): Promise<OrderDetailDTO | null> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(OrderEntity, {
        where: { id: orderId },
      });

      if (!order) {
        await queryRunner.rollbackTransaction();
        return null;
      }

      order.isPaid = dto.isPaid;
      order.paymentMethod = dto.paymentMethod;
      order.bankTransferTime = dto.bankTransferTime ? new Date(dto.bankTransferTime) : null;
      order.bankTransferTransactionCode = dto.bankTransferTransactionCode ?? null;

      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();

      return this.findOrderById(orderId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async hasOrdersByAccountId(accountId: number): Promise<boolean> {
    const count = await this.orderRepo.count({ where: { accountId } });
    return count > 0;
  }

  async hasOrdersByShippingInfoId(shippingInfoId: number): Promise<boolean> {
    const count = await this.orderRepo.count({ where: { shippingInfoId } });
    return count > 0;
  }

  async hasOrdersByDiscountCodeId(discountCodeId: number): Promise<boolean> {
    const count = await this.orderRepo.count({ where: { discountCodeId } });
    return count > 0;
  }
}
