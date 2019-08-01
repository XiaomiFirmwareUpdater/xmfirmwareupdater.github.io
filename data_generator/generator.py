#!/usr/bin/env python3
"""XiaomiFirmwareUpdater website data generator"""

from os import environ
import json
from requests import get

# Variables
GIT_TOKEN = environ['GIT_OAUTH_TOKEN_XFU']
ORG = get(f'https://api.github.com/orgs/XiaomiFirmwareUpdater/'
          f'repos?per_page=200&access_token={GIT_TOKEN}').json()
FW_CODENAMES = []
FW_DEVICES = {}
V_DEVICES = []
M_CODENAMES = []
M_DEVICES = {}
NAMES = {}


def load_names():
    """
    Load devices names
    """
    data = get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
               'xiaomi_devices/names/names.json').json()
    for codename, name in data.items():
        name = name.replace(' China', '').replace(' EEA Global', '').replace(' India', '') \
            .replace(' Russia', '').replace(' Global', '')
        if '_' in codename:
            check = codename.split('_')[0]
            if check in data:
                continue
            else:
                codename = check
        NAMES.update({codename: name})
    with open('../data/names.json', 'w') as out:
        json.dump(NAMES, out, indent=1)


def load_fw_devices():
    """
    Load devices codenames from GitHub org repos
    """
    for repo in ORG:
        if 'firmware_xiaomi_' in repo['name']:
            device = repo['name'].split('_')[-1]
            FW_CODENAMES.append(device)
    FW_CODENAMES.sort()
    with open('../data/firmware_codenames.json', 'w') as out:
        json.dump(FW_CODENAMES, out, indent=1)
    FW_DEVICES.update({codename: NAMES[codename] for codename in FW_CODENAMES})
    with open('../data/firmware_devices.json', 'w') as out:
        json.dump(FW_DEVICES, out, indent=1)


def load_releases():
    """
    Check GitHub releases info for each device and write JSON files
    """
    all_latest = []
    for device in FW_CODENAMES:
        info = []
        url = f'https://api.github.com/repos/XiaomiFirmwareUpdater/' \
            f'firmware_xiaomi_{device}/releases?per_page=200&access_token={GIT_TOKEN}'
        data = get(url).json()
        # Generate all releases JSON
        for item in data:
            # if 'untagged' in item['tag_name']:
            #     continue
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
            latest.append([i for i in info if i['branch'] == 'stable'
                           and i['region'] == 'Global'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable'
                           and i['region'] == 'China'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'weekly'
                           and i['region'] == 'Global'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'weekly'
                           and i['region'] == 'China'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable'
                           and i['region'] == 'Europe'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable'
                           and i['region'] == 'India'][0])
        except IndexError:
            pass
        try:
            latest.append([i for i in info if i['branch'] == 'stable'
                           and i['region'] == 'Russia'][0])
        except IndexError:
            pass
        with open(f'../data/devices/latest/{device}.json', 'w') as out:
            json.dump(latest, out, indent=1)
        for i in latest:
            all_latest.append(i)
    with open('../data/devices/latest.json', 'w') as out:
        json.dump(all_latest, out, indent=1)


def generate_fw_md():
    """
    Generate downloads markdown files for firmware pages
    """
    header = '''---
title: $name ($codename) Firmware Downloads
layout: download
name: $name
codename: $codename
permalink: $link
---
'''
    table = '''<div class="table-responsive-md" id="table-wrapper">
<table id="firmware" class="compact table table-striped table-hover table-sm">
    <thead class="thead-dark">
        <tr>
            <th>Branch</th>
            <th>MIUI</th>
            <th>Android</th>
            <th>Region</th>
            <th>Updated</th>
            <th>Link</th>
        </tr>
    </thead>
    <script>loadFirmwareDownloads('$codename', '$request')</script>
</table>
</div>
'''
    latest = '''### Latest Firmware
##### This page shows latest downloads only. If you're looking for old builds check [the archive](/archive/firmware/$codename/)
'''
    archive = '''### Firmware Archive
##### This page shows all available downloads. If you're looking for latest builds check [Here](/firmware/$codename/)
'''
    for branch in ['latest', 'full']:
        for codename, name in FW_DEVICES.items():
            link = ''
            if branch == 'latest':
                link = f'/firmware/{codename}/'
            elif branch == 'full':
                link = f'/archive/firmware/{codename}/'
            markdown = ''
            markdown += header.replace('$codename', codename) \
                            .replace('$name', name).replace('$link', link) + '\n\n'
            if branch == 'latest':
                markdown += latest.replace('$codename', codename) + '\n\n'
            elif branch == 'full':
                markdown += archive.replace('$codename', codename) + '\n\n'
            markdown += table.replace('$codename', codename).replace('$request', branch)

            with open(f'../pages/firmware/{branch}/{codename}.md', 'w') as out:
                out.write(markdown)


