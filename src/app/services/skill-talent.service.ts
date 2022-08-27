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
    [1.067000031, 50],
    [1.057999969, 200],
    [1.046000004, 50],
    [1.057999969, 2000],
    [1.046000004, 30],
    [1.039499998, 50],
    [1.041000009, 15],
    [1.036999941, 5],
    [1.046000004, 10]
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

  public getSkillName(skillID: number): string {
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

  public getXpForLevel(skillId: number, level: number): number {
    const multiplier = this._skillData[skillId][0];
    const skillBase = this._skillData[skillId][1];

    // TODO: figure out if this formular is actually correct
    return Math.ceil(((1 - Math.pow(multiplier, level)) * skillBase) / (1 - multiplier)) + 1; // +1 a the end isn't part of the formular, but it's nessessary to avoid a rounding issue
  }

  public getLevelByXp(skillId: number, xp: number): number {
    const getBaseLog = (x: number, y: number): number => Math.log(y) / Math.log(x);
    const multiplier = this._skillData[skillId][0];
    const skillBase = this._skillData[skillId][1];

    // TODO: figure out if this formular is actually correct
    return Math.floor(getBaseLog(multiplier, (skillBase + xp * multiplier - xp) / skillBase));
  }
}
