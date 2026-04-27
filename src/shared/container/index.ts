import { container, type DependencyContainer } from 'tsyringe';
import { registerAuthDependencies } from '@/module/auth/container';
import { registerReviewDependencies } from '@/module/review/container';
import { registerCartDependencies } from '@/module/cart/container';

export function initContainer(c: DependencyContainer = container): DependencyContainer {
  registerAuthDependencies(c);
  registerReviewDependencies(c);
  registerCartDependencies(c);

  return c;
}
