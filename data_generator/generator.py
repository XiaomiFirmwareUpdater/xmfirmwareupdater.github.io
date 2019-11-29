#!/usr/bin/env python3
"""XiaomiFirmwareUpdater website data generator"""

from os import environ
import json
import re
import xml.etree.ElementTree as eT
import yaml
from requests import get
from humanize import naturalsize

# Variables
GIT_TOKEN = environ['GIT_OAUTH_TOKEN_XFU']
ORG = get(f'https://api.github.com/orgs/XiaomiFirmwareUpdater/'
          f'repos?per_page=200&access_token={GIT_TOKEN}').json()
VARIANTS = [['stable', 'Global'], ['stable', 'China'], ['weekly', 'Global'], ['weekly', 'China'],
            ['stable', 'Europe'], ['stable', 'India'], ['stable', 'Russia']]
FW_CODENAMES = []
FW_DEVICES = {}
M_CODENAMES = []
M_DEVICES = {}
V_DEVICES = {}

NAMES = {}


def load_names():
    """
    Load devices names
    """
    data = yaml.load(get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                         'miui-updates-tracker/master/devices/names.yml').text, Loader=yaml.CLoader)
    for codename, info in data.items():
        name = info[0].replace(' China', '').replace(' EEA', '').replace(' India', '') \
            .replace(' Russia', '').replace(' Global', '').replace(' Indonesia', '')
        if '/' in name:
            name = name.split('/')[1].strip()
        codename = codename.split('_')[0]
        try:
            if NAMES[codename] and name not in NAMES[codename]:
                NAMES.update({codename: f"{NAMES[codename]}/{name}"})
        except KeyError:
            NAMES.update({codename: name})
    with open('../data/names.yml', 'w') as out:
        yaml.dump(NAMES, out, allow_unicode=True, Dumper=yaml.CDumper)


def load_fw_devices():
    """
    Load devices codenames from GitHub org repos
    """
    for repo in ORG:
        if 'firmware_xiaomi_' in repo['name']:
            device = repo['name'].split('_')[-1]
            FW_CODENAMES.append(device)
    FW_CODENAMES.sort()
    with open('../data/firmware_codenames.yml', 'w') as out:
        yaml.dump(FW_CODENAMES, out, Dumper=yaml.CDumper)
    FW_DEVICES.update({codename: NAMES[codename] for codename in FW_CODENAMES})
    with open('../data/firmware_devices.yml', 'w') as out:
        yaml.dump(FW_DEVICES, out, Dumper=yaml.CDumper)


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
        # Generate all releases YAML
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
        with open(f'../data/devices/full/{device}.yml', 'w') as out:
            yaml.dump(info, out, Dumper=yaml.CDumper)
        # Generate latest releases
        latest = []

        def filter_latest(branch_, region_):
            try:
                latest.append([i for i in info if i['branch'] == branch_
                               and i['region'] == region_][0])
            except IndexError:
                pass

        for i in VARIANTS:
            filter_latest(i[0], i[1])
        with open(f'../data/devices/latest/{device}.yml', 'w') as out:
            yaml.dump(latest, out, Dumper=yaml.CDumper)
        for i in latest:
            all_latest.append(i)
    with open('../data/devices/latest.yml', 'w') as out:
        yaml.dump(all_latest, out, Dumper=yaml.CDumper)


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
    table = '''{%include ads.html%}
<div class="table-responsive-md" id="table-wrapper">
<table id="firmware" class="display dt-responsive nowrap compact table table-striped table-hover table-sm">
    <thead class="thead-dark">
        <tr>
            <th data-ref="branch">Branch</th>
            <th data-ref="miui">MIUI</th>
            <th data-ref="android">Android</th>
            <th data-ref="region">Region</th>
            <th data-ref="link">Link</th>
            <th data-ref="updated">Updated</th>
        </tr>
    </thead>
    <script>loadFirmwareDownloads('$codename', '$request')</script>
</table>
</div>
'''
    latest = '''<h3>Latest Firmware <span class="badge badge-light"><a href="/releases.xml" class="icon solid fa-rss"><span class="label">RSS</span></a></span></h3>
##### This page shows the latest downloads only. If you're looking for old releases check [the archive](/archive/firmware/$codename/).
'''
    archive = '''### Firmware Archive
##### This page shows all available downloads. If you're looking for the latest releases check [Here](/firmware/$codename/).
'''
    banner = '''<div class="alert alert-primary alert-dismissible fade show" role="alert">
    Follow <a href="https://t.me/XiaomiFirmwareUpdater" class="alert-link">Xiaomi Firmware Updater</a> on Telegram to get notified when a new update is out!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>'''

    for branch in ['latest', 'full']:
        for codename, name in FW_DEVICES.items():
            link = ''
            if branch == 'latest':
                link = f'/firmware/{codename}/'
            elif branch == 'full':
                link = f'/archive/firmware/{codename}/'
            markdown = ''
            markdown += header.replace('$codename', codename) \
                            .replace('$name', name).replace('$link', link) + '\n'
            if branch == 'latest':
                markdown += latest.replace('$codename', codename) + '\n'
            elif branch == 'full':
                markdown += archive.replace('$codename', codename) + '\n'
            markdown += banner + '\n'
            markdown += table.replace('$codename', codename).replace('$request', branch)

            with open(f'../pages/firmware/{branch}/{codename}.md', 'w') as out:
                out.write(markdown)


