/**
 * @file 写纸条表单交互逻辑
 */

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

            addInput.tagsInput({
                width: 'auto',
                height: 'auto',
                defaultText: addInput.attr('placeholder') || '请输入对方用户名',
                placeholderColor: '#999',
                onChange: function (ele, eleTags) {

                },

                // autocomplete_url: ''
                
            });
        }
    };

})();


$(function () {

    newMsgModule.init();
});
