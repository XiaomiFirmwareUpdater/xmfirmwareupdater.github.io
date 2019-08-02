// Load supported devices from JSON file
function loadSupportedDevices(type) {
    $(document).ready(function () {
        $('#supported').DataTable({
            fixedHeader: true,
            responsive: {
                details: false
            },
            "paging": false,
            "order": [[1, "asc"]],
            "ajax": {
                "type": "GET",
                "url": '/data/' + type + '_devices.json',
                dataType: 'JSON',
                "dataSrc": function (json) {
                    var devicesList = [];
                    Object.entries(json).forEach(function ([codename, name]) {
                        devicesList.push({ 'name': name, 'codename': codename });
                    })
                    return devicesList;
                }
            },
            columns: [
                { data: 'name', className: "all" },
                { data: 'codename', className: "all" }
            ]
        });
    });
};

// Load table data from JSON file
function loadFirmwareDownloads(device, type) {
    $(document).ready(function () {
        $('#firmware').DataTable({
            responsive: true,
            responsive: {
                details: false
            },
            "pageLength": 25,
            "order": [[5, "desc"]],
            "ajax": {
                "type": "GET",
                "url": '/data/devices/' + type + '/' + device + '.json',
                dataType: 'JSON',
                "dataSrc": ""
            },
            columns: [
                { data: 'branch', className: "min-mobile-l" },
                { data: 'versions.miui', className: "all" },
                { data: 'versions.android', className: "min-mobile-p" },
                { data: 'region', className: "min-mobile-l" },
                {
                    data: 'downloads.osdn',
                    className: "all",
                    "render": function (data) {
                        return '<a href="' + data + '" target="_blank">Download</a>';
                    }
                },
                { data: 'date', className: "min-mobile-l" }
            ]
        });
    });
};

// Load latest firmware JSON file
function loadLatestFirmware() {
    $(document).ready(function () {
        fetchData();

        function fetchData() {
            var devicesList = new Array();
            $.ajax({
                url: '/data/devices/latest.json',
                async: true,
                dataType: 'JSON'
            }).done(function (json) {
                $.ajax({
                    url: '/data/firmware_devices.json',
                    async: true,
                    dataType: 'JSON'
                }).done(function (data) {
                    json.forEach(function (item) {
                        item.name = data[item.filename.split('_')[1]];
                        devicesList.push(item);
                    });
                    DrawTable(devicesList);
                })
            })
        }

        function DrawTable(data) {
            $('#firmware').DataTable({
                responsive: {
                    details: false
                },
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[6, "desc"]],
                data: data,
                columns: [
                    {
                        data: 'name',
                        defaultContent: 'Device',
                        className: "all"
                    },
                    {
                        data: 'filename',
                        className: "min-tablet-p",
                        "render": function (data) {
                            return data.split("_")[1];
                        }
                    },
                    { data: 'branch', className: "min-mobile-l" },
                    { data: 'versions.miui', className: "all" },
                    { data: 'versions.android', className: "min-mobile-p" },
                    { data: 'region', className: "min-mobile-l" },
                    {
                        data: 'downloads.osdn',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    },
                    { data: 'date', className: "min-mobile-l" }
                ]
            });
        }
    });
};

// Load miui latest downloads for a device
function loadMiuiDownloads(device) {
    $(document).ready(function () {
        var downloads = new Array();
        var codename = device;
        fetchData();
        function updateDownloads(data) {
            data.forEach(function (item) {
                if (item.codename.startsWith(codename)) {
                    downloads.push(item);
                }
            });
        }
        function fetchData() {
            var url = 'https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/';
            $.ajax({
                url: '/data/miui_codenames.json',
                async: true,
                dataType: 'JSON'
            }).done(function (data) {
                if (!(data.includes(device))) {
                    url = url + 'EOL/';
                }
                $.when(
                    $.ajax({
                        url: url + 'stable_recovery/stable_recovery.json',
                        async: true,
                        dataType: 'JSON'
                    }),
                    $.ajax({
                        url: url + 'stable_fastboot/stable_fastboot.json',
                        async: true,
                        dataType: 'JSON'
                    }),
                    $.ajax({
                        url: url + 'weekly_recovery/weekly_recovery.json',
                        async: true,
                        dataType: 'JSON'
                    }),
                    $.ajax({
                        url: url + 'weekly_fastboot/weekly_fastboot.json',
                        async: true,
                        dataType: 'JSON'
                    })).done(function (stable_recovery, stable_fastboot, weekly_recovery, weekly_fastboot) {
                        updateDownloads(stable_recovery[0]);
                        updateDownloads(stable_fastboot[0]);
                        updateDownloads(weekly_recovery[0]);
                        updateDownloads(weekly_fastboot[0]);
                        DrawTable(downloads);
                    })
            })
        }

        function DrawTable(downloads) {
            $('#miui').DataTable({
                data: downloads,
                responsive: {
                    details: false
                },
                "pageLength": 25,
                "pagingType": "full_numbers",
                "order": [[4, "desc"]],
                columns: [
                    { data: 'device', className: "min-tablet-p" },
                    {
                        data: 'version', className: "min-tablet-p",
                        "render": function (data) {
                            var type = ''
                            if (data.startsWith('V')) {
                                type = 'Stable'
                            }
                            else {
                                type = 'Weekly'
                            }
                            return type;
                        }
                    },
                    {
                        data: 'filename',
                        className: "min-mobile-l",
                        "render": function (data) {
                            var type = ''
                            if (data.endsWith('.zip')) {
                                type = 'Recovery'
                            }
                            else {
                                type = 'Fastboot'
                            }
                            return type;
                        }
                    },
                    { data: 'version', className: "all" },
                    { data: 'android', className: "min-mobile-p" },
                    {
                        data: 'download',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    },
                    { data: 'size', className: "min-mobile-l" }
                ]
            });
        };
    })
};

