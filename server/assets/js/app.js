var pos = 0;

function updateTotal() {
	var total = 0;
	
	$("#wine-table .sum").each(function(index, object) {
		value = 
		total += Number($(this).html().replace(',', '.'));
	});
	
	$("#wine-table #total .total").html("€ " + total.toFixed(2).replace('.', ','));
}

function updateTable(field) {
	id = getId(field)
	name = $("#wine-" + id + " .description").html();
	quantity = $("#quantity-" + id).val();
	price = $("#wine-" + id + " .price").html().replace(',', '.');
	sum = (quantity * price).toFixed(2).replace('.', ',');
	
	if ($("#wine-table #item-" + id).length == 0) {
		$("#wine-table #total").before(
			"<tr id='item-" + id + "'>" +
			"  <td>" + ++pos + "</td>" +
			"  <td>" + name + "</td>" +
			"  <td class='right'>€ " + price.replace('.', ',') + "</td>" +
			"  <td class='right quantity'>" + quantity + "</td>" +
			"  <td class='right'>€ <span class='sum'>" + sum + "</span></td>" +
			"</tr>"
		);
	} else if (quantity == 0) {
		$("#wine-table #item-" + id).remove();
		--pos;
	} else {
		$("#wine-table #item-" + id + " .quantity").html(quantity);
		$("#wine-table #item-" + id + " .sum").html(sum);
	}
	
	updateTotal();
}

function decrease(field) {
	$("#quantity-" + getId(field)).val(function(index, value) {
		return --value;
	});
	updateTable(field);
}

function increase(field) {
	$("#quantity-" + getId(field)).val(function(index, value) {
		return ++value;
	});
	updateTable(field);
}

function getId(field) {
	return field.split('-')[1];
}

$("form").submit(function(event) {
	var formData = $("form").serialize();

	$.ajax({
		type: "POST",
  		url: "/rechnung/submit/",
  		data: formData,
		error: function(data) {	},
		success: function(data){
			alert(data);
		}
	}); 
	
	return false;
});


// This is neede dot prevent CSRF
jQuery(document).ajaxSend(function(event, xhr, settings) {
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
    function sameOrigin(url) {
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
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
