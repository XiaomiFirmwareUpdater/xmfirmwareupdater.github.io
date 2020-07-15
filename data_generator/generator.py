#!/usr/bin/env python3
"""XiaomiFirmwareUpdater website data generator"""

from os import environ
# import json
import re
import xml.etree.ElementTree as eT
from pathlib import Path
from string import Template

import yaml
from requests import get
from humanize import naturalsize

# Variables
from database import close_db
from database.database import get_device_latest, get_device_roms, get_incremental

HEADER = {'Authorization': f'token {environ["GIT_OAUTH_TOKEN_XFU"]}'}
VARIANTS = [['stable', 'Global'], ['stable', 'China'], ['weekly', 'Global'], ['weekly', 'China'],
            ['stable', 'Europe'], ['stable', 'India'], ['stable', 'Russia']]
FW_CODENAMES = []
FW_DEVICES = {}
M_CODENAMES = []
M_DEVICES = {}
V_DEVICES = {}

NAMES = {}

with open("update_page.template", 'r') as file:
    miui_update_page_template = Template(file.read())
with open("update.template", 'r') as file:
    miui_update_template = Template(file.read())


def get_data_from_github(url):
    page = get(url, headers=HEADER)
    data = page.json()
    if page.links:
        for i in range(2, len(page.links) + 1):
            for j in get(f"{url}&page={i}", headers=HEADER).json():
                data.append(j)
    return data


ORG = get_data_from_github('https://api.github.com/orgs/XiaomiFirmwareUpdater/repos?per_page=100')


def load_names():
    """
    Load devices names
    """
    data = yaml.load(get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                         'miui-updates-tracker/V3/data/devices.yml').text, Loader=yaml.CLoader)
    for codename, info in data.items():
        name = ' '.join(info[0].split(' ')[:-1])
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
    archive = []
    for device in FW_CODENAMES:
        info = []
        url = f'https://api.github.com/repos/XiaomiFirmwareUpdater/' \
              f'firmware_xiaomi_{device}/releases?per_page=100'
        data = get_data_from_github(url)
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
        for i in info:
            archive.append(i)
        with open(f'../data/devices/full/{device}.yml', 'w') as out:
            yaml.dump(info, out, Dumper=yaml.CDumper)
        # Generate latest releases
        latest = []

        def filter_latest(branch_, region_):
            try:
                latest.append([j for j in info if j['branch'] == branch_
                               and j['region'] == region_][0])
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
    with open('../data/devices/full.yml', 'w') as out:
        yaml.dump(archive, out, Dumper=yaml.CDumper)

    # MIUI 12 China Beta
    miui12 = []
    with open("../data/devices/full.yml", "r") as o:
        archive = yaml.load(o, Loader=yaml.CLoader)
    for update in archive:
        if update["branch"] == "weekly":
            date = update["date"]
            date_array = date.split('-')
            if int(date_array[0]) == 2020 and int(date_array[1]) >= 4:
                filename = update["filename"]
                codename = filename.split('_')[1]
                name = FW_DEVICES[codename]
                filename = '_'.join(filename.split('_')[2:])
                version = update["versions"]["miui"]
                if version in ['20.3.28', '20.4.1']:
                    continue
                download = "https://bigota.d.miui.com/" + version + "/" + filename
                miui12.append({'name': name, 'codename': codename, 'date': date,
                               'version': version, 'android': update['versions']['android'], 'download': download})
    with open('../data/devices/miui12.yml', 'w') as out:
        yaml.dump(miui12, out, Dumper=yaml.CDumper)


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
{%include ad.html%}
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
    latest = yaml.load(get('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/'
                           'miui-updates-tracker/V3/data/latest.yml').content, Loader=yaml.CLoader)
    for item in latest:
        codename = item['codename']
        if '_' in codename:
            codename = codename.split('_')[0]
        if codename in M_CODENAMES:
            continue
        else:
            M_CODENAMES.append(codename)
    with open('../data/miui_codenames.yml', 'w') as out:
        yaml.dump(sorted(M_CODENAMES), out, Dumper=yaml.CDumper)
    M_DEVICES.update({codename: NAMES[codename] for codename in M_CODENAMES})
    with open('../data/miui_devices.yml', 'w') as out:
        yaml.dump(M_DEVICES, out, Dumper=yaml.CDumper)


def generate_miui_latest_table(item):
    return f'<tr><td>{item.name}</td>' \
           f'<td>{item.branch}</td>' \
           f'<td>{item.method}</td>' \
           f'<td>{item.version}</td>' \
           f'<td>{item.android}</td>' \
           f'<td>{naturalsize(item.size)}</td>' \
           f'<td>{item.date}</td>' \
           f'<td><a href="/miui/{item.codename.split("_")[0]}/{item.branch.lower()}/{item.version}/">' \
           f'Download</a></td></tr>\n'


