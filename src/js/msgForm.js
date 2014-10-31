/**
 * @file 写纸条表单交互逻辑
 */

var pageParams = window.pageParams || {};
var util = window.util || {};
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
    var sugSource = msgForm.find('.suggest-wrap>li');

    var isPosting;

    function bindSend() {

        sendBtn.on('click', function () {
            if (isPosting) {
                return;
            }
            var failed;

            var fakeInput = touserBox.find('.tagsinput input');
            var fakeVal = $.trim(fakeInput.val());
            if (fakeVal == fakeInput.attr('data-default')) {
                fakeVal = '';
            }

            var val = addInput.val();
            var users = val ? val.split(',') : [];
            if (fakeVal) {
                users.push(fakeVal);
            }

            // todo $.ajax({});
            if (!users.length) {
                touserBox.find('.tagsinput').addClass('input-invalid');
                failed = 1;
            }
            else {
                touserBox.find('.tagsinput').removeClass('input-invalid');
            }
            var content = $.trim(textarea.val());
            if (!content) {
                textarea.addClass('input-invalid');
                failed = 1;
            }
            else {
                textarea.removeClass('input-invalid');
            }

            var data = {
                'user_name': users.join(','),
                content: content
            };

            var url = pageParams.ajaxUrl.postMessage;
            if (!failed) {
                sendBtn.text('发送中...');
                isPosting = 1;
                
                $.post(url, data)
                    .done(function (resp) {
                        isPosting = 0;
                        window.location.reload();
                    })
                    .fail(function (resp) {
                        // fail
                        isPosting = 0;
                        sendBtn.text('发送');
                    });
            }
        });

        textarea.on('keypress', function () {
            textarea.removeClass('input-invalid');
        });
    }

    function initTagInput() {
        var data = $.map(sugSource, function (item, i) {
            return $(item).text();
        });
        addInput.tagsInput({
            width: 'auto',
            height: 'auto',
            defaultText: addInput.attr('placeholder') || '请输入对方用户名',
            placeholderColor: '#999',
            onAddTag: function () {
                touserBox.find('.tagsinput').removeClass('input-invalid');
            },
            autocomplete: {
                source: data,
                minLength: 0,
                position: {
                    my: 'left top+2'
                }
            },
            autocompleteUrl: '#'
        });
    }

    return {
        init: function () {
            bindSend();
            initTagInput();
        }
    };

})();

/**
 * 黑名单管理逻辑模块
 * @type {Object}
 */
var blackModule = (function () {
    var msgForm = $('#black-manage-form');
    var adduserBox = msgForm.find('.inputbox');
    var addInput = msgForm.find('#add-black-input');
    var addBtn = msgForm.find('#add-black-btn');
    var manageList = msgForm.find('.black-list');
    var manageInfo = msgForm.find('.black-form-info');

    var exports = {};

    function initTagInput() {
        addInput.tagsInput({
            width: 'auto',
            height: 'auto',
            defaultText: addInput.attr('placeholder') || '输入用户名',
            placeholderColor: '#999',
            onAddTag: function () {
                adduserBox.find('.tagsinput').removeClass('input-invalid');
            }
        });
    }

    var tpl = ''
        + '<li>'
        +     '<div class="user-head fl">' 
        +       '<img src="http://my.94uv.com/?app=user&func=getAvatar&pro=uv&user_id=#{1}&type=middle"></div>'
        +     '<div class="li-info fl">'
        +         '<h4 class="title">#{0}</h4>'
        +         '<div class="li-btn">'
        +             '<a href="javascript:void(0);" data-command="unblock" ' 
        +             'data-value="{black_id:#{1},username:\'#{0}\'}" class="btn-small">解除屏蔽</a>'
        +         '</div>'
        +     '</div>'
        + '</li>'
    ;

    function bind() {
        var isPosting;
        var url = pageParams.ajaxUrl.banUserBatch;
        addBtn.on('click', function () {
            var users = addInput.val();
            if (!users) {
                return false;
            }

            if (isPosting) {
                return false;
            }

            isPosting = 1;

            $.ajax({
                type: 'post',
                url: url, 
                data: {
                    'user_name': users
                }, 
                dataType: 'json'
            }).done(function (resp) {
                isPosting = 0;
                var manageCount = parseInt(manageInfo.find('i').text(), 10);

                if (resp && resp.status == 1) {
                    addInput.importTags('');

                    var user = resp.username;
                    var html = '';
                    var count = 0;
                    $.each(user, function (key, item) {
                        html += util.format(tpl, item, key);
                        manageCount++;
                    });

                    manageInfo.find('i').text(manageCount);
                    manageList.append(html);
                }
            }).fail(function (resp) {
                isPosting = 0;
            });

        });
    }

    exports.init = function () {
        if (msgForm.size() > 0) {
            initTagInput();
            bind();
        }
        
    };


    return exports;
})();



/**
 * 会话用户管理逻辑模块
 * @type {Object}
 */
var talkUserModule = (function () {
    var msgForm = $('#talkuser-manage-form');
    var adduserBox = msgForm.find('.inputbox');
    var addInput = msgForm.find('#add-talkuser-input');
    var addBtn = msgForm.find('#add-talkuser-btn');
    var manageList = msgForm.find('.black-list');
    var manageInfo = msgForm.find('.black-form-info');

    var exports = {};

    function initTagInput() {
        addInput.tagsInput({
            width: 'auto',
            height: 'auto',
            defaultText: addInput.attr('placeholder') || '输入用户名',
            placeholderColor: '#999',
            onAddTag: function () {
                adduserBox.find('.tagsinput').removeClass('input-invalid');
            }
        });
    }

    var tpl = ''
        + '<li>'
        +     '<div class="user-head fl">' 
        +       '<img src="http://my.94uv.com?app=user&func=getAvatar&pro=uv&user_id=#{1}&type=middle"></div>'
        +     '<div class="li-info fl">'
        +         '<h4 class="title">#{0}</h4>'
        +         '<div class="li-btn">'
        +             '<a href="javascript:void(0);" data-command="deluser" ' 
        +               'data-value="{user_id:#{1},username:\'#{0}\'}" class="btn-small">删除用户</a>'
        +         '</div>'
        +     '</div>'
        + '</li>'
    ;

    function bind() {
        var isPosting;
        var url = pageParams.ajaxUrl.addTalkUserBatch;
        
        addBtn.on('click', function () {
            var users = addInput.val();
            if (!users) {
                return false;
            }

            if (isPosting) {
                return false;
            }

            isPosting = 1;

            $.ajax({
                type: 'post',
                url: url, 
                data: {
                    'user_name': users
                }, 
                dataType: 'json'
            }).done(function (resp) {
                isPosting = 0;
                var manageCount = parseInt(manageInfo.find('i').text(), 10);

                if (resp && resp.status == 1) {
                    addInput.importTags('');

                    var user = resp.username;
                    var html = '';
                    var count = 0;
                    $.each(user, function (key, item) {
                        html += util.format(tpl, item, key);
                        manageCount++;
                    });

                    manageInfo.find('i').text(manageCount);
                    manageList.append(html);
                }
            }).fail(function (resp) {
                isPosting = 0;
            });

            return false;
        });
    }

    exports.init = function () {
        if (msgForm.size() > 0) {
            initTagInput();
            bind();
        }
        
    };


    return exports;
})();


$(function () {

    newMsgModule.init();
    blackModule.init();
    talkUserModule.init();
});
