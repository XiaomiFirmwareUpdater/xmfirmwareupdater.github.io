function switchROM(evt, ROM) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(ROM).style.display = "block";
  evt.currentTarget.className += " active";
}

// Load table data from JSON files
function loadtable(branch) {
  $.when(
    $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/' + branch + '/' + branch + '.json', function (data) {
      var latest = data;
    }),
    $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/' + branch + '/' + branch + '.json', function (data) {
      var eol = data;
    })
  ).then(function (latest, eol) {
    var dataSet = latest[0].concat(eol[0]);
    $(document).ready(function () {
      $('#' + branch).DataTable({
        data: dataSet,
        responsive: true,
        "pageLength": 25,
        "order": [[1, "asc"]],
        columns: [
          { data: 'device' },
          { data: 'codename' },
          { data: 'version' },
          { data: 'android' },
          {
            data: 'download',
            "render": function (data) {
              return '<a href="' + data + '">Download</a>';
            }
          },
          { data: 'size' }
        ]
      });
    });
  });
};

// Get the element with id="defaultOpen" and click on it
window.onload = function () { document.getElementById("defaultOpen").click() }
