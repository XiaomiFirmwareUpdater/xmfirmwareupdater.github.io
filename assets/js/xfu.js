var isSnackbarLoaded = true;
/*
try {
showKzSnackbar("Loading", 0, false);
} catch (e) {
(e == null ? isSnackbarLoaded = true : isSnackbarLoaded = false);
}; */

if (window.location.hash == "") {
	window.location.hash = "stable"
}

$(document).ready(function () {
	(window.location.hash.split('#')[1] == "stable" ? tabs_stable() : tabs_weekly());
});

function tabs_stable() {
	$('#tab_stable').css('background', '#fff');
	$('#tab_weekly').css('background', '#e5e5e5');

	$('#header_weekly').css('display', 'none');
	$('#header_stable').css('display', 'block');
}

function tabs_weekly() {
	$('#tab_weekly').css('background', '#fff');
	$('#tab_stable').css('background', '#e5e5e5');

	$('#header_stable').css('display', 'none');
	$('#header_weekly').css('display', 'block');
}

/**
*	Here we show supported devices in a dialog. However, it is not necessary as
*	a single page for this is better. Thus, disabling this function. Not sure tho
*	for temporarily or not.
*/
/*
$.get("https://xiaomifirmwareupdater.com/misc/supported", function (data) {
	var supportedDevices = $("<body>").html(data).find("table").html();
	$('#dialogWindow table').html(supportedDevices);
	//console.log($($('#dialogWindow tbody')[0]));
}).done(function () {
	$('#dialogWindow table tbody tr').each(function (tag, item) {
		//console.log($(item)[0].children[4]);
		$($(this)[0].children[4]).remove();
		$($("#dialogWindow table thead th")[4]).remove();
	});
});
*/

