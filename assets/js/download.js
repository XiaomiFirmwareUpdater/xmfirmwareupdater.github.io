async function getUrlVars() {
    // https://html-online.com/articles/get-url-parameters-javascript/
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

async function generate_link(filename, branch, version, codename) {
    var link = 'https://osdn.net/frs/redir.php?m=auto&f=/storage/g/x/xi/xiaomifirmwareupdater/';
    if (branch == 'Stable') {
        link += 'Stable/';
        link += version.split('.')[0] + '/';
    }
    else if (branch == 'Weekly') {
        if (version.startsWith('8.')) {
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
        } else {
            link += 'Developer/';
            link += version + '/';
        }
    }
    link += codename + '/' + filename;
    return link
}

async function startDownload(download, filename) {
    setTimeout(
        function () {
            link = document.createElement("a");
            link.setAttribute("href", download);
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }, 5000);
}


$(document).ready(async function () {
    vars = await getUrlVars();
    if ($.isEmptyObject(vars)) {
        window.location.href = window.location.origin + '#download';
    }
    history.pushState(window.location.href, null, window.location.origin + window.location.pathname);
    var filename = vars.file;
    var codename = filename.split('_')[1];
    var device = filename.split('_')[3];
    var version = filename.split('_')[4];
    var android = filename.split('_').slice(-1).join().split('.zip')[0];
    var branch;
    if (version.startsWith('V')) {
        branch = 'Stable';
    }
    else {
        branch = 'Weekly';
    }
    var region;
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
    else if (device.includes('Global')) {
        region = 'Global';
    }
    else {
        region = 'China';
    }
    var download = await generate_link(filename, branch, version, codename);
    $('#device').text(device);
    $('#codename').text(codename);
    $('#branch').text(branch);
    $('#region').text(region);
    $('#miui').text(version);
    $('#android').text(android);
    await startDownload(download, filename);
});
