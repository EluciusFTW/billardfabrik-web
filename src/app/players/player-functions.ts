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
}
