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
            renderVitals(data);
            renderHardware(data);
            renderMemory(data);
            renderFilesystem(data);
            renderNetwork(data);
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

    $('#vitals').render(data["Vitals"]["@attributes"], directives);
}

function renderHardware(data) {

    var directives = {
        Model: {
            text: function () {
                return this["CpuCore"].length + " x " +  this["CpuCore"][0]["@attributes"]["Model"];
            }
        }
    }

    $('#hardware').render(data["Hardware"]["CPU"],directives);
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

                if (this["Details"] == undefined) {
                    return '<div class="progress">' +
                        '<div class="progress-bar progress-bar-info" style="width: ' + this["@attributes"]["Percent"] + '%;"></div>' +
                        '</div>' +
                        '<div class="percent">' + this["@attributes"]["Percent"] + '% - ' +
                        '</div>';
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
                return "Physical Memory"
            }
        }
    };


    var data_memory = {};
    for(var i=0;i<data["Memory"]["Swap"].length;i++) {
        data_memory.push(data["Memory"]["Swap"][i]["@attributes"]);
    }

   $('#memory').render(data["Memory"], directives);
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
        Percent: {
            html: function () {
                return '<div class="progress">' + '<div class="' +
                    ((!isNaN(data["Options"]["@attributes"]["threshold"]) && (this["Percent"]>=data["Options"]["@attributes"]["threshold"]))?'progress-bar progress-bar-danger':'progress-bar')+
                    '" style="width: '+this["Percent"]+'% ;"></div>' +
                    '</div>' + '<div class="percent">' + this["Percent"]+'% '+(!isNaN(this["Inodes"])?'<sub>('+this["Inodes"]+'%)</sub>':'')+'</div>';
            }
        }
    };

    var fs_data = [];
    for (var i = 0; i < data["FileSystem"]["Mount"].length; i++) {
        fs_data.push(data["FileSystem"]["Mount"][i]["@attributes"]);
    }
    $('#filesystem-data').render(fs_data, directives);
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