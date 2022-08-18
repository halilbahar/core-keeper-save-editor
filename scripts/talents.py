import json
import logging
import os
import re

import yaml
from PIL import Image
from unityparser import UnityDocument

ASSET_FOLDER = './dump/CoreKeeper/ExportedProject/Assets'
CACHE_FOLDER = './.cache'
OUTPUT_FOLDER = './out'

condition_ids = {}
skill_talent_ids = {}
icons = {}
translations = {}

logging.basicConfig()
log = logging.getLogger('talents')
log.setLevel(logging.INFO)

if __name__ == '__main__':
    enum_pattern = re.compile(r'(\w+) = (\d*)')
    log.info('Reading ConditionID...')
    with open(os.path.join(ASSET_FOLDER, 'MonoScript/Pug.Core/ConditionID.cs'), 'r') as file:
        for match in enum_pattern.finditer(file.read()):
            condition_name = match.group(1)
            condition_id = match.group(2)
            condition_ids[condition_id] = condition_name
    log.info('Finished reading conditionID...')

    log.info('Reading SkillTalentID...')
    with open(os.path.join(ASSET_FOLDER, 'MonoScript/Pug.Core/SkillTalentID.cs'), 'r') as file:
        for match in enum_pattern.finditer(file.read()):
            skill_talent_name = match.group(1)
            skill_talent_id = match.group(2)
            skill_talent_ids[skill_talent_id] = skill_talent_name
    log.info('Finished reading SkillTalentID...')

    log.info('Reading talent_icons.meta...')
    with open(os.path.join(ASSET_FOLDER, 'Texture2D/talent_icons.png.meta'), 'r') as file:
        metadata = yaml.safe_load(file)
        for sprite in metadata['TextureImporter']['spriteSheet']['sprites']:
            internal_id = sprite['internalID']
            rect = sprite['rect']
            x = rect['x']
            y = rect['y']
            icons[internal_id] = {
                'x': x,
                'y': y
            }
    log.info('Finished reading talent_icons.meta...')

    log.info('Reading I2Languages...')
    doc = UnityDocument.load_yaml(os.path.join(ASSET_FOLDER, 'Resources/I2Languages.asset'))
    mono_behaviour = doc.get(class_name='MonoBehaviour')
    for term in mono_behaviour.mSource['mTerms']:
        term_name = term['Term']
        if term_name.startswith('Conditions/') or term_name.startswith('SkillTalents/'):
            translations[term_name] = term['Languages'][0]
    log.info('Finished reading I2Languages...')

    log.info('Reading SkillTalentsTable and creating spritesheet...')
    # Init data with 9 arrays. We group the data by their skillID, so we access the talents by skill
    data = {}
    for i in range(9):
        data[i] = []
    # Create out/ folder if it does not exist
    os.makedirs(os.path.join(OUTPUT_FOLDER, 'talents'), exist_ok=True)
    icons_image = Image.open(os.path.join(ASSET_FOLDER, 'Texture2D/talent_icons.png'))

    doc = UnityDocument.load_yaml(os.path.join(ASSET_FOLDER, 'Resources/SkillTalentsTable.asset'))
    mono_behaviour = doc.get(class_name='MonoBehaviour')
    for skill_talent_tree in mono_behaviour.skillTalentTrees:
        skill_id = skill_talent_tree['skillID']
        for talent in skill_talent_tree['skillTalents']:
            skill_talent_id = talent['skillTalentID']
            condition_id = talent['givesCondition']
            icon_id = talent['icon']['fileID']

            skill_talent_name = skill_talent_ids[str(skill_talent_id)]
            condition_name = condition_ids[str(condition_id)]

            name = translations['SkillTalents/' + skill_talent_name]
            increment = talent['conditionValuePerPoint']
            try:
                # Edge case for crit damage description.
                # There are 2 conditions that use this description instead of their own
                if 'CriticalDamagePercentageIncrease' in condition_name:
                    description = translations['Conditions/CriticalDamagePercentageIncrease']
                else:
                    description = translations['Conditions/' + condition_name]
            except KeyError:
                description = ''

            data[skill_id].append({
                'talentId': skill_talent_id,
                'name': name,
                'description': description,
                'increment': increment,
            })

            icon_x_y = icons[icon_id]
            x = icon_x_y['x']
            y = icon_x_y['y']

            cropped_x = x
            cropped_y = icons_image.height - y - 16
            cropped_x2 = x + 16
            cropped_y2 = icons_image.height - y

            area = (cropped_x, cropped_y, cropped_x2, cropped_y2)
            cropped_image = icons_image.crop(area)
            cropped_image.save(os.path.join(OUTPUT_FOLDER, 'talents', str(skill_talent_id) + '.png'))

    # Create json
    with open('out/talent-data.json', 'w') as file:
        file.write(json.dumps(data))
