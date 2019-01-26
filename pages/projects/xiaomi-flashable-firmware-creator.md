---
title: Xiaomi Flashable Firmware Creator
layout: single
permalink: /projects/xiaomi-flashable-firmware-creator/
---

# Xiaomi Flashable Firmware Creator
#### Do you want to create your own firmware files from MIUI ROMs without depending on Xiaomi Firmware Updater? Then you need the new script!

[Xiaomi Flashable Firmware Creator](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/) is a python 3 script which generates flashable firmware-update packages, extracted from official (or non official) MIUI ROMS.

It supports creating untouched firmware, non-arb firmware, firmware + vendor flashable zip and firmware-less ROMs.

### Usage:

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

### Guide:
1- Download .exe for windows, or the one without extension for linux from [releases](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/releases), and download Miui Based ROM you want to edit.

2- Put them in the same folder tool & .zip file.

3- Open CMD/Terminal in that folder and type the command you want with file name, from the above three options.
![1](https://i.postimg.cc/DwvbdGfp/1.png)

![2](https://i.postimg.cc/13vVWzfm/2.png)

4- Commands will be like this.
```
create_flashable_firmware.exe -F miui_HMNote5HMNote5ProGlobal_8.11.23_12bcf570ce_8.1.zip
create_flashable_firmware.exe -N miui_HMNote5HMNote5ProGlobal_8.11.23_12bcf570ce_8.1.zip
create_flashable_firmware.exe -L miui_HMNote5HMNote5ProGlobal_8.11.23_12bcf570ce_8.1.zip
```
5- Run the command you want and the result file will be in the same folder.
![3](https://i.postimg.cc/tg7Z8Hxh/3.png)

6- Final Zips after running all the commands:
![4](https://i.postimg.cc/L6fV0jpH/4.png)

### Support:
If you face any problem with our tool please let us know, you can report on [GitHub repo](https://github.com/XiaomiFirmwareUpdater/xiaomi-flashable-firmware-creator.py/) issues, or on [XDA thread](https://forum.xda-developers.com/android/software/tool-xiaomi-flashable-firmware-creator-t3871311).