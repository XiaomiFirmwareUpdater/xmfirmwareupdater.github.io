$(document).ready(function () {
    $.ajax({
        url: '/releases.xml',
        async: true,
        dataType: "xml",
    }).done(function (xml) {
        list = "";
        x = xml.getElementsByTagName("title");
        for (i = 1; i < 8; i++) {
            var release = x[i].childNodes[0].nodeValue;
            var codename = release.split('(')[1].split(')')[0];
            list += "<li><a href='/firmware/" + codename + "'>" + release + "</a></li>";
        }
        document.getElementById("releases").innerHTML = list;
    })
}); 
