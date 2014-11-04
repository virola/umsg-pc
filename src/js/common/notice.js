/**
 * @file 消息数量请求通用js
 */

(function ($) {
    var domain = '94uv.com';
    var domain = '94uv.com';
    if (window.location.href.indexOf('94uv.dev') > -1) {
        domain = '94uv.dev';
    }
    if (window.location.href.indexOf('94uv.test') > -1) {
        domain = '94uv.test';
    }
    var url = 'http://zhitiao.' + domain + '/index.php?app=message&func=messageTotal';

    var doctit = document.title;

    function getMsgCnt() {
        $.ajax({
            url: url,
            cache: false,
            dataType: 'jsonp'
        }).done(function (resp) {
            var cnt = parseInt(resp.data, 10);
            var msgCount = cnt ? '(' + cnt + ')' : ''; 
            // $('#nav-top .message>i').text(msgCount);
            $('.top_nav .message, .nav-top .message').text('消息' + msgCount);

            if (cnt > 0) {
                document.title = '【新消息】' + doctit;
            }
        });
    }

    // 定时请求消息数量
    setInterval(function () {
        getMsgCnt();
    }, 30000);

    getMsgCnt();

})(jQuery);