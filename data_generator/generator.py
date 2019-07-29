#!/usr/bin/env python3
"""XiaomiFirmwareUpdater website data generator"""

from os import environ
import json
import requests

# Variables
GIT_TOKEN = environ['GIT_OAUTH_TOKEN_XFU']
ORG = requests.get(f'https://api.github.com/orgs/XiaomiFirmwareUpdater/'
                   f'repos?per_page=200&access_token={GIT_TOKEN}').json()
DEVICES = ['whyred']


def load_devices():
    """
    Load devices' codenames from GitHub org repos
    """
    for repo in ORG:
        if 'firmware_xiaomi_' in repo['name']:
            device = repo['name'].split('_')[-1]
            DEVICES.append(device)
    DEVICES.sort()
    with open('../data/codenames.json', 'w') as out:
        json.dump(DEVICES, out, indent=1)
    """
    # Generate devices.json
    names = requests.get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                         'xiaomi_devices/names/names.json').json()
    names_ = []
    for i in DEVICES:
        try:
            names_.append({'codename': i,
                           'name': names[i],
                           'url': f'https://github.com/XiaomiFirmwareUpdater/firmware_xiaomi_{i}'})
        except KeyError as e:
            print(e)
    with open('../data/devices.json', 'w') as out:
        json.dump(names_, out, indent=1)
    """


def load_releases():
    """
    Check GitHub releases info for each device and write JSON files
    """
    for device in DEVICES:
        info = []
        url = f'https://api.github.com/repos/XiaomiFirmwareUpdater/' \
            f'firmware_xiaomi_{device}/releases?per_page=200&access_token={GIT_TOKEN}'
        data = requests.get(url).json()
        # Generate all releases JSON
        for item in data:
            branch = 'stable' if 'stable' in item['tag_name'] else 'weekly'
            for asset in item['assets']:
                date = asset['updated_at'][:10]
                filename = asset['name']
                miui_version = filename.split('_')[-3]
                android = filename.split('_')[-1].split('.zip')[0]
                download_url = asset['browser_download_url']
                if 'EEAGlobal' in filename or 'EU' in miui_version:
                    region = 'Europe'
                elif 'INGlobal' in filename or 'IN' in miui_version:
                    region = 'India'
                elif 'RUGlobal' in filename or 'RU' in miui_version:
                    region = 'Russia'
                elif 'Global' in filename or 'MI' in miui_version:
                    region = 'Global'
                else:
                    region = 'China'
                osdn = 'https://osdn.net/projects/xiaomifirmwareupdater/storage/'
                if branch == 'stable':
                    osdn += 'Stable/'
                    osdn += miui_version.split('.')[0] + '/'
                else:
                    osdn += 'Developer/'
                    osdn += miui_version + '/'
                osdn += f'{device}/{filename}'
                release = {'branch': branch,
                           'versions': {
                               'miui': miui_version,
                               'android': android},
                           'date': date,
                           'region': region,
                           'downloads': {
                               'github': download_url,
                               'osdn': osdn},
                           'filename': filename}
                info.append(release)
        with open(f'../data/devices/full/{device}.json', 'w') as out:
            json.dump(info, out, indent=1)
        # Generate latest releases JSON
        latest = []
        try:
            latest.append([i for i in info if i['branch'] == 'stable' and i['region'] == 'Global'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable' and i['region'] == 'China'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'weekly' and i['region'] == 'Global'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'weekly' and i['region'] == 'China'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable' and i['region'] == 'Europe'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable' and i['region'] == 'India'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable' and i['region'] == 'Russia'][0])
        except IndexError:
            pass
        with open(f'../data/devices/latest/{device}.json', 'w') as out:
            json.dump(latest, out, indent=1)


def main():
    load_devices()


if __name__ == '__main__':
    main()