def load_miui_devices():
    """
    load miui devices
    """
    devices = get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                  'miui-updates-tracker/master/devices/sf.json').json()
    for codename in devices:
        if '_' in codename:
            check = codename.split('_')[0]
            if check in devices:
                continue
            else:
                codename = check
        M_CODENAMES.append(codename)
    with open('../data/miui_codenames.json', 'w') as out:
        json.dump(M_CODENAMES, out, indent=1)
    eol = get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
              'miui-updates-tracker/master/EOL/sf.json').json()
    for codename in eol:
        if '_' in codename:
            check = codename.split('_')[0]
            if check in eol:
                continue
            else:
                codename = check
        M_CODENAMES.append(codename)

    M_DEVICES.update({codename: NAMES[codename] for codename in M_CODENAMES})
    with open('../data/miui_devices.json', 'w') as out:
        json.dump(M_DEVICES, out, indent=1)


def generate_miui_md():
    """
    Generate downloads markdown files for miui pages
    """
    header = '''---
title: $name ($codename) MIUI Downloads
layout: download
name: $name
codename: $codename
permalink: $link
---
'''
    table = '''<div class="table-responsive-md" id="table-wrapper">
<table id="miui" class="compact table table-striped table-hover table-sm">
    <thead class="thead-dark">
        <tr>
            $rows
        </tr>
    </thead>
    <script>$function('$codename')</script>
</table>
</div>
'''
    latest_rows = '''<th>Device</th>
            <th>Branch</th>
            <th>Type</th>
            <th>MIUI</th>
            <th>Android</th>
            <th>Link</th>
            <th>Size</th>'''
    archive_rows = '''<th>Branch</th>
            <th>MIUI</th>
            <th>Android</th>
            <th>Region</th>
            <th>Updated</th>
            <th>Link</th>'''
    latest = '''### Latest MIUI Official ROMs
##### This page shows latest downloads only. If you're looking for old builds check [the archive](/archive/miui/$codename/)
*Note*: All files listed here are official untouched MIUI ROMs. It's not owned, modified or edited by Xiaomi Firmware Updater.
'''
    archive = '''### MIUI Official ROMs Archive
##### This page shows all available downloads. If you're looking for latest builds check [Here](/miui/$codename/)
*Note*: All files listed here are official untouched MIUI ROMs. It's not owned, modified or edited by Xiaomi Firmware Updater.
'''
    for branch in ['latest', 'full']:
        for codename, name in M_DEVICES.items():
            markdown = ''
            if branch == 'latest':
                link = f'/miui/{codename}/'
                markdown += header.replace('$codename', codename) \
                    .replace('$name', name).replace('$link', link)
                markdown += latest.replace('$codename', codename) + '\n\n'
                markdown += table.replace('$codename', codename).replace('$request', branch) \
                                .replace('$function', 'loadMiuiDownloads') \
                                .replace('$rows', latest_rows) + '\n\n'
            elif branch == 'full':
                link = f'/archive/miui/{codename}/'
                markdown += header.replace('$codename', codename) \
                    .replace('$name', name).replace('$link', link)
                markdown += archive.replace('$codename', codename) + '\n\n'
                markdown += table.replace('$codename', codename).replace('$request', branch) \
                                .replace('$function', 'loadMiuiArchive') \
                                .replace('$rows', archive_rows) + '\n\n'

            with open(f'../pages/miui/{branch}/{codename}.md', 'w') as out:
                out.write(markdown)


def main():
    """
    XFU data generate script
    """
    load_names()
    load_fw_devices()
    load_releases()
    generate_fw_md()
    load_miui_devices()
    generate_miui_md()


if __name__ == '__main__':
    main()
