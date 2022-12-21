import logging
import os
import pickle
import re
from typing import TypedDict

from unityparser import UnityDocument

CACHE_FOLDER = '.cache'
ENUM_PATTERN = re.compile(r'(\w+) = (\d*)')
os.makedirs(CACHE_FOLDER, exist_ok=True)

logger = logging.getLogger('util')


class Translation(TypedDict):
    term: str
    value: str


def load_cache(name: str) -> object:
    try:
        with open(os.path.join(CACHE_FOLDER, name), 'rb') as f:
            value = pickle.load(f)
            logger.info('Successfully loaded value from: %s' % name)
            return value
    except:
        logger.error('Failed to loaded value from: %s' % name)


def set_cache(name: str, value) -> None:
    with open(os.path.join(CACHE_FOLDER, name), 'wb') as f:
        try:
            pickle.dump(value, f)
            logger.info('Successfuly dumped value to: %s' % name)
        except:
            logger.error('Failed to dump value to: %s' % name)
            pass


def get_translations() -> [Translation]:
    translations: [Translation] = load_cache('language')
    if translations is not None:
        return translations

    behaviour_ = UnityDocument.load_yaml('dump/CoreKeeper/ExportedProject/Assets/Resources/I2Languages.asset').filter(
        class_names=('MonoBehaviour',)
    )[0]
    m_terms = behaviour_.mSource['mTerms']

    translations = []
    for term in m_terms:
        translations.append({'term': term['Term'], 'value': term['Languages'][0]})

    set_cache('language', translations)
    return translations


def get_enum(path) -> dict:
    result = {}
    # Get all the object ids from the enum file with regex
    with open(os.path.join(path)) as file:
        for match in ENUM_PATTERN.finditer(file.read()):
            enum_name = match.group(1)
            enum_value = match.group(2)
            result[int(enum_value)] = enum_name

    return result


def first_ingredient_is_primary(ingredient1, ingredient2):
    var1 = ingredient1 * 2 + 0x157b9 + ingredient2
    var1 = ((var1 ^ 0x3d0000) >> 0x10 ^ var1) * 9
    var2 = (var1 >> 4 ^ var1) * 0x27d4eb2d
    var2 = var2 >> 0xf ^ var2
    var2 = var2 ^ var2 << 0xd
    var2 = var2 ^ var2 >> 0x11
    var1 = ingredient2 * 2 + 0x157b9 + ingredient1
    var1 = ((var1 ^ 0x3d0000) >> 0x10 ^ var1) * 9
    var1 = (var1 >> 4 ^ var1) * 0x27d4eb2d
    var1 = var1 >> 0xf ^ var1
    var1 = var1 ^ var1 << 0xd
    var1 = var1 ^ var1 >> 0x11
    return ((var1 << 5 ^ var1) >> 9 | 0x3f800000) - 1.0 < ((var2 << 5 ^ var2) >> 9 | 0x3f800000) - 1.0


def get_food(first_object_id, second_object_id):
    first_ingredient_primary = first_ingredient_is_primary(first_object_id, second_object_id)
    if first_ingredient_primary:
        result_ingredient1 = first_object_id
        result_ingredient2 = second_object_id
    else:
        result_ingredient1 = second_object_id
        result_ingredient2 = first_object_id

    return result_ingredient1 * 10000 + result_ingredient2
