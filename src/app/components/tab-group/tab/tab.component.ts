import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  private _active = false;

  @HostBinding('class') classes = 'hidden';
  @Input() navItemTitle: string;

  @Input() set active(value: boolean) {
    this._active = value;
    this.classes = value ? 'block' : 'hidden';
  }
  get active(): boolean {
    return this._active;
  }
}