def load_miui_devices():
    """
    load miui devices
    """
    devices = yaml.load(get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                            'miui-updates-tracker/master/devices/sf.yml').content, Loader=yaml.CLoader)
    for codename in devices:
        if '_' in codename:
            check = codename.split('_')[0]
            if check in devices:
                continue
            else:
                codename = check
        M_CODENAMES.append(codename)
    for codename in ['tissot', 'jasmine', 'daisy', 'tiare', 'laurel']:
        M_CODENAMES.append(codename)
    with open('../data/miui_codenames.yml', 'w') as out:
        yaml.dump(M_CODENAMES, out, Dumper=yaml.CDumper)
    eol = yaml.load(get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                        'miui-updates-tracker/master/EOL/sf.yml').content, Loader=yaml.CLoader)
    for codename in eol:
        if '_' in codename:
            check = codename.split('_')[0]
            if check in eol:
                continue
            else:
                codename = check
        M_CODENAMES.append(codename)
    M_DEVICES.update({codename: NAMES[codename] for codename in M_CODENAMES})
    with open('../data/miui_devices.yml', 'w') as out:
        yaml.dump(M_DEVICES, out, Dumper=yaml.CDumper)


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
    table = '''{%include ads.html%}
<div class="table-responsive-md" id="table-wrapper">
<table id="miui" class="display dt-responsive compact table table-striped table-hover table-sm">
    <thead class="thead-dark">
        <tr>
            $rows
        </tr>
    </thead>
    <script>$function('$codename')</script>
</table>
</div>
'''
    latest_rows = '''<th data-ref="device">Device</th>
            <th data-ref="branch">Branch</th>
            <th data-ref="type">Type</th>
            <th data-ref="miui">MIUI</th>
            <th data-ref="android">Android</th>
            <th data-ref="link">Link</th>
            <th data-ref="size">Size</th>'''
    archive_rows = '''<th data-ref="device">Device</th>
                <th data-ref="codename">Codename</th>
                <th data-ref="branch">Branch</th>
                <th data-ref="type">Type</th>
                <th data-ref="region">Region</th>
                <th data-ref="miui">MIUI</th>
                <th data-ref="android">Android</th>
                <th data-ref="link">Link</th>'''
    latest = '''### Latest MIUI Official ROMs
##### This page shows the latest downloads only. If you're looking for old releases check [the archive](/archive/miui/$codename/).
*Note*: All files listed here are official untouched MIUI ROMs. It's not owned, modified or edited by Xiaomi Firmware Updater.
'''
    archive = '''### MIUI Official ROMs Archive
##### This page shows all available downloads. If you're looking for the latest releases check [Here](/miui/$codename/).
*Note*: All files listed here are official untouched MIUI ROMs. It's not owned, modified or edited by Xiaomi Firmware Updater.
'''
    banner = '''<div class="alert alert-primary alert-dismissible fade show" role="alert">
    Follow <a href="https://t.me/MIUIUpdatesTracker" class="alert-link">MIUI Updates Tracker</a> on Telegram to get notified when a new ROM is out!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>'''

    for branch in ['latest', 'full']:
        for codename, name in M_DEVICES.items():
            markdown = ''
            if branch == 'latest':
                link = f'/miui/{codename}/'
                markdown += header.replace('$codename', codename) \
                    .replace('$name', name).replace('$link', link)
                markdown += latest.replace('$codename', codename) + '\n'
                markdown += banner + '\n'
                markdown += table.replace('$codename', codename).replace('$request', branch) \
                                .replace('$function', 'loadMiuiDownloads') \
                                .replace('$rows', latest_rows) + '\n'
            elif branch == 'full':
                link = f'/archive/miui/{codename}/'
                markdown += header.replace('$codename', codename) \
                    .replace('$name', name).replace('$link', link)
                markdown += archive.replace('$codename', codename) + '\n'
                markdown += banner + '\n'
                markdown += table.replace('$codename', codename).replace('$request', branch) \
                                .replace('$function', 'loadMiuiArchive') \
                                .replace('$rows', archive_rows) + '\n'

            with open(f'../pages/miui/{branch}/{codename}.md', 'w') as out:
                out.write(markdown)


