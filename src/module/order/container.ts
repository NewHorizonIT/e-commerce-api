import { type DependencyContainer } from 'tsyringe';
import { ORDER_TOKENS } from './tokens';
import { TypeORMOrderRepository } from './infrastructure/repository';

export function registerOrderDependencies(container: DependencyContainer): void {
  container.registerSingleton(ORDER_TOKENS.IOrderRepository, TypeORMOrderRepository);
}
