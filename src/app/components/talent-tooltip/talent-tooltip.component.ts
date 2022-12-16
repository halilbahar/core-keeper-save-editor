import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { TalentData } from '~models';
import { TalentDataService } from '~services';

export interface TalenTooltipOptions {
  skillId: number;
  index: number;
  points: number;
}

@Component({
  selector: 'app-talent-tooltip',
  templateUrl: './talent-tooltip.component.html',
  styleUrls: ['./talent-tooltip.component.scss']
})
export class TalentTooltipComponent implements OnInit {
  talent: TalentData;
  @Input() options: TalenTooltipOptions;

  @HostBinding('class.tooltip') tooltip = true;

  constructor(private talentDataService: TalentDataService) {}

  ngOnInit(): void {
    this.talent = this.talentDataService.getData(this.options.skillId, this.options.index);
  }

  getDescription(): string {
    return this.talent.description.replace(
      '{0}',
      ((this.options.points === 0 ? 1 : this.options.points) * this.talent.increment).toString()
    );
  }
}
