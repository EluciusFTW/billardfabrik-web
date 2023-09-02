import { RouterModule } from '@angular/router';
import { OwnMessageService } from './services/own-message.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTileComponent } from './content-tile/content-tile.component';
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
        ContentTileComponent,
        ConfirmDialogComponent
    ],
    exports: [
        ContentTileComponent,
    ],
    providers: [
        OwnMessageService,
        OwnConfirmService
    ]
})
export class SharedModule { }
