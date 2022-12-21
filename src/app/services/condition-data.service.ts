import { Injectable } from '@angular/core';

import { Data } from '~config';
import { ConditionData as ConditionDataJson } from '~data';
import { ConditionWhenEquipped, ExtractedData } from '~models';

@Injectable({
  providedIn: 'root'
})
export class ConditionDataService {
  readonly conditionLabels = ConditionDataJson as {
    [key: string]: { description: string; isUnique: boolean };
  };

  /**
   * Turn the given item conditions from key (id), value to a string which describes the condition with the given value.
   * @param itemConditions to transform
   * @returns list of tuples: [Description, IsUnique]
   */
  transformConditionIdToLabel(itemConditions: ConditionWhenEquipped[]): [string, boolean][] {
    const conditionStrings = [];

    for (let itemCondition of itemConditions) {
      const conditionLabel = this.conditionLabels[itemCondition.id];
      const conditionStringTemplate = conditionLabel.description;
      const isUnique = conditionLabel.isUnique;

      if (conditionStringTemplate.includes('{0}') || conditionStringTemplate.includes('{/10}')) {
        const prefix = itemCondition.value >= 0 ? '+' : '';
        const result = conditionStringTemplate
          // When the template has '{/10}' instead of '{0}' we need to divide the value by 10
          // If it has no '{/10}' the replace will have done nothing and we can replace '{0}' which will succeed
          .replace('{/10}', prefix + itemCondition.value / 10)
          .replace('{0}', prefix + itemCondition.value);
        conditionStrings.push([result, isUnique]);
      } else {
        conditionStrings.push([conditionStringTemplate, isUnique]);
      }
    }

    return conditionStrings;
  }
}
