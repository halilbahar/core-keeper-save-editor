import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SkillTalentService {
  // Mining,
  // Running,
  // Melee Combat,
  // Vitality,
  // Crafting,
  // Range Combat,
  // Gardening,
  // Fishing,
  // Cooking
  private _skillData = [
    [1.0464799404144, 50],
    [1.049399971962, 200],
    [1.0271600484848, 50],
    [1.0494300127029, 2000],
    [1.0370600223541, 30],
    [1.0238200426102, 50],
    [1.0252599716187, 15],
    [1.0271600484848, 5],
    [1.0370600223541, 5]
  ];

  private _$selectedSkill: Subject<number> = new Subject();
  readonly $selectedSkill: Observable<number> = this._$selectedSkill.asObservable();
  private _lastSelectedSkillID: number;

  setSelectedSkill(skillID: number) {
    if (skillID === this._lastSelectedSkillID) {
      this._$selectedSkill.next(null);
      this._lastSelectedSkillID = null;
      return;
    }
    this._$selectedSkill.next(skillID);
    this._lastSelectedSkillID = skillID;
  }

  getSkillName(skillID: number): string {
    const skillNames = [
      'Mining',
      'Running',
      'Meele Combat',
      'Vitality',
      'Crafting',
      'Ranged Combat',
      'Gardening',
      'Fishing',
      'Cooking'
    ];
    return skillNames[skillID];
  }

  getXpForLevel(skillId: number, level: number): number {
    const multiplier = this._skillData[skillId][0];
    const skillBase = this._skillData[skillId][1];

    return Math.ceil(((1 - Math.pow(multiplier, level)) * skillBase) / (1 - multiplier));
  }

  getLevelByXp(skillId: number, xp: number): number {
    const multiplier = this._skillData[skillId][0];
    const skillBase = this._skillData[skillId][1];

    const level = Math.floor(
      Math.log2(1 - ((1 - multiplier) * xp) / skillBase) / Math.log2(multiplier)
    );

    if (level > 100) {
      return 100;
    }

    return level;
  }
}