// Load miui latest downloads for a device
function loadLatestMiui() {
    $(document).ready(function () {
        var downloads = new Array();
        fetchData();
        function updateDownloads(data) {
            data.forEach(function (item) {
                downloads.push(item);
            });
        }
        function fetchData() {
            var url = 'https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/';
            $.when(
                $.ajax({
                    url: url + 'stable_recovery/stable_recovery.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'stable_fastboot/stable_fastboot.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'weekly_recovery/weekly_recovery.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'weekly_fastboot/weekly_fastboot.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'EOL/stable_recovery/stable_recovery.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'EOL/stable_fastboot/stable_fastboot.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'EOL/weekly_recovery/weekly_recovery.json',
                    async: true,
                    dataType: 'JSON'
                }),
                $.ajax({
                    url: url + 'EOL/weekly_fastboot/weekly_fastboot.json',
                    async: true,
                    dataType: 'JSON'
                })).done(function (stable_recovery, stable_fastboot, weekly_recovery, weekly_fastboot,
                    eol_stable_recovery, eol_stable_fastboot, eol_weekly_recovery, eol_weekly_fastboot) {
                    updateDownloads(stable_recovery[0]);
                    updateDownloads(stable_fastboot[0]);
                    updateDownloads(weekly_recovery[0]);
                    updateDownloads(weekly_fastboot[0]);
                    updateDownloads(eol_stable_recovery[0]);
                    updateDownloads(eol_stable_fastboot[0]);
                    updateDownloads(eol_weekly_recovery[0]);
                    updateDownloads(eol_weekly_fastboot[0]);
                    DrawTable(downloads);
                })
        }

        function DrawTable(downloads) {
            $('#miui').DataTable({
                data: downloads,
                responsive: {
                    details: false
                },
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[4, "desc"]],
                columns: [
                    { data: 'device', className: "all" },
                    {
                        data: 'version',
                        className: "min-tablet-p",
                        "render": function (data) {
                            var type = ''
                            if (data.startsWith('V')) {
                                type = 'Stable'
                            }
                            else {
                                type = 'Weekly'
                            }
                            return type;
                        }
                    },
                    {
                        data: 'filename',
                        className: "min-mobile-l",
                        "render": function (data) {
                            var type = ''
                            if (data.endsWith('.zip')) {
                                type = 'Recovery'
                            }
                            else {
                                type = 'Fastboot'
                            }
                            return type;
                        }
                    },
                    { data: 'version', className: "all" },
                    { data: 'android', className: "min-mobile-p" },
                    {
                        data: 'download',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    },
                    { data: 'size', className: "min-mobile-l" }
                ]
            });
        };
    })
};

// Load miui stable archive
function loadMiuiStable() {
    $(document).ready(function () {
        var downloads = [];
        fetchData();

        function fetchData() {
            $.ajax({
                url: '/data/miui_devices.json',
                async: true,
                dataType: 'JSON'
            }).done(function (names) {
                $.ajax({
                    url: 'https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-stable-archive/master/miui.json',
                    async: true,
                    dataType: 'JSON'
                }).done(function (data) {
                    data.forEach(function (items) {
                        Object.entries(items).forEach(function ([key, value]) {
                            var device = key;
                            var codename = key.split('_')[0];
                            var name = names[codename];
                            value.forEach(function (item) {
                                if (typeof item == 'object') {
                                    Object.entries(item).forEach(function ([key, value]) {
                                        var version = key;
                                        var filename = value.file;
                                        var download = value.download
                                        var android = filename.split('_').slice(-1).join().split('.zip')[0];
                                        var region
                                        if (device.includes('eea_global')) {
                                            region = 'Europe';
                                        }
                                        else if (device.includes('in_global')) {
                                            region = 'India';
                                        }
                                        else if (device.includes('ru_global')) {
                                            region = 'Russsia';
                                        }
                                        else if (device.includes('global')) {
                                            region = 'Global';
                                        }
                                        else {
                                            region = 'China';
                                        }
                                        downloads.push({
                                            'name': name, 'codename': codename, 'filename': filename,
                                            'region': region, 'version': version, 'android': android,
                                            'download': download
                                        })
                                    })
                                }
                            })
                        }
                        );
                    })
                    DrawTable(downloads);
                })
            })
        }

        function DrawTable(data) {
            $('#miui').DataTable({
                responsive: {
                    details: false
                },
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[4, "desc"]],
                data: data,
                columns: [
                    {
                        data: 'name',
                        defaultContent: 'Device',
                        className: "all"
                    },
                    { data: 'codename', className: "min-tablet-p" },
                    { data: 'version', className: "all" },
                    { data: 'region', className: "min-mobile-l" },
                    { data: 'android', className: "min-mobile-p" },
                    {
                        data: 'download',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    }
                ]
            });
        }
    });
};

