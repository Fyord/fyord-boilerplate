import { Environments } from 'fyord';

export enum EnvironmentVariables {
  Mode = 'mode',
}

export const DevelopmentEnvironmentVariables = new Map<string, string>([
  [EnvironmentVariables.Mode, Environments.Development]
]);

export const ProductionEnvironmentVariables = new Map<string, string>([
  [EnvironmentVariables.Mode, Environments.Production]
]);
