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
        if (!target.size()) {
            return false;
        }
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
                target.hide();
                me.hide().remove();
            });
        }
    }

    exports.showPopup = showPopup;

    exports.format = function (source, opts) {
        source = String(source);
        var data = Array.prototype.slice.call(arguments,1);
        var toString = Object.prototype.toString;

        if(data.length){
            data = data.length == 1 ? 
                /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
                (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) 
                : data;
            return source.replace(/#\{(.+?)\}/g, function (match, key){
                var replacer = data[key];
                // chrome 下 typeof /a/ == 'function'
                if('[object Function]' == toString.call(replacer)){
                    replacer = replacer(key);
                }
                return ('undefined' == typeof replacer ? '' : replacer);
            });
        }
        return source;
    };

    return exports;
})();