def load_vendor_devices():
    """
    Load mi-vendor-updater devices from GitHub repo
    """
    codenames = set()
    data = get(f'https://api.github.com/repos/TryHardDood/mi-vendor-updater/'
               f'releases?per_page=200&access_token={GIT_TOKEN}').json()
    for release in data:
        codenames.add(release['tag_name'].split('_')[0].split('-')[0])
    codenames = list(codenames)
    codenames.sort()
    with open('../data/vendor_codenames.yml', 'w') as out:
        yaml.dump(codenames, out, Dumper=yaml.CDumper)
    for codename in codenames:
        try:
            V_DEVICES.update({codename: NAMES[codename]})
        except KeyError:
            continue
    with open('../data/vendor_devices.yml', 'w') as out:
        yaml.dump(V_DEVICES, out, Dumper=yaml.CDumper)
    all_latest = []
    for codename in codenames:
        releases = [i for i in data if i['tag_name'].split('_')[0].split('-')[0] == codename]
        full = []
        for item in releases:
            tag_name = item['tag_name']
            branch = 'stable' if 'stable' in tag_name else 'weekly'
            for asset in item['assets']:
                date = asset['updated_at'][:10]
                filename = asset['name']

                if "_miui_" not in filename:
                    miui_version = filename.split('_')[-1].split('.zip')[0]
                    android = "8.1" if miui_version.split('.')[-1].startswith('O') else "9.0"
                else:
                    miui_version = filename.split('_')[-3]
                    android = filename.split('_')[-1].split('.zip')[0]
                filesize = naturalsize(asset['size'])
                download_url = asset['browser_download_url']
                if 'eea_global' in tag_name:
                    region = 'Europe'
                elif 'in_global' in tag_name:
                    region = 'India'
                elif 'ru_global' in tag_name:
                    region = 'Russia'
                elif 'global' in tag_name:
                    region = 'Global'
                else:
                    region = 'China'
                sf = f"https://sourceforge.net/projects/xiaomi-vendor-updater-project/files/" \
                     f"{tag_name}/{filename}/download"
                release = {'branch': branch,
                           'versions': {
                               'miui': miui_version,
                               'android': android},
                           'date': date,
                           'region': region,
                           'downloads': {
                               'github': download_url,
                               'sf': sf},
                           'filename': filename,
                           'size': filesize}
                full.append(release)
        with open(f'../data/vendor/full/{codename}.yml', 'w') as out:
            yaml.dump(full, out, Dumper=yaml.CDumper)
            # Generate latest releases YAML
            latest = []

            def filter_latest(branch_, region_):
                try:
                    info = [i for i in full if i['branch'] == branch_
                            and i['region'] == region_]
                    dates = sorted([i['date'] for i in info], reverse=True)
                    latest.append([i for i in info if i['date'] == dates[0]][0])
                except IndexError:
                    pass

            for i in VARIANTS:
                filter_latest(i[0], i[1])
        with open(f'../data/vendor/latest/{codename}.yml', 'w') as out:
            yaml.dump(latest, out, Dumper=yaml.CDumper)
        for i in latest:
            all_latest.append(i)
    with open('../data/vendor/latest.yml', 'w') as out:
        yaml.dump(all_latest, out, Dumper=yaml.CDumper)
    header = '''---
title: $name ($codename) Vendor Downloads
layout: download
name: $name
codename: $codename
permalink: $link
---
'''
    table = '''{%include ads.html%}
<div class="table-responsive-md" id="table-wrapper">
    <table id="vendor" class="display dt-responsive compact table table-striped table-hover table-sm">
        <thead class="thead-dark">
            <tr>
                <th data-ref="branch">Branch</th>
                <th data-ref="miui">MIUI</th>
                <th data-ref="region">Region</th>
                <th data-ref="link">Link</th>
                <th data-ref="size">Size</th>
                <th data-ref="updated">Updated</th>
            </tr>
        </thead>
        <script>loadVendorDownloads('$codename', '$request')</script>
    </table>
</div>
'''
    latest = '''### Latest Vendor flashable files
##### This page shows the latest downloads only. If you're looking for old releases check [the archive](/archive/vendor/$codename/).
'''
    archive = '''### Vendor flashable files Archive
##### This page shows all available downloads. If you're looking for the latest releases check [Here](/vendor/$codename/).
'''
    notice = "*Note*: All files listed here are made by " \
             "[mi-vendor-updater](https://github.com/TryHardDood/mi-vendor-updater) " \
             "open-source project. It's not owned, modified or edited by Xiaomi Firmware Updater."
    banner = '''<div class="alert alert-primary alert-dismissible fade show" role="alert">
    Follow <a href="https://t.me/MIUIVendorUpdater" class="alert-link">MIUI Vendor Updater</a> on Telegram to get notified when a new update is out!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>'''
    for branch in ['latest', 'full']:
        for codename, name in V_DEVICES.items():
            link = ''
            if branch == 'latest':
                link = f'/vendor/{codename}/'
            elif branch == 'full':
                link = f'/archive/vendor/{codename}/'
            markdown = ''
            markdown += header.replace('$codename', codename) \
                            .replace('$name', name).replace('$link', link) + '\n'
            if branch == 'latest':
                markdown += latest.replace('$codename', codename) + '\n'
            elif branch == 'full':
                markdown += archive.replace('$codename', codename) + '\n'
            markdown += notice + '\n'
            markdown += banner + '\n'
            markdown += table.replace('$codename', codename).replace('$request', branch)

            with open(f'../pages/vendor/{branch}/{codename}.md', 'w') as out:
                out.write(markdown)


