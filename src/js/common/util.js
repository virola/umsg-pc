/**
 * @file 基础函数库
 * @author  virola
 */
var util = (function () {

    var exports = {};

    exports.lang = {
        index: {
            talkDel: '确认要删除与 #{0} 的对话记录吗？',
            userBan: '确认要将 #{0} 加入屏蔽用户列表吗？您将收不到对方发来的纸条',
            markread: '您确定要将所有消息的状态置为已读吗？'
        },
        message: {
            batchDel: '确认要删除这些对话记录吗？'
        },
        talk: {
            userBan: '确认要将 #{0} 加入屏蔽用户列表吗？您将收不到对方发来的纸条'
        }
    };

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
                        var result;
                        if (params.okHandler) {
                            result = params.okHandler.call(this);
                        }

                        if (result !== false) {
                            this.hide();
                        }
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

    /**
     * 将字符串解析成 JSON 对象
     * 
     * @memberof module:util
     * @param {string} data 需要解析的字符串
     * @return {Object} 解析结果 JSON 对象
     */
    exports.parseJSON = function (data) {
        try {
            return (new Function('return (' + data + ')'))();
        }
        catch (e) {
            return {};
        }
    };

    return exports;
})();