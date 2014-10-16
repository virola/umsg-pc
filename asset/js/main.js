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
    var closeDom = $('<a href="javascript:;"><i class="fa fa-times"></i></a>').addClass('close').appendTo(main);

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
        var scrollTop = $(window).scrollTop();
        main.css({
            left: left + 'px',
            top: (top + scrollTop) + 'px'
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
var util = window.util || {};
var pageParams = window.pageParams || {};

$(function () {

    /**
     * for common header
     */ 
    // add redirect
    $('.uc-redirect-add').each(function (i, item) {
        var curUrl = encodeURIComponent(window.location.href);
        var url =  $(item).attr('href');
        url += (url.indexOf('?') > -1 ? '&' : '?') + 'redirect_url=' +  curUrl;
        $(item).attr('href', url);
    });

    // scroll top
    var scrollDom = $('#scrolltop');
    $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 80) {
            scrollDom.show();
        }
        else {
            scrollDom.hide();
        }
    });
    scrollDom.on('click', function () {
        $(document.body).animate({scrollTop: 0});
    });

    $('.msg-list-item').on('mouseover', function () {
        $(this).addClass('item-hover');
    }).on('mouseout', function () {
        $(this).removeClass('item-hover');
    }).on('click', function (ev) {
        var item = $(this);
        var target = $(ev.target);
        
        if (target.hasClass('operate') || target.parent().hasClass('operate')) {
            // nothing..
        }
        else {
            item.removeClass('msg-topic-new');

            var url = item.attr('data-url');
            if (url) {
                window.location.href = url;
            }
        }
    });

    /**
     * operate 操作弹出菜单的交互逻辑设定
     */
    $(document).on('click', function (ev) {
        var target = $(ev.target);
        if (target.hasClass('operate') || target.parent().hasClass('operate')) {

            var item = target.closest('.msg-item');
            var opList = item.find('.operate-list');
            var isShow = (opList.attr('data-open') == 'true') ? false : true;
            
            $('.operate-list').each(function (i, item) {
                if ($(item).is(opList)) {
                    opList.toggle(isShow).attr('data-open', isShow);
                }
                else {
                    $(item).attr('data-open', false).hide();
                }
            });
            
            return false;
        }
        else {
            $('.operate-list').attr('data-open', 0).hide();
        }

        var command = target.attr('data-command');
        if (command) {
            handleListOpts(target, command);
            return false;
        }
    });

    function handleListOpts(target, command) {
        var dataVal = target.attr('data-value') || '{}';
        var val = util.parseJSON(dataVal);
        var url;

        if (command == 'talkdel') {
            url = pageParams.ajaxUrl.banUser;
            util.confirm({
                modal: 1,
                content: util.format(util.lang.index.talkDel, val.username),
                okHandler: function (dialog) {
                    $.post(url, val, function (resp) {
                        // success
                        window.location.reload();
                    });
                } 
            });
        }

        if (command == 'userban') {
            url = pageParams.ajaxUrl.delTalk;

            util.confirm({
                modal: 1,
                content: util.format(util.lang.index.userBan, val.username),
                okHandler: function (dialog) {
                    $.post(url, val, function (resp) {
                        // success
                        window.location.reload();
                    });
                } 
            });
        }

        if (command == 'markread') {
            var url = target.attr('data-url');

            util.confirm({
                title: '标记已读',
                modal: 1,
                content: util.lang.index.markread,
                okHandler: function (dialog) {
                    $.post(url, val, function (resp) {
                        // success
                        window.location.reload();
                    });
                } 
            });
        }

        // 屏蔽用户管理
        if (command == 'blackmanage') {
            // todo 
            // 弹出层
        }
    }

    /**
     * 写纸条的处理逻辑
     */
    $('.popup-trigger').on('click', function () {
        util.showPopup($(this).attr('data-id'), {
            title: '写纸条',
            width: 440,
            modal: true
        });
        return false;
    });

    // action=new写消息的时候自动弹出来
    if (pageParams.isNew > 0) {
        util.showPopup('new-msg', {
            title: '写纸条',
            width: 640,
            modal: true
        });

        if (pageParams.tousername) {
            $('#add-input').val(pageParams.tousername);
        }
    }

    $('.popup .close').on('click', function () {
        $(this).closest('.popup').hide();
        $('.mask').remove();
    });


    // 操作栏按钮
    var baseOperation = $('.operation');
    var delOperation = $('.operation-del');
    var searchOperation = $('.operation-search');

    var msgFormWrap = $('#msg-form');

    var checkAllLabel = $('.main .delete-all');
    var checkAllBox = checkAllLabel.children('input:checkbox');

    $('#btn-batch-del').on('click', function () {
        baseOperation.hide();
        delOperation.show();
        $('.checkbox-list input:checkbox').show();
        msgFormWrap.hide();
        listModule.setDelMode(true);
    });

    $('.btn-del-cancel').on('click', function () {
        baseOperation.show();
        delOperation.hide();
        $('.checkbox-list input:checkbox').hide();
        msgFormWrap.show();
        listModule.setDelMode(false);
    });

    checkAllBox.on('click', function () {
        var checked = $(this).prop('checked');
        checkAllBox.prop('checked', checked);
        $('.checkbox-list input:checkbox').prop('checked', checked);
    });

    var confirmDialog;

    // talk delete
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
                    var checkedVal = $.map($('.checkbox-list input:checked'), function (item) {
                        return item.value;
                    });
                    if (!checkedVal.length) {
                        return;
                    }

                    var url = pageParams.ajaxUrl.delTalkBatch;
                    $.post(url, {
                        data: checkedVal
                    }, function (resp) {
                        // success
                        window.location.reload();
                    });

                }
            });
        }
    });

    // 搜索事件
    $('#btn-search').on('click', function () {
        baseOperation.hide();
        searchOperation.show();
        msgFormWrap.hide();
    });
    $('#btn-search-cancel').on('click', function () {
        baseOperation.show();
        searchOperation.hide();
        msgFormWrap.show();
    });

});


