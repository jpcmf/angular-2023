import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  visibilityClasses: {};
  private isVisible: boolean = false;

  @Output() featureSelected = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
    this.setVisibilityClasses();
  }

  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  toggleVisible(isVisible: boolean): void {
    this.isVisible = isVisible;
    this.setVisibilityClasses();
  }

  private setVisibilityClasses(): void {
    this.visibilityClasses = { hidden: !this.isVisible, '': this.isVisible };
  }
}
