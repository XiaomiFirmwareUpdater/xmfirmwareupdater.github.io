---
title: Xiaomi Firmware Updater Downloads
layout: download
permalink: /firmware/
---

<h3>Latest Firmware Downloads for all Xiaomi Devices <span class="badge badge-light"><a href="/releases.xml"
            class="icon solid fa-rss"><span class="label">RSS</span></a></span></h3>

<div class="alert alert-primary alert-dismissible fade show" role="alert">
    Follow <a href="https://t.me/XiaomiFirmwareUpdater" class="alert-link">Xiaomi Firmware Updater</a> on Telegram to
    get notified when a new update is out!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
{%include ads.html%}
<div class="table-responsive-md" style="margin-top: 25px;">
    <table id="firmware" class="display dt-responsive nowrap compact table table-striped table-hover table-sm">
        <thead class="thead-dark">
            <tr>
                <th data-ref="device">Device</th>
                <th data-ref="codename">Codename</th>
                <th data-ref="branch">Branch</th>
                <th data-ref="miui">MIUI</th>
                <th data-ref="android">Android</th>
                <th data-ref="region">Region</th>
                <th data-ref="link">Link</th>
                <th data-ref="updated">Updated</th>
            </tr>
        </thead>
        <script>loadLatestFirmware()</script>
    </table>
</div>