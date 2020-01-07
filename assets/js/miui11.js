// Load latest miui 11 china beta downloads
function loadMiuiChinaBeta() {
    $(document).ready(function () {
        $('#miui').DataTable({
            responsive: true,
            responsive: {
                details: false
            },
            "pageLength": 50,
            "order": [[5, "desc"]],
            "ajax": {
                "type": "GET",
                "url": '/data/devices/miui11.yml',
                converters: {
                    'text yaml': function (result) {
                        return jsyaml.load(result);
                    }
                },
                dataType: 'yaml',
                "dataSrc": ""
            },
            columns: [
                {
                    data: 'name',
                    defaultContent: 'Device',
                    className: "all"
                },
                { data: 'codename', className: "min-mobile-l" },
                { data: 'version', className: "all" },
                { data: 'android', className: "min-mobile-l" },
                {
                    data: 'download',
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