def generate_update_info(update, idx):
    codename = update.codename.split("_")[0]
    page = miui_update_template
    page = page.safe_substitute(device=update.name)
    page = Template(page).safe_substitute(codename=codename)
    page = Template(page).safe_substitute(version=update.version)
    page = Template(page).safe_substitute(branch=update.branch)
    page = Template(page).safe_substitute(type=update.method)
    page = Template(page).safe_substitute(size=naturalsize(update.size))
    page = Template(page).safe_substitute(date=update.date)
    page = Template(page).safe_substitute(filename=update.link.split('/')[-1])
    page = Template(page).safe_substitute(md5=update.md5 if update.md5 else "Unknown")
    page = Template(page).safe_substitute(link=update.link)
    if update.method == "Recovery":
        incremental = get_incremental(update.version)
        if incremental:
            button = f'<button type="button" id="incremental_download" class="btn btn-warning" ' \
                     f'onclick="window.open(\'{incremental.link}\', \'_blank\');">' \
                     f'<i class="fa fa-download"></i> Incremental Update</button>'
            page = Template(page).safe_substitute(incremental=button)
        else:
            page = Template(page).safe_substitute(incremental='')
    else:
        page = Template(page).safe_substitute(incremental='')
    page = Template(page).safe_substitute(changelog='<br>'.join(update.changelog.splitlines()))
    page = page.replace('$idx', str(idx)).replace('$codename', codename)
    return page


def generate_versions_pages(updates):
    versions = {}
    for update in updates:
        if update.version in versions.keys():
            device_version = versions[update.version]
            device_version.append(update)
            versions.update({update.version: device_version})
        else:
            versions.update({update.version: [update]})
    codename = updates[0].codename.split("_")[0]
    table = ""
    for version, updates in versions.items():
        page = miui_update_page_template
        page = page.safe_substitute(codename=codename)
        page = Template(page).safe_substitute(device=updates[0].name)
        page = Template(page).safe_substitute(version=version)
        page = Template(page).safe_substitute(branch_lower=updates[0].branch.lower())
        page = Template(page).safe_substitute(branch=updates[0].branch)
        updates_info = ""
        for idx, update in enumerate(updates):
            table += generate_miui_latest_table(update)
            if Path(f'../pages/miui/updates/{codename}/{version}.md').exists():
                continue
            updates_info += generate_update_info(update, idx + 1)
        page = Template(page).safe_substitute(updates=updates_info)
        files_dir = Path(f'../pages/miui/updates/{codename}')
        if not files_dir.exists():
            files_dir.mkdir(parents=True)
        with open(f'../pages/miui/updates/{codename}/{version}.md', 'w') as out:
            out.write(page)
    return table


def generate_miui_md():
    """
    Generate downloads markdown files for miui pages
    """
    for branch, filename in {'latest': 'miui_latest.template', 'full': 'miui_archive.template'}.items():
        with open(filename, 'r') as f:
            template = Template(f.read())
        for codename, name in M_DEVICES.items():
            markdown = template
            markdown = markdown.safe_substitute(codename=codename)
            markdown = Template(markdown).safe_substitute(name=name)
            if branch == 'latest':
                table_content = generate_versions_pages(get_device_latest(codename))
                link = f'/miui/{codename}/'
                markdown = Template(markdown).safe_substitute(rows=table_content)
            else:
                table_content = generate_versions_pages(get_device_roms(codename))
                link = f'/archive/miui/{codename}/'
                markdown = Template(markdown).safe_substitute(rows=table_content)

            markdown = Template(markdown).safe_substitute(link=link)
            with open(f'../pages/miui/{branch}/{codename}.md', 'w') as out:
                out.write(markdown)


def load_vendor_devices():
    """
    Load mi-vendor-updater devices from GitHub repo
    """
    codenames = set()
    url = f'https://api.github.com/repos/TryHardDood/mi-vendor-updater/releases' \
          f'?per_page=100'
    data = get_data_from_github(url)
    # with open('vendor.json', 'w') as json_file:
    #     json.dump(data, json_file, indent=4)
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
                elif 'tr_global' in tag_name:
                    region = 'Turkey'
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
                    info = [j for j in full if j['branch'] == branch_
                            and j['region'] == region_]
                    dates = sorted([j['date'] for j in info], reverse=True)
                    latest.append([j for j in info if j['date'] == dates[0]][0])
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
    {%include ad.html%}
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
    notice = "*Note 1*: All files listed here are made by " \
             "[mi-vendor-updater](https://github.com/TryHardDood/mi-vendor-updater) " \
             "open-source project. It's not owned, modified or edited by Xiaomi Firmware Updater.\n\n" \
             "*Note 2*: Newer vendor packages include boot img, it'll overwrite existing boot img when you install it," \
             "so, you'll need to reflash Magisk and any custom kernel if you're using it."
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
    close_db()
