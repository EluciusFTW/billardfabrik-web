import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'billardfabrik-web';
  defaultImage = '../assets/pics/player-right.jpg';
  urlToImage = this.defaultImage;

  // constructor(private router: Router) {
  //   router.events.subscribe((val) => {
  //     if (val instanceof ActivationStart) {
  //       this.urlToImage = val.snapshot.data.bg || this.defaultImage;
  //     }
  //   });
  // }
}
