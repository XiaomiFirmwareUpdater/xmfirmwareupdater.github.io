var jsdom = require("jsdom");
const {
	JSDOM
} = jsdom;
const {
	window
} = new JSDOM();
const {
	document
} = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);
const fs = require('fs');

var token = process.env.ACCESS_TOKEN;
var info = [];
var devices = [];

$.ajax({
	type: 'GET',
	url: 'https://api.github.com/orgs/XiaomiFirmwareUpdater/repos?per_page=100&access_token=' + token,
	data: {
		get_param: 'value'
	},
	dataType: 'json',
	success: function (repo) {

		console.log("**** Gathering information of all available repos");
		fs.writeFile("./../data/repos.json", JSON.stringify(repo, null, 2), function (error) {
			(error ? console.log(error) : console.log("*** Repos gathered and written to repos.json"));
		});

		$.each(repo, function (index, value) {
			if (value.html_url.includes("firmware_xiaomi_")) {
				var device = value.html_url.replace("https://github.com/XiaomiFirmwareUpdater/", "").replace("firmware_xiaomi_", "");
				devices.push(device);
			}
		});

		console.log("*** Gathering information of each available device");
		$.each(devices, function (index, value) {
			$.ajax({
				type: 'GET',
				url: "https://api.github.com/repos/XiaomiFirmwareUpdater/firmware_xiaomi_" + devices[index] + "/releases?per_page=100&access_token=" + token,
				data: {
					get_param: 'value'
				},
				dataType: 'json',
				success: function (releases) {

					/**
					 * Full Global and China begins.
					 */

					info = [];

					var branch,
					codename,
					androidVersion,
					miuiVersion,
					date,
					type,
					filename,
					browser_download_url,
					dlOSDN;
					codename = devices[index];

					console.log("\n\n** Gathering information for " + codename);

					console.log("* Processing latest 2 builds *");
					var latestStable = {
						type: "",
						branch: "",
						globalAndroidVersion: "",
						chinaAndroidVersion: "",
						globalMiuiVersion: "",
						chinaAndroidVersion: "",
						globalDate: "",
						chinaDate: ""
					};
					var latestStableBuilds = [];

					var latestWeekly = {
						type: "",
						branch: "",
						globalAndroidVersion: "",
						chinaAndroidVersion: "",
						globalMiuiVersion: "",
						chinaAndroidVersion: "",
						globalDate: "",
						chinaDate: ""
					};
					var latestWeeklyBuilds = [];

					var x = releases.length - 1;

					var i = releases.length - 1;
					for (i; i >= 0; i--) {
						if (releases[i].assets[0] && !releases[i].assets[0].browser_download_url.includes("untagged")) {

							branch = (releases[i].tag_name.includes("stable") ? "stable" : "weekly");

							type = (releases[i].assets[0].name.includes("Global") ? "Global" : "China");
							androidVersion = releases[i].assets[0].name.split("_")[6].replace(".zip", "");
							miuiVersion = releases[i].assets[0].name.split("_")[4];
							date = releases[i].assets[0].updated_at.slice(0, 10);
							filename = releases[i].assets[0].name;
							browser_download_url = releases[i].assets[0].browser_download_url;

							if (branch == "stable") {
								dlOSDN = ((miuiVersion.split(".")[0] == "V10") | (miuiVersion.split(".")[0] == "V9")) ? "https://osdn.net/projects/xiaomifirmwareupdater/storage/Stable/" + miuiVersion.split(".")[0] + "/" + codename + "/" + filename : "N/A";
							} else {
								branch = "weekly";
								dlOSDN = "https://osdn.net/projects/xiaomifirmwareupdater/storage/Developer/" + miuiVersion + "/" + codename + "/" + filename;
							}

							info.push({
								branch: branch,
								versions: {
									miui: miuiVersion,
									android: androidVersion
								},
								date: date,
								type: type,
								downloads: {
									github: browser_download_url,
									osdn: dlOSDN
								},
								filename: filename
							});
						};
						
						if (releases[i].assets[1] && !releases[i].assets[1].browser_download_url.includes("untagged")) {

							branch = (releases[i].tag_name.includes("stable") ? "stable" : "weekly");

							type = (releases[i].assets[1].name.includes("Global") ? "Global" : "China");
							androidVersion = releases[i].assets[1].name.split("_")[6].replace(".zip", "");
							miuiVersion = releases[i].assets[1].name.split("_")[4];
							date = releases[i].assets[1].updated_at.slice(0, 10);
							filename = releases[i].assets[1].name;
							browser_download_url = releases[i].assets[1].browser_download_url;

							if (branch == "stable") {
								dlOSDN = ((miuiVersion.split(".")[0] == "V10") | (miuiVersion.split(".")[0] == "V9")) ? "https://osdn.net/projects/xiaomifirmwareupdater/storage/Stable/" + miuiVersion.split(".")[0] + "/" + codename + "/" + filename : "N/A";
							} else {
								branch = "weekly";
								dlOSDN = "https://osdn.net/projects/xiaomifirmwareupdater/storage/Developer/" + miuiVersion + "/" + codename + "/" + filename;
							}

							info.push({
								branch: branch,
								versions: {
									miui: miuiVersion,
									android: androidVersion
								},
								date: date,
								type: type,
								downloads: {
									github: browser_download_url,
									osdn: dlOSDN
								},
								filename: filename
							});
						};
					};

					fs.writeFile("./../data/devices/full/" + devices[index] + ".json", JSON.stringify(info, null, 2), function (error) {
						(error ? console.log(error) : console.log("* Information for " + devices[index] + " gathered and " + devices[index] + ".json was updated"));
					});

					/**
					 * Full Global and China ends.
					 */

					/**
					 * Latest Global and China begins
					 */

					console.log("* Processing latest 2 builds *");
					var latestStable = {
						type: "",
						branch: "",
						globalAndroidVersion: "",
						chinaAndroidVersion: "",
						globalMiuiVersion: "",
						chinaAndroidVersion: "",
						globalDate: "",
						chinaDate: "",
						globalFilename: ""
					};
					var latestStableBuilds = [];

					var latestWeekly = {
						type: "",
						branch: "",
						globalAndroidVersion: "",
						chinaAndroidVersion: "",
						globalMiuiVersion: "",
						chinaAndroidVersion: "",
						globalDate: "",
						chinaDate: "",
						chinaFilename: ""
					};
					var latestWeeklyBuilds = [];

					var branch;
					var x = releases.length - 1;
					for (x; x >= 0; x--) {
						if (releases[x].assets[0] && !releases[x].tag_name.includes("untagged")) {
							latestStable.type = (releases[x].assets[0].name.includes("Global") ? "Global" : "China");
							branch = (releases[x].tag_name.includes("stable") ? "stable" : "weekly");

							if (branch == "stable") {
								latestWeekly.type = (releases[x].assets[0].name.includes("Global") ? "Global" : "China");
								if (latestStable.type == "Global") {
									latestStable.globalAndroidVersion = releases[x].assets[0].name.split("_")[6].replace(".zip", "");
									latestStable.globalMiuiVersion = releases[x].assets[0].name.split("_")[4];
									latestStable.globalDate = releases[x].assets[0].updated_at.slice(0, 10);
									latestStable.globalFilename = releases[x].assets[0].name;
								} else {
									latestStable.chinaAndroidVersion = releases[x].assets[0].name.split("_")[6].replace(".zip", "");
									latestStable.chinaMiuiVersion = releases[x].assets[0].name.split("_")[4];
									latestStable.chinaDate = releases[x].assets[0].updated_at.slice(0, 10);
									latestStable.chinaFilename = releases[x].assets[0].name;
								}
							} else if (branch == "weekly") {
								latestWeekly.type = (releases[x].assets[0].name.includes("Global") ? "Global" : "China");
								if (latestWeekly.type == "Global") {
									latestWeekly.globalAndroidVersion = releases[x].assets[0].name.split("_")[6].replace(".zip", "");
									latestWeekly.globalMiuiVersion = releases[x].assets[0].name.split("_")[4];
									latestWeekly.globalDate = releases[x].assets[0].updated_at.slice(0, 10);
									latestWeekly.globalFilename = releases[x].assets[0].name;
								} else {
									latestWeekly.chinaAndroidVersion = releases[x].assets[0].name.split("_")[6].replace(".zip", "");
									latestWeekly.chinaMiuiVersion = releases[x].assets[0].name.split("_")[4];
									latestWeekly.chinaDate = releases[x].assets[0].updated_at.slice(0, 10);
									latestWeekly.chinaFilename = releases[x].assets[0].name;
								};
							};
						};

						if (releases[x].assets[1] && !releases[x].tag_name.includes("untagged")) {
							branch = (releases[x].tag_name.includes("stable") ? "stable" : "weekly");
							latestWeekly.branch = (releases[x].tag_name.includes("weekly") ? "weekly" : "stable");
							if (branch == "stable") {
								latestStable.type = (releases[x].assets[1].name.includes("Global") ? "Global" : "China");
								if (latestStable.type == "Global") {
									latestStable.globalAndroidVersion = releases[x].assets[1].name.split("_")[6].replace(".zip", "");
									latestStable.globalMiuiVersion = releases[x].assets[1].name.split("_")[4];
									latestStable.globalDate = releases[x].assets[1].updated_at.slice(0, 10);
									latestStable.globalFilename = releases[x].assets[1].name;
								} else {
									latestStable.chinaAndroidVersion = releases[x].assets[1].name.split("_")[6].replace(".zip", "");
									latestStable.chinaMiuiVersion = releases[x].assets[1].name.split("_")[4];
									latestStable.chinaDate = releases[x].assets[1].updated_at.slice(0, 10);
									latestStable.chinaFilename = releases[x].assets[1].name;
								}
							} else if (branch == "weekly") {
								latestWeekly.type = (releases[x].assets[1].name.includes("Global") ? "Global" : "China");
								if (latestWeekly.type == "Global") {
									latestWeekly.globalAndroidVersion = releases[x].assets[1].name.split("_")[6].replace(".zip", "");
									latestWeekly.globalMiuiVersion = releases[x].assets[1].name.split("_")[4];
									latestWeekly.globalDate = releases[x].assets[1].updated_at.slice(0, 10);
									latestWeekly.globalFilename = releases[x].assets[1].name;
								} else {
									latestWeekly.chinaAndroidVersion = releases[x].assets[1].name.split("_")[6].replace(".zip", "");
									latestWeekly.chinaMiuiVersion = releases[x].assets[1].name.split("_")[4];
									latestWeekly.chinaDate = releases[x].assets[1].updated_at.slice(0, 10);
									latestWeekly.chinaFilename = releases[x].assets[1].name;
								};
							};
						};
					};

					latestStableBuilds.push({
						codename : devices[index],
						type: "global",
						versions: {
							android: latestStable.globalAndroidVersion,
							miui: latestStable.globalMiuiVersion,
						},
						date: latestStable.globalDate,
						file: latestStable.globalFilename
					});

					latestStableBuilds.push({
						codename : devices[index],
						type: "china",
						versions: {
							android: latestStable.chinaAndroidVersion,
							miui: latestStable.chinaMiuiVersion,
						},
						date: latestStable.chinaDate,
						file: latestStable.chinaFilename
					});

					fs.writeFile("./../data/devices/latest/stable/" + devices[index] + ".json", JSON.stringify(latestStableBuilds, null, 2), function (error) {
						(error ? console.log(error) : console.log("* Last 2 stable builds were written to file " + devices[index] + ".json"));
					});

					latestWeeklyBuilds.push({
						codename : devices[index],
						type: "global",
						versions: {
							android: latestWeekly.globalAndroidVersion,
							miui: latestWeekly.globalMiuiVersion,
						},
						date: latestWeekly.globalDate,
						file: latestWeekly.globalFilename
					});

					latestWeeklyBuilds.push({
						codename : devices[index],
						type: "china",
						versions: {
							android: latestWeekly.chinaAndroidVersion,
							miui: latestWeekly.chinaMiuiVersion,
						},
						date: latestWeekly.chinaDate,
						file: latestWeekly.chinaFilename
					});

					fs.writeFile("./../data/devices/latest/weekly/" + devices[index] + ".json", JSON.stringify(latestWeeklyBuilds, null, 2), function (error) {
						(error ? console.log(error) : console.log("* Last 2 weekly builds were written to file " + devices[index] + ".json"));
					});

					/**
					 * Latest Global and China ends
					 */
				}
			});
		});
	},
	error: function (result) {
		console.log("/** \n Error: " + result.responseJSON.message + "\n*/");
	}
}).done(function () {
	console.log("*** Done");
});