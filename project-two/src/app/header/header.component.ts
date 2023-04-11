import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  visibilityClasses: {};
  private isVisible: boolean = false;

  constructor(private _dataStorageService: DataStorageService) {}

  ngOnInit(): void {
    this.setVisibilityClasses();
  }

  toggleVisible(isVisible: boolean): void {
    this.isVisible = isVisible;
    this.setVisibilityClasses();
  }

  private setVisibilityClasses(): void {
    this.visibilityClasses = { hidden: !this.isVisible, '': this.isVisible };
  }

  onSaveData(): void {
    this._dataStorageService.storeRecipes();
  }

  onFetchData(): void {
    this._dataStorageService.fetchRecipes().subscribe();
  }
}
