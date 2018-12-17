	if (window.location.hash == "") {
		window.location.hash = "stable"
	}
	
	$(document).ready(function() {
		(window.location.hash.split('#')[1] == "stable" ? tabs_stable() : tabs_weekly());
	});
	
	function tabs_stable() {
		$('#tab_stable').css('background','#fff');
		$('#tab_weekly').css('background','#e5e5e5');

		$('#header_weekly').css('display','none');
		$('#header_stable').css('display','block');
	}
	
	function tabs_weekly() {
		$('#tab_weekly').css('background','#fff');
		$('#tab_stable').css('background','#e5e5e5');

		$('#header_stable').css('display','none');
		$('#header_weekly').css('display','block');		
	}
	
	var lastPosition = $(window).scrollTop();
		$(window).scroll(function(event){
			var currentPosition = $(this).scrollTop();
			if (currentPosition > lastPosition){
				$('#header').fadeOut();
			} else {
				$('#header').fadeIn();
			}
		lastPosition = currentPosition;
	});
	
	$.get("https://xiaomifirmwareupdater.github.io/supported", function(data) {
		var supportedDevices = $("<body>").html(data).find("table").html();
		$('#dialogWindow table').html(supportedDevices);
		//console.log($($('#dialogWindow tbody')[0]));
	}).done(function() {
		$('#dialogWindow table tbody tr').each(function(tag, item) {
			//console.log($(item)[0].children[4]);
			$($(this)[0].children[4]).remove();
			$($("#dialogWindow table thead th")[4]).remove();
		});
	});
	
	var token = "0dc63205e1481ea2480f46e1725b585c364b50a5";
	
	var stable_content = '';
	stable_content +='<tr>'
	stable_content += '<th colspan="3" style="border-right: solid 1px #e5e5e5; text-align: center">Device</th>'
	stable_content += '<th colspan="3" style="border-right: solid 1px #e5e5e5; text-align: center">Latest Global</th>'
	stable_content += '<th colspan="4" style="text-align: center">Latest Chinese</th>'
	stable_content +='</tr>'
	stable_content += '<tr>'
	stable_content += '<th>#</th>'
	stable_content += '<th>Model</th>'
	stable_content += '<th onclick="sortBy(this)">Codename</th>'
	stable_content += '<th>MIUI Version</th>'
	stable_content += '<th>Android</th>'
	stable_content += '<th>Update Time</th>'
	stable_content += '<th>MIUI Version</th>'
	stable_content += '<th>Android</th>'
	stable_content += '<th>Update Time</th>'
	stable_content += '<th>Downloads</th>'
	stable_content += '</tr>'
	
	var devices = [];
	var codenames = [];
	var urls = [];
	var index;
	
	var allDevices = [];
	var deviceCount = 0;
	
	$.ajax({
		type: 'GET',
		url: 'https://api.github.com/orgs/XiaomiFirmwareUpdater/repos?per_page=100',
		data: { get_param: 'value' },
		dataType: 'json',
		//headers: {"Authorization": "token 0dc63205e1481ea2480f46e1725b585c364b50a5"},
		success: function (response) {
			
			$.getJSON("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/devices/master/devices.json", function(json) {
				var i = json.devices.length - 1;
				for (i; i >= 0; i--) {
					devices.push(json.devices[i].name);
					codenames.push(json.devices[i].codename);
					urls.push(json.devices[i].url);
				}
			}).done(function(k) {
				console.log("XFU: Device names were loaded.");
				$.each(response, function(key, value) {
					var device;
					var model;
					var url;
					
					if (value.html_url.includes("firmware_xiaomi_")) {
						device = value.html_url.replace("https://github.com/XiaomiFirmwareUpdater/","").replace("firmware_xiaomi_","");
					
						var android_global;
						var android_china;
						var version_global;	
						var version_china;
						var download_global;
						var download_china;
						var updateTime_global;
						var updateTime_china;
						var branch;
						var isGlobal;
						
						allDevices.push(device);
						
						$.getJSON("https://api.github.com/repos/XiaomiFirmwareUpdater/firmware_xiaomi_" + device + "/releases?per_page=100", function(data) {
							deviceCount = deviceCount + 1;
							var i = data.length - 1;
							
							for (i; i >= 0; i--) {
								if (data[i].assets[0]) {
									isGlobal = (data[i].assets[0].name.includes("Global") ? true : false);
									if (data[i].tag_name.includes("stable")) {
										branch = "stable";
										if (isGlobal) {
											android_global = data[i].assets[0].name.split("_")[6].replace(".zip","");
											version_global = data[i].assets[0].name.split("_")[4];
											download_global = data[i].assets[0].browser_download_url;
											updateTime_global = data[i].assets[0].updated_at.slice(0,10);
										} else {
											android_china = data[i].assets[0].name.split("_")[6].replace(".zip","");
											version_china = data[i].assets[0].name.split("_")[4];
											download_china = data[i].assets[0].browser_download_url;
											updateTime_china = data[i].assets[0].updated_at.slice(0,10);
										}
									}
								}

								if (data[i].assets[1]) {
									isGlobal = (data[i].assets[1].name.includes("Global") ? true : false);
									if (data[i].tag_name.includes("stable")) {
										branch = "stable";
										if (isGlobal) {
											android_global = data[i].assets[1].name.split("_")[6].replace(".zip","");
											version_global = data[i].assets[1].name.split("_")[4];
											download_global = data[i].assets[1].browser_download_url;
											updateTime_global = data[i].assets[1].updated_at.slice(0,10);
										} else {
											android_china = data[i].assets[1].name.split("_")[6].replace(".zip","");
											version_china = data[i].assets[1].name.split("_")[4];
											download_china = data[i].assets[1].browser_download_url;
											updateTime_china = data[i].assets[1].updated_at.slice(0,10);
										}
									}
								}
							}
							
							var devicePosition = codenames.length - 1;
							for (devicePosition; devicePosition >= 0; devicePosition--) {
								if (device == codenames[devicePosition]) {	
									model = devices[devicePosition];
									url = urls[devicePosition];
								}
							}
							
							stable_content+='<tr class="item">'
							stable_content+='<td class="stable_count"></td>'
							if (model != null) {
								stable_content+='<td><a href="' + url + '" title="' + model + '" target="_blank">' + model + '</td>'
							} else {
								stable_content+='<td><span>?</span></td>'
							}
							stable_content+='<td>' + device + '</td>'
							
							if (download_global != null || download_china != null) {
								if (download_global != null) {
									stable_content+='<td title="' + version_global +'">' + version_global + '</td>'
									stable_content+='<td>' + android_global + '</td>'
									//stable_content+='<td><a href="' + download_global + '" target="_blank">Here</a></td>'
									stable_content+='<td>' + updateTime_global + '</td>'
								} else {
									stable_content+='<td colspan="3" style="text-align: center; font-style: italic">No global build available for ' + device + '</td>'
								}
								
								if (download_china != null) {
									stable_content+='<td title="' + version_china + '">' + version_china + '</td>'
									stable_content+='<td>' + android_china + '</td>'
									//stable_content+='<td><a href="' + download_china + '" target="_blank">Here</a></td>'
									stable_content+='<td>' + updateTime_china + '</td>'
									stable_content+='<td onclick="showDeviceInfoDialog(this)" id="dialogButtonStable"><a>Links</a></td>'
								} else {
									stable_content+='<td colspan="3" style="text-align: center; font-style: italic">No Chinese build available for ' + device + '</td>'
									stable_content+='<td onclick="showDeviceInfoDialog(this)" id="dialogButtonStable"><a>Links</a></td>'
								}
							} else {
								stable_content +='<td colspan="8" style="text-align: center; font-style: italic">Neither global nor Chinese builds available for ' + device + '</td>'
							}
							stable_content+='</tr>'
						}).done(function(x) {		
							if (deviceCount == allDevices.length) {
								document.getElementById("tbody_stable").innerHTML = stable_content;
								$(".load-bar").css("opacity","0");
														
								$('.stable_count').each(function(i) {
									$(this).append($('<a>').attr('href','javascript:;'));
									$(this).children().text(i+1);
									$(this).attr('class',$(this).parent().children()[2].innerHTML);

									$(this).click(function() {
										$('tr').css('background','');
										$(this).parent().css('background-color','rgba(150, 255, 34, 0.44)');
										parent.location.href = '#stable#' + $(this).parent().children()[2].innerText;
									});
								});
								
								$('tr').each( function(i) {
									if ($(this).text() == "") {
										$(this).remove();
									}
								});
														
								if (window.location.href.indexOf("#") > -1) {
									var item = window.location.hash.split('#')[2];
									if (item != null) {
										$("." + item).parent().css('background-color','rgba(150, 255, 34, 0.44)');
										console.log("XFU: " + item + " detected.");
										
										if (window.location.hash.split('#')[1] == "stable") {
											var distance = $("." + item)[0].offsetParent.offsetTop + $("." + item)[0].offsetTop - 100;
											window.scrollTo(0, distance);
										}
									}
								 }
								 console.log("XFU: Table was loaded.");
							} else {
								return;
							}
						});
					}
				});
			});
		},
		statusCode: {
			403: function(error) {
				stable_content += '<tr><td colspan="11" style="text-align: center; line-height: 45px; font-style: italic">Error 403. No information available at the moment. Try again later.</td></tr>'
				document.getElementById("tbody_stable").innerHTML =  stable_content;
			}
		}
	}).done(function(p) {
		console.log("done");
	});
	
	var weekly_content = '';
	weekly_content +='<tr>'
	weekly_content += '<th colspan="3" style="border-right: solid 1px #e5e5e5; text-align: center">Device</th>'
	weekly_content += '<th colspan="3" style="border-right: solid 1px #e5e5e5; text-align: center">Latest Global</th>'
	weekly_content += '<th colspan="4" style="text-align: center">Latest Chinese</th>'
	weekly_content +='</tr>'
	weekly_content += '<tr>'
	weekly_content += '<th>#</th>'
	weekly_content += '<th>Model</th>'
	weekly_content += '<th onclick="sortBy(this)">Codename</th>'
	weekly_content += '<th>MIUI Version</th>'
	weekly_content += '<th>Android</th>'
	//weekly_content += '<th>Download URL</th>'
	weekly_content += '<th>Update Time</th>'
	weekly_content += '<th>MIUI Version</th>'
	weekly_content += '<th>Android</th>'
	//weekly_content += '<th>Download URL</th>'
	weekly_content += '<th>Update Time</th>'
	weekly_content += '<th>Downloads</th>'
	weekly_content += '</tr>'
	
	var devices = [];
	var codenames = [];
	var urls = [];
	var weeklyDevices = [];
	var weeklyDeviceCount = 0;
	
	$.ajax({
		type: 'GET',
		url: 'https://api.github.com/orgs/XiaomiFirmwareUpdater/repos?per_page=100',
		data: { get_param: 'value' },
		dataType: 'json',
		//headers: {"Authorization": "token 0dc63205e1481ea2480f46e1725b585c364b50a5"},
		success: function (response) {
			
			var urls = [];
			
			$.getJSON("https://raw.githubusercontent.com/XiaomiFirmwareUpdater/devices/master/devices.json", function(json) {
				var i = json.devices.length - 1;
				for (i; i >= 0; i--) {
					devices.push(json.devices[i].name);
					codenames.push(json.devices[i].codename);
					urls.push(json.devices[i].url);
				}
			}).done(function() {
				console.log("XFU: Device names were loaded.");
				$.each(response, function(key, value) {
				var device;
				var model;
				var url;
				
				if (value.html_url.includes("firmware_xiaomi_")) {
				
					device = value.html_url.replace("https://github.com/XiaomiFirmwareUpdater/","").replace("firmware_xiaomi_","");
					
					weeklyDevices.push(device);
					$.getJSON("https://api.github.com/repos/XiaomiFirmwareUpdater/firmware_xiaomi_" + device + "/releases?per_page=100", function(data) {
						
						weeklyDeviceCount = weeklyDeviceCount + 1;
						
						var android_global;
						var android_china;
						var version_global;	
						var version_china;
						var download_global;
						var download_china;
						var updateTime_global;
						var updateTime_china;
						var branch;
						var i = data.length - 1;
						var isGlobal;
						
						for (i; i >= 0; i--) {
							if (data[i].assets[0]) {
								isGlobal = (data[i].assets[0].name.includes("Global") ? true : false);
								if (data[i].tag_name.includes("weekly")) {
									branch = "weekly";
									if (isGlobal) {
										android_global = data[i].assets[0].name.split("_")[6].replace(".zip","");
										version_global = data[i].assets[0].name.split("_")[4];
										download_global = data[i].assets[0].browser_download_url;
										updateTime_global = data[i].assets[0].updated_at.slice(0,10);
									} else {
										android_china = data[i].assets[0].name.split("_")[6].replace(".zip","");
										version_china = data[i].assets[0].name.split("_")[4];
										download_china = data[i].assets[0].browser_download_url;
										updateTime_china = data[i].assets[0].updated_at.slice(0,10);
									}
								}
							} 
							
							if (data[i].assets[1]) {
								isGlobal = (data[i].assets[1].name.includes("Global") ? true : false);
								if (data[i].tag_name.includes("weekly")) {
									branch = "weekly";
									if (isGlobal) {
										android_global = data[i].assets[1].name.split("_")[6].replace(".zip","");
										version_global = data[i].assets[1].name.split("_")[4];
										download_global = data[i].assets[1].browser_download_url;
										updateTime_global = data[i].assets[1].updated_at.slice(0,10);
									} else {
										android_china = data[i].assets[1].name.split("_")[6].replace(".zip","");
										version_china = data[i].assets[1].name.split("_")[4];
										download_china = data[i].assets[1].browser_download_url;
										updateTime_china = data[i].assets[1].updated_at.slice(0,10);
									}
								}
							}
						}
						
						var devicePosition = codenames.length - 1;
						for (devicePosition; devicePosition >= 0; devicePosition--) {
							if (device == codenames[devicePosition]) {	
								model = devices[devicePosition];
								url = urls[devicePosition];
							}
						}
						
						weekly_content+='<tr class="item">'
						weekly_content+='<td class="weekly_count"></td>'
						if (model != null) {
							weekly_content+='<td><a href="' + url + '" title="' + model + ' target="_blank">' + model + '</td>'
						} else {
							weekly_content+='<td><span>?</span></td>'
						}
						weekly_content+='<td class="codename">' + device + '</td>'
						
						if (download_global != null || download_china != null) {
							if (download_global != null) {
								weekly_content+='<td title="' + version_global +'">' + version_global + '</td>'
								weekly_content+='<td>' + android_global + '</td>'
								//weekly_content+='<td><a href="' + download_global + '" target="_blank">Here</a></td>'
								weekly_content+='<td>' + updateTime_global + '</td>'
							} else {
								weekly_content+='<td colspan="3" style="text-align: center; font-style: italic">No global build available for ' + device + '</td>'
							}
							
							if (download_china != null) {
								weekly_content+='<td title="' + version_china + '">' + version_china + '</td>'
								weekly_content+='<td>' + android_china + '</td>'
								//weekly_content+='<td><a href="' + download_china + '" target="_blank">Here</a></td>'
								weekly_content+='<td>' + updateTime_china + '</td>'
								weekly_content+='<td onclick="showDeviceInfoDialog(this)" id="dialogButtonWeekly"><a>Links</a></td>'
							} else {
								weekly_content+='<td colspan="3" style="text-align: center; font-style: italic">No Chinese build available for ' + device + '</td>'
								weekly_content+='<td onclick="showDeviceInfoDialog(this)" id="dialogButtonWeekly"><a>Links</a></td>'
							}
						} else {
							weekly_content +='<td colspan="8" style="text-align: center; font-style: italic">Neither global nor Chinese builds available for ' + device + '</td>'
						}
						weekly_content+='</tr>'
					}).done(function(x) {
						if (weeklyDeviceCount == weeklyDevices.length) {
								document.getElementById("tbody_weekly").innerHTML = weekly_content;

								$('.weekly_count').each(function(i) {
									$(this).append($('<a>').attr('href','javascript:;'));
									$(this).children().text(i+1);
									$(this).attr('class',$(this).parent().children()[2].innerHTML);

									$(this).click(function() {
										$('tr').css('background','');
										$(this).parent().css('background-color','rgba(150, 255, 34, 0.44)');
										parent.location.href = '#weekly#' + $(this).parent().children()[2].innerText;
									});
								});
								
								$('tr').each( function(i) {
									if ($(this).text() == "") {
										$(this).remove();
									}
								});
														
								if (window.location.href.indexOf("#") > -1) {
									var item = window.location.hash.split('#')[2];
									if (item != null) {
										console.log(item);
										$("." + item).parent().css('background-color','rgba(150, 255, 34, 0.44)');
										console.log("XFU: " + item + " detected.");
										if (window.location.hash.split('#')[1] == "weekly") {
											var distance = $("." + item)[1].offsetParent.offsetTop + $("." + item)[1].offsetTop - 100;
											window.scrollTo(0, distance);
										}
									}
								 }
							} else {
								return;
							}
					});
				}
				});
		});
		},
		statusCode: {
			403: function(error) {
				weekly_content += '<tr><td colspan="11" style="text-align: center; line-height: 45px; font-style: italic">Error 403. No information available at the moment. Try again later.</td></tr>'
				document.getElementById("tbody_weekly").innerHTML =  weekly_content;
			}
		}
	});
	
	function search(id) {
		var input, table, tr, td, i, model, codename;
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
	
	// Handling tabs
	function switchTab(item) {
		var hash = window.location.hash;
		if (item.id == 'tab_stable') {
			hash.split('#')[2] != null ? window.location.href = "#stable" + "#" + hash.split('#')[2] : window.location.href = "#stable";
			//window.location.href = "#stable";
			$('#tab_stable').css('background','#fff');
			$('#tab_weekly').css('background','#e5e5e5');
		
			$('#header_weekly').css('display','none');
			$('#header_stable').css('display','block');
		} else if (item.id == 'tab_weekly') {
			hash.split('#')[2] != null ? window.location.href = "#weekly" + "#" + hash.split('#')[2] : window.location.href = "#weekly";
			//window.location.href = "#weekly";
			$('#tab_weekly').css('background','#fff');
			$('#tab_stable').css('background','#e5e5e5');
		
			$('#header_stable').css('display','none');
			$('#header_weekly').css('display','block');
		}
	};
	
	function sortBy(item) {
		var table = $(item)[0].parentNode.parentElement.id;
		if (table == "tbody_weekly") {
			w3.sortHTML('#tbody_weekly','.item', 'td:nth-child(3)')
			$('#tbody_weekly .item').each(function(i) {
				$($(this)[0].childNodes[0].childNodes[0]).text(i+1);
			});
		} else {
			w3.sortHTML('#tbody_stable','.item', 'td:nth-child(3)');
			$('#tbody_stable .item').each(function(i) {
				$($(this)[0].childNodes[0].childNodes[0]).text(i+1);
			});
		}
	}
	
	function showDeviceInfoDialog(item) {
		showKzSnackbar('Generating download links...',1000,false);
		var deviceRow = $(item).parent()[0];
		var model = deviceRow.children[1].innerText;
		var codename = deviceRow.children[2].innerText;
		$('#deviceInfoDialogContainer #device').text(model + " (" + codename + ")");
		$('#deviceInfoDialogBuilds table tbody').html("");
		
		$.getJSON("https://api.github.com/repos/XiaomiFirmwareUpdater/firmware_xiaomi_" + codename + "/releases?per_page=100", function(response) {
			$.each(response, function(index, value) {
				var stableBuilds = "", weeklyBuilds = "";
				if (item.id == "dialogButtonStable" && value.tag_name.includes("stable")) {
					var filename, miVer, androidVer, updateTime, global, dlUrl;
					
					
					if (value.assets[0]) {
						filename = value.assets[0].name; 
						miVer = value.assets[0].name.split("_")[4]; 
						androidVer = value.assets[0].name.split("_")[6].replace(".zip",""); 
						global = (value.assets[0].name.includes("Global") ? true : false);
						updateTime = value.assets[0].updated_at.slice(0,10); 
						dlUrl = value.assets[0].browser_download_url;
					
						stableBuilds += "\
						<tr>\
							<td style='text-align: left;'>" + miVer + "</td>\
							<td>" + androidVer + "</td>\
							<td>" + updateTime + "</td>\
							<td>" + (global ? "Global" : "Chinese") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : "<a href='" + dlUrl + "' target='_blank'>GitHub</a>") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : ((miVer.split(".")[0] == "V10") | (miVer.split(".")[0] == "V9")) ? "<a href='https://sourceforge.net/projects/xiaomi-firmware-updater/files/Stable/" + miVer.split(".")[0] + "/" + codename + "/" + filename + "/download' target='_blank'>Sourceforge</a>" : "<a>N/A</a>") + "</td>\
						</tr>";
					}
					
					if (value.assets[1]) {
						filename = value.assets[1].name; 
						miVer = value.assets[1].name.split("_")[4]; 
						androidVer = value.assets[1].name.split("_")[6].replace(".zip",""); 
						global = (value.assets[1].name.includes("Global") ? true : false);
						updateTime = value.assets[1].updated_at.slice(0,10); 
						dlUrl = value.assets[1].browser_download_url;
					
						stableBuilds += "\
						<tr>\
							<td style='text-align: left;'>" + miVer + "</td>\
							<td>" + androidVer + "</td>\
							<td>" + updateTime + "</td>\
							<td>" + (global ? "Global" : "Chinese") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : "<a href='" + dlUrl + "' target='_blank'>GitHub</a>") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : ((miVer.split(".")[0] == "V10") | (miVer.split(".")[0] == "V9")) ? "<a href='https://sourceforge.net/projects/xiaomi-firmware-updater/files/Stable/" + miVer.split(".")[0] + "/" + codename + "/" + filename + "/download' target='_blank'>Sourceforge</a>" : "<a>N/A</a>") + "</td>\
						</tr>";						
					}
					
					if (value.assets.length == 0) { 
						filename = "N/A"; 
						miVer = "N/A"; 
						androidVer = "N/A"; 
						global = "N/A";
						updateTime = "N/A"; 
						dlUrl = "N/A"
					}
					
					$('#deviceInfoDialog h3').html("All available stable builds: ");
					$('#deviceInfoDialogBuilds table tbody').append(stableBuilds);
				} else if (item.id == "dialogButtonWeekly" && value.tag_name.includes("weekly")) {
					var filename, miVer, androidVer, updateTime, global, dlUrl;
					
					if (value.assets[0]) {
						filename = value.assets[0].name; 
						miVer = value.assets[0].name.split("_")[4]; 
						androidVer = value.assets[0].name.split("_")[6].replace(".zip",""); 
						updateTime = value.assets[0].updated_at.slice(0,10); 
						global = (value.assets[0].name.includes("Global") ? true : false);
						dlUrl = value.assets[0].browser_download_url;
						
						weeklyBuilds += "\
						<tr>\
							<td style='text-align: left;'>" + miVer + "</td>\
							<td>" + androidVer + "</td>\
							<td>" + updateTime + "</td>\
							<td>" + (global ? "Global" : "Chinese") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : "<a href='" + dlUrl + "' target='_blank'>GitHub</a>") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : "<a href='https://sourceforge.net/projects/xiaomi-firmware-updater/files/Developer/" + (miVer) + "/" + codename + "/" + filename + "/download' target='_blank'>Sourceforge</a>") + "</td>\
						</tr>";
					} 
					
					if (value.assets[1]) {
						filename = value.assets[1].name; 
						miVer = value.assets[1].name.split("_")[4]; 
						androidVer = value.assets[1].name.split("_")[6].replace(".zip",""); 
						updateTime = value.assets[1].updated_at.slice(0,10); 
						global = (value.assets[1].name.includes("Global") ? true : false);
						dlUrl = value.assets[1].browser_download_url;
						
						weeklyBuilds += "\
						<tr>\
							<td style='text-align: left;'>" + miVer + "</td>\
							<td>" + androidVer + "</td>\
							<td>" + updateTime + "</td>\
							<td>" + (global ? "Global" : "Chinese") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : "<a href='" + dlUrl + "' target='_blank'>GitHub</a>") + "</td>\
							<td>" + (dlUrl == "N/A" ? "<a>N/A</a>" : "<a href='https://sourceforge.net/projects/xiaomi-firmware-updater/files/Developer/" + (miVer) + "/" + codename + "/" + filename + "/download' target='_blank'>Sourceforge</a>") + "</td>\
						</tr>";
					}
					
					if (value.assets.length == 0) {
						filename = "N/A"; 
						miVer = "N/A"; 
						androidVer = "N/A"; 
						updateTime = "N/A"; 
						global = "N/A";
						dlUrl = "N/A" 
					}
					$('#deviceInfoDialog h3').html("All available weekly builds: ");
					$('#deviceInfoDialogBuilds table tbody').append(weeklyBuilds);
				};
			});
		}).done(function() {
			closeKzSnackbar();
			$('#deviceInfoDialogContainer').css('display','block');
			$('body').css("overflow","hidden");
		});
	}