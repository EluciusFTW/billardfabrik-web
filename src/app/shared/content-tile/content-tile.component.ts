import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { OwnMessageService } from '../services/own-message.service';
import { OwnConfirmService } from '../services/own-confirm.service';

@Component({
  selector: 'app-content-tile',
  templateUrl: './content-tile.component.html',
  styleUrls: ['./content-tile.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  providers: [
    OwnMessageService,
    OwnConfirmService
  ]
})
export class ContentTileComponent {
  public header = input<string>();
  public subheader = input<string>();
}
