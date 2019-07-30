// Load devices
var devicesList = [];
$.getJSON("data/devices.json", function (response) {
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


// Process to download page
function choicesParser() {
    var form = document.getElementById("DownloadForm").elements;
    var request = form.request.value;
    var device = form.device.value;
    if (device != '- Device -') {        
    window.location.href = window.location.origin + "/" + request + "/" + device;
    }
    else {
        $('#NoDeviceError').modal('toggle');
    };
    return false;
};
