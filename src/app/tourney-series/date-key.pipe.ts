import { Pipe, PipeTransform } from '@angular/core';
import { TourneyFunctions } from './tourney/tourney-functions';

@Pipe({
  name: 'dateKey'
})
export class DateKeyPipe implements PipeTransform {
  transform(value: string): string {
    return TourneyFunctions
      .NameFragmentToDate(value)
      .toLocaleDateString();
  }
}
