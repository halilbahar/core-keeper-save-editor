import { Component, HostBinding, Input } from '@angular/core';

import { TalentData } from '~models';
import { ConditionDataService, TalentDataService } from '~services';

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
export class TalentTooltipComponent {
  talent: TalentData;
  description: string;

  @HostBinding('class.tooltip') tooltip = true;

  constructor(
    private talentDataService: TalentDataService,
    private conditionDataService: ConditionDataService
  ) {}

  @Input() set options(options: TalenTooltipOptions) {
    const { index, points, skillId } = options;
    this.talent = this.talentDataService.getData(skillId, index);
    // We have a function that takes in an array.
    // Instead of creating one that doesn't take an array we give and array and get the first index
    this.description = this.conditionDataService
      .transformConditionIdToLabel([
        {
          id: this.talent.conditionId,
          value: (points === 0 ? 1 : points) * this.talent.increment
        }
      ])[0][0]
      .toString();
  }
}