$("document").ready(function () {
	var stable_content = '',
	weekly_content = '';

	$.getJSON("../../data/repos.json", function (repos) {
		var eachCounter = 0;
		$.each(repos, function (index, value) {
			if (repos[index].name.includes("firmware_xiaomi_")) {
				eachCounter++;
				var deviceJSON = value.name.replace("firmware_xiaomi_", "") + ".json";
				/**
				 *  Start loading stable table.
				 */
				$.getJSON("../../data/devices/latest/stable/" + deviceJSON, function (latestStable) {

					var model = "n/a";
					var codename = "n/a";
					var url = "#";

					$.getJSON("../../data/devices.json", function (devices) {
						var devicesLength = devices.length - 1;
						for (devicesLength; devicesLength >= 0; devicesLength--) {
							if (value.name.replace("firmware_xiaomi_", "") == devices[devicesLength].codename) {
								model = devices[devicesLength].name;
								codename = devices[devicesLength].codename;
								url = devices[devicesLength].url;
							}
						}

						stable_content += "\
						<tr class='item'>\
						<td class='stable_count'></td>\
						<td><a href='" + url + "' title='" + model + "' target='_blank'>" + model + "</td>\
						<td title='" + codename + "'>" + codename + "</td>";

						if (latestStable[0] && latestStable[1]) {
							(latestStable[0].file ? (stable_content += "\
									<td>" + latestStable[0].versions.miui + "</td>\
									<td>" + latestStable[0].versions.android + "</td>\
									<td>" + latestStable[0].date + "</td>") : stable_content += "<td colspan='3' style='text-align: center; font-style: italic'>No Global builds available for " + codename + "</td>");

							(latestStable[1].file ? (stable_content += "\
									<td>" + latestStable[1].versions.miui + "</td>\
									<td>" + latestStable[1].versions.android + "</td>\
									<td>" + latestStable[1].date + "</td>") : stable_content += "<td colspan='3' style='text-align: center; font-style: italic'>No Chinese builds available for " + codename + "</td>");

							stable_content += "<td onclick='showDeviceInfoDialog(this, &#34" + codename + "&#34, &#34" + model + "&#34)' id='dialogButtonStable'><a>Links</a></td>";
						} else {
							(stable_content += "<td colspan='7' style='text-align: center; font-style: italic'>Nor Global neither Chinese build(s) available for " + codename + "</td>")
						}
					});
				});

				/**
				 *  End loading stable table.
				 */
				//
				/**
				 *  Start loading weekly stable.
				 */
				$.getJSON("../../data/devices/latest/weekly/" + deviceJSON, function (latestWeekly) {

					var model = "n/a";
					var codename = "n/a";
					var url = "#";

					$.getJSON("../../data/devices.json", function (devices) {
						var devicesLength = devices.length - 1;
						for (devicesLength; devicesLength >= 0; devicesLength--) {
							if (value.name.replace("firmware_xiaomi_", "") == devices[devicesLength].codename) {
								model = devices[devicesLength].name;
								codename = devices[devicesLength].codename;
								url = devices[devicesLength].url;
							}
						}

						weekly_content += "\
						<tr class='item'>\
						<td class='weekly_count'></td>\
						<td><a href='" + url + "' title='" + model + "' target='_blank'>" + model + "</td>\
						<td title='" + codename + "'>" + codename + "</td>";

						if (latestWeekly[0] && latestWeekly[1]) {
							(latestWeekly[0].file ? (weekly_content += "\
									<td>" + latestWeekly[0].versions.miui + "</td>\
									<td>" + latestWeekly[0].versions.android + "</td>\
									<td>" + latestWeekly[0].date + "</td>") : weekly_content += "<td colspan='3' style='text-align: center; font-style: italic'>No Global builds available for " + codename + "</td>");

							(latestWeekly[1].file ? (weekly_content += "\
									<td>" + latestWeekly[1].versions.miui + "</td>\
									<td>" + latestWeekly[1].versions.android + "</td>\
									<td>" + latestWeekly[1].date + "</td>") : weekly_content += "<td colspan='3' style='text-align: center; font-style: italic'>No Chinese builds available for " + codename + "</td>");

							weekly_content += "<td onclick='showDeviceInfoDialog(this, &#34" + codename + "&#34, &#34" + model + "&#34)' id='dialogButtonWeekly'><a>Links</a></td>";
						} else {
							(weekly_content += "<td colspan='7' style='text-align: center; font-style: italic'>Nor Global neither Chinese build(s) available for " + codename + "</td>")
						}
					});
				});
				/**
				 *  End loading weekly table.
				 */

				// Show tables
				(eachCounter == 44 ?
					setTimeout(function () {
						/**
						 *	Common stuff.
						 */

						$(".load-bar").css("opacity", "0");
						(isSnackbarLoaded ? closeKzSnackbar() : console.log("XFU: Unable to load kzSnackbar"));
						setTimeout(function () {
							(isSnackbarLoaded ? showKzSnackbar("Table was loaded successfully.", 2000, false) : console.log("XFU: Unable to load kzSnackbar"));
						}, 500);

						/**
						 *	Stable table stuff.
						 */
						$('#tbody_stable').html(stable_content);

						$('.stable_count').each(function (i) {
							$(this).append($('<a>').attr('href', 'javascript:;'));
							$(this).children().text(i + 1);
							$(this).attr('class', $(this).parent().children()[2].innerHTML);

							$(this).click(function () {
								$('tr').css('background', '');
								$(this).parent().css('background-color', 'rgba(150, 255, 34, 0.44)');
								parent.location.href = '#stable#' + $(this).parent().children()[2].innerText;
							});
						});

						/**
						 *	Weekly table stuff.
						 */
						$('#tbody_weekly').html(weekly_content);

						$('.weekly_count').each(function (i) {
							$(this).append($('<a>').attr('href', 'javascript:;'));
							$(this).children().text(i + 1);
							$(this).attr('class', $(this).parent().children()[2].innerHTML);

							$(this).click(function () {
								$('tr').css('background', '');
								$(this).parent().css('background-color', 'rgba(150, 255, 34, 0.44)');
								parent.location.href = '#weekly#' + $(this).parent().children()[2].innerText;
							});
						});

						/**
						 *	Common stuff
						 */

						if (window.location.href.indexOf("#") > -1) {
							var item = window.location.hash.split('#')[2];
							if (item != null) {
								$("." + item).parent().css('background-color', 'rgba(150, 255, 34, 0.44)');
								console.log("XFU: " + item + " detected.");

								var distance;
								(window.location.hash.split('#')[1] == "stable" ? distance = $("." + item)[0].offsetParent.offsetTop + $("." + item)[0].offsetTop - 100 : distance = $("." + item)[1].offsetParent.offsetTop + $("." + item)[1].offsetTop);
								window.scrollTo(0, distance);
							}
						}
					}, 2000) : (isSnackbarLoaded ? showKzSnackbar("Table is being loaded...", 4000, false) : console.log("XFU: Unable to load kzSnackbar")));
			};
		});
	});
});

	function search(id) {
	var input,
	table,
	tr,
	td,
	i,
	model,
	codename;
	if (id == "stable") {
		input = document.getElementById("searchForm_stable").value.toLowerCase();
		table = document.getElementById("table_stable");
		tr = table.getElementsByTagName("tr");
		for (i = 2; i < tr.length; i++) {
			model = tr[i].getElementsByTagName("td")[1].innerText.toLowerCase();
			codename = tr[i].getElementsByTagName("td")[2].innerText.toLowerCase();
			if (model.indexOf(input) > -1 | codename.indexOf(input) > -1) {
				tr[i].style.opacity = "";
			} else {
				tr[i].style.opacity = "0.3";
			}
		}
	} else if (id == "weekly") {
		input = document.getElementById("searchForm_weekly").value.toLowerCase();
		table = document.getElementById("table_weekly");
		tr = table.getElementsByTagName("tr");
		for (i = 2; i < tr.length; i++) {
			model = tr[i].getElementsByTagName("td")[1].innerText.toLowerCase();
			codename = tr[i].getElementsByTagName("td")[2].innerText.toLowerCase();
			if (model.indexOf(input) > -1 | codename.indexOf(input) > -1) {
				tr[i].style.opacity = "";
			} else {
				tr[i].style.opacity = "0.3";
			}
		}
	}
};

	function switchTab(item) {
	var hash = window.location.hash;
	if (item.id == 'tab_stable') {
		hash.split('#')[2] != null ? window.location.href = "#stable" + "#" + hash.split('#')[2] : window.location.href = "#stable";
		$('#tab_stable').css('background', '#fff');
		$('#tab_weekly').css('background', '#e5e5e5');

		$('#header_weekly').css('display', 'none');
		$('#header_stable').css('display', 'block');
	} else if (item.id == 'tab_weekly') {
		hash.split('#')[2] != null ? window.location.href = "#weekly" + "#" + hash.split('#')[2] : window.location.href = "#weekly";
		$('#tab_weekly').css('background', '#fff');
		$('#tab_stable').css('background', '#e5e5e5');

		$('#header_stable').css('display', 'none');
		$('#header_weekly').css('display', 'block');
	}
};

