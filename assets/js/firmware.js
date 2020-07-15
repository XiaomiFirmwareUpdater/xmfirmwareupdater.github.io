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
                "order": [[7, "desc"]],
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
function loadMiuiDownloads() {
    $(document).ready(function () {
        $('#miui').DataTable({
            responsive: {
                details: false
            },
            "pageLength": 25,
            "pagingType": "full_numbers",
            "order": [[6, "desc"]],
            columnDefs: [{ type: 'file-size', targets: 5 }],
            columns: [
                { data: 'device', className: "all" },
                { data: 'branch', className: "min-tablet-p" },
                { data: 'type', className: "min-mobile-l" },
                { data: 'version', className: "all" },
                { data: 'android', className: "min-mobile-p" },
                { data: 'size', className: "min-mobile-l" },
                { data: 'date', className: "min-mobile-l" },
                { data: 'download', className: "all" }
            ]
        });
    })
};

// Load miui latest downloads for a device
function loadLatestMiui() {
    $(document).ready(function () {
        $('#miui').DataTable({
            responsive: true,
            responsive: {
                details: false
            },
            "pageLength": 100,
            "pagingType": "full_numbers",
            "order": [[6, "desc"]],
            "ajax": {
                "type": "GET",
                "url": 'https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/V3/data/latest.yml',
                converters: {
                    'text yaml': function (result) {
                        let schema = jsyaml.Schema.create(jsyaml.CORE_SCHEMA, []);
                        return jsyaml.safeLoad(result, { schema: schema });
                    }
                },
                dataType: 'yaml',
                "dataSrc": ""
            },
            columns: [
                { data: 'name', className: "all" },
                { data: 'branch', className: "min-tablet-p" },
                { data: 'method', className: "min-mobile-l" },
                { data: 'version', className: "all" },
                { data: 'android', className: "min-mobile-p" },
                { data: 'size', className: "min-mobile-l" },
                { data: 'date', className: "min-mobile-l" },
                {
                    data: {},
                    className: "all",
                    "render": function (data) {
                        return '<a href="/miui/' + data.codename.split('_')[0] + '/' + data.branch.toLowerCase() + '/' + data.version + '/">Download</a>';
                    }
                }
            ]
        });
    });
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
