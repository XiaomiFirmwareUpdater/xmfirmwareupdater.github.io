
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
    $(".device").select2({
        data: devicesList
    })
});

// Parse URL
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

// Process to download page
function choicesParses() {
    document.getElementById("DownloadForm").submit();
    var vars = getUrlVars();
    var site = window.location.origin;
    window.location.href = site + "/" + vars.request + "/" + vars.device + "/" + vars.branch + "/" + vars.region;
}