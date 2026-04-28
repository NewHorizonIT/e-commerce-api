import { AppDataSource } from '@/config';
import { injectable } from 'tsyringe';
import { Repository } from 'typeorm';
import { IDiscountRepository } from '../domain/interface';
import { DiscountCodeEntity } from './discount-entity';
import {
  DiscountListQueryDTO,
  PaginatedDiscountsDTO,
  DiscountDetailDTO,
  CreateDiscountDTO,
  UpdateDiscountDTO,
} from '../application/dtos';
import { DiscountType } from '../domain/value_objects';

@injectable()
export class TypeORMDiscountRepository implements IDiscountRepository {
  constructor(
    private readonly discountRepo: Repository<DiscountCodeEntity> = AppDataSource.getRepository(
      DiscountCodeEntity
    )
  ) {}

  private mapToDetailDTO(entity: DiscountCodeEntity): DiscountDetailDTO {
    return {
      id: entity.id,
      name: entity.name,
      discountCode: entity.discountCode,
      type: entity.type as DiscountType,
      discountValue: Number(entity.discountValue),
      minimumOrderValue: Number(entity.minimumOrderValue),
      maximumDiscount: Number(entity.maximumDiscount),
      maximumUsage: entity.maximumUsage,
      startTime: entity.startTime.toISOString(),
      endTime: entity.endTime.toISOString(),
      isActive: entity.isActive,
      allowSaveBefore: entity.allowSaveBefore,
    };
  }

  async listDiscounts(query: DiscountListQueryDTO): Promise<PaginatedDiscountsDTO> {
    const page = query.page > 0 ? query.page : 1;
    const limit = query.limit > 0 ? Math.min(query.limit, 100) : 20;

    const qb = this.discountRepo.createQueryBuilder('d');

    if (query.isActive !== undefined) {
      qb.andWhere('d.is_active = :isActive', { isActive: query.isActive });
    }

    if (query.sortBy === 'name') {
      qb.orderBy('d.name', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    } else if (query.sortBy === 'startTime') {
      qb.orderBy('d.start_time', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    } else if (query.sortBy === 'discountValue') {
      qb.orderBy('d.discount_value', query.sortOrder?.toUpperCase() as 'ASC' | 'DESC');
    } else {
      qb.orderBy('d.created_at', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      items: rows.map((d) => ({
        id: d.id,
        name: d.name,
        discountCode: d.discountCode,
        type: d.type as DiscountType,
        discountValue: Number(d.discountValue),
        minimumOrderValue: Number(d.minimumOrderValue),
        maximumDiscount: Number(d.maximumDiscount),
        maximumUsage: d.maximumUsage,
        startTime: d.startTime.toISOString(),
        endTime: d.endTime.toISOString(),
        isActive: d.isActive,
        allowSaveBefore: d.allowSaveBefore,
      })),
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findDiscountById(discountId: number): Promise<DiscountDetailDTO | null> {
    const discount = await this.discountRepo.findOne({
      where: { id: discountId },
    });
    if (!discount) {
      return null;
    }

    return this.mapToDetailDTO(discount);
  }

  async findDiscountByCode(code: string): Promise<DiscountDetailDTO | null> {
    const discount = await this.discountRepo.findOne({
      where: { discountCode: code },
    });
    if (!discount) {
      return null;
    }

    return this.mapToDetailDTO(discount);
  }

  async createDiscount(dto: CreateDiscountDTO): Promise<DiscountDetailDTO> {
    const entity = this.discountRepo.create({
      name: dto.name,
      discountCode: dto.discountCode,
      type: dto.type,
      discountValue: dto.discountValue,
      minimumOrderValue: dto.minimumOrderValue ?? 0,
      maximumDiscount: dto.maximumDiscount ?? Number.MAX_SAFE_INTEGER,
      maximumUsage: dto.maximumUsage ?? Number.MAX_SAFE_INTEGER,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: dto.isActive ?? true,
      allowSaveBefore: dto.allowSaveBefore ?? true,
    });

    const saved = await this.discountRepo.save(entity);
    return this.mapToDetailDTO(saved);
  }

  async updateDiscount(
    discountId: number,
    dto: UpdateDiscountDTO
  ): Promise<DiscountDetailDTO | null> {
    const discount = await this.discountRepo.findOne({
      where: { id: discountId },
    });
    if (!discount) {
      return null;
    }

    if (dto.name !== undefined) discount.name = dto.name;
    if (dto.discountCode !== undefined) discount.discountCode = dto.discountCode;
    if (dto.type !== undefined) discount.type = dto.type;
    if (dto.discountValue !== undefined) discount.discountValue = Number(dto.discountValue);
    if (dto.minimumOrderValue !== undefined)
      discount.minimumOrderValue = Number(dto.minimumOrderValue);
    if (dto.maximumDiscount !== undefined) discount.maximumDiscount = Number(dto.maximumDiscount);
    if (dto.maximumUsage !== undefined) discount.maximumUsage = dto.maximumUsage;
    if (dto.startTime !== undefined) discount.startTime = dto.startTime;
    if (dto.endTime !== undefined) discount.endTime = dto.endTime;
    if (dto.allowSaveBefore !== undefined) discount.allowSaveBefore = dto.allowSaveBefore;

    const updated = await this.discountRepo.save(discount);
    return this.mapToDetailDTO(updated);
  }

  async updateActiveDiscount(
    discountId: number,
    isActive: boolean
  ): Promise<DiscountDetailDTO | null> {
    const discount = await this.discountRepo.findOne({
      where: { id: discountId },
    });
    if (!discount) {
      return null;
    }

    discount.isActive = isActive;

    const updated = await this.discountRepo.save(discount);
    return this.mapToDetailDTO(updated);
  }
}
