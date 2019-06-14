---
title: Uranus Chat Bot
layout: single
permalink: /projects/uranus-chatbot/
---

Uranus is an all-in-one bot that provides useful services for Xiaomi users, currently available on Telegram only.

This project is a modular telegram bot, made using Python 3 and python-telegram-bot library.

The whole bot functions in source code, which is licensed under GPL3, are based on [XiaomiFirmwareUpdater](https://github.com/XiaomiFirmwareUpdater/) other projects and files, including and not limited to:

- [mi-firmware-updater](https://github.com/XiaomiFirmwareUpdater/mi-firmware-updater)
- [miui-updates-tracker](https://github.com/XiaomiFirmwareUpdater/miui-updates-tracker)
- [xiaomifirmwareupdater.github.io](https://github.com/XiaomiFirmwareUpdater/xiaomifirmwareupdater.github.io)

However, [the telegram bot](https://t.me/XiaomiGeeksBot) may contain some other features that are not available in this code, like the Admins module.

<h3><a href="#usage">Using the bot</a></h3>
Available commands are:

<table>
  <tr>
    <td>Command</td>
    <td>Arguments</td>
    <td>Action</td>
    <td>Example</td>
  </tr>
  <tr>
    <td>/recovery</td>
    <td>codename</td>
    <td>gets latest recovery ROMs info and links</td>
    <td>/recovery whyred</td>
  </tr>
  <tr>
    <td>/fastboot</td>
    <td>codename</td>
    <td>gets latest fastboot ROMs info and links</td>
    <td>/fastboot whyred</td>
  </tr>
  <tr>
    <td>/latest</td>
    <td>codename</td>
    <td>gets latest MIUI versions info</td>
    <td>/latest sagit</td>
  </tr>
  <tr>
    <td>/list</td>
    <td>codename</td>
    <td>gets all official available recovery MIUI ROMs for device</td>
    <td>/list mido</td>
  </tr>
  <tr>
    <td>/firmware</td>
    <td>codename</td>
    <td>generate latest available firmware for device</td>
    <td>/firmware dipper</td>
  </tr>
  <tr>
    <td>/vendor</td>
    <td>codename</td>
    <td>gets latest firmware+vendor for device, based on @MIUIVendorUpdater</td>
    <td>/vendor davinci</td>
  </tr>
  <tr>
    <td>/eu</td>
    <td>codename</td>
    <td>gets latest Xiaomi EU ROMs downloads for device</td>
    <td>/eu mido</td>
  </tr>
  <tr>
    <td>/twrp</td>
    <td>codename</td>
    <td>gets latest TWRP download link for device</td>
    <td>/twrp whyred</td>
  </tr>
  <tr>
    <td>/models</td>
    <td>codename</td>
    <td>gets info about all available models of a device</td>
    <td>/models ysl</td>
  </tr>
  <tr>
    <td>/whatis</td>
    <td>codename</td>
    <td>tells you which device's codename is this</td>
    <td>/whatis cepheus</td>
  </tr>
  <tr>
    <td>/codename</td>
    <td>device name</td>
    <td>tells you what is the codename of this device</td>
    <td>/codename Redmi 6</td>
  </tr>
  <tr>
    <td>/specs</td>
    <td>codename</td>
    <td>gets this device specs from GSMArena</td>
    <td>/specs riva</td>
  </tr>
  <tr>
    <td>/ota</td>
    <td>full_codename version android</td>
    <td>gets the increment OTA link of MIUI update</td>
    <td>/ota tulip_global 9.5.9 9.0<br>/ota sirius 9.5.9 9.0<br></td>
  </tr>
  <tr>
    <td>/changelog</td>
    <td>full_codename version android</td>
    <td>gets the changelog of a MIUI update</td>
    <td>/changelog whyred_global V10.3.1.0.OEIMIXM 8.1</td>
  </tr>
  <tr>
    <td>/guides</td>
    <td>-</td>
    <td>Various useful guides for every Xiaomi user</td>
    <td>/guides</td>
  </tr>
  <tr>
    <td>/unlockbl</td>
    <td>-</td>
    <td>Unlocking bootloader help and tools</td>
    <td>/unlockbl</td>
  </tr>
  <tr>
    <td>/tools</td>
    <td>-</td>
    <td>Various useful tools for every Xiaomi user</td>
    <td>/tools</td>
  </tr>
  <tr>
    <td>/arb</td>
    <td>-</td>
    <td>Anti-Rollback Protection information</td>
    <td>/arb</td>
  </tr>
</table>

### Source Code:

The code of this bot is available on GitHub [repo](https://github.com/XiaomiFirmwareUpdater/xiaomi_uranus_tgbot), contributions are more than welcome!
