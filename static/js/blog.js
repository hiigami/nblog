function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

var eApp = eApp || { host: location.protocol + '//' + location.host, val: 0, _slug:""};

eApp.getcsrftoken = function(){
    return $(".csrftoken").text();
}

eApp.ajax = function (url, data, action, type, $responseElement, _processData, _contentType) {
    _processData = typeof _processData !== 'undefined' ? _processData : true;
    _contentType = typeof _contentType !== 'undefined' ? _contentType : "application/x-www-form-urlencoded; charset=UTF-8"; 
    var csrftoken = getCookie("csrftoken");
    var newurl = eApp.host + url;
    var arr = document.URL.match(/next=([//a-zA-Z0-9]+)/)
    if (arr != null && arr[1])
        newurl += "?next=" + arr[1];
    return $.ajax({
        type: type,
        url: newurl,
        data: data,
        processData: _processData,
        contentType: _contentType,
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader("X-CSRF-Token", eApp.getcsrftoken());
            }
        },
        success: function (data) {
            switch (action) {
                case "displayTable":
                    eApp.displayTable(data, $responseElement);
                    break;
                case "displayJson":
                    eApp.displayJson(data, $responseElement);
                    break;
                case "displayButton":
                    eApp.displayButton(data, $responseElement);
                    break;
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            /*console.log(xhr);
            console.log(textStatus);
            console.log(errorThrown);*/
        }
    });
}

eApp.displayJson = function (data, $responseElement) {
    data=data.data;
    var _data = (data.error) ? data.error : data.success;
    if ($responseElement) {
        $responseElement.empty();
        if (data.error) {
            $responseElement.parent().removeClass("alert-success hidden").addClass("alert-danger");
        } else if (data.success) {
            $responseElement.parent().removeClass("alert-danger hidden").addClass("alert-success");
        } else {
            $.each(data, function (key, val) {
                $responseElement.append("<div><a href='" + key + "' class='" + $responseElement.data("elclass") + "'>" + val + "</a></div>");
            });
            $responseElement.show();
        }
    } else {
        eApp.notifications(_data);
        if (data.return) {
            $.each(data.return, function (key, val) {
                if(key!="file"){
                    $("input[name=" + key + "]").val(val);
                }
            });
        }
    }
    if(!data.error){
        var count = $(".site-content .row").children().length;
        if(count%3==0){
            $(".site-content .row").append("<div class='clearfix'></div>");
        }
        $(".site-content .row").append('<div class="col-post col-md-4">'+
                    '<div class="post">'+
                        '<dl class="dl-horizontal">'+
                            '<dt><img src="img/ic_action_dock.png" alt="..." class="img-circle"></dt>'+
                            '<dd>'+
                                '<h4>'+$("form input[name=author]").val()+'</h4>'+
                                '<p>'+$("form input[name=author]").val()+'</p>'+
                            '</dd>'+
                        '</dl>'+
                        '<div class="post-body">'+
                            '<h4>'+$("form input[name=title]").val()+'</h4>'+
                            '<div><img src="'+$("#base").text()+'" class="img-responsive"/></div>'+
                            '<div class="post-body-content">'+
                                $("form input[name=content]").val()+
                            '</div>'+
                        '</div>'+
                        '<div class="post-footer"><button class="btn btn-default btn-vote" data-action="/vote/" data-slug="'+eApp._slug+'" data-title="'+$("form input[name=title]").val()+'" data-display="displayButton">+ 0</button></div>'+
                    '</div>'+
                '</div>');
    }   
    if (data.next) { window.location.href = data.next; }
}

eApp.displayButton = function (data, $responseElement) {
    var _data = (data.data.error) ? data.data.error : data.data.success;
    if ($responseElement) {
    	if(!isNaN(eApp.val)){
    		$responseElement.html("+ " + eApp.val);
    	}
    }
    //eApp.notifications(_data);
}

eApp.notifications = function (data) {
    var _data = "";
    var _tmp = $.extend(true, "", data);
    if ($(".notifications").hasClass('anime')) {
        setTimeout(function () { eApp.notifications(_tmp); }, 1000);
    } else {
        $(".notifications").addClass('anime');
        $.each(data, function (key, val) { _data += key + " : " + val + "<br>" });
        $(".notifications .notifications-text").empty().html(_data);
        $(".notifications").animate({
            left: "+=300"
        }, 1000).delay(2000).animate({ left: "-=300" }, 1000, function () { $(".notifications").removeClass('anime'); });
    }
}

function readImage() {
    if ( this.files && this.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
            document.getElementById('img').src = e.target.result;
            document.getElementById('base').innerHTML = e.target.result;
        };       
        FR.readAsDataURL(this.files[0]);
    }
}
    
eApp.generalClickHandler = function(){

	$("form").submit(function (e) {

        e.preventDefault();
        var $_form = $(this);
        var $btn = $(":submit", $_form);
        var txt_btn = eApp.disableEnableElement($btn, true, "<i class='glyphicon glyphicon-refresh'></i>");
        var newurl = $_form.attr("action");
        var newdata = $_form.serialize();
        eApp._slug=Math.random().toString(36).substring(8);
        if ($('input[name=slug]',$_form).val() == "") {
            newdata = newdata.replace("&slug=","");

        	newdata += "&slug="+eApp._slug+"&createdAt="+new Date()+"&votes=0&active=true";
        }
        newdata+="&_csrf="+eApp.getcsrftoken();
        var _contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        var _processData = true;
        if ($_form.find('input[type=file]').length > 0) {
            $('input[name=slug]',$_form).val(eApp._slug);
            newdata = new FormData($_form[0]);
            newdata.append("createdAt", new Date());
            newdata.append("votes", 0);
            newdata.append("active", true);
            _contentType = false;
            _processData = false;
        }
        var displayType = $_form.data("display") ? $_form.data("display") : null;
        var $displayEl = $_form.data("displayel") ? $($_form.data("displayel")) : null;
        $.when(eApp.ajax(newurl, newdata, displayType, 'POST', $displayEl, _processData, _contentType)).then(
            function () {
                eApp.disableEnableElement($btn, false, txt_btn);
            });
    });

	$('.show-modal').on('click', function () {
		var _action = 'show';
		//--- edit function ----
		$('#myModal').modal(_action);
	});

	$(".btn-vote").on("click", function(e){
		e.preventDefault();
		var $btn = $(this);
        var txt_btn = eApp.disableEnableElement($btn, true, "<i class='glyphicon glyphicon-refresh'></i>");
        var newurl = $btn.data("action");
        var displayType = $btn.data("display") ? $btn.data("display") : null;
        var $displayEl = $btn;
        eApp.val = eApp.newVoteSum(txt_btn);
        var newdata = {"vote": eApp.val, "title":$btn.data('title'), "slug":$btn.data('slug'), "_csrf":eApp.getcsrftoken() };
        var _contentType = "application/x-www-form-urlencoded; charset=UTF-8";
        var _processData = true;
		$.when(eApp.ajax(newurl, newdata, displayType, 'POST', $btn, _processData, _contentType)).then(
            function () {
                eApp.disableEnableElement($btn, false);
            });
	});

	document.getElementById("file").addEventListener("change", readImage, false);
}

eApp.newVoteSum = function(txt_btn){
	return parseInt(txt_btn.slice(2))+1;
}

eApp.disableEnableElement = function ($el, state, optionalNewHtml) {
    if ($el.is("a")) {
        if (state)
            $el.addClass("disabled");
        else
            $el.removeClass("disabled");
    } else
        $el.prop('disabled', state);
    if (optionalNewHtml !== undefined) {
        var old = $el.html();
        $el.html(optionalNewHtml)
        return old;
    }
}

eApp.run = function () {
    eApp.generalClickHandler();
}

function StartUp(app) {
    $(document).ready(app.run);
}

StartUp(eApp);