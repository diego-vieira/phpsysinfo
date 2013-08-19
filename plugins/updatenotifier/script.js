function renderPluginUpdateNotifier(data) {

    var directives = {
        updateNotifierNbPackages: {
            text: function () {
                return this['packages'];
            }
        },
        updateNotifierNbSecPackages: {
            text: function () {
                return this['security'];
            }
        }
    };
    $('#updatenotifier').render(data, directives);
}
