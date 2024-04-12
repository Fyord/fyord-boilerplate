import { BuildOperation } from './buildOperation';
import { BuildOptions, BuildResult } from 'esbuild';

const logErrors: BuildOperation = (_isProductionBuild: boolean, r: BuildResult<BuildOptions>) => {
  r.errors.length && console.error('errors', r.errors);
  r.warnings.length && console.warn('warnings', r.warnings);
};

export const onBuildEndOperations: BuildOperation[] = [
  logErrors
];