function sortBy(item) {
	var currentI = $(item)[0].children[0].className;
	var sortUp = ' <i class="fa fa-sort-up"></i></th>';
	var sortDown = ' <i class="fa fa-sort-down"></i></th>';
	$($(item)[0].children).remove();
	currentI.includes("up") ? $(item).append(sortDown) : $(item).append(sortUp);
	var table = $(item)[0].parentNode.parentNode.parentElement.id;
	if (table == "table_weekly") {
		w3.sortHTML('#tbody_weekly', '.item', 'td:nth-child(3)');
		$('#tbody_weekly .item').each(function (i) {
			$($(this)[0].childNodes[1].childNodes[0]).text(i + 1);
		});
	} else if (table == "table_stable") {
		w3.sortHTML('#tbody_stable', '.item', 'td:nth-child(3)');
		$('#tbody_stable .item').each(function (i) {
			$($(this)[0].childNodes[1].childNodes[0]).text(i + 1);
		});
	}
}

	function showDeviceInfoDialog(item, codename, model) {
	(isSnackbarLoaded ? showKzSnackbar('Generating download links...', 1000, false) : console.log("XFU: Unable to load kzSnackbar"));
	var deviceRow = $("." + codename).parent()[0];
	$('#deviceInfoDialogContainer #device').text(model + " (" + codename + ")");
	$('#deviceInfoDialogBuilds table tbody').html("");

	$.getJSON("../../data/devices/full/" + codename + ".json", function (response) {
		$.each(response, function (index, value) {
			var stableBuilds = "",
			weeklyBuilds = "";
			var filename,
			miVer,
			androidVer,
			updateTime,
			type,
			dlGit,
			dlOSDN;
			if (item.id == "dialogButtonStable" && value.branch == "stable") {

				filename = value.filename;
				miVer = value.versions.miui;
				androidVer = value.versions.android;
				type = (value.type == "Global" ? "Global" : "Chinese");
				updateTime = value.date;
				dlGit = value.downloads.github;
				dlOSDN = value.downloads.osdn;

				stableBuilds += "\
				<tr>\
				<td style='text-align: left;'>" + miVer + "</td>\
				<td>" + androidVer + "</td>\
				<td>" + updateTime + "</td>\
				<td>" + type + "</td>\
				<td><a href='" + dlOSDN + "' target='_blank'>OSDN</a></td>\
				<td><a href='" + dlGit + "' target='_blank'>GitHub</a></td>\
				</tr>";

				$('#deviceInfoDialog h3').html("All available stable builds: ");
				$('#deviceInfoDialogBuilds table tbody').append(stableBuilds);
			} else if (item.id == "dialogButtonWeekly" && value.branch == "weekly") {
				filename = value.filename;
				miVer = value.versions.miui;
				androidVer = value.versions.android;
				type = (value.type == "Global" ? "Global" : "Chinese");
				updateTime = value.date;
				dlOSDN = value.downloads.osdn;
				dlGit = value.downloads.github;

				weeklyBuilds += "\
				<tr>\
				<td style='text-align: left;'>" + miVer + "</td>\
				<td>" + androidVer + "</td>\
				<td>" + updateTime + "</td>\
				<td>" + type + "</td>\
				<td><a href='" + dlOSDN + "' target='_blank'>OSDN</a></td>\
				<td><a href='" + dlGit + "' target='_blank'>GitHub</a></td>\
				</tr>";

				$('#deviceInfoDialog h3').html("All available weekly builds: ");
				$('#deviceInfoDialogBuilds table tbody').append(weeklyBuilds);
			};
		});
	}).done(function () {
		(isSnackbarLoaded ? closeKzSnackbar() : console.log("XFU: Unable to load kzSnackbar."));
		$('#deviceInfoDialogContainer').css('display', 'block');
		$('body').css("overflow", "hidden");
			
		var list = $('#deviceInfoDialogBuilds tbody tr').get().reverse();
		$('#deviceInfoDialogBuilds tbody').html(list);
	});
}
