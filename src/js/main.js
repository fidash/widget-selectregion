/*globals FIDASHRequests,$ */
(function () {
    "use strict";
    /***  AUTHENTICATION VARIABLES  ***/
    var url = "http://130.206.84.4:1028/monitoring/regions/";

    var fillRegions = function fillRegions(regions) {
        var father = $("#regionContainer");
        regions.forEach(function (region) {
            $("<li></li>")
                .addClass("list-group-item")
                .addClass("item")
                .text(region)
                .appendTo(father);
        });
    };

    var loadRegions = function loadRegions() {
        FIDASHRequests.get(url, function (err, data) {
            if (err) {
                window.console.log(err);
                MashupPlatform.widget.log(err);
                // Show error?
                return;
            }
            var regions = [];

            data._embedded.regions.forEach(function (region) {
                regions.push(region.id);
            });

            stopAnimation();
            fillRegions(regions.sort());
        }.bind(this));
    };

    var sendViaWiring = function sendViaWiring() {
        var regions = [];
        $(".list-group li.active").each(function () {
            regions.push($(this).text());
        });
        MashupPlatform.wiring.pushEvent("regions", JSON.stringify(regions));
    };

    $('body').on('click', '.list-group .list-group-item', function () {
        $(this).toggleClass('active');
        sendViaWiring();
    });

    $('.list .selector').click(function () {
        var $checkBox = $(this);
        if (!$checkBox.hasClass('selected')) {
            // $checkBox.addClass('selected').closest('.list-group').find('li:not(.active)').addClass('active');
            $checkBox.addClass('selected');
            $('.list-group').find('li:not(.active)').addClass('active');
            $checkBox.children('i').removeClass('glyphicon-unchecked').addClass('glyphicon-check');
        } else {
            $checkBox.removeClass('selected');
            $('.list-group').find('li.active').removeClass('active');
            $checkBox.children('i').removeClass('glyphicon-check').addClass('glyphicon-unchecked');
        }
        sendViaWiring();
    });
    $('[name="SearchDualList"]').keyup(function (e) {
        var code = e.keyCode || e.which;
        if (code == '9') {
            return;
        }
        if (code == '27') {
            $(this).val(null);
        }
        var $rows = $('.list-group li');
        var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
        $rows.show().filter(function () {
            var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
            return !~text.indexOf(val);
        }).hide();
    });

    var startAnimation = function startAnimation() {
        $("#spinner").show();
    };

    var stopAnimation = function stopAnimation() {
        $("#spinner").hide();
    };

    $(document).ready(function () {
        startAnimation();
        loadRegions();
    });
})();
