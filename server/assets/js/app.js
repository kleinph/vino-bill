var pos = 0;

function updateTable(field) {
	id = getId(field)
	name = $("#wine-" + id + " .description").html();
	quantity = $("#quantity-" + id).val();
	price = $("#wine-" + id + " .price").html().replace(',', '.');
	sum = "€ " + (quantity * price).toFixed(2).replace('.', ',');
	
	if ($("#wine-table #item-" + id).length == 0) {
		$("#wine-table tbody").append(
			"<tr id='item-" + id + "'>" +
			"  <td>" + ++pos + "</td>" +
			"  <td>" + name + "</td>" +
			"  <td class='right'>€ " + price.replace('.', ',') + "</td>" +
			"  <td class='right quantity'>" + quantity + "</td>" +
			"  <td class='right sum'>" + sum + "</td>" +
			"</tr>"
		);
	} else if (quantity == 0) {
		$("#wine-table #item-" + id).remove();
		--pos;
	} else {
		$("#wine-table #item-" + id + " .quantity").html(quantity);
		$("#wine-table #item-" + id + " .sum").html(sum);
	}
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
