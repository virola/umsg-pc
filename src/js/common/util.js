/**
 * @file 基础函数库
 * @author  virola
 */
var util = (function () {

    var exports = {};

    var ICON_FONTAWESOME = {
        confirm: 'fa fa-question-circle'
    };

    exports.confirm = function (params) {
        var options = $.extend({
            title: '确认',
            width: 450,
            fontawesome: 1,
            cancelBtnText: '取消',
            okBtnText: '确认',
            skin: 'confirm',
            ico : ICON_FONTAWESOME.confirm,
            buttons: [
                {
                    text: '取消',
                    handler: function () {
                        this.hide();
                    }
                },
                {
                    text: '确定',
                    skin: 'primary',
                    handler: function () {
                        params.okHandler && params.okHandler.call(this);
                    }
                }
            ]
        }, params);

        var dialog = new Dialog(options);

        return dialog;
    };

    function showPopup(id, options) {
        var target = $('#popup-' + id);
        target.show();
        
        options = $.extend({}, options);

        var top = ($(window).height() - target.outerHeight()) / 2;
        var left = ($(window).width() - target.outerWidth()) / 2;
        target.css({
            left: left + 'px',
            top: top + 'px'
        });

        if (options.modal) {
            var mask = $('<div/>').addClass('mask').css({
                width: $(window).width() + 'px',
                height:  Math.max($(window).height(), $(document.body).outerHeight()) + 'px'
            });

            $(document.body).append(mask);
            mask.show();

            mask.on('click', function () {
                var me = $(this);
                me.hide();
                target.hide();
                me.remove();
            });
        }
    }

    exports.showPopup = showPopup;

    function ModalBox(params) {

    };

    return exports;
})();