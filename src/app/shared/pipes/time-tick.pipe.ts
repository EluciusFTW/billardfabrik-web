import { Pipe, PipeTransform } from '@angular/core';
// import * as moment from 'moment';

@Pipe({
  name: 'timeTick'
})
export class TimeTickPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    // if (value > 1) {
    //   if (args){
    //     return moment(value).format('HH:mm');
    //   }
    //   return moment(value).format('DD.MM.YY, HH:mm');
    // }
    return '';
  }
}
