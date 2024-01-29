export interface Player {
  firstName: string;
  lastName: string;
  clubPlayer: boolean;
  club?: string;
  enteredInSystem: number;
  showForTourneys: boolean;
  showForElo: boolean;
}
