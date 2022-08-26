import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SkillTalentService } from 'src/app/services/skill-talent.service';
import { Skill } from '~models';
import { CharacterService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {
  skills: Skill[];
  selectedSkillID: number;

  constructor(
    private characterService: CharacterService,
    private skillTalentService: SkillTalentService
  ) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(value => {
      this.skills = value.skills;
    });
    this.skillTalentService.$selectedSkill.pipe(untilDestroyed(this)).subscribe(value => {
      this.selectedSkillID = value;
    });
  }

  onSKillClick(skillID: number): void {
    this.skillTalentService.setSelectedSkill(skillID);
  }

  onLevelIncreaseClick(): void {}

  onLevelDecreaseClick(): void {}

  getSelectedSkillName(): string {
    return this.skillTalentService.getSkillName(this.selectedSkillID);
  }

  getSkillLevel(skillID: number): number {
    return this.skillTalentService.getLevelByXp(skillID, this.skills[skillID].value);
  }
}
