import { Injectable } from '@angular/core';

import { ConditionData as ConditionDataJson } from '~data';
import { ConditionWhenEquipped } from '~models';

@Injectable({
  providedIn: 'root'
})
export class ConditionDataService {
  readonly conditionLabels = ConditionDataJson as {
    [key: string]: { description: string; isUnique: boolean };
  };

  /**
   * Turn the given item conditions from key (id), value to a string which describes the condition with the given value.
   * @param conditions to transform
   * @param mode for item or skill. Item: the string with {1|3} will be divided by 10. Skill: the string with {2|3} will be divided by 10.
   * @returns list of tuples: [Description, IsUnique]
   */
  transformConditionIdsToLabel(
    conditions: ConditionWhenEquipped[],
    mode: 'item' | 'skill'
  ): [string, boolean][] {
    const conditionStrings = [];

    for (let condition of conditions) {
      const conditionLabel = this.conditionLabels[condition.id];
      const conditionStringTemplate = conditionLabel.description;
      const isUnique = conditionLabel.isUnique;

      if (conditionStringTemplate.match(/\{0:[0-3]\}/)) {
        const prefix = condition.value >= 0 ? '+' : '';
        const tenthValueString = prefix + condition.value / 10;
        const valueString = prefix + condition.value;

        let result;
        if (mode === 'item') {
          result = conditionStringTemplate
            .replace('{0:1}', tenthValueString)
            .replace('{0:2}', valueString)
            .replace('{0:3}', tenthValueString);
        } else {
          result = conditionStringTemplate
            .replace('{0:1}', valueString)
            .replace('{0:2}', tenthValueString)
            .replace('{0:3}', tenthValueString);
        }

        result = result.replace('{0:0}', valueString);
        conditionStrings.push([result, isUnique]);
      } else {
        conditionStrings.push([conditionStringTemplate, isUnique]);
      }
    }

    return conditionStrings;
  }
}
