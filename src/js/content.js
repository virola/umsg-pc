/**
 * @file 消息列表文件逻辑处理
 */
var util = window.util || {};
var pageParams = window.pageParams || {};

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
                isAjax = 0;
                if (json && json.list && (json.list instanceof Array)) {
                    var list = json.list;

                    renderList(list || []);
                    loading.success();

                    if (json['page_total'] === false) {
                        isLoadend = 1;
                        loading.complete();
                    }
                }
                else {
                    loading.success();
                    page--;
                }
                
            },
            failure: function () {
                isAjax = 0;
                page--;
            }
        });
    }

    var _tpl = ''
        + '<li class="talk-msg-item clear">'
        +     '<fieldset class="date-talk">'
        +         '<legend class="time-title">#{dateline}</legend>'
        +     '</fieldset>'
        +     '<section class="#{talkStyle} clear">'
        +         '<a class="avatar-talk user-avator" ' 
        +           'href="http://xiaozu.' 
        + pageParams.siteDomain + '/home.php?mod=space&uid=#{userid}&do=profile" title="#{username}">'
        +             '<img class="avator-round" ' 
        +               'src="http://my.' 
        + pageParams.siteDomain + '/?app=user&func=getAvatar&pro=uv&user_id=#{userid}&type=small">'
        +             '<span>#{username}</span>'
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
            if (!data['message_id']) {
                html[i] = '';
                return;
            }
            
            var talkStyle = 'guest-talk';
            if (data.isOwner) {
                talkStyle = 'me-talk';
            }
            var delStyle = 'hide';
            if (isDelMode) {
                delStyle = '';
            }

            html[i] = util.format(_tpl, {
                dateline: data['insert_time'],
                talkStyle: talkStyle,
                delStyle: delStyle,
                pmid: data['message_id'],
                content: data['content'],
                username: data['insert_name'],
                avator: data['avator'],
                userid: data['insert_id']
            });
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

    // message delete
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
                            'message_id': checkedVal.join(',')
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
            }
        }).done(function (resp) {
            if (resp) {
                window.location.reload();
            }
        });

        return false;
    });

    listModule.init();

    $('#btn-batch-del').on('click', function () {
        listModule.setDelMode(true);
    });

    $('.btn-del-cancel').on('click', function () {
        listModule.setDelMode(false);
    });

    var appl = $('.appl');

});


// 会话用户管理
var userModule = (function () {
    var exports = {};

    var manageDialog = $('.user-manage');

    function bindEvents() {
        $('#btn-adduser').on('click', function () {

        });
    }

    exports.init = function () {
        bindEvents();
    };

    return exports;
})();

$(function () {
    userModule.init();
});

