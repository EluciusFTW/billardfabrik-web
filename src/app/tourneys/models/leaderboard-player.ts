export interface LeaderBoardPlayer {
  name: string;
  participations: number;
  points: number;
  matches: number;
  winPercentage: number;
  scored: number;
  received: number;
  placements?: any;
  achievements?: any;
}
