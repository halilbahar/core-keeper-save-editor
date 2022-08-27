import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SkillTalentService } from 'src/app/services/skill-talent.service';
import { Character, Skill } from '~models';
import { CharacterService } from '~services';

@UntilDestroy()
@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnInit {
  skills: Skill[];
  character: Character;
  selectedSkillID: number;

  constructor(
    private characterService: CharacterService,
    private skillTalentService: SkillTalentService
  ) {}

  ngOnInit(): void {
    this.characterService.$character.pipe(untilDestroyed(this)).subscribe(value => {
      this.skills = value.skills;
      this.character = value;
    });
    this.skillTalentService.$selectedSkill.pipe(untilDestroyed(this)).subscribe(value => {
      this.selectedSkillID = value;
    });
  }

  onSKillClick(skillID: number): void {
    this.skillTalentService.setSelectedSkill(skillID);
  }

  onLevelIncreaseClick(): void {
    this.setSelectedSkillLevel(
      this.skillTalentService.getLevelByXp(
        this.selectedSkillID,
        this.skills[this.selectedSkillID].value
      ) + 1
    );
  }

  onLevelDecreaseClick(): void {
    this.setSelectedSkillLevel(
      this.skillTalentService.getLevelByXp(
        this.selectedSkillID,
        this.skills[this.selectedSkillID].value
      ) - 1
    );
  }

  setSelectedSkillLevel(level: number): void {
    this.characterService.setCharacter({
      ...this.character,
      skills: this.character.skills.map(skill => {
        return {
          ...skill,
          value:
            skill.skillID === this.selectedSkillID
              ? this.skillTalentService.getXpForLevel(this.selectedSkillID, level)
              : skill.value
        };
      })
    });
  }

  getSelectedSkillName(): string {
    return this.skillTalentService.getSkillName(this.selectedSkillID);
  }

  getSkillLevel(skillID: number): number {
    return this.skillTalentService.getLevelByXp(skillID, this.skills[skillID].value);
  }
}
