/* eslint-disable no-console */
import { BuildConstants } from './buildConstants';
import { BuildOperation } from './buildOperation';

const logBuildModeAndTimestamp: BuildOperation = (isProductionBuild: boolean) => {
  console.time(BuildConstants.BuildTimeLog);
  console.log(`${isProductionBuild ?
    'Production' : 'Development'} build started at ${new Date().toLocaleTimeString()}`);
};

export const beforeOperations: BuildOperation[] = [
  logBuildModeAndTimestamp
];
