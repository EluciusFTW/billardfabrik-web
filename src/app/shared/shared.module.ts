import { RouterModule } from '@angular/router';
import { OwnMessageService } from './services/own-message.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentHeaderComponent } from './content-header/content-header.component';
import { ContentTileComponent } from './content-tile/content-tile.component';
import { TimeTickPipe } from './pipes/time-tick.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { OwnConfirmService } from './services/own-confirm.service';
import { MaterialModule } from '../material/material.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MaterialModule
    ],
    declarations: [
        ContentHeaderComponent,
        ContentTileComponent,
        TimeTickPipe,
        ConfirmDialogComponent
    ],
    exports: [
        ContentHeaderComponent,
        ContentTileComponent,
        TimeTickPipe
    ],
    providers: [
        OwnMessageService,
        OwnConfirmService
    ]
})
export class SharedModule { }
