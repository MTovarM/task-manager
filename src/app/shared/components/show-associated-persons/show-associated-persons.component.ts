import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Person } from '../../interfaces/models/person';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { EditPersonData } from '../../interfaces/person-edit';

@Component({
  selector: 'app-show-associated-persons',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './show-associated-persons.component.html',
  styleUrls: ['./show-associated-persons.component.scss']
})
export class ShowAssociatedPersonsComponent {
  @Input() persons: Person[] = [];
  @Input() enableAction: boolean = false;
  @Output() onDelete = new EventEmitter<number>()
  @Output() onEdit = new EventEmitter<EditPersonData>()

  /**
   * Evento cuando se oprime editar
   * @param person 
   * @param index 
   */
  onEditClick(person: Person, index: number) {
    this.onEdit.emit({
      index,
      person 
    });
  }
  
  /**
   * Evento cuando se oprime eliminar
   * @param personIndex 
   */
  onDeleteClick(personIndex: number): void {
    this.onDelete.emit(personIndex);
  }
}
