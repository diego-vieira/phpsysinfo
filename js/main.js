var data_dbg;
$(document).ready(function () {

    $(document).ajaxStart(function () {
        $("#loader").show();
    });
    $(document).ajaxStop(function () {
        $("#loader").hide();
    });

    $.ajax({
        dataType: "json",
        url: "xml.php?plugin=complete&json",
        success: function (data) {
            console.log(data);
            data_dbg = data;
            renderVitals(data);
            renderHardware(data);
            renderMemory(data);
            renderFilesystem(data);
            renderNetwork(data);
            renderVoltage(data);
            renderTemperature(data);
            renderFans(data);
            renderPower(data);
        }
    });
});

function renderVitals(data) {
    var directives = {
        Uptime: {
            text: function () {
                return secondsToString(this["Uptime"]);
            }
        },
        Distro: {
            html: function () {
                return '<img src="gfx/images/' + this["Distroicon"] + '" style="width:24px"/>' + this["Distro"];
            }
        }
    };

    if (data["Vitals"]["@attributes"]["SysLang"] === undefined) {
        $("#tr_SysLang").hide();
    }
    if (data["Vitals"]["@attributes"]["CodePage"] === undefined) {
        $("#tr_CodePage").hide();
    }
    $('#vitals').render(data["Vitals"]["@attributes"], directives);
}

function renderHardware(data) {

    var directives = {
        Model: {
            text: function () {
                if(this["CPU"]["CpuCore"].length > 1)
                    return this["CPU"]["CpuCore"].length + " x " + this["CPU"]["CpuCore"][0]["@attributes"]["Model"];
                else
                    return this["CPU"]["CpuCore"]["@attributes"]["Model"];
            }
        },
        USB: {
            text: function() {
                if (this["USB"]["Device"] != undefined && this["USB"]["Device"].length > 0) {
                    return this["USB"]["Device"].length;
                }
                else if (this["USB"]["0"] != undefined) {
                    return "1";
                }
            }
        },
        PCI: {
            text: function() {
                if (this["PCI"]["Device"] != undefined && this["PCI"]["Device"].length > 0) {
                    return this["PCI"]["Device"].length;
                }
                else if (this["PCI"]["0"] != undefined) {
                    return "1";
                }
            }
        },
        IDE: {
            text: function() {
                if (this["IDE"]["Device"] != undefined && this["IDE"]["Device"].length > 0) {
                    return this["IDE"]["Device"].length;
                }
                else if (this["IDE"]["0"] != undefined) {
                    return "1";
                }
            }
        },
        SCSI: {
            text: function() {
                if (this["SCSI"]["Device"] != undefined && this["SCSI"]["Device"].length > 0) {
                    return this["SCSI"]["Device"].length;
                }
                else if (this["SCSI"]["0"] != undefined) {
                    return "1";
                }
            }
        }
    };
    $('#hardware').render(data["Hardware"], directives);

    var hw_directives = {
        hwName: {
            text: function() {
                return this["@attributes"]["Name"];
            }
        },
        hwCount: {
            text: function() {
                if (this["@attributes"]["Count"] == "1") {
                    return "";
                }
                return this["@attributes"]["Count"];
            }
        }
    };


    for (hw_type in data["Hardware"]) {
        if (hw_type != "CPU") {
            hw_data = [];

            if(jQuery.isEmptyObject(data["Hardware"][hw_type])) {
                $("#hardware-"+hw_type).hide();
            }
            else {
                if (data["Hardware"][hw_type]["Device"] == undefined && data["Hardware"][hw_type]["0"] != undefined) {
                    hw_data.push(data["Hardware"][hw_type]["0"]);
                }
                else if (data["Hardware"][hw_type]["Device"].length != undefined) {
                    for (index in data["Hardware"][hw_type]["Device"]) {
                        hw_data.push(data["Hardware"][hw_type]["Device"][index]);
                    }
                }

                if (hw_data.length > 0) {
                    $("#hw-dialog-"+hw_type+" ul").render(hw_data, hw_directives);
                }
                else {
                    $("#hardware-"+hw_type).hide();
                }
            }
        }
    }
    /*
    if (data["Hardware"]["USB"]["Device"].length > 0) {
        $("#hw-dialog-USB ul").render(data["Hardware"]["USB"]["Device"], hw_directives);
    }
    else {
        $("hardware-USB").hide();
    }
    */
}

