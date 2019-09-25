// Load supported devices from YAML file
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
                "url": '/data/' + type + '_devices.yml',
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml',
                "dataSrc": function (yml) {
                    var devicesList = [];
                    Object.entries(yml).forEach(function ([codename, name]) {
                        devicesList.push({ 'name': name, 'codename': codename });
                    })
                    return devicesList;
                }
            },
            columns: [
                { data: 'name', className: "all" },
                {
                    data: 'codename', className: "all",
                    "render": function (data) {
                        return '<a href="/' + type + '/' + data + '">' + data + '</a>';
                    }
                }
            ]
        });
    });
};

// Load table data from YAML file
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
                "url": '/data/devices/' + type + '/' + device + '.yml',
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml',
                "dataSrc": ""
            },
            columns: [
                { data: 'branch', className: "min-mobile-l" },
                { data: 'versions.miui', className: "all" },
                { data: 'versions.android', className: "min-mobile-p" },
                { data: 'region', className: "min-mobile-l" },
                {
                    data: {},
                    className: "all",
                    "render": function (data) {
                        return "<form class='form-control-plaintext' style='padding: 0;'>"
                            + "<a href='#' style='-webkit-appearance: inherit;' type='submit' onclick='redirect(\""
                            + data.filename
                            + "\"); return false;'>Download</a></form>";
                    }
                },
                { data: 'date', className: "min-mobile-l" }
            ]
        });
    });
};

