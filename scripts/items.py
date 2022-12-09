import json
import logging
import os
import textwrap
from glob import glob, iglob

import yaml
from PIL import Image
from unityparser import UnityDocument

import util
from util import get_translations


def get_objectinfo_monobehaviour() -> [dict]:
    objectinfo_monobehaviour = util.load_cache('objectinfo_monobehaviour')
    if objectinfo_monobehaviour is not None:
        return objectinfo_monobehaviour

    logger = logging.getLogger('get_objectinfo_monobehaviour')
    # Get the PugDatabase and read all the prefabs (objects)
    pug_database_doc = UnityDocument.load_yaml(
        'dump/CoreKeeper/ExportedProject/Assets/PrefabInstance/PugDatabase.prefab'
    )
    pug_database_mono_behaviour = pug_database_doc.filter(class_names=('MonoBehaviour',))[0]
    object_id_guids: [str] = []
    for prefab in pug_database_mono_behaviour.prefabList:
        object_id_guids.append(prefab['guid'])

    # Now read all meta files and find the objects with the guid This happens by looping over all the meta files and
    # check their content. Read it and compare it to left_object_id_guids, if the file contains any of the elements:
    # Save the path to the file without the .meta part (e.g. Chest.prefab.meta -> Chest.prefab) Remove the guid from
    # the left_object_id_guids We add a little check by looking for the left_object_id_guids length. If it is not 0,
    # we didn't find an object, even though it is in the database
    left_object_id_guids = object_id_guids.copy()
    prefab_paths: [str] = []

    for prefab_meta_path in glob("dump/CoreKeeper/ExportedProject/Assets/PrefabInstance/*.meta"):
        with open(prefab_meta_path) as file:
            content = file.read()
            for i, guid in enumerate(left_object_id_guids):
                if guid in content:
                    # Remove .meta with [:-5]
                    prefab_paths.append(prefab_meta_path[:-5])
                    del left_object_id_guids[i]
                    break

    if len(left_object_id_guids) > 0:
        logger.warning(
            f'len(left_object_id_guids) = %s. This means that files are missing / corrupted' % len(left_object_id_guids)
        )

    objectinfo_monobehaviour = []
    # Now we know all the paths to the prefabs, itterate and parse over all items.
    # Next filter all the objects out, that we know are not items (Enemy, Projectile, etc.)
    for prefab_path in prefab_paths:
        prefab_doc = UnityDocument.load_yaml(prefab_path)
        prefab_monobehaviour_list = prefab_doc.filter(class_names=('MonoBehaviour',), attributes=('objectInfo',))
        if len(prefab_monobehaviour_list) > 1:
            logger.warning(
                'Prefab has %d Monobehaviour with objectInfo: "%s"' % (len(prefab_monobehaviour_list), prefab_path)
            )
        prefab_monobehaviour = prefab_monobehaviour_list[0]
        prefab_objectinfo = prefab_monobehaviour.objectInfo

        object_type = prefab_objectinfo['objectType']
        file_id = prefab_objectinfo['icon']['fileID']
        if object_type in (0, 1, 900, 6000) or file_id == 0:
            continue

        monobehaviour_gives_conditions_when_equipped = prefab_doc.filter(
            class_names=('MonoBehaviour',), attributes=('givesConditionsWhenEquipped',)
        )

        if len(monobehaviour_gives_conditions_when_equipped) > 1:
            logging.warning('Multiple Conditions MonoBehaviour found in %s', prefab_path)
        # Add all the conditions to the objectinfo
        if len(monobehaviour_gives_conditions_when_equipped) > 0:
            gives_conditions_when_equipped = []
            for mono_behaviour_with_conditions in monobehaviour_gives_conditions_when_equipped:
                for condition in mono_behaviour_with_conditions.givesConditionsWhenEquipped:
                    gives_conditions_when_equipped.append(condition)
            prefab_objectinfo['givesConditionsWhenEquipped'] = gives_conditions_when_equipped

        monobehaviour_damage = prefab_doc.filter(class_names=('MonoBehaviour',), attributes=('damage',))

        if len(monobehaviour_damage) > 1:
            logging.warning('Multiple Damage MonoBehaviour found in %s', prefab_path)
        # Add damage to objectinfo
        if len(monobehaviour_damage) > 0:
            prefab_objectinfo['damage'] = monobehaviour_damage[0].damage

        monobehaviour_turns_into_food = prefab_doc.filter(class_names=('MonoBehaviour',), attributes=('turnsIntoFood',))
        if len(monobehaviour_turns_into_food) > 1:
            logging.warning('Multiple TurnsIntoFood MonoBehaviour found in %s', prefab_path)

        if len(monobehaviour_turns_into_food) > 0:
            monobehaviour_values = prefab_doc.filter(class_names=('MonoBehaviour',), attributes=('Values',))
            if len(monobehaviour_values) > 1:
                logging.warning('Multiple Values MonoBehaviour found in %s', prefab_path)

            prefab_objectinfo['ingredient'] = {
                'brightColor': monobehaviour_turns_into_food[0].brightColor,
                'brightestColor': monobehaviour_turns_into_food[0].brightestColor,
                'darkColor': monobehaviour_turns_into_food[0].darkColor,
                'darkestColor': monobehaviour_turns_into_food[0].darkestColor,
                'turnsIntoFood': monobehaviour_turns_into_food[0].turnsIntoFood,
                'values': monobehaviour_values[0].Values
            }

        objectinfo_monobehaviour.append(prefab_objectinfo)

    util.set_cache('objectinfo_monobehaviour', objectinfo_monobehaviour)
    return objectinfo_monobehaviour