function renderMemory(data) {
    var directives = {
        Total: {
            text: function () {
                return bytesToSize(this["@attributes"]["Total"]);
            }
        },
        Free: {
            text: function () {
                return bytesToSize(this["@attributes"]["Free"]);
            }
        },
        Used: {
            text: function () {
                return bytesToSize(this["@attributes"]["Used"]);
            }
        },
        Usage: {
            html: function () {
                if (this["Details"] == undefined || this["Details"]["@attributes"] == undefined) {
                    return '<div class="progress">' +
                        '<div class="progress-bar progress-bar-info" style="width: ' + this["@attributes"]["Percent"] + '%;"></div>' +
                        '</div><div class="percent">' + this["@attributes"]["Percent"] + '%</div>';
                }
                else {
                    return '<div class="progress">' +
                        '<div class="progress-bar progress-bar-info" style="width: ' + this["Details"]["@attributes"]["AppPercent"] + '%;"></div>' +
                        '<div class="progress-bar progress-bar-warning" style="width: ' + this["Details"]["@attributes"]["CachedPercent"] + '%;"></div>' +
                        '<div class="progress-bar progress-bar-danger" style="width: ' + this["Details"]["@attributes"]["BuffersPercent"] + '%;"></div>' +
                        '</div>' +
                        '<div class="percent">' +
                        'Total: ' + this["@attributes"]["Percent"] + '% ' +
                        '<i>(App: ' + this["Details"]["@attributes"]["AppPercent"] + '% - ' +
                        'Cache: ' + this["Details"]["@attributes"]["CachedPercent"] + '% - ' +
                        'Buffers: ' + this["Details"]["@attributes"]["BuffersPercent"] + '%' +
                        ')</i></div>';
                }
            }
        },
        Type: {
            text: function () {
                return "Physical Memory";
            }
        }
    };

    var directive_swap = {
        Total: {
            text: function () {
                return bytesToSize(this["Total"]);
            }
        },
        Free: {
            text: function () {
                return bytesToSize(this["Free"]);
            }
        },
        Used: {
            text: function () {
                return bytesToSize(this["Used"]);
            }
        },
        Usage: {
            html: function () {
                return '<div class="progress">' +
                    '<div class="progress-bar progress-bar-info" style="width: ' + this["Percent"] + '%;"></div>' +
                    '</div><div class="percent">' + this["Percent"] + '%</div>';
            }
        },
        Name: {
            html: function () {
                return this['Name'] + '<br/>' + this['MountPoint'];
            }
        }
    }

    var data_memory = [];

    if (data["Memory"]["Swap"]["Mount"] !== undefined) {
        if (data["Memory"]["Swap"]["Mount"].length === undefined) {
            data_memory.push(data["Memory"]["Swap"]["Mount"]["@attributes"]);
        } else {
            for (var i = 0; i < data["Memory"]["Swap"]["Mount"].length; i++) {
                data_memory.push(data["Memory"]["Swap"]["Mount"][i]["@attributes"]);
            }
        }
    }

    $('#memory-data').render(data["Memory"], directives);
    $('#swap-data').render(data_memory, directive_swap);
}

