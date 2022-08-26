import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { SkillTalentService } from 'src/app/services/skill-talent.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent {
  private _skillID: number;
  private _value: number;

  @HostBinding('class.selected')
  @Input()
  selected: boolean = false;

  constructor(private skillTalentService: SkillTalentService) {}

  @Input() set skillID(value) {
    this._skillID = value;
  }

  @Input() set value(value) {
    this._value = value;
  }

  get skillID(): number {
    return this._skillID;
  }

  get value(): number {
    return this._value;
  }

  getSkillName(): string {
    return this.skillTalentService.getSkillName(this.skillID);
  }
}
