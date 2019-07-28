
// Select2 boxes in index
$(document).ready(function () {
    $('.select2').select2();
});

// Load devices
var devicesList = [];
$.getJSON("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/xiaomifirmwareupdater.github.io/master/data/devices.json", function (response) {
    response.forEach(function (item) {
        name = item.name + ' (' + item.codename + ')',
            codename = item.codename,
            devicesList.push({ text: name, id: codename })
    });
});

// Devices select2 box
$(document).ready(function () {
    $(".devices").select2({
        data: devicesList
    })
});

// choicesParses
function choicesParses() {
    document.getElementById("DownloadForm").submit();
}