def get_textures() -> dict:
    textures = util.load_cache('textures')
    if textures is None:
        textures = {}
        for filepath in iglob(os.path.join('dump/CoreKeeper/ExportedProject/Assets/Texture2D/*.png.meta')):
            with open(filepath, 'r') as stream:
                metadata = yaml.safe_load(stream)
                textures[metadata['guid']] = {
                    # 'texture_importer': metadata['TextureImporter'],
                    'metadata': metadata,
                    'filepath': filepath[:len(filepath) - 5]
                }

        util.set_cache('textures', textures)
    return textures


def get_item_translations():
    translations = get_translations()
    # item_and_desc_translations includes both the name and description: Items/AdderStone and Items/AdderStoneDesc
    item_and_desc_translations = {}
    for translation in translations:
        term = translation['term']
        text = translation['value']
        if term.startswith('Items/'):
            item_and_desc_translations[term[6:]] = text

    item_translations = {}
    # Go over both of the name and descrption and combine them in item_translations
    for item in item_and_desc_translations:
        text = item_and_desc_translations[item]
        if item.endswith('Desc'):
            key = item[:len(item) - 4]
            is_description = True
        else:
            key = item
            is_description = False

        # Check if the item with the given key is None
        if item_translations.get(key) is None:
            item_translations[key] = {}

        if is_description:
            item_translations[key]['description'] = text
        else:
            item_translations[key]['text'] = text

    return item_translations


def get_object_ids() -> dict:
    return util.get_enum('dump/CoreKeeper/ExportedProject/Assets/MonoScript/Pug.Base/ObjectID.cs')


def get_condition_ids() -> dict:
    return util.get_enum('dump/CoreKeeper/ExportedProject/Assets/MonoScript/Pug.Base/ConditionID.cs')


def get_set_bonuses():
    set_bonuses_doc = UnityDocument.load_yaml('dump/CoreKeeper/ExportedProject/Assets/Resources/SetBonusesTable.asset')
    mono_behaviour = set_bonuses_doc.data[0]
    mono_behvaiour_set_bonuses = mono_behaviour.setBonuses
    set_bonuses = {}
    for set_bonus in mono_behvaiour_set_bonuses:
        pieces = []
        # 'avaiablePices' is a string which contains multiple hex strings. These are 8 characters long
        # Example for avaiablePices: 382100009c21000000220000
        # Example for object_id_hex: ['38210000', '9c210000', '00220000']
        object_id_hex = textwrap.wrap(str(set_bonus['availablePieces']), 8)
        # We can't parse the hex string as it is, we need to format before that
        for hex_string in object_id_hex:
            # Example for hex_string: 38210000
            # Example for normalized_hex_string 00002138
            # So we need to split hex so we get 4 elements of the length 2 and reverse the order
            hex_list = textwrap.wrap(hex_string, 2)
            hex_list.reverse()
            object_id = int("0x%s" % ''.join(hex_list), 0)
            pieces.append(object_id)

        # Remove the duration as it is constant to 0
        set_bonus_datas = set_bonus['setBonusDatas']
        for set_bonus_data in set_bonus_datas:
            set_bonus_data['conditionData'].pop('duration', None)

        set_bonus_id = set_bonus['setBonusID']
        set_bonuses[set_bonus_id] = {
            'id': set_bonus_id,
            'rarity': set_bonus['rarity'],
            'data': set_bonus_datas,
            'pieces': pieces
        }

    return set_bonuses


def get_conditions():
    translations = get_translations()
    condition_ids_enum = {v: k for k, v in get_condition_ids().items()}
    condition_translation = {}

    # Find all the translations that start with 'Conditions/'
    # After that split them: 'Conditions/AcidDamage' is split into _ = 'Conditions' and condition_name = 'AcidDamage'
    # Use the condition_name to get the id of that condition
    for translation in translations:
        term = translation['term']
        translation_value = translation['value']
        if term.startswith('Conditions/'):
            _, condition_name = term.split('/')
            condition_id = condition_ids_enum[condition_name]
            condition_translation[condition_id] = translation_value

    return condition_translation


