

function showPopup(id, options) {
    var target = $('#popup-' + id);
    target.show();
    
    options = $.extend({}, options);

    // target.dialog(options);
    // target.dialog('open');

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


$(function () {

    $('.msg-list-item').on('mouseover', function () {
        $(this).addClass('item-hover');
    }).on('mouseout', function () {
        $(this).removeClass('item-hover');
    }).on('click', function (ev) {
        var item = $(this);
        var target = $(ev.target);
        
        if (target.hasClass('.checkbox')) {
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
        showPopup($(this).attr('data-id'), {
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
});