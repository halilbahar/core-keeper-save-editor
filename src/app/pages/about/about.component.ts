import { Component } from '@angular/core';

import PackageJson from 'package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  version: string = PackageJson.version;
  constructor() {}
}
