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
$(function () {

    $('.msg-list-item').on('mouseover', function () {
        $(this).addClass('item-hover');
    }).on('mouseout', function () {
        $(this).removeClass('item-hover');
    }).on('click', function (ev) {
        var item = $(this);
        var target = $(ev.target);
        
        var url = item.attr('data-url');
        if (url) {
            window.location.href = url;
        }
    });


    $(document).on('click', function (ev) {
        $('.operate-list').hide();

        var target = $(ev.target);
        if (target.hasClass('operate') || target.parent().hasClass('operate')) {
            var item = target.closest('.msg-list-item');
            item.find('.operate-list').toggle();

            return false;
        }
    });


    $('.popup-trigger').on('click', function () {
        util.showPopup($(this).attr('data-id'), {
            title: '写纸条',
            width: 440,
            modal: true,
            autoOpen: false
        });
        return false;
    });

    $('.popup .close').on('mouseover', function () {
        $(this).addClass('close-hover');
    }).on('mouseout', function () {
        $(this).removeClass('close-hover');
    }).on('click', function () {
        $(this).closest('.popup').hide();
        $('.mask').remove();
    });


    // 操作栏按钮
    var baseOperation = $('.operation');
    var delOperation = $('.operation-del');

    var allCheckbox = $('.checkbox-list input:checkbox');
    var checkAllLabel = $('.main .delete-all');
    var checkAllBox = checkAllLabel.children('input:checkbox');

    $('#btn-batch-del').on('click', function () {
        baseOperation.hide();
        delOperation.show();
        allCheckbox.show();
    });

    $('#btn-del-cancel').on('click', function () {
        baseOperation.show();
        delOperation.hide();
        allCheckbox.hide();
    });

    checkAllBox.on('click', function () {
        var checked = $(this).prop('checked');
        allCheckbox.prop('checked', checked);
    });

    var confirmDialog;
    $('#btn-del-confirm').on('click', function () {
        // to delete
        if (confirmDialog) {
            confirmDialog.show();
        }
        else {
            confirmDialog = util.confirm({
                content: '确认要删除这些对话记录吗？',
                modal: 1,
                okHandler: function () {
                    var dialog = this;
                    console.log(dialog);
                }
            });
        }
    });

    
    /**
     * message list 页面逻辑处理
     */
    var replyForm = $('#chat-sendmsg-form');
    var replyText = $('#chat-sendmsg-box').find('.txt');
    var replyTextWrap = replyText.parent();

    $('#form-send-btn').on('click', function () {
        var url = replyForm.attr('action');
        var content = $.trim(replyText.val());

        if (!content) {
            return false;
        }

        $.ajax({
            type: 'post',
            url: url,
            data: {
                content: content
            },
            dataType: 'json',
            success: function (data) {
                if (data && data.status === 0) {
                    window.location.reload();
                }
            }
        });

        return false;
    });

});