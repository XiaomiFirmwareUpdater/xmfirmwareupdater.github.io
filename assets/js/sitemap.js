$(document).ready(function () {
    $.ajax({
        url: '/sitemap.xml',
        async: true,
        dataType: "xml",
    }).done(function (xml) {
        list = "";
        x = xml.getElementsByTagName("loc");
        for (i = 1; i < x.length; i++) {
            var url = x[i].childNodes[0].nodeValue;
            var path = url.split('/').slice(3, -1).join('/');
            list += "<li><a href='" + url + "'>/" + path + "/</a></li>";
        }
        document.getElementById("sitemap").innerHTML = list;
    })
}); 
