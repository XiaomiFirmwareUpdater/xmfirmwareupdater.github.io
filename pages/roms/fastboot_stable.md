---
title: Latest MIUI stable Fastboot ROMs
layout: single
permalink: /roms/fastboot/stable/
---

<section id="main" class="container single">
	<header>
		<h2 style="text-align: center">Stable</h2>
		<h3 style="text-align: center">Latest MIUI Stable Fastboot ROMs, Global and China.</h3>
	</header>
	<div class="stable_fastboot">
		<script>
			$(function() {
			var sr_devices = [];
			$.getJSON('https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_fastboot/stable_fastboot.json', function(data) {
			   $.each(data, function(i, sf) {
				  var sf_tblRow = "<tr>" + "<td style=\"text-align: left\">" + sf.device + "</td>" +
				   "<td style=\"text-align: left\">" + sf.version + "</td>" + "<td style=\"text-align: left\">" + sf.android + "</td>" +
				   "<td style=\"text-align: left\">" + sf.md5 + "</td>" + "<td style=\"text-align: left\">" + "<a href=" + sf.download + ">Download</a>" + "</td>" + "</tr>"
				   $(sf_tblRow).appendTo("#stable_fastboot tbody");
			 });
			});
			});
		</script>
		<table id="stable_fastboot" border="1">
			<thead>
				<th style="text-align: center">Device</th>
				<th style="text-align: center">Version</th>
				<th style="text-align: center">Android</th>
				<th style="text-align: center">MD5</th>
				<th style="text-align: center">Link</th>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</section>