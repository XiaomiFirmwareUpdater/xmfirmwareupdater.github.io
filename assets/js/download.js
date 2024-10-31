async function getUrlVars() {
    // https://html-online.com/articles/get-url-parameters-javascript/
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

async function generate_link(filename, branch, version, codename) {
    let link
    await $.ajax({
        url: '/data/devices/full/' + codename + '.yml',
        async: true,
        converters: {
            'text yaml': function (result) {
                return jsyaml.load(result);
            }
        },
        dataType: 'yaml'
    }).done(function (data) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].filename == filename) {
                link = data[i].downloads.github;
                break;
            }
        }
    })
    return link
}

async function startDownload(download, filename) {
    setTimeout(
        function () {
            const link = document.createElement("a");
            link.setAttribute("href", download);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }, 5000);
}


$(document).ready(async function () {
    const vars = await getUrlVars();
    if ($.isEmptyObject(vars)) {
        window.location.href = window.location.origin + '#download';
    }
    history.pushState(window.location.href, null, window.location.origin + window.location.pathname);
    const filename = vars.file;
    let codename, device, version, android;
    if (filename.includes("-OS2.")) {
        // fw_dada_dada-ota_full-OS2.0.12.0.VOCCNXM-user-15.0-5b863df2e2.zip
        let parts = filename.split("-");
        codename = parts[0].split("_")[1];
        device = parts[0].split("_")[2];
        version = parts[2];
        android = parts[parts.length - 2];
    } else {
        // fw_water_miui_WATERINGlobal_V14.0.18.0.TGOINXM_95e49b28fb_13.0.zip
        let parts = filename.split("_");
        codename = parts[1];
        device = parts[3];
        version = parts[parts.length - 3];
        android = parts[parts.length - 1].split(".zip")[0];
    }
    let branch;
    if (version.startsWith('V')) {
        branch = 'Stable';
    }
    else {
        branch = 'Weekly';
    }
    let region;
    if (device.includes('EEAGlobal')) {
        region = 'Europe';
    }
    else if (device.includes('INGlobal')) {
        region = 'India';
    }
    else if (device.includes('IDGlobal')) {
        region = 'Indonesia';
    }
    else if (device.includes('RUGlobal')) {
        region = 'Russia';
    }
    else if (device.includes('TRGlobal')) {
        region = 'Turkey';
    }
    else if (device.includes('TWGlobal')) {
        region = 'Taiwan';
    }
    else if (device.includes('JPGlobal')) {
        region = 'Japan';
    }
    else if (device.includes('KRGlobal')) {
        region = 'South Korea';
    }
    else if (device.includes('Global')) {
        region = 'Global';
    }
    else {
        region = 'China';
    }
    const download = await generate_link(filename, branch, version, codename);
    $('#device').text(device);
    $('#codename').text(codename);
    $('#branch').text(branch);
    $('#region').text(region);
    $('#miui').text(version);
    $('#android').text(android);
    await startDownload(download, filename);
});
