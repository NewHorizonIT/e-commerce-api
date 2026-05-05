import { container } from 'tsyringe';
import { IStatsModulePort } from './application/module_port';
import { STATS_TOKENS } from './tokens';
import { StatsController } from './presentation/controller';
import { createStatsRouter } from './presentation/router';

export class StatsModule {
  public readonly router;
  public readonly publicApi: IStatsModulePort;

  constructor() {
    this.publicApi = container.resolve<IStatsModulePort>(STATS_TOKENS.IStatsModulePort);
    const controller = container.resolve(StatsController);
    this.router = createStatsRouter(controller);
  }
}

export const statsModule = new StatsModule();
export const statsPublicApi = statsModule.publicApi;
