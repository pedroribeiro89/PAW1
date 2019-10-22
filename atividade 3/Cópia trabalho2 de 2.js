// UTIL
function formatCode(codeValue) {
    var formatedValue = codeValue + '';
    while (formatedValue.length < 6) { formatedValue = "0" + formatedValue; }
    return formatedValue;
}

// INITIAL VALUES
initialStatementData = [		  
	{ item_date: new Date(2019, 4, 1).toString(), code: 53, description: 'Depósito de salário', value: 8000.0},
	{ item_date: new Date(2019, 4, 3).toString(), code: 69, description: 'Saque', value: -150.0},
	{ item_date: new Date(2019, 4, 3).toString(), code: 70, description: 'Conta de luz', value: -329.0},
	{ item_date: new Date(2019, 4, 4).toString(), code: 90, description: 'Supermercado', value: -197.0},
	{ item_date: new Date(2019, 4, 5).toString(), code: 112, description: 'Resgate da Poupança', value: 500.0},
	{ item_date: new Date(2019, 4, 9).toString(), code: 215, description: 'Pagamento de fatura de cartão', value: -2500.0},
	{ item_date: new Date(2019, 4, 9).toString(), code: 221, description: 'Restaurante', value: -69.0}
];
var stmt;

function initStmtData() {
	stmt = JSON.parse(localStorage.getItem('stmtData'));
	if (stmt === undefined || stmt === null || stmt.length === 0) {
		stmt = initialStatementData;
		localStorage.setItem('stmtData', JSON.stringify(stmt));
	}
}

// STATEMENT DOM
function addStmtItemToDOM(stmtItem, id) {
	var balance = stmtItem.value;
	if (id !== 0) { balance += Number($('#balance'+(id-1)).text()); }

	$('tbody').append(`<tr id=\"${id}\""></tr>`);
	var row = $('#'+id).append(`<td>${new Date(stmtItem.item_date).toLocaleDateString('pt-br')}</td>`)
			           .append(`<td>${formatCode(stmtItem.code)}</td>`)
			           .append(`<td id=\"desc${id}\" contenteditable="true">${stmtItem.description}</td>`);
	if (stmtItem.value < 0)	{ row.append(`<td class="negative-value" id=\"val${id}\" contenteditable="true">${stmtItem.value.toFixed(2)}</td>`) }
	else { row.append(`<td id=\"val${id}\" contenteditable="true">${stmtItem.value.toFixed(2)}</td>`) }
	if (balance < 0) { row.append(`<td class="negative-value" id=\"balance${id}\">${balance.toFixed(2)}</td>`); }
	else { row.append(`<td id=\"balance${id}\">${balance.toFixed(2)}</td>`); }
	row.append(`<td><button id=\"btn${id}\" type=\"button\" class=\"btn btn-outline-danger\">Remover</button></td>`);

	$('#desc'+id).keyup((event) => changeStmtItemDescription(event, id));
	$('#val'+id).keyup((event) => changeStmtItemValue(event, id));
	$('#btn'+id).click(() => removeStmtItem(id));
}

function rebuildStmtDOM() {
	$('tbody').empty();
	for(var i = 0; i < stmt.length; ++i) {
		addStmtItemToDOM(stmt[i], i);
	}
}

// FORM
function validateForm(form, event) {
	if (form.checkValidity() === false) {
    	event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
}

function addFormStmtItem(form) {
	var date = $('#dateInput').val() + 'T00:00:00';
	var code = $('#codeInput').val();
	var desc = $('#descriptionInput').val();
	var val = Number($('#valueInput').val());
	var newItem = { item_date: new Date(date).toString(), code: code, description: desc, value: val }; 
	addStmtItemToDOM(newItem, stmt.length);
	stmt.push(newItem);
	localStorage.setItem('stmtData', JSON.stringify(stmt));
}

function cleanForm() {
	$('#dateInput').val(null);
	$('#codeInput').val(null);
	$('#descriptionInput').val(null);
	$('#valueInput').val(null);
}

function configureAddItemForm() {
	var form = document.getElementById('addItemForm');
 	form.addEventListener('submit', (event) => validateForm(form, event), false);

    $('#modalButton').click((event) => {
    	validateForm(form, event);
        if (form.checkValidity() === true) {
          addFormStmtItem(form);
          $('#addItemModal').modal('hide');
          cleanForm();
        }
    });
}

// STATEMENT 
function saveRebuildStmtDOM() {
	localStorage.setItem('stmtData', JSON.stringify(stmt));
	rebuildStmtDOM();
}
function removeStmtItem(id) {
	stmt.splice(id, 1);
	saveRebuildStmtDOM();
}

// SORT
function sortByDate() {
	// JAVASCRIPT SORT: stmt.sort((a, b) => { return new Date(a.item_date).getTime() - new Date(b.item_date).getTime(); });
	mysort(stmt, (a, b) => { return new Date(a.item_date).getTime() - new Date(b.item_date).getTime(); });
	saveRebuildStmtDOM();
}
function sortByCode() {
	// JAVASCRIPT SORT: stmt.sort((a, b) => { return a.code - b.code; });
	mysort(stmt, (a, b) => { return a.code - b.code; });
	saveRebuildStmtDOM();
}

// CHANGE TABLE ITENS
function changeStmtItemDescription(event, id) {
	stmt[id].description = event.target.innerHTML;
	localStorage.setItem('stmtData', JSON.stringify(stmt));
}
function changeStmtItemValue(event, id) {
	console.log(event);
	if (isNaN(event.target.innerHTML)) {
		event.target.innerHTML = event.target.innerHTML.replace(event.key, '');
	} else {
		stmt[id].value = Number(event.target.innerHTML);
		saveRebuildStmtDOM();
	}
}

//LOADED PAGE
$(document).ready(function() {
	initStmtData();
	rebuildStmtDOM();

	$('#date-col').click(sortByDate);
	$('#code-col').click(sortByCode);
	
	configureAddItemForm();
});