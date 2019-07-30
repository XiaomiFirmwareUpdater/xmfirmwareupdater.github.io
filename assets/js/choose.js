// Load devices
var firmwareDevicesList = [];
$.getJSON("data/firmware_devices.json", function (response) {
    response.forEach(function (item) {
        name = item.name + ' (' + item.codename + ')',
            codename = item.codename,
            firmwareDevicesList.push({ text: name, id: codename })
    });
});
var vendorDevicesList = [];
$.getJSON("data/vendor_devices.json", function (response) {
    response.forEach(function (item) {
        name = item.name + ' (' + item.codename + ')',
            codename = item.codename,
            vendorDevicesList.push({ text: name, id: codename })
    });
});
var miuiDevicesList = [];
$.getJSON("data/miui_devices.json", function (response) {
    response.forEach(function (item) {
        name = item.name + ' (' + item.codename + ')',
            codename = item.codename,
            miuiDevicesList.push({ text: name, id: codename })
    });
});

// Change device menu based on download type
function deviceMenu() {
    var radio = document.getElementsByName('request');
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            var request = radio[i].value
        }
    };
    if (request == 'firmware') {
        console.log(request);
        $('.device').empty();
        $(".device").select2({
            data: firmwareDevicesList,
        })
    }
    else if (request == 'vendor') {
        $('.device').empty();
        $(".device").select2({
            data: vendorDevicesList,
        })
    }
    else if (request == 'miui') {
        $('.device').empty();
        $(".device").select2({
            data: miuiDevicesList
        })
    }
};


// Devices select2 box
$(document).ready(function () {
    $(".device").select2({
        placeholder: "- Device -",
        data: firmwareDevicesList,
    })
});


// Process to download page
function choicesParser() {
    var form = document.getElementById("DownloadForm").elements;
    var request = form.request.value;
    var device = form.device.value;
    if (device != '') {
        window.location.href = window.location.origin + "/" + request + "/" + device;
    }
    else {
        $('#NoDeviceError').modal('toggle');
    };
    return false;
};
