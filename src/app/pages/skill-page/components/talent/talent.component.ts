import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

import { TalentData } from '~models';
import { TalentDataService } from '~services';

type TalentOptions = { skillId: number; points: number; index: number; blocked: boolean };

@Component({
  selector: 'app-talent',
  templateUrl: './talent.component.html',
  styleUrls: ['./talent.component.scss']
})
export class TalentComponent {
  private _options: TalentOptions;

  talent: TalentData;
  @HostBinding('style') style: string;
  @Output() talentIncreased = new EventEmitter<{ index: number }>();

  constructor(public talentDataService: TalentDataService) {}

  @Input() set options(options: TalentOptions) {
    this._options = options;
    this.talent = this.talentDataService.getData(options.skillId, options.index);
    this.style = `border-image: url("assets/border/talents/talent_border_${
      options.points === 5 ? options.skillId : 'base'
    }.png") 1`;
  }

  @HostListener('click')
  onClick() {
    if (this.options.points < 5) {
      this.talentIncreased.emit({ index: this.options.index });
    }
  }

  get options(): TalentOptions {
    return this._options;
  }
}