// Load latest firmware YAML file
function loadLatestFirmware() {
    $(document).ready(function () {
        fetchData();

        function fetchData() {
            var devicesList = new Array();
            $.ajax({
                url: '/data/devices/latest.yml',
                async: true,
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml'
            }).done(function (yml) {
                $.ajax({
                    url: '/data/firmware_devices.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }).done(function (data) {
                    yml.forEach(function (item) {
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
                        data: {},
                        className: "all",
                        "render": function (data) {
                            return "<form class='form-control-plaintext' style='padding: 0;'>"
                                + "<a href='#' style='-webkit-appearance: inherit;' type='submit' onclick='redirect(\""
                                + data.filename
                                + "\"); return false;'>Download</a></form>";
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
                url: '/data/miui_codenames.yml',
                async: true,
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml'
            }).done(function (data) {
                if (!(data.includes(device))) {
                    url = url + 'EOL/';
                }
                $.when(
                    $.ajax({
                        url: url + 'stable_recovery/stable_recovery.yml',
                        async: true,
                        converters: {
                            'text yaml': function (result) {
                                return jsyaml.load(result);
                            }
                        },
                        dataType: 'yaml'
                    }),
                    $.ajax({
                        url: url + 'stable_fastboot/stable_fastboot.yml',
                        async: true,
                        converters: {
                            'text yaml': function (result) {
                                return jsyaml.load(result);
                            }
                        },
                        dataType: 'yaml'
                    }),
                    $.ajax({
                        url: url + 'weekly_recovery/weekly_recovery.yml',
                        async: true,
                        converters: {
                            'text yaml': function (result) {
                                return jsyaml.load(result);
                            }
                        },
                        dataType: 'yaml'
                    }),
                    $.ajax({
                        url: url + 'weekly_fastboot/weekly_fastboot.yml',
                        async: true,
                        converters: {
                            'text yaml': function (result) {
                                return jsyaml.load(result);
                            }
                        },
                        dataType: 'yaml'
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
                columnDefs: [
                    { type: 'file-size', targets: 6 }
                ],
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
                    {
                        data: 'size',
                        className: "min-mobile-l",
                        "render": function (data) {
                            if (data.endsWith('G')) {
                                return data.replace('G', ' GB');
                            }
                            else if (data.endsWith('M')) {
                                return data.replace('M', ' MB');
                            }
                            else {
                                return data;
                            }
                        }
                    }
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
                    url: url + 'stable_recovery/stable_recovery.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'stable_fastboot/stable_fastboot.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'weekly_recovery/weekly_recovery.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'weekly_fastboot/weekly_fastboot.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'EOL/stable_recovery/stable_recovery.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'EOL/stable_fastboot/stable_fastboot.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'EOL/weekly_recovery/weekly_recovery.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'EOL/weekly_fastboot/weekly_fastboot.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
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
                columnDefs: [
                    { type: 'file-size', targets: 6 }
                ],
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
                    {
                        data: 'size',
                        className: "min-mobile-l",
                        "render": function (data) {
                            if (data.endsWith('G')) {
                                return data.replace('G', ' GB');
                            }
                            else if (data.endsWith('M')) {
                                return data.replace('M', ' MB');
                            }
                            else {
                                return data;
                            }
                        }
                    }
                ]
            });
        };
    })
};

// Load miui archive downloads for a device
function loadMiuiArchive(device) {
    $(document).ready(function () {
        var downloads = new Array();
        var devices = new Array();
        fetchData();
        function updateDownloads(data) {
            Object.entries(data).forEach(function (item) {
                Object.entries(item[1]).forEach(function ([key, value]) {
                    var full_codename = key;
                    var codename = key.split('_')[0];
                    var name = devices[codename];
                    if (full_codename.startsWith(device)) {
                        Object.entries(value).forEach(function ([rom, link]) {
                            var version = rom;
                            var download = link;
                            var filename = download.split('/').slice(-1).join();
                            if (filename.endsWith('.zip')) {
                                var android = filename.split('_').slice(-1).join().split('.zip')[0];
                            }
                            else {
                                var android = filename.match(/_[0-9].[0-9]_/)[0].split('_')[1];
                            }
                            var region;
                            if (full_codename.includes('eea_global')) {
                                region = 'Europe';
                            }
                            else if (full_codename.includes('in_global')) {
                                region = 'India';
                            }
                            else if (full_codename.includes('ru_global')) {
                                region = 'Russia';
                            }
                            else if (full_codename.includes('global')) {
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
            });
        }
        function fetchData() {
            var url = 'https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/archive/';
            $.when(
                $.ajax({
                    url: '/data/miui_devices.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'stable_recovery/stable_recovery.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'stable_fastboot/stable_fastboot.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'weekly_recovery/weekly_recovery.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: url + 'weekly_fastboot/weekly_fastboot.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                })).done(function (names, stable_recovery, stable_fastboot, weekly_recovery, weekly_fastboot) {
                    devices = names[0];
                    updateDownloads(stable_recovery[0]);
                    updateDownloads(stable_fastboot[0]);
                    updateDownloads(weekly_recovery[0]);
                    updateDownloads(weekly_fastboot[0]);
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
                "order": [[5, "desc"]],
                columns: [
                    {
                        data: 'name',
                        defaultContent: 'Device',
                        className: "all"
                    },
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
                    { data: 'region', className: "min-mobile-l" },
                    { data: 'version', className: "all" },
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
        };
    })
};

// Mi-Vendor-updater
function loadVendorDownloads(device, type) {
    $(document).ready(function () {
        $('#vendor').DataTable({
            responsive: true,
            responsive: {
                details: false
            },
            "pageLength": 25,
            "order": [[5, "desc"]],
            "ajax": {
                "type": "GET",
                "url": '/data/vendor/' + type + '/' + device + '.yml',
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml',
                "dataSrc": ""
            },
            columnDefs: [
                { type: 'file-size', targets: 4 }
            ],
            columns: [
                { data: 'branch', className: "min-mobile-l" },
                { data: 'versions.miui', className: "all" },
                { data: 'region', className: "min-mobile-l" },
                {
                    data: 'downloads',
                    className: "all",
                    "render": function (data) {
                        return '<a href="' + data.github + '" target="_blank">GitHub</a> | <a href="' + data.sf + '" target="_blank">SF</a>';
                    }
                },
                { data: 'size', className: "min-mobile-l" },
                { data: 'date', className: "min-mobile-l" }
            ]
        });
    });
};

function loadLatestVendor() {
    $(document).ready(function () {
        fetchData();

        function fetchData() {
            var devicesList = new Array();
            $.ajax({
                url: '/data/vendor/latest.yml',
                async: true,
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml'
            }).done(function (yml) {
                $.ajax({
                    url: '/data/vendor_devices.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }).done(function (data) {
                    yml.forEach(function (item) {
                        item.name = data[item.filename.split('_')[1]];
                        devicesList.push(item);
                    });
                    DrawTable(devicesList);
                })
            })
        }

        function DrawTable(data) {
            $('#vendor').DataTable({
                responsive: {
                    details: false
                },
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[6, "desc"]],
                data: data,
                columnDefs: [
                    { type: 'file-size', targets: 5 }
                ],
                columns: [
                    {
                        data: 'name',
                        defaultContent: 'Device',
                        className: "all"
                    },
                    { data: 'branch', className: "min-mobile-l" },
                    { data: 'versions.miui', className: "all" },
                    { data: 'region', className: "min-mobile-l" },
                    {
                        data: 'downloads',
                        className: "all",
                        "render": function (data) {
                            return '<a href="' + data.github + '" target="_blank">GitHub</a> | <a href="' + data.sf + '" target="_blank">SF</a>';
                        }
                    },
                    { data: 'size', className: "min-mobile-l" },
                    { data: 'date', className: "min-mobile-l" }
                ]
            });
        }
    });
};

function redirect(filename) {
    window.location.href = "/download?file=" + filename;
}

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
