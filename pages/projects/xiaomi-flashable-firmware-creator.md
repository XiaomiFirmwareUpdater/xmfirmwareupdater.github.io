---
title: Xiaomi Flashable Firmware Creator
description: A tool for automating creating flashable firmware zip files
layout: single
permalink: /projects/xiaomi-flashable-firmware-creator/
---

#### Do you want to create your own firmware files from MIUI ROMs without depending on Xiaomi Firmware Updater? Then you need the new script!

Xiaomi Flashable Firmware Creator is a tool that generates flashable firmware-update packages from official (or non official) MIUI ROMS.

It supports creating untouched firmware, non-arb firmware, firmware + vendor flashable zip, and firmware-less ROMs.

[![screenshot](https://raw.githubusercontent.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/py/screenshots/1.png)](https://xiaomifirmwareupdater.com/projects/xiaomi-flashable-firmware-creator/)

### Features:
- CLI and GUI version
- Easy-to-use interface
- Multilanguage support (more than 25 languages!). Thanks to our community members!

{%include vli_ad_320x50_1.html%}

#### Screenshots:

[Here](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/tree/py/screenshots)

### GUI Usage:
- Clone or download [this repo](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py).
- Make sure that you have Python3 installed on your device.
- Install the required packages.
```
pip3 install -r requirements.txt
```
- Run the tool.
```
python3 main.py
```

### CLI Usage:

- Creating normal (untouched) firmware:
```
python3 create_flashable_firmware.py -F [MIUI ZIP]
```
- Creating non-arb firmware (without anti-rollback):
```
python3 create_flashable_firmware.py -N [MIUI ZIP]
```
- Creating firmware-less ROM (stock untouched ROM with just firmware removed):
```
python3 create_flashable_firmware.py -L [MIUI ZIP]
```
- Creating firmware + vendor flashable zip:
```
python3 create_flashable_firmware.py -V [MIUI ZIP]
```

{%include vli_ad_320x50_1.html%}

### CLI Guide:

1- Download .exe for windows, or the one without extension for linux from [releases](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/releases), and download Miui Based ROM you want to edit.

2- Put them in the same folder tool & .zip file.

3- Open CMD/Terminal in that folder and type the command you want with file name, from the above three options.

![1](https://i.postimg.cc/DwvbdGfp/1.png)

![2](https://i.postimg.cc/13vVWzfm/2.png)

4- Commands will be like this.
```
create_flashable_firmware.exe -F miui_HMNote5HMNote5ProGlobal_8.11.23_12bcf570ce_8.1.zip
```
```
create_flashable_firmware.exe -N miui_HMNote5HMNote5ProGlobal_8.11.23_12bcf570ce_8.1.zip
```
```
create_flashable_firmware.exe -L miui_HMNote5HMNote5ProGlobal_8.11.23_12bcf570ce_8.1.zip
```

5- Run the command you want and the result file will be in the same folder.

![3](https://i.postimg.cc/tg7Z8Hxh/3.png)

6- Final Zips after running all the commands:

![4](https://i.postimg.cc/L6fV0jpH/4.png)


### Support:
If you face any problem with our tool please let us know, you can report on [GitHub repo](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/) issues, or on [XDA thread](https://forum.xda-developers.com/android/software/tool-xiaomi-flashable-firmware-creator-t3871311).
