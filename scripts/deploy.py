#!/usr/bin/env python3
from os import path
from re import sub
from shutil import copytree, copy2

from PIL import Image


# https://stackoverflow.com/a/12514470/11125147
def copy_to(src, dst_folder, dst=None):
    if dst is None:
        dst = src

    s = path.join('out', src)
    d = path.join(dst_folder, dst)
    if path.isdir(s):
        copytree(s, d, False, None)
    else:
        copy2(s, d)


def copy_to_assets(src):
    copy_to(src, '../src/assets')


def copy_to_config(src):
    copy_to(src, '../src/app/config')


if __name__ == '__main__':
    # Copy files
    copy_to_config('data.json')
    # copy_to_config('talent-data.json')
    copy_to_assets('item-spritesheet.png')
    item_spritesheet = Image.open('out/item-spritesheet.png')

    # Replace variables
    with open('../src/variables.scss', 'r') as file:
        file_data = file.read()
    # Replace the target string
    file_data = sub(r'--spritesheet-width: \d+px;', '--spritesheet-width: %dpx;' % item_spritesheet.size[0], file_data)
    # Write the file out again
    with open('../src/variables.scss', 'w') as file:
        file.write(file_data)

    # Delete old talents
    # rmtree('../src/assets/talents', ignore_errors=True)
    # Copy new talents
    # copy_to_assets('talents')
