---
title: MI Vendor Updater Supported Devices
layout: download
permalink: /supported/vendor/
---

*Note*: [mi-vendor-updater](https://github.com/TryHardDood/mi-vendor-updater) is an open-source project that utilize
[Xiaomi Firmware Updater](/) works. It's independant project and not a part of [Xiaomi Firmware Updater](/) project.

Check the downloads on the following pages: [Latest Releases](/vendor/) - [ROMs Archive](/archive/vendor/).

<div class="alert alert-primary alert-dismissible fade show" role="alert">
    Follow <a href="https://t.me/MIUIVendorUpdater" class="alert-link">MIUI Vendor Updater</a> on Telegram to get
    notified when a new update is out!
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
{%include ads.html%}
<div class="card">
    <div class="card-body">
        <h5 class="card-title">Note</h5>
        <h6 class="card-subtitle mb-2 text-muted">You might be looking for something else!</h6>
        <p class="card-text">This page shows MI Vendor Updater supported devices only.
            If you're looking for other projects supported devices check:</p>
        <a href="/supported/firmware/" class="card-link">Xiaomi Firmware Updater</a>
        <a href="/supported/miui/" class="card-link">MIUI Updates Tracker</a>
    </div>
</div>
<div class="row justify-content-center">
    <div class="col-10">
        <div class="table-responsive-md" style="margin-top: 25px;">
            {%include pix_ad_320x50_1.html%}
            <table id="supported" class="display dt-responsive nowrap compact table table-striped table-hover table-sm">
                <thead class="thead-dark">
                    <tr>
                        <th data-ref="device">Device</th>
                        <th data-ref="codename">Codename</th>
                    </tr>
                </thead>
                <script>loadSupportedDevices('vendor')</script>
            </table>
        </div>
    </div>
    {%include pix_ad_160x600_1.html%}
</div>