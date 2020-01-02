// Load latest miui 11 china beta downloads
function loadMiuiChinaBeta() {
    $(document).ready(function () {
        var codenames = ["begonia", "cactus", "cepheus", "cereus", "chiron", "crux", "davinci",
            "dipper", "equuleus", "ginkgo", "grus", "jason", "lavender", "laurus", "lotus", "nitrogen",
            "perseus", "platina", "phoenix", "polaris", "pyxis", "raphael", "sagit", "sakura", "sirius",
            "tucana", "ursa", "vela", "violet", "wayne", "whyred"];
        var devices;
        var downloads = new Array();
        fetchData();
        function updateDownloads(full) {
            full.forEach(function (item) {
                var codename = item.filename.split('_')[1];
                if (codenames.includes(codename)) {
                    if (item.branch == "weekly") {
                        var name = devices[codename];
                        var date = item.date;
                        var date_array = date.split('-');
                        if (date_array[0] == 2019 && date_array[1] >= 10 || date_array[0] >= 2020) {
                            var filename = item.filename.split('_').slice(2).join('_');
                            var version = item.versions.miui;
                            var download = "https://bigota.d.miui.com/" + version + "/" + filename;
                            downloads.push({
                                'name': name, 'codename': codename, 'date': date,
                                'version': version, 'android': item.versions.android, 'download': download
                            });
                        }
                    }
                }
            });
        }

        function fetchData() {
            $.when(
                $.ajax({
                    url: '/data/firmware_devices.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                }),
                $.ajax({
                    url: '/data/devices/full.yml',
                    async: true,
                    converters: {
                        'text yaml': function (result) {
                            return jsyaml.load(result);
                        }
                    },
                    dataType: 'yaml'
                })).done(function (names, full) {
                    devices = names[0];
                    updateDownloads(full[0]);
                    DrawTable(downloads);
                })
        }

        function DrawTable(downloads) {
            $('#miui').DataTable({
                responsive: {
                    details: false
                },
                "pageLength": 50,
                "pagingType": "full_numbers",
                "order": [[5, "desc"]],
                data: downloads,
                columnDefs: [
                    { type: 'date-eu', targets: 5 }
                ],
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
        }
    });
};
