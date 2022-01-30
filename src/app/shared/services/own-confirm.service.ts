import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Observable } from 'rxjs';
import { ConfirmDialogData } from '../models/confirm-dialog-data';
import { map } from 'rxjs/operators';

@Injectable()
export class OwnConfirmService {

    constructor(public dialog: MatDialog) { }

    confirm(data: ConfirmDialogData): Observable<boolean> {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            hasBackdrop: true,
            data: {
                title: data.title || 'Bitte um Bestätigung',
                message: data.message || 'Bist Du sichser dass Du das tun willst?',
                icon: data.icon || 'fas fa-check-circle'
            }
        });
        return dialogRef.afterClosed().pipe(map(result => !!result));
    }
}
