/**
 * @file 对话框组件
 * @author  virola
 */

function Dialog(params) {
    var _me = this;
    var options = _me.options = $.extend({
        title: '提示',
        width: 450,
        skin: '',
        ico: ''
    }, params);

    var main = _me.main = $('<div/>').addClass('popup').addClass('popup-' + options.skin);

    // 标题区域
    var titleDom = $('<div/>').addClass('popup-title').text(options.title).appendTo(main);
    var closeDom = $('<span><i class="fa fa-times"></i></span>').addClass('close').appendTo(main);

    // 内容区域
    var body = $('<div/>').addClass('popup-content').appendTo(main);
    var iconDom = $('<i/>').addClass('popup-ico').addClass(options.ico).appendTo(body);
    var contentDom = $('<div/>').addClass('popup-text').text(options.content).appendTo(body);
    
    // foot按钮区域
    var footDom = _me.footer = $('<div/>').addClass('popup-btn').hide().appendTo(main);
    if (options.buttons && options.buttons.length) {
        footDom.show();
        _me.renderBtns(options.buttons);
    }
    
    // 弹出框显示
    main.appendTo($(document.body));

    // mask 生成
    if (options.modal) {
        var mask = _me.mask = $('<div/>').addClass('mask');
        $(document.body).append(mask);
        mask.on('click', function () {
            _me.hide();
        });
    }

    closeDom.on('click', function () {
        _me.hide();
    });

    _me.show();
}

Dialog.prototype = {
    constructor: Dialog,
    
    show: function () {
        var main = this.main;

        if (this.options.modal) {
            this.mask.css({
                width: $(window).width() + 'px',
                height:  Math.max($(window).height(), $(document.body).outerHeight()) + 'px'
            }).show();
        }

        main.width(this.options.width).show()

        var top = ($(window).height() - main.outerHeight()) / 2;
        var left = ($(window).width() - main.outerWidth()) / 2;
        main.css({
            left: left + 'px',
            top: top + 'px'
        });
    },

    hide: function () {
        this.mask && this.mask.hide();
        this.main.hide();
    },

    dispose: function () {
        this.mask && this.mask.hide().remove();
        this.main.hide().remove();

        this.mask = this.main = this.foot = null;
    },

    renderBtns: function (buttons) {
        var _me = this;
        var footer = _me.footer;
        $.each(buttons, function (i, item) {
            var btn = $('<button type="button" />')
                .text(item.text)
                .addClass('btn btn-' + (item.skin || 'default'))
                .appendTo(footer);

            btn.on('click', function () {
                item.handler && item.handler.call(_me);
            });
        }); 
    }
};

