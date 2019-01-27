---
title: Latest MIUI weekly recovery ROMs
layout: single
permalink: /roms/recovery/weekly/
---

<div class="weekly_recover">
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
