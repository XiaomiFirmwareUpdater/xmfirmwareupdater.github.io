// Load devices
var firmwareDevicesList = [];
var vendorDevicesList = [];
var miuiDevicesList = [];
$(document).ready(function () {
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
            url: '/data/vendor_devices.yml',
            async: true,
            converters: {
                'text yaml': function (result) {
                    return jsyaml.load(result);
                }
            },
            dataType: 'yaml'
        }),
        $.ajax({
            url: '/data/miui_devices.yml',
            async: true,
            converters: {
                'text yaml': function (result) {
                    return jsyaml.load(result);
                }
            },
            dataType: 'yaml'
        })
    ).done(function (firmware_devices, vendor_devices, miui_devices) {
        Object.entries(firmware_devices[0]).forEach(
            ([codename, name]) => firmwareDevicesList.push({ text: name + ' (' + codename + ')', id: codename })
        );
        Object.entries(vendor_devices[0]).forEach(
            ([codename, name]) => vendorDevicesList.push({ text: name + ' (' + codename + ')', id: codename })
        );
        Object.entries(miui_devices[0]).forEach(
            ([codename, name]) => miuiDevicesList.push({ text: name + ' (' + codename + ')', id: codename })
        );
        $(".device").select2({
            placeholder: "- Device -",
            data: firmwareDevicesList,
        })
    })
})

// Change device menu based on download type
function deviceMenu() {
    var radio = document.getElementsByName('request');
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            var request = radio[i].value
        }
    };
    if (request == 'firmware') {
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

// Process to download page
function choicesParser() {
    var form = document.getElementById("DownloadForm").elements;
    var request = form.request.value;
    var type = form.type.value;
    var device = form.device.value;
    if (device != '') {
        if (type == 'archive') {
            window.location.href = window.location.origin + "/archive/" + request + "/" + device;
        }
        else {
            window.location.href = window.location.origin + "/" + request + "/" + device;
        }
    }
    else {
        $('#NoDeviceError').modal('toggle');
    };
    return false;
};
