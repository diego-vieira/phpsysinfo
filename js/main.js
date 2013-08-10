var json_data = {};

$(document).ready(function () {

    $(document).ajaxStart(function(){
        $("#loader").show();
    });
    $(document).ajaxStop(function(){
        $("#loader").hide();
    });

    $.ajax({
        dataType: "json",
        url: "xml.php?plugin=complete&json",
        success: function (data) {
            json_data = data;
            console.log(data);
            renderVitals();
            renderHardware();
            renderFilesystem();
        }
    });
});

function renderVitals() {
    $('#vitals').render(json_data["Vitals"]["@attributes"]);
}

function renderHardware() {
    $('#hardware').render(json_data["Hardware"]["CPU"]["CpuCore"][0]["@attributes"]);
}

function renderFilesystem() {
    var directives = {
        Total: {
            text: function() {
                return bytesToSize(this["Total"]);
            }
        },
        Free: {
            text: function() {
                return bytesToSize(this["Free"]);
            }
        },
        Used: {
            text: function() {
                return bytesToSize(this["Used"]);
            }
        }
    };

    var fs_data = [];
    for(var i=0;i<json_data["FileSystem"]["Mount"].length;i++) {
        fs_data.push(json_data["FileSystem"]["Mount"][i]["@attributes"]);
    }
    $('#filesystem-data').render(fs_data, directives);
}


// from http://scratch99.com/web-development/javascript/convert-bytes-to-mb-kb/
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i == 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
}

