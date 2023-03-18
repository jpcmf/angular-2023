import {
  Directive,
  EventEmitter,
  // HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  // @HostBinding('class.hidden') isOpen: boolean = false;

  @Output() isMenuOpen = new EventEmitter<boolean>();
  isOpen: boolean = false;

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
    this.isMenuOpen.emit(this.isOpen);
  }

  constructor() {}
}
