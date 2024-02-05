import { Pipe, PipeTransform } from "@angular/core";
import { Player } from "./player";
import { PlayerFunctions } from "./player-functions";

@Pipe({
  name: 'name'
})
export class PlayerNamePipe implements PipeTransform {
  transform(value: Player): string {
    return PlayerFunctions.displayName(value);
  }
}
