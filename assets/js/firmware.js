// Load table data from JSON file
function loadFirmwareDownloads(device, type) {
    $.when(
        $.getJSON('/data/devices/'+ type +'/' + device + '.json', function (data) {
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
