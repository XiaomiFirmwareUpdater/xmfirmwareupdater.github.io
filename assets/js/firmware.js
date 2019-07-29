// Load table data from JSON file
function loadLatest(device) {
    $.when(
        $.getJSON('/data/devices/latest/' + device + '.json', function (data) {
            var latest = data;
        })
    ).then(function (latest) {
        $(document).ready(function () {
            $('#firmware').DataTable({
                data: latest,
                responsive: true,
                "pageLength": 10,
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
