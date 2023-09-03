import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { User } from 'src/app/models/user/user';

@Component({
  selector: 'app-user-filterable-multi-select',
  templateUrl: './user-filterable-multi-select.component.html',
  styleUrls: ['./user-filterable-multi-select.component.css'],
})
export class UserFilterableMultiSelectComponent implements OnChanges {
  @Input() label = '';

  @Input() selection: User[] = [];

  @Output() selectionChange = new EventEmitter<User[]>();

  @Input() selectable: User[] | null | undefined = [];

  @Input() disabled = false;

  @Input() none = true;

  preservedSelectable: User[] | null | undefined = [];

  filterValue = '';

  ngOnChanges() {
    this.preservedSelectable = this.selectable;
  }

  filter() {
    this.selectable = this.preservedSelectable?.filter(
      selection =>
        selection.username
          ?.toLowerCase()
          .includes(this.filterValue.toLowerCase())
    );
  }

  onClose() {
    this.clearFilter();
  }

  onSelectionChange() {
    this.clearFilter();
    this.selectionChange.emit(this.selection);
  }

  clearFilter() {
    this.filterValue = '';
    if (this.preservedSelectable) {
      this.selectable = [...(this.preservedSelectable as User[])];
    }
  }

  compare(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id && o1.username === o2.username : false;
  }
}