function renderFilesystem(data) {
    var directives = {
        Total: {
            text: function () {
                return bytesToSize(this["Total"]);
            }
        },
        Free: {
            text: function () {
                return bytesToSize(this["Free"]);
            }
        },
        Used: {
            text: function () {
                return bytesToSize(this["Used"]);
            }
        },
        MountPoint: {
            text: function () {
                return ((this["MountPoint"] !== undefined) ? this["MountPoint"] : this["MountPointID"]);
            }
        },
        Name: {
            html: function () {
                return this["Name"] + ((this["MountOptions"] !== undefined) ? '<br><i>(' + this["MountOptions"] + ')</i>' : '');
            }
        },
        Percent: {
            html: function () {
                return '<div class="progress">' + '<div class="' +
                    ((!isNaN(data["Options"]["@attributes"]["threshold"]) &&
                        (this["Percent"] >= data["Options"]["@attributes"]["threshold"])) ? 'progress-bar progress-bar-danger' : 'progress-bar progress-bar-info') +
                    '" style="width: ' + this["Percent"] + '% ;"></div>' +
                    '</div>' + '<div class="percent">' + this["Percent"] + '% ' + (!isNaN(this["Inodes"]) ? '<i>(' + this["Inodes"] + '%)</i>' : '') + '</div>';
            }
        }
    };

    var fs_data = [];
    for (var i = 0; i < data["FileSystem"]["Mount"].length; i++) {
        fs_data.push(data["FileSystem"]["Mount"][i]["@attributes"]);
    }
    $('#filesystem-data').render(fs_data, directives);
    sorttable.innerSortFunction.apply(document.getElementById('MountPoint'), []);
}


function renderNetwork(data) {
    var directives = {
        RxBytes: {
            text: function () {
                return bytesToSize(this["RxBytes"]);
            }
        },
        TxBytes: {
            text: function () {
                return bytesToSize(this["TxBytes"]);
            }
        },
        Drops: {
            text: function () {
                return this["Drops"] + "/" + this["Err"];
            }
        }
    };

    var network_data = [];
    for (var i = 0; i < data["Network"]["NetDevice"].length; i++) {
        network_data.push(data["Network"]["NetDevice"][i]["@attributes"]);
    }
    $('#network-data').render(network_data, directives);
}

function renderVoltage(data) {
    try {
        var voltage_data = [];
        for (var i = 0; i < data["MBInfo"]["Voltage"]["Item"].length; i++) {
            voltage_data.push(data["MBInfo"]["Voltage"]["Item"][i]["@attributes"]);
        }
        $('#voltage-data').render(voltage_data);
        $("#block_voltage").show();
    }
    catch (err) {
        $("#block_voltage").hide();
    }
}

function renderTemperature(data) {
    try {
        var temperature_data = [];
        for (var i = 0; i < data["MBInfo"]["Temperature"]["Item"].length; i++) {
            temperature_data.push(data["MBInfo"]["Temperature"]["Item"][i]["@attributes"]);
        }
        $('#temperature-data').render(temperature_data);
        $("#block_temperature").show();
    }
    catch (err) {
        $("#block_temperature").hide();
    }
}
function renderFans(data) {
    try {
        var fans_data = [];
        for (var i = 0; i < data["MBInfo"]["Fans"]["Item"].length; i++) {
            fans_data.push(data["MBInfo"]["Fans"]["Item"][i]["@attributes"]);
        }
        $('#fans-data').render(fans_data);
        $("#block_fans").show();
    }
    catch (err) {
        $("#block_fans").hide();
    }
}

function renderPower(data) {
    try {
        var power_data = [];
        for (var i = 0; i < data["MBInfo"]["Power"]["Item"].length; i++) {
            power_data.push(data["MBInfo"]["Power"]["Item"][i]["@attributes"]);
        }
        $('#power-data').render(power_data);
        $("#block_power").show();
    }
    catch (err) {
        $("#block_power").hide();
    }
}

// from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + '' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + '' + sizes[i];
}

function secondsToString(seconds) {
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = Math.floor((((seconds % 31536000) % 86400) % 3600) % 60);
    return numyears + " years " + numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
}
