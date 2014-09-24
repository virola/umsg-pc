/**
 * @file 页面交互逻辑处理
 * @author virola
 */

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

    var allCheckbox = $('.msg-list input:checkbox');
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
});