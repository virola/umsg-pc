/**
 * @file 页面交互逻辑处理
 * @author virola
 */
var util = window.util || {};
var pageParams = window.pageParams || {};


// common interactions
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

    $('.weixin').on('mouseover', function () {
        $(this).children('div').show();
    }).on('mouseout', function () {
        $(this).children('div').hide();
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
        $(document.body).animate({scrollTop: 0}, 'fast');
    });

    // side fixed
    var mainDom = $('.main');
    var mainHeight = mainDom.height();
    var sideFixed = $('.side .appl');
    var scrollGap = sideFixed.offset().top + sideFixed.outerHeight();
    var timerSide;
    $(window).on('scroll', function () {
        var scrollTop = $(window).scrollTop();

        if (scrollTop > scrollGap) {
            if (timerSide) {
                clearTimeout(timerSide);
            }

            timerSide = setTimeout(function () {
                var scrollTop = $(window).scrollTop();
                // var sideT = sideFixed.offset().top;

                if (scrollTop > scrollGap) {
                    sideFixed.addClass('fixed');
                }
            }, 500);
        }
        else {
            sideFixed.removeClass('fixed');
        }
    });

});


// content interactions
$(function () {

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
            url = target.attr('data-url');

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
            util.showPopup('black-manage', {
                width: 540,
                modal: true
            });
        }

        // 屏蔽用户管理
        if (command == 'adduser') {
            util.showPopup('talkuser-manage', {
                width: 540,
                modal: true
            });
        }

        // unblock
        if (command == 'unblock') {
            url = pageParams.ajaxUrl.unblockUser;
            $.post(url, val).done(function (resp) {
                if (parseInt(resp, 10) == 1) {
                    // success
                    target.closest('li').remove();
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
            width: 450,
            modal: true
        });
        return false;
    });

    // action=new写消息的时候自动弹出来
    if (pageParams.isNew > 0) {
        util.showPopup('new-msg', {
            title: '写纸条',
            width: 450,
            modal: true
        });

        if (pageParams.tousername) {
            $('#add-input').val(pageParams.tousername);
        }
    }

    $('.popup .close, .popup .popup-close').on('click', function () {
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
    });

    $('.btn-del-cancel').on('click', function () {
        baseOperation.show();
        delOperation.hide();
        $('.checkbox-list input:checkbox').hide();
        msgFormWrap.show();
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
                        'talk_id': checkedVal.join(',')
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


