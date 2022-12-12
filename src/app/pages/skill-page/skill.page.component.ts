import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SkillTalentTree } from '~models';
import { CharacterService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-skill-page',
  templateUrl: './skill.page.component.html',
  styleUrls: ['./skill.page.component.scss']
})
export class SkillPageComponent implements OnInit {
  skillTalentTreeDatas: SkillTalentTree[];
  debugTree: SkillTalentTree;
  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(character => {
      this.skillTalentTreeDatas = character.skillTalentTreeDatas;
      this.debugTree = this.skillTalentTreeDatas.find(tree => tree.skillTreeID === 0);
      const pointsLength = this.debugTree.points.length;
      if (pointsLength < 8) {
        const diff = 8 - pointsLength;
        for (let i = 0; i < diff; i++) {
          this.debugTree.points.push(0);
        }
      }
    });
  }
}
