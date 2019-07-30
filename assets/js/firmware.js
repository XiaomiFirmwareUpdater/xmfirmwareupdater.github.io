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
                "pagingType": "full_numbers",
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