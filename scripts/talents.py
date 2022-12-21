import json
import os

import yaml
from PIL import Image
from unityparser import UnityDocument

import util

divide_by_ten = [
    [0, 0, 0, 0, 1, 0, 0, 1],
    [0, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 1, 0, 1]
]


def get_skill_talent_ids() -> dict:
    return util.get_enum('./dump/CoreKeeper/ExportedProject/Assets/MonoScript/Pug.Base/SkillTalentID.cs')


if __name__ == '__main__':
    translations = util.get_translations()
    skill_talent_ids_by_name = {v: k for k, v in get_skill_talent_ids().items()}
    skill_talent_id_to_translation = {}

    talent_icons = {}
    with open('./dump/CoreKeeper/ExportedProject/Assets/Texture2D/talent_icons.png.meta', 'r') as file:
        metadata = yaml.safe_load(file)
        for sprite in metadata['TextureImporter']['spriteSheet']['sprites']:
            internal_id = sprite['internalID']
            rect = sprite['rect']
            x = rect['x']
            y = rect['y']
            talent_icons[internal_id] = {
                'x': x,
                'y': y
            }

    # Find all the translations that start with SkillTalents/' After that split them:
    # 'SkillTalents/ChanceForExtraOre' is split into _ = 'SkillTalents' and condition_name = 'ChanceForExtraOre'.
    # Use the condition_name to get the id of that condition
    for translation in translations:
        term = translation['term']
        translation_value = translation['value']
        if term.startswith('SkillTalents/'):
            _, skill_talent_name = term.split('/')
            skill_talent_id_to_translation[skill_talent_ids_by_name[skill_talent_name]] = translation_value

    # Create out/talents folder if it does not exist
    os.makedirs('out/talents/image', exist_ok=True)
    talent_data = {}
    # Init data with 9 arrays. We group the data by their skillID, so we access the talents by skill
    for i in range(9):
        talent_data[i] = []
    icons_image = Image.open('./dump/CoreKeeper/ExportedProject/Assets/Texture2D/talent_icons.png')

    doc = UnityDocument.load_yaml('./dump/CoreKeeper/ExportedProject/Assets/Resources/SkillTalentsTable.asset')
    mono_behaviour = doc.get(class_name='MonoBehaviour')
    for skill_talent_tree in mono_behaviour.skillTalentTrees:
        skill_id = skill_talent_tree['skillID']
        for talent in skill_talent_tree['skillTalents']:
            skill_talent_id = talent['skillTalentID']
            name = skill_talent_id_to_translation[skill_talent_id]
            increment = talent['conditionValuePerPoint']
            conditoin_id = talent['givesCondition']
            tenth = divide_by_ten[skill_id][len(talent_data[skill_id])] == 1
            talent_data[skill_id].append({
                'talentId': skill_talent_id,
                'name': name,
                'increment': increment,
                'conditionId': conditoin_id,
                'tenth': tenth
            })

            icon_id = talent['icon']['fileID']
            icon_x_y = talent_icons[icon_id]
            x = icon_x_y['x']
            y = icon_x_y['y']

            cropped_x = x
            cropped_y = icons_image.height - y - 16
            cropped_x2 = x + 16
            cropped_y2 = icons_image.height - y

            area = (cropped_x, cropped_y, cropped_x2, cropped_y2)
            cropped_image = icons_image.crop(area)
            cropped_image.save(os.path.join('out/talents/image/', str(skill_talent_id) + '.png'))

    # Create json
    with open('out/talents/talent-data.json', 'w') as file:
        file.write(json.dumps(talent_data))