/**
 * 写纸条的交互逻辑模块
 * 
 * @type {Object}
 */
var newMsgModule = (function () {
    var msgForm = $('#new-msg-form');
    var touserBox = msgForm.find('.inputbox-username');
    var addInput = msgForm.find('#add-input');
    var textarea = msgForm.find('textarea');
    var sendBtn = msgForm.find('#btn-send');

    function bindSend() {
        sendBtn.on('click', function () {
            // todo $.ajax({});
        });
    }

    return {
        init: function () {
            bindSend();
        }
    };

})();



/**
 * 加载更多消息列表
 * @type {Object}
 */
var listModule = (function () {
    
    var loadMoreBtn = $('#talk-msg-load');
    var talkList = $('#talk-msg-list');

    var page = 1;
    var isAjax;
    var TALK_URL = talkList.attr('data-url');
    var isLoadend;
    var isDelMode;

    var loading = {
        load: function () {
            loadMoreBtn.attr('data-loading', 1).text('加载中...');
        },
        success: function () {
            loadMoreBtn.attr('data-loading', 0).text('点击加载更多...');
        },
        complete: function () {
            loadMoreBtn.addClass('load-more-end').attr('data-loading', 0).text('已加载完毕');
        }
    };

    function loadList(page) {
        if (isAjax) {
            return false;
        }
        var url = TALK_URL + '&page=' + page;
        isAjax = 1;
        loading.load();

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (json) {
                setTimeout(function () {

                    isAjax = 0;
                    
                    if (json.status === 0) {
                        renderList(json.data.list || []);
                        loading.success();
                        if (json.data.loadend) {
                            isLoadend = 1;
                            loading.complete();
                        }
                    }
                }, 1000);
                
            },
            failure: function () {
                isAjax = 0;
            }
        });
    }

    var _tpl = ''
        + '<li class="talk-msg-item clear">'
        +     '<fieldset class="date-talk">'
        +         '<legend class="time-title">#{dateline}</legend>'
        +     '</fieldset>'
        +     '<section class="#{talkStyle} clear">'
        +         '<a class="avatar-talk user-avator" href="#{url}" title="#{username}">'
        +             '<img class="avator-round" src="#{avator}">'
        +         '</a>'
        +         '<div class="content-talk">'
        +             '<div class="msg-arrow">'
        +               '<em class="line-c">◆</em><span class="bg-c">◆</span>'
        +             '</div>'
        +             '<div class="msg-dialog-box">'
        +                 '<input type="checkbox" name="deletepm_delid[]" class="checkbox #{delStyle}" value="#{pmid}">'
        +                 '<p class="msg-dialog-text">#{content}</p>'
        +             '</div>'
        +         '</div>'
        +     '</section>'
        + '</li>';

    function renderList(list) {
        var html = [];
        $.each(list, function (i, data) {
            data.talkStyle = 'guest-talk';
            if (data.issend) {
                data.talkStyle = 'me-talk';
            }
            data.delStyle = 'hide';
            if (isDelMode) {
                data.delStyle = '';
            }

            html[i] = util.format(_tpl, data);
        });

        talkList.append(html.join(''));

        if (html.length) {
            $('.operation-del').removeClass('hide-forever');
        }
    }

    function bindClicker() {
        loadMoreBtn.on('click', function () {
            if (isLoadend) {
                return false;
            }
            loadList(++page);
        });
    }

    return {
        init: function () {
            if (talkList.size()) {
                bindClicker();
            }
        },
        setDelMode: function (bool) {
            isDelMode = bool;
        }
    };
})();

$(function () {


    /**
     * message list 页面逻辑处理
     */
    
    var confirmDialog;

    // messaga delete
    $('.btn-delpm-confirm').on('click', function () {
        if (confirmDialog) {
            confirmDialog.show();
        }
        else {
            confirmDialog = util.confirm({
                content: '确认要删除这些对话记录吗？',
                modal: 1,
                okHandler: function () {
                    var dialog = this;
                    var checkedVal = $.map($('.checkbox-list input:checked'), function (item) {
                        return item.value;
                    });

                    if (checkedVal.length) {
                        $.post(pageParams.ajaxUrl.delMsgBatch, {
                            data: checkedVal
                        }, function (resp) {
                            // success
                            window.location.reload();
                        });
                    }
                }
            });
        }
    });

    var replyForm = $('#chat-sendmsg-form');
    var replyText = $('#chat-sendmsg-box').find('.txt');
    var replyTextWrap = replyText.parent();
    var replyBtn = $('#form-send-btn');

    replyText.on('focusin', function () {
        replyTextWrap.addClass('msg-textbox-focus');
        replyText.addClass('textarea-expanded');
        replyBtn.parent().removeClass('hide');
    }).on('focusout', function () {
        replyTextWrap.removeClass('msg-textbox-focus');
    });

    replyBtn.on('click', function () {
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

    listModule.init();

    var appl = $('.appl');

});