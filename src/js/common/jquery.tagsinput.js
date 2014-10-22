/*

	jQuery Tags Input Plugin 1.3.2
	
	Copyright (c) 2011 XOXCO, Inc
	
	Documentation for this plugin lives here:
	http://xoxco.com/clickable/jquery-tags-input
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com


	Modified by virola.
	2014-10-20

*/

(function($) {

	var delimiter = new Array();
	var tagsCallbacks = new Array();
	$.fn.doAutosize = function(o){
	    var minWidth = $(this).data('minwidth'),
	        maxWidth = $(this).data('maxwidth'),
	        val = '',
	        input = $(this),
	        testSubject = $('#'+ $(this).data('tester-id'));
	
	    if (val === (val = input.val())) {return;}
	
	    // Enter new content into testSubject
	    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	    testSubject.html(escaped);
	    // Calculate new width + whether to change
	    var testerWidth = testSubject.width(),
	        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
	        currentWidth = input.width(),
	        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                || (newWidth > minWidth && newWidth < maxWidth);
	
	    // Animate width
	    if (isValidWidthChange) {
	        input.width(newWidth);
	    }
  };

  $.fn.resetAutosize = function(options){
    var minWidth =  $(this).data('minwidth') || options.minInputWidth || $(this).width();
    var maxWidth = $(this).data('maxwidth') || options.maxInputWidth 
    	|| ($(this).closest('.tagsinput').width() - options.inputPadding);
    
    var val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
            position: 'absolute',
            top: -9999,
            left: -9999,
            width: 'auto',
            fontSize: input.css('fontSize'),
            fontFamily: input.css('fontFamily'),
            fontWeight: input.css('fontWeight'),
            letterSpacing: input.css('letterSpacing'),
            whiteSpace: 'nowrap'
        }),
        testerId = $(this).attr('id')+'-autosize-tester';

	    if (! $('#'+testerId).length > 0) {
	      	testSubject.attr('id', testerId);
	      	testSubject.appendTo('body');
	    }

	    input.data('minwidth', minWidth);
	    input.data('maxwidth', maxWidth);
	    input.data('tester-id', testerId);
	    input.css('width', minWidth);
  	};
  
	$.fn.addTag = function (value, options) {
		options = jQuery.extend({focus:false,callback:true},options);
		this.each(function() { 
			var id = $(this).attr('id');

			var tagslist = $(this).val().split(delimiter[id]);
			if (tagslist[0] == '') { 
				tagslist = new Array();
			}

			value = jQuery.trim(value);
	
			if (options.unique) {
				var skipTag = $(tagslist).tagExist(value);
				if (skipTag == true) {
				    $('#' + id + '-tag').addClass('taginputs-not-valid');
				}
			} else {
				var skipTag = false; 
			}
			
			if (value !='' && skipTag != true) { 
                $('<span>').addClass('tag').append(
                    $('<span>').text(value).append('&nbsp;&nbsp;'),
                    $('<a>', {
                        href  : '#',
                        title : '删除',
                        text  : 'x'
                    }).click(function () {
                        return $('#' + id).removeTag(escape(value));
                    })
                ).insertBefore('#' + id + '-addTag');

				tagslist.push(value);
			
				$('#'+id+'-tag').val('');
				if (options.focus) {
					$('#'+id+'-tag').focus();
				} else {		
					$('#'+id+'-tag').blur();
				}
				
				$.fn.tagsInput.updateTagsField(this,tagslist);
				
				if (options.callback && tagsCallbacks[id] && tagsCallbacks[id]['onAddTag']) {
					var f = tagsCallbacks[id]['onAddTag'];
					f.call(this, value);
				}
				if (tagsCallbacks[id] && tagsCallbacks[id]['onChange'])
				{
					var i = tagslist.length;
					var f = tagsCallbacks[id]['onChange'];
					f.call(this, $(this), tagslist[i-1]);
				}					
			}
	
		});		
		
		return false;
	};
		
	$.fn.removeTag = function(value) { 
			value = unescape(value);
			this.each(function() { 
				var id = $(this).attr('id');
	
				var old = $(this).val().split(delimiter[id]);
					
				$('#'+id+'-tagsinput .tag').remove();
				str = '';
				for (i=0; i< old.length; i++) { 
					if (old[i]!=value) { 
						str = str + delimiter[id] +old[i];
					}
				}
				
				$.fn.tagsInput.importTags(this,str);

				if (tagsCallbacks[id] && tagsCallbacks[id]['onRemoveTag']) {
					var f = tagsCallbacks[id]['onRemoveTag'];
					f.call(this, value);
				}
			});
					
			return false;
		};
	
	$.fn.tagExist = function(val) {
		return (jQuery.inArray(val, $(this)) >= 0); //true when tag exists, false when not
	};
	
	// clear all existing tags and import new ones from a string
	$.fn.importTags = function(str) {
        id = $(this).attr('id');
		$('#'+id+'-tagsinput .tag').remove();
		$.fn.tagsInput.importTags(this, str);
	}
		
	$.fn.tagsInput = function(options) { 
	    var settings = jQuery.extend({
	        interactive: true,
	        defaultText: 'add a tag',
	        minChars: 0,
	        width: '300px',
	        height: '100px',
	        autocomplete:  {selectFirst:  false },
	        'hide': true,
	        delimiter: ',',
	        'unique': true,
	        removeWithBackspace:  true,
	        placeholderColor: '#666666',
	        autosize:  true,
	        comfortZone:  20,
	        inputPadding:  6*2,
	    }, options);

		this.each(function() { 
			if (settings.hide) { 
				$(this).hide();				
			}
				
			var id = $(this).attr('id')
			
			var data = jQuery.extend({
				pid:id,
				realInput: '#'+id,
				holder: '#'+id+'-tagsinput',
				inputWrapper: '#'+id+'-addTag',
				fakeInput: '#'+id+'-tag'
			}, settings);
	
			delimiter[id] = data.delimiter;
			
			if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
				tagsCallbacks[id] = new Array();
				tagsCallbacks[id]['onAddTag'] = settings.onAddTag;
				tagsCallbacks[id]['onRemoveTag'] = settings.onRemoveTag;
				tagsCallbacks[id]['onChange'] = settings.onChange;
			}
	
			var markup = '<div id="'+id+'-tagsinput" class="tagsinput"><div id="'+id+'-addTag">';
			
			if (settings.interactive) {
				markup = markup + '<input id="'+id+'-tag" value="" data-default="'+settings.defaultText+'" />';
			}
			
			markup = markup + '</div><div class="tags-clear"></div></div>';
			
			$(markup).insertAfter(this);

			$(data.holder).css('width',settings.width);
			$(data.holder).css('height',settings.height);
	
			if ($(data.realInput).val()!='') { 
				$.fn.tagsInput.importTags($(data.realInput),$(data.realInput).val());
			}		
			if (settings.interactive) { 
				$(data.fakeInput).val($(data.fakeInput).attr('data-default'));
				$(data.fakeInput).css('color', settings.placeholderColor);
		        $(data.fakeInput).resetAutosize(settings);
		
				$(data.holder).bind('click', data, function (event) {
					$(event.data.fakeInput).focus();
				});
			
				$(data.fakeInput).bind('focus', data, function (event) {
					$(event.data.holder).addClass('tagsinput-focus');
					if ($(event.data.fakeInput).val() == $(event.data.fakeInput).attr('data-default')) { 
						$(event.data.fakeInput).val('');
					}
					$(event.data.fakeInput).css('color','#000000');		
				});
				$(data.fakeInput).bind('blur', data, function (event) {
					$(event.data.holder).removeClass('tagsinput-focus');
				});
						
				if (settings.autocompleteUrl != undefined) {
					var autocompleteOptions = {source: settings.autocompleteUrl};
					for (attrname in settings.autocomplete) { 
						autocompleteOptions[attrname] = settings.autocomplete[attrname]; 
					}
				
					if (jQuery.Autocompleter !== undefined) {
						$(data.fakeInput).autocomplete(settings.autocompleteUrl, settings.autocomplete);
						$(data.fakeInput).bind('result', data, function(event, data,formatted) {
							if (data) {
								$('#'+id).addTag(data[0] + '',{focus:true,unique:(settings.unique)});
							}
					  	});
					} else if (jQuery.ui.autocomplete !== undefined) {
						$(data.fakeInput).autocomplete(autocompleteOptions);
						$(data.fakeInput).bind('autocompleteselect', data, function (event, ui) {
							$(event.data.realInput).addTag(ui.item.value,{focus:true,unique:(settings.unique)});
							return false;
						});

						$(data.fakeInput).bind('focusin', data, function (event, ui) {
							$(event.data.fakeInput).autocomplete('search', $(event.data.fakeInput).val());
						});
					}
				
					
				} else {
						// if a user tabs out of the field, create a new tag
						// this is only available if autocomplete is not used.
						$(data.fakeInput).bind('blur', data, function (event) { 
							var d = $(this).attr('data-default');
							var fakeInput = $(event.data.fakeInput);
							if (fakeInput.val() != '' && fakeInput.val() != d) { 
								if ( (event.data.minChars <= fakeInput.val().length) 
									&& (!event.data.maxChars || (event.data.maxChars >= fakeInput.val().length)) 
								) {
									$(event.data.realInput).addTag(fakeInput.val(), { 
										focus: true,
										unique: (settings.unique)
									});
								}
							} 
							else {
								fakeInput.val(fakeInput.attr('data-default'));
								fakeInput.css('color',settings.placeholderColor);
							}
							return false;
						});
				
				}
				// if user types a comma, create a new tag
				$(data.fakeInput).bind('keydown', data, function(event) {
					if (event.which == 188 || event.which == 186 || event.which==13 ) {
					    event.preventDefault();
						if ( (event.data.minChars <= $(event.data.fakeInput).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fakeInput).val().length)) )
							$(event.data.realInput).addTag($(event.data.fakeInput).val(),{focus:true,unique:(settings.unique)});
					  	$(event.data.fakeInput).resetAutosize(settings);
						return false;
					} else if (event.data.autosize) {
			            $(event.data.fakeInput).doAutosize(settings);
            
          			}
				});
				//Delete last tag on backspace
				data.removeWithBackspace && $(data.fakeInput).bind('keydown', function(event)
				{
					if (event.keyCode == 8 && $(this).val() == '')
					{
						 event.preventDefault();
						 var lastTag = $(this).closest('.tagsinput').find('.tag:last').text();
						 var id = $(this).attr('id').replace(/-tag$/, '');
						 lastTag = lastTag.replace(/[\s]+x$/, '');
						 $('#' + id).removeTag(escape(lastTag));
						 $(this).trigger('focus');
					}
				});
				$(data.fakeInput).blur();
				
				//Removes the not-valid class when user changes the value of the fake input
				if (data.unique) {
				    $(data.fakeInput).keydown(function(event){
				        if (event.keyCode == 8 || event.keyCode == 188 || event.keyCode == 186 
				        	|| String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)
				        ) {
				            $(this).removeClass('taginputs-not-valid');
				        }
				    });
				}
			} // if settings.interactive
			return false;
		});
			
		return this;
	
	};
	
	$.fn.tagsInput.updateTagsField = function(obj,tagslist) { 
		var id = $(obj).attr('id');
		$(obj).val(tagslist.join(delimiter[id]));
	};
	
	$.fn.tagsInput.importTags = function(obj,val) {			
		$(obj).val('');
		var id = $(obj).attr('id');
		var tags = val.split(delimiter[id]);
		for (i=0; i<tags.length; i++) { 
			$(obj).addTag(tags[i],{focus:false,callback:false});
		}
		if (tagsCallbacks[id] && tagsCallbacks[id]['onChange'])
		{
			var f = tagsCallbacks[id]['onChange'];
			f.call(obj, obj, tags[i]);
		}
	};

})(jQuery);
