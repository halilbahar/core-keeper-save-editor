import json
import os

from unityparser import UnityDocument

import util


def get_condition_ids() -> dict:
    return util.get_enum('dump/CoreKeeper/ExportedProject/Assets/MonoScript/Pug.Base/ConditionID.cs')


if __name__ == '__main__':
    translations = util.get_translations()
    condition_ids_enum = {v: k for k, v in get_condition_ids().items()}
    condition_id_to_translation = {}

    # Find all the translations that start with 'Conditions/'
    # After that split them: 'Conditions/AcidDamage' is split into _ = 'Conditions' and condition_name = 'AcidDamage'
    # Use the condition_name to get the id of that condition
    for translation in translations:
        term = translation['term']
        translation_value = translation['value']
        if term.startswith('Conditions/'):
            _, condition_name = term.split('/')
            condition_id = condition_ids_enum[condition_name]
            condition_id_to_translation[condition_id] = translation_value

    condition_table_doc = UnityDocument.load_yaml(
        'dump/CoreKeeper/ExportedProject/Assets/Resources/ConditionsTable.asset'
    )
    mono_behaviour = condition_table_doc.data[0]
    condition_results = {}

    # Now that we have the ids -> text we can loop over the conditionsTable
    for condition in mono_behaviour.conditions:
        condition_id = condition['Id']
        effect_id = condition['effect']
        # Ignore Null, ApplySnare, ImmuneToDamageAfterLogin
        # if condition_id == 0 or condition_id == 26:
        if condition_id in (0, 26, 187):
            continue

        id_to_use_same_desc = condition['useSameDescAsId']
        if id_to_use_same_desc != 0:
            condition_description = condition_id_to_translation[id_to_use_same_desc]
        else:
            condition_description = condition_id_to_translation[condition_id]

        # (((effect - 2U < 0x40) && ((0xc05420e880310045U >> ((ulonglong)(effect - 2U) & 0x3f) & 1) != 0)) || (effect == 0x47))
        effect_id_needs_to_be_divided = (
                ((effect_id - 2 < 0x40) and ((0xc05420e880310045 >> ((effect_id - 2) & 0x3f) & 1) != 0)) or (
                effect_id == 0x47))
        # ((0x3f < conditionInfo - 2U) || ((0xc05420e880310045U >> ((ulonglong)(conditionInfo - 2U) & 0x3f) & 1) == 0)) && (conditionInfo != 0x47)
        condition_id_needs_to_be_divided = not (((0x3f < condition_id - 2) or (
                (0xc05420e880310045 >> ((condition_id - 2) & 0x3f) & 1) == 0)) and (
                                                        condition_id != 0x47))
        # if effect_id == 0 and condition_id_needs_to_be_divided or effect_id != 0 and effect_id_needs_to_be_divided:
        if effect_id != 0 and effect_id_needs_to_be_divided:
            condition_description = condition_description.replace("{0}", "{/10}")
        # if ((effect - 2U < 0x40) && ((0xc05420e880310045U >> ((effect - 2U) & 0x3f) & 1) != 0)) || (effect == 0x47)

        condition_results[condition_id] = {
            'description': condition_description,
            'isUnique': condition['isUnique'] == 1
        }

    os.makedirs('out/conditions', exist_ok=True)

    with open('out/conditions/condition-data.json', 'w') as file:
        result_json = json.dumps(condition_results)
        file.write(result_json)
