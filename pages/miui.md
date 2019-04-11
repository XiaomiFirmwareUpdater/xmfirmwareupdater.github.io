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
      $(function() {
      var sr_devices = [];
      $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_recovery/stable_recovery.json', function(data) {
         $.each(data, function(i, sf) {
      	  var sf_tblRow = "<tr>" + "<td style=\"text-align: left\">" + sf.device + "</td>" + "<td style=\"text-align: left\">" + sf.codename + "</td>" +
      	   "<td style=\"text-align: left\">" + sf.version + "</td>" + "<td style=\"text-align: left\">" + sf.android + "</td>" + "<td style=\"text-align: left\">" + "<a href=" + sf.download + ">Download</a>" + "</td>" + "</tr>"
      	   $(sf_tblRow).appendTo("#stable_recovery tbody");
       });
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
      </thead>
      <tbody>
      </tbody>
   </table>
</div>
<div id="stable_fastboot" class="tabcontent">
   <script>
      $(function() {
      var sr_devices = [];
      $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_fastboot/stable_fastboot.json', function(data) {
         $.each(data, function(i, sf) {
      	  var sf_tblRow = "<tr>" + "<td style=\"text-align: left\">" + sf.device + "</td>" + "<td style=\"text-align: left\">" + sf.codename + "</td>" +
      	   "<td style=\"text-align: left\">" + sf.version + "</td>" + "<td style=\"text-align: left\">" + sf.android + "</td>" + "<td style=\"text-align: left\">" + "<a href=" + sf.download + ">Download</a>" + "</td>"
      	   + "<td style=\"text-align: left\">" + sf.md5 + "</td>" + "</tr>"
      	   $(sf_tblRow).appendTo("#stable_fastboot tbody");
       });
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
         <th style="text-align: center">MD5</th>
      </thead>
      <tbody>
      </tbody>
   </table>
</div>
<div id="weekly_recovery" class="tabcontent">
   <script>
      $(function() {
      var sr_devices = [];
      $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_recovery/weekly_recovery.json', function(data) {
         $.each(data, function(i, sf) {
      	  var sf_tblRow = "<tr>" + "<td style=\"text-align: left\">" + sf.device + "</td>" + "<td style=\"text-align: left\">" + sf.codename + "</td>" +
      	   "<td style=\"text-align: left\">" + sf.version + "</td>" + "<td style=\"text-align: left\">" + sf.android + "</td>" + "<td style=\"text-align: left\">" + "<a href=" + sf.download + ">Download</a>" + "</td>" + "</tr>"
      	   $(sf_tblRow).appendTo("#weekly_recovery tbody");
       });
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
      </thead>
      <tbody>
      </tbody>
   </table>
</div>
<div id="weekly_fastboot" class="tabcontent">
   <script>
      $(function() {
      var sr_devices = [];
      $.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_fastboot/weekly_fastboot.json', function(data) {
         $.each(data, function(i, sf) {
      	  var sf_tblRow = "<tr>" + "<tr>" + "<td style=\"text-align: left\">" + sf.device + "</td>" + "<td style=\"text-align: left\">" + sf.codename + "</td>" +
      	   "<td style=\"text-align: left\">" + sf.version + "</td>" + "<td style=\"text-align: left\">" + sf.android + "</td>" + "<td style=\"text-align: left\">" + "<a href=" + sf.download + ">Download</a>" + "</td>" + 
      	   "<td style=\"text-align: left\">" + sf.md5 + "</td>" + "</tr>"
      	   $(sf_tblRow).appendTo("#weekly_fastboot tbody");
       });
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
         <th style="text-align: center">MD5</th>
      </thead>
      <tbody>
      </tbody>
   </table>
</div>

