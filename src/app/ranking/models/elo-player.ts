import { EloDataPoint } from "./elo-match";

export type EloPlayer = {
  name: string;
  show: boolean;
  changes: EloDataPoint[];
}
