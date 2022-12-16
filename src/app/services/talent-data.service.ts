import { Injectable } from '@angular/core';

import { TalentData as TalentDataJson } from '~config';
import { TalentData } from '~models';

@Injectable({
  providedIn: 'root'
})
export class TalentDataService {
  readonly skillTrees: { [key: number]: TalentData[] } = TalentDataJson;

  getData(skillTreeID: number, index: number): TalentData {
    return this.skillTrees[skillTreeID][index] || null;
  }
}