// Load miui archive for a device
function loadMiuiArchive(device) {
    $(document).ready(function () {
        $('#miui').DataTable({
            responsive: {
                details: false
            },
            "pageLength": 50,
            "order": [[4, "desc"]],
            "ajax": {
                "type": "GET",
                "url": '/data/devices/full/' + device + '.json',
                "dataSrc": ""
            },
            columns: [
                { data: 'branch', className: "min-tablet-p" },
                { data: 'versions.miui', className: "all" },
                { data: 'versions.android', className: "min-mobile-p" },
                { data: 'region', className: "min-mobile-l" },
                {
                    data: 'filename', className: "all",
                    "render": function (data) {
                        var link = 'http://bigota.d.miui.com/' + data.split('_')[4] + '/' + data.match(/miui.*/)
                        return '<a href="' + link + '">Download</a>';
                    }
                },
                { data: 'date', className: "min-mobile-l" }
            ]
        });
    });
};

// Mi-Vendor-updater
function loadVendorDownloads(device, type) {
    $(document).ready(function () {
        var downloads = [];
        fetchData();

        function fetchData() {
            var devicesList = new Array();
            $.ajax({
                url: '/data/vendor_devices.json',
                async: true,
            }).done(function (names) {
                var names = names;
                $.ajax({
                    url: 'https://api.github.com/repos/TryHardDood/mi-vendor-updater/releases?per_page=200',
                    async: true,
                    dataType: 'JSON'
                }).done(function (json) {
                    var releases = [];
                    json.forEach(function (release) {
                        if (release.tag_name.startsWith(device)) {
                            if (type == 'latest') {
                                var reversed = release.assets.reverse();
                                for (let i = 0; i < reversed.length; i++) {
                                    if (reversed[i].name.match(/fw-vendor_[a-z]*(?:_[a-z]*)*?_(?:V(.*))?[0-9].*.zip/)) {
                                        releases.push([reversed[i]]);
                                        break;
                                    }
                                }
                            }
                            else if (type == 'full') {
                                releases.push(release.assets);
                            }
                        }
                    })
                    releases.forEach(function (release) {
                        release.forEach(function (item) {
                            var filename = item.name;
                            var date = item.updated_at.slice(0, 10);
                            var download = item.browser_download_url;
                            var size = humanFileSize(item.size, true);
                            var version = '';
                            if (filename.includes('miui')) {
                                version = filename.split('_')[4];
                            }
                            else {
                                version = filename.split('_').slice(-1).join().split('.zip')[0];
                            }
                            var branch = '';
                            if (version.startsWith('V')) {
                                branch = 'Stable';
                            }
                            else {
                                branch = 'Weekly';
                            }
                            var codename = download.split('/').slice(-2)[0].split('-')[0];
                            var name = names[filename.split('_')[1]];
                            var region = '';
                            if (codename.includes('eea_global')) {
                                region = 'Europe';
                            }
                            else if (codename.includes('in_global')) {
                                region = 'India';
                            }
                            else if (codename.includes('ru_global')) {
                                region = 'Russsia';
                            }
                            else if (codename.includes('global')) {
                                region = 'Global';
                            }
                            else {
                                region = 'China';
                            }
                            downloads.push({
                                'name': name, 'codename': codename, 'filename': filename,
                                'branch': branch, 'region': region, 'version': version,
                                'download': download, 'size': size, 'date': date
                            })
                        })
                    })
                    DrawTable(downloads);
                })
            })
        }

        function DrawTable(data) {
            $('#vendor').DataTable({
                responsive: {
                    details: false
                },
                "pageLength": 25,
                "pagingType": "full_numbers",
                "order": [[6, "desc"]],
                data: data,
                columns: [
                    {
                        data: 'name',
                        defaultContent: 'Device',
                        className: "all"
                    },
                    { data: 'branch', className: "min-tablet-p" },
                    { data: 'version', className: "all" },
                    { data: 'region', className: "min-mobile-l" },
                    {
                        data: 'download',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data + '" target="_blank">Download</a>';
                        }
                    },
                    { data: 'size', className: "min-mobile-l" },
                    { data: 'date', className: "min-mobile-l" }
                ]
            });
        }
    });
};

// human file size converter
// https://stackoverflow.com/a/14919494
function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
}