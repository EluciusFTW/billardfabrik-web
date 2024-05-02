import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [SharedModule],
  standalone: true
})
export class ContactComponent { }
