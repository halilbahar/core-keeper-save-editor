import { Component, Input, OnInit } from '@angular/core';

import { SkillTalentTree } from '~models';

type TalentTreeOptions = { skillId: number; talentTree: SkillTalentTree };

@Component({
  selector: 'app-talent-tree',
  templateUrl: './talent-tree.component.html',
  styleUrls: ['./talent-tree.component.scss']
})
export class TalentTreeComponent {
  private _options: TalentTreeOptions;
  blocked: boolean[] = [];
  constructor() {}

  @Input() set options(options: TalentTreeOptions) {
    this._options = options;
    this.updateBlocked();
  }

  get options() {
    return this._options;
  }

  onTalentIncrease({ index }: { index: number }) {
    this.options.talentTree.points[index]++;
    this.updateBlocked();
  }

  private updateBlocked() {
    const firstMaxed = this.options.talentTree.points[0] !== 5;
    this.blocked[0] = false;
    this.blocked[1] = firstMaxed;
    this.blocked[2] = firstMaxed;

    const secondMaxed = this.options.talentTree.points[1] !== 5;
    const thirdMaxed = this.options.talentTree.points[2] !== 5;
    this.blocked[3] = secondMaxed;
    this.blocked[4] = secondMaxed && thirdMaxed;
    this.blocked[5] = thirdMaxed;

    const fourthMaxed = this.options.talentTree.points[3] !== 5;
    const fifthMaxed = this.options.talentTree.points[4] !== 5;
    const sixthMaxed = this.options.talentTree.points[5] !== 5;
    this.blocked[6] = fourthMaxed && fifthMaxed;
    this.blocked[7] = fifthMaxed && sixthMaxed;
    console.log(this.blocked);
  }
}
