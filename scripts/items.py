import datetime
import glob
import itertools
import json
import logging
import os
import pickle
import re
import time

import yaml
from PIL import Image
from unityparser import UnityDocument

ASSET_FOLDER = './dump/CoreKeeper/ExportedProject/Assets'
CACHE_FOLDER = './.cache'
BLACK_LISTED_TERMS = ['objectType: 1\n', 'objectType: 900\n', 'objectType: 6000\n', 'icon: {fileID: 0}\n']
USE_CACHE = True

object_ids = {}
translations = {}
textures = {}
prefabs = {}

item_translations = {}
item_description_translations = {}
item_name_translations = {}

logging.basicConfig()
log = logging.getLogger('items')
log.setLevel(logging.INFO)

if __name__ == '__main__':
    if USE_CACHE:
        log.info('Cache is enabled...')
        # Cache folder does not exit -> create all needed cache files
        os.makedirs(CACHE_FOLDER, exist_ok=True)
        for item in ['png_metadata', 'prefabs', 'translations', 'object_ids']:
            path = os.path.join(CACHE_FOLDER, item)
            with open(path, 'a+'):
                pass
            log.info('Created cache file \'%s\'', path)
        log.info('Found .cache folder, reading files...')
        with open(os.path.join(CACHE_FOLDER, 'object_ids'), 'rb') as f:
            try:
                object_ids = pickle.load(f)
                log.info('Successfully loaded object_ids...')
            except:
                log.info('Failed to load object_ids...')
                pass
        with open(os.path.join(CACHE_FOLDER, 'translations'), 'rb') as f:
            try:
                translations = pickle.load(f)
                log.info('Successfully loaded translations...')
            except:
                log.info('Failed to load translations...')
                pass
        with open(os.path.join(CACHE_FOLDER, 'png_metadata'), 'rb') as f:
            try:
                textures = pickle.load(f)
                log.info('Successfully loaded textures...')
            except:
                log.info('Failed to load textures...')
                pass
        with open(os.path.join(CACHE_FOLDER, 'prefabs'), 'rb') as f:
            try:
                prefabs = pickle.load(f)
                log.info('Successfully loaded prefabs...')
            except:
                log.info('Failed to load prefabs...')
                pass
        log.info('Finished reading .cache files')

    # Iterate over all prefabs and save them, so we can access it later
    # If prefabs length is 0 the cache has to be unset whether the USE_CACHE is True or False
    if len(prefabs) == 0:
        log.info('Reading all prefab files...')
        prefab_time_begin = time.time()

        # Get all the prefabs from different folders
        filepaths = itertools.chain(glob.iglob(os.path.join(ASSET_FOLDER, 'PrefabInstance/*.prefab')),
                                    glob.iglob(os.path.join(ASSET_FOLDER, 'Resource/**/*.prefab'), recursive=True))

        # Go over all files and filter them by objectInfo and black listed terms
        # If the prefab does not have an objectInfo it cannot be an item
        # The black listed terms include object types that are not items and items without an icon
        for filepath in filepaths:
            with open(filepath, 'r') as stream:
                file_content = stream.read()
                has_blacklisted_term = False
                for term in BLACK_LISTED_TERMS:
                    if term in file_content:
                        has_blacklisted_term = True

                if 'objectInfo' in file_content and not has_blacklisted_term:
                    doc = UnityDocument.load_yaml(filepath)
                    mono_behaviour = doc.filter(class_names=('MonoBehaviour',), attributes=('objectInfo',))
                    mono_behaviour2 = doc.filter(class_names=('MonoBehaviour',),
                                                 attributes=('givesConditionsWhenEquipped',))
                    mono_behaviour3 = doc.filter(class_names=('MonoBehaviour',), attributes=('damage',))

                    if len(mono_behaviour) > 1:
                        logging.warning('Multiple MonoBehaviour found in %s', filepath)

                    if len(mono_behaviour2) > 1:
                        logging.warning('Multiple Conditions MonoBehaviour found in %s', filepath)

                    if len(mono_behaviour3) > 1:
                        logging.warning('Multiple Damage MonoBehaviour found in %s', filepath)

                    if len(mono_behaviour) == 0:
                        continue

                    object_info = mono_behaviour[0].objectInfo

                    if len(mono_behaviour2) > 0:
                        object_info['givesConditionsWhenEquipped'] = mono_behaviour2[0].givesConditionsWhenEquipped

                    if len(mono_behaviour3) > 0:
                        object_info['damage'] = mono_behaviour3[0].damage

                    id_ = object_info['objectID']
                    if id_ is not None:
                        prefabs[id_] = object_info

        prefab_time_end = time.time()
        with open(os.path.join(CACHE_FOLDER, 'prefabs'), 'wb') as f:
            pickle.dump(prefabs, f)
        log.info('Finished reading all prefab meta files...')
        log.info('This took %s' % str(datetime.timedelta(seconds=(prefab_time_end - prefab_time_begin))))

    # Get all the object ids from the enum file with regex
    # If object_ids is empty the cache has to be empty whether the USE_CACHE is True or False
    if object_ids == {}:
        with open(os.path.join(ASSET_FOLDER, 'MonoScript/Pug.Core/ObjectID.cs'), 'r') as file:
            pattern = re.compile(r'(\w+) = (\d*)')
            for match in pattern.finditer(file.read()):
                object_name = match.group(1)
                object_id = match.group(2)
                object_ids[object_name] = object_id
        with open(os.path.join(CACHE_FOLDER, 'object_ids'), 'wb') as f:
            pickle.dump(object_ids, f)

    # Load the translations file and get only the name and description of the items nothing else
    # If translations is empty the cache has to be empty whether the USE_CACHE is True or False
    if translations == {}:
        translation_time_begin = time.time()
        # Load the language file and access the right array and filter for 'Items/'
        doc = UnityDocument.load_yaml(os.path.join(ASSET_FOLDER, 'Resources/I2Languages.asset'))
        mono_behaviour = doc.get(class_name='MonoBehaviour')
        for term in mono_behaviour.mSource['mTerms']:
            name = term['Term']
            text = term['Languages'][0]
            if name.startswith('Items/'):
                item_translations[name[6:]] = text

        # Now we split the normal translation from the Desc form
        # If the translation key ends with 'Desc' put it without the 'Desc' into 'item_description_translations'
        # Else put the normal name translation into 'item_name_translations'
        for item in item_translations:
            if item.endswith('Desc'):
                name = item[:len(item) - 4]
                item_description_translations[name] = item_translations[item]
            else:
                item_name_translations[item] = item_translations[item]

        # Now we go over all item_name_translations because not all items have description
        # We merge them into 1 dict and add them to 'translations'
        for item in item_name_translations:
            try:
                description = item_description_translations[item]
            except:
                description = ''

            translations[item] = {
                'name': item_name_translations[item],
                'description': description
            }

        translation_time_end = time.time()
        with open(os.path.join(CACHE_FOLDER, 'translations'), 'wb') as f:
            pickle.dump(translations, f)
        log.info('Finished getting all the translation...')
        log.info('This took %s' % str(datetime.timedelta(seconds=(translation_time_end - translation_time_begin))))

    # Iterate over all assets and save them, so we can access it later when looking up a texture of an item
    # If textures is empty the cache has to be unset whether the USE_CACHE is True or False
    if textures == {}:
        log.info('Reading all texture meta files...')
        png_meta_data_time_begin = time.time()
        for filepath in glob.iglob(os.path.join(ASSET_FOLDER, 'Texture2D/*.png.meta')):
            with open(filepath, 'r') as stream:
                metadata = yaml.safe_load(stream)
                textures[metadata['guid']] = {
                    'metadata': metadata,
                    'filepath': filepath[:len(filepath) - 5]
                }
        png_meta_data_time_end = time.time()
        with open(os.path.join(CACHE_FOLDER, 'png_metadata'), 'wb') as f:
            pickle.dump(textures, f)
        log.info('Finished reading all texture meta files...')
        log.info(
            'This took %s' % str(datetime.timedelta(seconds=(png_meta_data_time_end - png_meta_data_time_begin))))

    # At this point we have collected all the data we need,
    # We will start by iterating over the item translations
    # Based on the translation name we will get the object_id
    # With that object_id we try to find the correct prefab
    # If we have a match we will look up the texture file and extract the image
    # At the end we will assemble a big sprite-sheet with a big json
    data = []
    images = []
    index = 0
    for item in translations:
        try:
            object_id = object_ids[item]
            # Convert the object_id to int because we used int to assign the object_info
            object_info = prefabs[int(object_id)]
        except:
            continue

        icon = object_info['icon']
        icon_offset = object_info['iconOffset']
        icon_offset_x = icon_offset['x']
        icon_offset_y = icon_offset['y']

        # Get the texture file based on the icon object
        texture = textures[icon['guid']]
        # Loop over all the icons of the spritesheet and find the correct one
        found_image = False
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
                images.append(cropped_image)

        if not found_image:
            continue

        single_data = {
            'objectID': object_info['objectID'],
            'name': translations[item]['name'],
            'description': translations[item]['description'],
            'initialAmount': object_info['initialAmount'],
            'objectType': object_info['objectType'],
            'rarity': object_info['rarity'],
            'isStackable': object_info['isStackable'],
            'iconIndex': index
            # 'variation': object_info['variation'],
        }

        if object_info.__contains__('givesConditionsWhenEquipped') and len(
                object_info['givesConditionsWhenEquipped']) > 0:
            single_data['condition'] = []
            for condition in object_info['givesConditionsWhenEquipped']:
                single_data['condition'].append({
                    'id': condition['id'],
                    'value': condition['value']
                })

        if object_info.__contains__('damage'):
            single_data['damage'] = object_info['damage']

        data.append(single_data)
        index += 1

    # Sort by objectID
    data.sort(key=lambda x: x.get('objectID'))
    # Create json
    os.makedirs('out', exist_ok=True)
    with open('out/item-data.json', 'w') as file:
        file.write(json.dumps(data))

    # Create spritesheet
    image = Image.new('RGBA', (len(data) * 16, 16))
    for index, single_image in enumerate(images):
        image.paste(single_image, (index * 16, 0))

    image.save('out/item-spritesheet.png')
