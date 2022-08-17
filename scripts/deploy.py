from os import path
from PIL import Image
from shutil import rmtree, copytree, copy2
from re import sub


# https://stackoverflow.com/a/12514470/11125147
def copy_to_assets(src, dst=None, symlinks=False, ignore=None):
    if dst is None:
        dst = src

    s = path.join('out', src)
    d = path.join('../src/assets', dst)
    if path.isdir(s):
        copytree(s, d, symlinks, ignore)
    else:
        copy2(s, d)


if __name__ == '__main__':
    # Copy files
    copy_to_assets('item-data.json')
    copy_to_assets('item-spritesheet.png')
    copy_to_assets('talent-data.json')
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
    rmtree('../src/assets/talents', ignore_errors=True)
    # Copy new talents
    copy_to_assets('talents')
