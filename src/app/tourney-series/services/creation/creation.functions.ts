
export class CreationFunctions {
  static reOrderRandomly<T>(players: T[]): T[] {
    let randomOrderedPlayers: T[] = [];
    while (players.length > 0) {
      let randomIndex = Math.floor(Math.random() * players.length);
      randomOrderedPlayers.push(players[randomIndex]);
      players.splice(randomIndex, 1);
    }
    return randomOrderedPlayers;
  }

  static chunk<T>(array: T[], size: number): T[][] {
    let result: T[][] = [];
    while (array.length > 0) {
      result.push(array.splice(0, size));
    }
    return result;
  }
}
