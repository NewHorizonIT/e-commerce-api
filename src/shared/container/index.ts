import { container, type DependencyContainer } from 'tsyringe';
import { registerAuthDependencies } from '@/module/auth/container';
import { registerReviewDependencies } from '@/module/review/container';
import { registerCartDependencies } from '@/module/cart/container';
import { registerUserDependencies } from '@/module/user/container';
import { registerStatsDependencies } from '@/module/stats/container';

export function initContainer(c: DependencyContainer = container): DependencyContainer {
  registerAuthDependencies(c);
  registerReviewDependencies(c);
  registerCartDependencies(c);
  registerUserDependencies(c);
  registerStatsDependencies(c);

  return c;
}
