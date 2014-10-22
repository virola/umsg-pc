/**
 * @file 写纸条表单交互逻辑
 */

var pageParams = window.pageParams || {};
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
                username: users.join(','),
                content: content
            };

            var url = pageParams.ajaxUrl.postMessage;
            if (!failed) {
                $.post(url, data, function (resp) {

                }, 'json');
            }
        });

        textarea.on('keypress', function () {
            textarea.removeClass('input-invalid');
        });
    }

    function initTagInput() {
        addInput.tagsInput({
            width: 'auto',
            height: 'auto',
            defaultText: addInput.attr('placeholder') || '请输入对方用户名',
            placeholderColor: '#999',
            onAddTag: function () {
                touserBox.find('.tagsinput').removeClass('input-invalid');
            },
            autocomplete: {
                source: ['有节操', 'Luna很纠结', '小甜腥', '有拍管理员', 'admin'],
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


$(function () {

    newMsgModule.init();
});