if __name__ == '__main__':
    logging.basicConfig()
    logger = logging.getLogger(__name__)

    objectinfo_monobehaviour = get_objectinfo_monobehaviour()
    textures = get_textures()
    item_translations = get_item_translations()
    object_ids = get_object_ids()
    set_bonuses = get_set_bonuses()
    item_data = {}
    duplicate_entries = {}
    images: [Image] = []
    icon_index = 0

    # Create a dict where we can later retrieve the set_bonus.id by object_id
    set_bonus_ids = {}
    for set_bonus_id, set_bonus in set_bonuses.items():
        for piece in set_bonus['pieces']:
            set_bonus_ids[piece] = set_bonus_id

    for objectinfo in objectinfo_monobehaviour:
        object_id = objectinfo['objectID']
        object_name = object_ids[object_id]
        translation = item_translations.get(object_name)
        if translation is None:
            logger.warning("No Translation found for: (%s, %d)" % (object_name, object_id))
            continue

        single_data = {
            'objectID': object_id,
            'name': translation['text'],
            'description': translation.get('description'),
            'initialAmount': objectinfo['initialAmount'],
            'objectType': objectinfo['objectType'],
            'rarity': objectinfo['rarity'],
            'isStackable': objectinfo['isStackable'],
            'iconIndex': icon_index
        }

        # Add condition array if there is a 'givesConditionsWhenEquipped' attribute
        conditions = objectinfo.get('givesConditionsWhenEquipped')
        if conditions is not None and len(conditions) > 0:
            single_data['condition'] = []
            for condition in conditions:
                single_data['condition'].append({
                    'id': condition['id'],
                    'value': condition['value']
                })

        # Add damage if there is a 'damage' property
        damage = objectinfo.get('damage')
        if damage is not None:
            single_data['damage'] = damage

        # Add setBonusId if this items belongs to one
        set_bonus_id = set_bonus_ids.get(object_id)
        if set_bonus_id is not None:
            single_data['setBonusId'] = set_bonus_id

        icon = objectinfo['icon']
        icon_offset = objectinfo['iconOffset']
        icon_offset_x = icon_offset['x']
        icon_offset_y = icon_offset['y']

        # Get the texture file based on the icon object
        texture = textures[icon['guid']]
        # Loop over all the icons of the spritesheet and find the correct one
        found_image = False
        cropped_image = None
        for sprite in texture['metadata']['TextureImporter']['spriteSheet']['sprites']:
            if sprite['internalID'] == icon['fileID']:
                found_image = True
                rect = sprite['rect']
                x = rect['x']
                y = rect['y']
                width = rect['width']
                height = rect['height']
                sprite_pixels_to_units = texture['metadata']['TextureImporter']['spritePixelsToUnits']
                offset_x = icon_offset_x * sprite_pixels_to_units
                offset_y = icon_offset_y * sprite_pixels_to_units

                # The coordinate system of the games starts from bottem left,
                # so we have to reverse the y
                # The spritesheet is perfectly uniform with 16x16 icons
                # The tool sprites (which is also used for animation) on the other hand are not
                # We have found x / y values of 40, 50, ...
                # But the width is still 16 pixel of that icon
                # We just have to crop it right
                # We need to width - 16 and split that in 2
                # For example: 40 - 16 = 24. We make the crop 12 pixel in both directions smaller
                # This would mean for cropped_x to add 12 and cropped_x2 to remove 12
                # ------------------- cropped_y to add 12 and cropped_y2 to remove 12
                # For perfect values of 16 the result will be 0 and the crop won't be effected
                # For some objectInfo the iconOffset is set to something other than 0
                # We need to apply this offset to center the icon. Just multiply the offset with the pixel ratio
                # and apply it on
                image = Image.open(texture['filepath'])
                diff = (width - 16) / 2
                cropped_x = x + diff
                cropped_y = image.height - y - width + diff + offset_y
                cropped_x2 = x + width - diff + offset_x
                cropped_y2 = image.height - y - diff

                area = (cropped_x, cropped_y, cropped_x2, cropped_y2)
                cropped_image = image.crop(area)

        # If we found no image we skip this and don't add anything
        if not found_image or cropped_image is None:
            logger.warning("Skipping %d due to no image" % object_id)
            continue

        # If there is already an entry with the given object_id we skip it and increment a number so we can later
        # display how many duplicate entries there were
        if item_data.get(object_id) is not None:
            logger.info("Skipping %d due to duplicate entry" % object_id)
            duplicate_entry_count = duplicate_entries.get(object_id)
            if duplicate_entry_count is None:
                duplicate_entries[object_id] = 1
            else:
                duplicate_entries[object_id] = duplicate_entry_count + 1
            continue

        item_data[object_id] = single_data
        images.append(cropped_image)
        icon_index += 1

    os.makedirs('out', exist_ok=True)
    # Create spritesheet
    image = Image.new('RGBA', (icon_index * 16, 16))
    for index, single_image in enumerate(images):
        image.paste(single_image, (index * 16, 0))
    image.save('out/item-spritesheet.png')

    # Sort by key (objectID)
    sorted_item_data = dict(sorted(item_data.items(), key=lambda x: x[0]))

    # Create the final result.json by combined all the extracted data:
    with open('out/data.json', 'w') as file:
        result_json = json.dumps({
            'items': sorted_item_data,
            'setBonuses': set_bonuses,
            'conditions': get_conditions()
        })
        file.write(result_json)

    # Display which object id was multiple times found but added 1 time
    for duplicate_object_id, duplicate_count in duplicate_entries.items():
        logger.warning(
            "ObjectID %s was ignored %d times due to being a duplicate entry" % (duplicate_object_id, duplicate_count)
        )
