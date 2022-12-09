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
