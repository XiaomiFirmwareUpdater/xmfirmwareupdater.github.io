---
title: Frequently Asked Questions
layout: single
permalink: /faq/
keywords: ""
---

## Xiaomi Firmware Updater FAQ

* ```Q:``` What is Xiaomi Firmware Updater?
* ```A:``` Xiaomi Firmware Updater is a community project, started in January 2018, aims to provide firmware packages for Xiaomi devices, in order to allow custom ROM users to update their devices’ firmware easily through custom recovery instead of having to flash full ROM every time they want to update.

* ```Q:``` What is Firmware? Is it a full ROM or OTA package?
* ```A:``` Firmware is not a ROM nor OTA Package, it's a set of low-level drivers which helps the operating system do whatever it wants to do. It includes various things like Modem, Bluetooth, Bootloader, DSP and etc.

* ```Q:``` Why should I update the Firmware?
* ```A:``` Firmware is provided from Xiaomi directly, and there are no sources for it to let developers build and edit it on their own like custom ROMs, so if you want to keep your device up to date always update your firmware!

* ```Q:``` Do I need updating the Firmware If I'm MIUI official or MIUI custom ROM user?
*	```A:``` No, MIUI ROMs contain the firmware-update package which I extract and provide here.

* ```Q:``` What are the supported devices?
* ```A:``` All Snapdragon and MTK devices including China-only devices. Check the full devices list [here](https://xiaomifirmwareupdater.com/supported/firmware/).

* ```Q:``` How to update firmware?
* ```A:``` 
	* Download the package you want to flash. IT MUST BE NAMED WITH THE SAME CODENAME OF YOUR DEVICE.
	* Flash it using TWRP or any custom recovery. There's no need to wipe/format anything before or after the installation.

* ```Q:``` How to check the updated firmware?
* ```A:``` Usually, the modem gets updated with newer firmware, you can check it in Settings > About > Baseband.

<hr/>

## MIUI Updates Tracker FAQ

* ```Q:``` What is that?
* ```A:``` A place to download MIUI ROMs. Because Xiaomi's official websites are too messy and not being updated regularly! You will spend a lot of time searching for a ROM on the official websites. You will also find the latest updates there, meanwhile, MIUI Updates Tracker has every single update of every device since 2014 organized and easy to access!

* ```Q:``` Are these official downloads?
* ```A:``` Yes! We don't touch updates' files at all. Actually, all download links are from MIUI servers directly, we don't have enough space to mirror more than 25K ROM files.

* ```Q:``` How to update?
	* Recovery updates can be installed using the official updater app inside your device settings, but keep in mind that only stable updates can be installed like this. If the update is a stable beta you might not be able to install it. After downloading the MIUI update, whether the incremental or the full one, open the updater from settings then click the 3-dots menu and choose Install from a local file, then select the downloaded MIUI zip. If you can't see this option, click on MIUI logo in the updater several times till you see a message that tells you more features have been enabled.
	* Fastboot updates can be installed using MiFlash official tool, but you must unlock the bootloader of your device first. Here's a good guide about flashing the official updates: Flash official ROMs | XiaomiWiki.

* ```Q:``` Excuse me. What is stable beta?!
* ```A:``` Basically, Xiaomi releases stable updates in gradual phases in which an update reaches some devices randomly but not all devices. Then, after some days if the update was stable enough they release it to everybody via OTA along with releasing fastboot package. In a nutshell, the update that doesn't have fastboot version is not a fully released stable update yet.

* ```Q:``` Can I flash an update of region X if I am using a version of region Y?
* ```A:``` No, to switch regions you will have to unlock the bootloader and flash the fastboot ROM of the region you want to switch to.

* ```Q:``` Which devices do your project support?
* ```A:``` All Xiaomi, Redmi, and POCO devices including China-only devices. Check the full devices list [here](https://xiaomifirmwareupdater.com/supported/miui/).
