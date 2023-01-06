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
   * @param calculateReinforcementBonus Whether the reinforcement-bonus should be calculated for the given set of conditions.
   * @returns list of 3-tuples: [Description, IsUnique, reinforcementBonus?]
   */
  transformConditionIdsToLabel(
    conditions: ConditionWhenEquipped[],
    mode: 'item' | 'skill',
    calculateReinforcementBonus?: boolean
  ): [string, boolean, string | undefined][] {
    const conditionStrings: [string, boolean, string | undefined][] = [];

    conditions.forEach(condition => console.log(condition));
    for (let condition of conditions) {
      const conditionLabel = this.conditionLabels[condition.id];
      const conditionStringTemplate = conditionLabel.description;
      const isUnique = conditionLabel.isUnique;

      const templateFillIn = conditionStringTemplate.match(/\{0:[0-3]}/);
      if (templateFillIn) {
        const prefix = condition.value >= 0 ? '+' : '';
        const tenthValueString = prefix + condition.value / 10;
        const valueString = prefix + condition.value;

        const templateContainsPercentage = conditionStringTemplate.match(/(?<=\{0:[0-3]})%/);
        const reinforcementBonusValueString = prefix + Math.round(condition.value * 0.15);
        const tenthReinforcementBonusValueString = prefix + Math.round(condition.value * 0.15) / 10;
        const reinforcementBonusStringTemplate = `(${templateFillIn[0]}${
          templateContainsPercentage ? '%' : ''
        })`;

        let result;
        let reinforcementBonusString;
        if (mode === 'item') {
          result = conditionStringTemplate
            .replace('{0:1}', tenthValueString)
            .replace('{0:2}', valueString)
            .replace('{0:3}', tenthValueString);
          reinforcementBonusString = reinforcementBonusStringTemplate
            .replace('{0:1}', tenthReinforcementBonusValueString)
            .replace('{0:2}', reinforcementBonusValueString)
            .replace('{0:3}', tenthReinforcementBonusValueString);
        } else {
          result = conditionStringTemplate
            .replace('{0:1}', valueString)
            .replace('{0:2}', tenthValueString)
            .replace('{0:3}', tenthValueString);
          reinforcementBonusString = reinforcementBonusStringTemplate
            .replace('{0:1}', reinforcementBonusValueString)
            .replace('{0:2}', tenthReinforcementBonusValueString)
            .replace('{0:3}', tenthReinforcementBonusValueString);
        }

        result = result.replace('{0:0}', valueString);
        reinforcementBonusString = reinforcementBonusString.replace(
          '{0:0}',
          reinforcementBonusValueString
        );
        conditionStrings.push([result, isUnique, reinforcementBonusString]);
      } else {
        conditionStrings.push([conditionStringTemplate, isUnique, undefined]);
      }
    }
    return conditionStrings;
  }
}
