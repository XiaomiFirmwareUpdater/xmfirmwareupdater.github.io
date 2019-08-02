---
title: MIUI ARB Checker
layout: single
permalink: /projects/miui-arb-checker/
---

MIUI Anti-Rollback checker is a simple command-line Python 3 tool that can check anti-rollback implementation in MIUI Recovery and Fastboot ROMs. It also supports checking xbl files and fastboot flashing scripts.

The script is available on [GitHub](https://github.com/XiaomiFirmwareUpdater/xiaomi-oss-tracker/).

**Usage:**

You need python 3 installed on your device.

Download the latest version of the script from here and place rom you want to check in same script folder and run:

`python3 miui_arb_checker.py <file_to_check>`

The script will detect the input automatically and check for ARB index.

**Known Issues:**

* Recovery ROM / XBL check may return incorrect number in case of some devices. Check [Issue #2](https://github.com/XiaomiFirmwareUpdater/miui_arb_checker/issues/2) for more details.
