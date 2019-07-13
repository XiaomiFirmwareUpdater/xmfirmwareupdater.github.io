---
title: Latest MIUI Official ROMs
layout: miui
permalink: /miui/
---

<p><b>Note: </b>All files listed here are from Xiaomi servers. It's not owned, modified or edited by Xiaomi Firmware Updater.</p>
<!-- Tab links -->
<div class="tab">
   <button class="tablinks" onclick="switchROM(event, 'stable_recovery')">Stable Recovery</button>
   <button class="tablinks" onclick="switchROM(event, 'stable_fastboot')">Stable Fastboot</button>
   <button class="tablinks" onclick="switchROM(event, 'weekly_recovery')">Weekly Recovery</button>
   <button class="tablinks" onclick="switchROM(event, 'weekly_fastboot')">Weekly Fastboot</button>
</div>
<!-- Tab content -->
<div id="stable_recovery" class="tabcontent">
<script>
   $.when(
      $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_recovery/stable_recovery.json', function(data) {
         var latest = data;
      }),
      $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/stable_recovery/stable_recovery.json', function(data) {
         var eol = data;
      })
   ).then(function(latest, eol) {
      var data = latest[0].concat(eol[0]);
      $.each(data, function(i, item) {
         var info_tblRow = "<tr>" + "<td style=\"text-align: left\">" + item.device + "</td>" +
            "<td style=\"text-align: left\">" + item.codename + "</td>" +
            "<td style=\"text-align: left\">" + item.version + "</td>" +
            "<td style=\"text-align: left\">" + item.android + "</td>" +
            "<td style=\"text-align: left\">" + "<a href=" + item.download + ">Download</a>" + "</td>" +
            "<td style=\"text-align: left\">" + item.size + "</td>" + "</tr>"
            $(info_tblRow).appendTo("#stable_recovery tbody");
      });
   });
   </script>
   <table id="stable_recovery" border="1">
      <thead>
         <th style="text-align: center">Device</th>
         <th style="text-align: center">Codename</th>
         <th style="text-align: center">Version</th>
         <th style="text-align: center">Android</th>
         <th style="text-align: center">Link</th>
         <th style="text-align: center">Size</th>
      </thead>
      <tbody>
      </tbody>
   </table>
</div>
<div id="stable_fastboot" class="tabcontent">
   <script>
      $.when(
         $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_fastboot/stable_fastboot.json', function(data) {
            var latest = data;
         }),
         $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/stable_fastboot/stable_fastboot.json', function(data) {
            var eol = data;
         })
      ).then(function(latest, eol) {
         var data = latest[0].concat(eol[0]);
         $.each(data, function(i, item) {
            var info_tblRow = "<tr>" + "<td style=\"text-align: left\">" + item.device + "</td>" +
               "<td style=\"text-align: left\">" + item.codename + "</td>" +
               "<td style=\"text-align: left\">" + item.version + "</td>" +
               "<td style=\"text-align: left\">" + item.android + "</td>" +
               "<td style=\"text-align: left\">" + "<a href=" + item.download + ">Download</a>" + "</td>" +
               "<td style=\"text-align: left\">" + item.size + "</td>" +
               "<td style=\"text-align: left\">" + item.md5 + "</td>" + "</tr>"
               $(info_tblRow).appendTo("#stable_fastboot tbody");
         });
      });
   </script>
   <table id="stable_fastboot" border="1">
      <thead>
         <th style="text-align: center">Device</th>
         <th style="text-align: center">Codename</th>
         <th style="text-align: center">Version</th>
         <th style="text-align: center">Android</th>
         <th style="text-align: center">Link</th>
         <th style="text-align: center">Size</th>
         <th style="text-align: center">MD5</th>
      </thead>
      <tbody>
      </tbody>
   </table>
</div>
<div id="weekly_recovery" class="tabcontent">
   <script>
      $.when(
         $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_recovery/weekly_recovery.json', function(data) {
            var latest = data;
         }),
         $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/weekly_recovery/weekly_recovery.json', function(data) {
            var eol = data;
         })
      ).then(function(latest, eol) {
         var data = latest[0].concat(eol[0]);
         $.each(data, function(i, item) {
            var info_tblRow = "<tr>" + "<td style=\"text-align: left\">" + item.device + "</td>" +
               "<td style=\"text-align: left\">" + item.codename + "</td>" +
               "<td style=\"text-align: left\">" + item.version + "</td>" +
               "<td style=\"text-align: left\">" + item.android + "</td>" +
               "<td style=\"text-align: left\">" + "<a href=" + item.download + ">Download</a>" + "</td>" +
               "<td style=\"text-align: left\">" + item.size + "</td>" + "</tr>"
               $(info_tblRow).appendTo("#weekly_recovery tbody");
         });
      });
   </script>
   <table id="weekly_recovery" border="1">
      <thead>
         <th style="text-align: center">Device</th>
         <th style="text-align: center">Codename</th>
         <th style="text-align: center">Version</th>
         <th style="text-align: center">Android</th>
         <th style="text-align: center">Link</th>
         <th style="text-align: center">Size</th>
      </thead>
      <tbody>
      </tbody>
   </table>
</div>
<div id="weekly_fastboot" class="tabcontent">
   <script>
      $.when(
         $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_fastboot/weekly_fastboot.json', function(data) {
            var latest = data;
         }),
         $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/weekly_fastboot/weekly_fastboot.json', function(data) {
            var eol = data;
         })
      ).then(function(latest, eol) {
         var data = latest[0].concat(eol[0]);
         $.each(data, function(i, item) {
            var info_tblRow = "<tr>" + "<td style=\"text-align: left\">" + item.device + "</td>" +
               "<td style=\"text-align: left\">" + item.codename + "</td>" +
               "<td style=\"text-align: left\">" + item.version + "</td>" +
               "<td style=\"text-align: left\">" + item.android + "</td>" +
               "<td style=\"text-align: left\">" + "<a href=" + item.download + ">Download</a>" + "</td>" +
               "<td style=\"text-align: left\">" + item.size + "</td>" +
               "<td style=\"text-align: left\">" + item.md5 + "</td>" + "</tr>"
               $(info_tblRow).appendTo("#weekly_fastboot tbody");
         });
      });
   </script>
   <table id="weekly_fastboot" border="1">
      <thead>
         <th style="text-align: center">Device</th>
         <th style="text-align: center">Codename</th>
         <th style="text-align: center">Version</th>
         <th style="text-align: center">Android</th>
         <th style="text-align: center">Link</th>
         <th style="text-align: center">Size</th>
         <th style="text-align: center">MD5</th>
      </thead>
      <tbody>
      </tbody>
   </table>
</div>

