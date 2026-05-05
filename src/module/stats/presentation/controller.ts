import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';
import { STATS_TOKENS } from '../tokens';
import type { IStatsModulePort } from '../application/module_port';
import type { StatsRangeQueryDTO } from '../application/dtos';

@injectable()
export class StatsController {
  constructor(
    @inject(STATS_TOKENS.IStatsModulePort)
    private readonly statsModulePort: IStatsModulePort
  ) {}

  async getOverview(req: Request, res: Response): Promise<void> {
    const overview = await this.statsModulePort.getOverview(this.parseQuery(req.query));
    new SuccessResponse(overview, undefined, StatusCode.OK).send(res);
  }

  async getOrdersTrend(req: Request, res: Response): Promise<void> {
    const trend = await this.statsModulePort.getOrdersTrend(this.parseQuery(req.query));
    new SuccessResponse(trend, undefined, StatusCode.OK).send(res);
  }

  async getOrdersStatusBreakdown(req: Request, res: Response): Promise<void> {
    const breakdown = await this.statsModulePort.getOrdersStatusBreakdown(
      this.parseQuery(req.query)
    );
    new SuccessResponse(breakdown, undefined, StatusCode.OK).send(res);
  }

  async getTopSellingProducts(req: Request, res: Response): Promise<void> {
    const topSellingProducts = await this.statsModulePort.getTopSellingProducts(
      this.parseQuery(req.query)
    );
    new SuccessResponse(topSellingProducts, undefined, StatusCode.OK).send(res);
  }

  async getTopSpenders(req: Request, res: Response): Promise<void> {
    const topSpenders = await this.statsModulePort.getTopSpenders(this.parseQuery(req.query));
    new SuccessResponse(topSpenders, undefined, StatusCode.OK).send(res);
  }

  async getReviewSummary(req: Request, res: Response): Promise<void> {
    const summary = await this.statsModulePort.getReviewSummary(this.parseQuery(req.query));
    new SuccessResponse(summary, undefined, StatusCode.OK).send(res);
  }

  private parseQuery(query: Request['query']): StatsRangeQueryDTO {
    const rawQuery = query as Record<string, unknown>;
    const from = rawQuery.from;
    const to = rawQuery.to;
    const groupBy = rawQuery.groupBy;
    const limit = rawQuery.limit;
    const productId = rawQuery.productId;

    return {
      ...(from instanceof Date ? { from } : {}),
      ...(to instanceof Date ? { to } : {}),
      ...(groupBy === 'day' || groupBy === 'week' || groupBy === 'month' ? { groupBy } : {}),
      ...(typeof limit === 'number' ? { limit } : {}),
      ...(typeof productId === 'number' ? { productId } : {}),
    };
  }
}
