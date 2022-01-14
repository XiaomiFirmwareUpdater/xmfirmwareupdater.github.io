// Load latest miui china beta downloads
function loadMiuiChinaBeta(miui_version) {
  $(document).ready(function () {
    $("#miui").DataTable({
      responsive: true,
      responsive: {
        details: false,
      },
      pageLength: 50,
      order: [[5, "desc"]],
      ajax: {
        type: "GET",
        url: "/data/devices/" + miui_version + ".yml",
        converters: {
          "text yaml": function (result) {
            return jsyaml.load(result);
          },
        },
        dataType: "yaml",
        dataSrc: "",
      },
      columns: [
        {
          data: "name",
          defaultContent: "Device",
          className: "all",
        },
        { data: "codename", className: "min-mobile-l" },
        {
          // branch
          data: "version",
          className: "min-mobile-l",
          render: function (data) {
            return parseInt(data[0])
              ? "Weekly"
              : /\.DEV$/.test(data)
              ? "Public Beta"
              : "Stable";
          },
        },
        { data: "version", className: "all" },
        { data: "android", className: "min-mobile-l" },
        {
          data: {},
          className: "all",
          render: function (data) {
            return (
              '<a href="/miui/' +
              data.codename.split("_")[0] +
              '/">Download</a>'
            );
          },
        },
        { data: "date", className: "min-mobile-l" },
      ],
    });
  });
}
