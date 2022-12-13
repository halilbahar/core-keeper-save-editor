import { Component, Input, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SkillTalentTree } from '~models';
import { CharacterService, SkillTalentService } from '~services';

type TalentTreeOptions = { skillId: number; talentTree: SkillTalentTree };

@UntilDestroy()
@Component({
  selector: 'app-talent-tree',
  templateUrl: './talent-tree.component.html',
  styleUrls: ['./talent-tree.component.scss']
})
export class TalentTreeComponent implements OnInit {
  blocked: boolean[] = [];
  skillTalentTree: SkillTalentTree;
  skillId: number;

  constructor(
    private characterService: CharacterService,
    private skillTalentService: SkillTalentService
  ) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(character => {
      const skillTalentTreeDatas = character.skillTalentTreeDatas;

      this.skillTalentService.$selectedSkill.pipe(untilDestroyed(this)).subscribe(value => {
        this.skillId = value;

        this.skillTalentTree = skillTalentTreeDatas.find(tree => tree.skillTreeID === this.skillId);
        const pointsLength = this.skillTalentTree.points.length;
        if (pointsLength < 8) {
          const diff = 8 - pointsLength;
          for (let i = 0; i < diff; i++) {
            this.skillTalentTree.points.push(0);
          }
        }
        this.updateBlocked();
      });
    });
  }

  onTalentIncrease({ index }: { index: number }) {
    this.skillTalentTree.points[index]++;
    this.updateBlocked();
  }

  private updateBlocked() {
    const firstMaxed = this.skillTalentTree.points[0] !== 5;
    this.blocked[0] = false;
    this.blocked[1] = firstMaxed;
    this.blocked[2] = firstMaxed;

    const secondMaxed = this.skillTalentTree.points[1] !== 5;
    const thirdMaxed = this.skillTalentTree.points[2] !== 5;
    this.blocked[3] = secondMaxed;
    this.blocked[4] = secondMaxed && thirdMaxed;
    this.blocked[5] = thirdMaxed;

    const fourthMaxed = this.skillTalentTree.points[3] !== 5;
    const fifthMaxed = this.skillTalentTree.points[4] !== 5;
    const sixthMaxed = this.skillTalentTree.points[5] !== 5;
    this.blocked[6] = fourthMaxed && fifthMaxed;
    this.blocked[7] = fifthMaxed && sixthMaxed;
  }
}
