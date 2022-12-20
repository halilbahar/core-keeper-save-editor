#!/usr/bin/env python3
import os
from os import path
from re import sub
from shutil import copytree, copy2, rmtree

from PIL import Image


# https://stackoverflow.com/a/12514470/11125147
def copy_to(src, src_folder, dst_folder, dst=None):
    if dst is None:
        dst = src

    s = path.join('out', os.path.join(src_folder, src))
    d = path.join(dst_folder, dst)
    if path.isdir(s):
        copytree(s, d, False, None)
    else:
        copy2(s, d)


def copy_to_assets(src, src_folder, dst=None):
    copy_to(src, src_folder, '../src/assets', dst=dst)


def copy_to_data(src, src_folder, dst=None):
    copy_to(src, src_folder, '../src/app/data', dst=dst)


if __name__ == '__main__':
    # Copy items
    if os.path.isdir('out/item'):
        copy_to_data('item-data.json', 'item')
        copy_to_assets('item-spritesheet.png', 'item')
        # Replace variables
        with open('../src/variables.scss', 'r') as file:
            file_data = file.read()
        # Replace the target string
        item_spritesheet = Image.open('out/item/item-spritesheet.png')
        file_data = sub(
            r'--spritesheet-width: \d+px;', '--spritesheet-width: %dpx;' % item_spritesheet.size[0],
            file_data
        )
        # Write the file out again
        with open('../src/variables.scss', 'w') as file:
            file.write(file_data)

    if os.path.isdir('out/talents'):
        copy_to_data('talent-data.json', 'talents')
        # Delete old talents
        rmtree('../src/assets/talents', ignore_errors=True)
        # Copy new talents
        copy_to_assets('image', 'talents', dst='talents')

    if os.path.isdir('out/conditions'):
        copy_to_data('condition-data.json', 'conditions')
