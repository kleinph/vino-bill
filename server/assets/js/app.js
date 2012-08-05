function Invoice() {
	var self = this;
	var itemCount = 0;
	var total = 0;
	
	this.rebate = 0;
	this.customerData;
	this.items = {};
	
	this.addItem = function(item) {
		if (!this.items[item.id]) {
			item.pos = ++itemCount;
			this.items[item.id] = item;
			this.items[item.id].updateTable();
			log.info("added item " + item.id + " (" + item.name + ")");
		} else {
			if (item.quantity == 0) {
				$("#wine-table #item-" + item.id).remove();
				--itemCount;
				updateIndices(this.items[item.id].pos);
				delete this.items[item.id];
				log.info("deletd " + item.id + " (" + item.name + ")");
			} else {
				this.items[item.id].quantity = item.quantity;
				this.items[item.id].updateTable();
				log.info("updated item #" + item.pos + " (" + item.name + ")");
			}
		}
		
		calculateTotal();
	}
	
	this.setRebate = function(rebate) {
		this.rebate = rebate;
		
		if (this.rebate == 0) {
			$("#wine-table #rebate").remove();
		} else {
			if ($("#wine-table #rebate").length == 0) {
				$("#wine-table #total").before(
					"<tr id='rebate' class='well'>" +
					"  <td class='right' colSpan='3'>Rabbat</td>" +
					"  <td class='right rebate'>"+ this.rebate + " %</td>" +
					"  <td class='right sum'></td>" +
					"</tr>"
				);
			} else {
				$("#wine-table #rebate .rebate").html(this.rebate + " %");
			}
		}
		
		calculateTotal();
	}
	
	function calculateTotal() {
		var total = 0;
		
		for (id in self.items) {
			total += self.items[id].price * self.items[id].quantity;
		}
		
		if (self.rebate != 0) {
			$("#wine-table #rebate .sum").html("€ " + (total * (self.rebate / 100)).toFixed(2).replace('.', ','));
			total *= (100 - self.rebate) / 100;
		}
		
		$("#wine-table #total .total").html("€ " + total.toFixed(2).replace('.', ','));
	}
	
	function updateIndices(startIndex) {
		for (id in self.items) {
			if (self.items[id].pos > startIndex) {
				--self.items[id].pos;
				self.items[id].updateTable();
			}
		}
	}
	
}

function InvoiceItem(id, name, quantity, price) {
	this.pos;
	this.id = id;
	this.name = name;
	this.quantity = quantity;
	this.price = price;
	
	this.updateTable = function() {
		var sum = "€ " + (this.quantity * this.price).toFixed(2).replace('.', ',');
		
		if ($("#wine-table #item-" + this.id).length == 0) {
			$("#wine-table .well:first").before(
				"<tr id='item-" + this.id + "'>" +
				"  <td class='pos'>" + this.pos + "</td>" +
				"  <td>" + this.name + "</td>" +
				"  <td class='right'>€ " + this.price.replace('.', ',') + "</td>" +
				"  <td class='right quantity'>" + this.quantity + "</td>" +
				"  <td class='right sum'>" + sum + "</td>" +
				"</tr>"
			);
		} else {
			$("#wine-table #item-" + this.id + " .pos").html(this.pos);
			$("#wine-table #item-" + this.id + " .quantity").html(this.quantity);
			$("#wine-table #item-" + this.id + " .sum").html(sum);
		}
	}
}

var invoice = new Invoice();

function updateTable(field) {
	id = getId(field)
	name = $("#wine-" + id + " .description").html();
	quantity = $("#quantity-" + id).val();
	price = $("#wine-" + id + " .price").html().replace(',', '.');
	
	item = new InvoiceItem(id, name, quantity, price);
	invoice.addItem(item);
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


// This is needed to prevent CSRF
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
