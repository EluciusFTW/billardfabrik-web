import { Player } from "./player";

export class PlayerFunctions {
  public static keyFromPlayer(player: Player): string {
    return player.firstName + '_' + player.lastName;
  }

  public static keyFromName(name: string): string {
    return name.replace(' ', '_');
  }

  public static nameFromKey(name: string): string {
    return name.replace('_', ' ');
  }

  public static displayName(player: Player): string {
    return `${player.firstName} ${player.lastName}`;
  }

  public static sortPlayers(first: Player, second: Player): number {
      if (first.firstName < second.firstName) {
        return -1;
      }
      if (first.firstName > second.firstName) {
        return 1;
      }
      return 0;
  }
}
