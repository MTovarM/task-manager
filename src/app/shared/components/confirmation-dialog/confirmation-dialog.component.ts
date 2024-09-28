import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { GenericDialogData } from '../../interfaces/generic-dialog-dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogData,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>
  ) {}

  /**
   * Evento cuando se confirma
   */
  onOkClick = () => this.dialogRef.close(true);
  
  /**
   * Evento cuando se responde que no
   */
  onNotClick = () => this.dialogRef.close(false);

}