def generate_rss():
    """
    generate site rss based on osdn
    """
    xml = get('https://osdn.net/projects/xiaomifirmwareupdater/storage/!rss').content.decode()
    xml = re.sub(r'https:.*!rss',
                 r'https://xiaomifirmwareupdater.com/releases.xml', xml)
    root = eT.fromstring(xml)
    description = root.find('./channel/description')
    description.text = 'Xiaomi Firmware Updater latest releases'
    link = root.find('./channel/link')
    link.text = 'https://xiaomifirmwareupdater.com'
    title = root.find('./channel/title')
    title.text = 'Xiaomi Firmware Updater Releases'
    for child in root.findall('./channel/item/title'):
        txt = child.text
        codename = txt.split('/')[-1].split('_')[1]
        if '-' in codename:
            codename = codename.replace('-', '_').split('_')[0]
        name = NAMES[codename]
        version = txt.split('/')[-1].split('_')[4]
        child.text = f'{name} ({codename}) - {version}'
    for child in root.findall('./channel/item/link'):
        codename = child.text.split('/')[-1].split('_')[1]
        child.text = f'https://xiaomifirmwareupdater.com/firmware/{codename}'
    with open('../releases.xml', 'w') as out:
        out.write(eT.tostring(root).decode())


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
    load_vendor_devices()
    generate_rss()


if __name__ == '__main__':
    main()
