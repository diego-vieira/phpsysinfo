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
        }
    });
});

function renderVitals() {
    $('#vitals').render(json_data["Vitals"]["@attributes"]);
}