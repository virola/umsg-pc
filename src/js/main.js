/**
 * @file 页面交互逻辑处理
 * @author virola
 */
var util = window.util || {};
var pageParams = window.pageParams || {};

$(function () {

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
            var command = target.attr('data-command');
            if (command == 'ban') {
                var uid = target.attr('data-uid');
            }
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
        if (command == 'talkdel') {
            var val = util.parseJSON(target.attr('data-value'));
            console.log(val);
            util.confirm({
                modal: 1,
                content: util.format(util.lang.index.talkDel, val.username),
                okHandler: function (dialog) {
                    console.log('delete talk~~');
                } 
            });
        }

        if (command == 'userban') {
            var val = util.parseJSON(target.attr('data-value'));
            console.log(val);
            util.confirm({
                modal: 1,
                content: util.format(util.lang.index.userBan, val.username),
                okHandler: function (dialog) {
                    console.log('ban user~~');
                } 
            });
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
                    // console.log(checkedVal);
                }
            });
        }
    });

    $('.btn-delpm-confirm').on('click', function () {
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
                    // console.log(checkedVal);
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
    
    /**
     * message list 页面逻辑处理
     */
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


