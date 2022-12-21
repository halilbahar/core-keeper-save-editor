import { Injectable } from '@angular/core';

import { TalentData as TalentDataJson } from '~data';
import { TalentData } from '~models';

@Injectable({
  providedIn: 'root'
})
export class TalentDataService {
  readonly skillTrees = TalentDataJson as unknown as { [key: number]: TalentData[] };

  getData(skillTreeID: number, index: number): TalentData {
    return this.skillTrees[skillTreeID][index] || null;
  }
}
