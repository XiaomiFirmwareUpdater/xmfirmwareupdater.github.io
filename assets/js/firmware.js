// Load table data from JSON file
function loadFirmwareDownloads(device, type) {
    $.when(
        $.getJSON('/data/devices/' + type + '/' + device + '.json', function (data) {
            var latest = data;
        })
    ).then(function (latest) {
        $(document).ready(function () {
            $('#firmware').DataTable({
                data: latest,
                responsive: true,
                "pageLength": 25,
                "order": [[4, "desc"]],
                columns: [
                    { data: 'branch' },
                    { data: 'versions.miui' },
                    { data: 'versions.android' },
                    { data: 'region' },
                    { data: 'date' },
                    {
                        data: 'downloads.osdn',
                        "render": function (data) {
                            return '<a href="' + data + '">Download</a>';
                        }
                    }
                ]
            });
        });
    });
};

// Load latest firmware JSON file
function loadLatest() {
    // Load devices
    var devicesList = [];
    $.getJSON("/data/firmware_devices.json", function (response) {
        response.forEach(function (item) {
            device_name = item.name,
                device_codename = item.codename,
                devicesList.push({ name: device_name, codename: device_codename })
        });
    });
    $.when(
        $.getJSON('/data/devices/latest.json', function (data) {
            var latest = data;
        })
    ).then(function (latest) {
        $(document).ready(function () {
            $('#firmware').DataTable({
                data: latest,
                responsive: true,
                "pageLength": 100,
                "pagingType": "full_numbers",
                "order": [[6, "desc"]],
                columns: [
                    {
                        data: 'filename',
                        "render": function (data) {
                            var deviceCount = devicesList.length;
                            while (deviceCount--) {
                                if (devicesList[deviceCount].codename === data.split("_")[1]) {
                                    var name = devicesList[deviceCount].name;
                                    break;
                                }
                            }
                            return name;
                        },
                        defaultContent: 'Device'
                    },
                    {
                        data: 'filename',
                        "render": function (data) {
                            return data.split("_")[1];
                        }
                    },
                    { data: 'branch' },
                    { data: 'versions.miui' },
                    { data: 'versions.android' },
                    { data: 'region' },
                    { data: 'date' },
                    {
                        data: 'downloads.osdn',
                        "render": function (data) {
                            return '<a href="' + data + '">Download</a>';
                        }
                    }
                ]
            });
        });
    });
};

// Load miui latest downloads for a device
function loadMiuiDownloads(device) {
    var downloads = [];
    var url = 'https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/';
    $.getJSON(url + 'stable_recovery/stable_recovery.json', function (data) {
        data.forEach(function (item) {
            if (item.codename.includes(device)) {
                downloads.push(item);
            }
        });
    }),
        $.getJSON(url + 'stable_fastboot/stable_fastboot.json', function (data) {
            data.forEach(function (item) {
                if (item.codename.includes(device)) {
                    downloads.push(item);
                }
            });
        }),
        $.getJSON(url + 'weekly_recovery/weekly_recovery.json', function (data) {
            data.forEach(function (item) {
                if (item.codename.includes(device)) {
                    downloads.push(item);
                }
            });
        }),
        $.getJSON(url + 'weekly_fastboot/weekly_fastboot.json', function (data) {
            data.forEach(function (item) {
                if (item.codename.includes(device)) {
                    downloads.push(item);
                }
            });
        }),
        $(document).ready(function () {
            $('#firmware').DataTable({
                data: downloads,
                responsive: true,
                "pageLength": 25,
                "order": [[3, "desc"]],
                columns: [
                    { data: 'device' },
                    /* {
                    data: 'codename',
                    "render": function (data) {
                        return data.split("_")[0];
                    }
                    }, */
                    {
                        data: 'version',
                        "render": function (data) {
                            var type = ''
                            if (data.includes('V')) {
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
                        "render": function (data) {
                            var type = ''
                            if (data.includes('.zip')) {
                                type = 'Recovery'
                            }
                            else {
                                type = 'Fastboot'
                            }
                            return type;
                        }
                    },
                    { data: 'version' },
                    { data: 'android' },
                    {
                        data: 'download',
                        "render": function (data) {
                            return '<a href="' + data + '">Download</a>';
                        }
                    },
                    { data: 'size' }
                ]
            });
        });
};