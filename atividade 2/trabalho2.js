//Util
function formatDate(date) { return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()} `; }
function formatCode(codeValue) {
    var formatedValue = codeValue + '';
    while (formatedValue.length < 6) { formatedValue = "0" + formatedValue; }
    return formatedValue;
}

//VARS
initialStatementData = [		  
	{ item_date: new Date(2019, 4, 1), code: 53, description: 'Depósito de salário', value: 8000.0},
	{ item_date: new Date(2019, 4, 3), code: 69, description: 'Saque', value: -150.0},
	{ item_date: new Date(2019, 4, 3), code: 70, description: 'Conta de luz', value: -329.0},
	{ item_date: new Date(2019, 4, 4), code: 90, description: 'Supermercado', value: -197.0},
	{ item_date: new Date(2019, 4, 5), code: 112, description: 'Resgate da Poupança', value: 500.0},
	{ item_date: new Date(2019, 4, 9), code: 215, description: 'Pagamento de fatura de cartão', value: -2500.0},
	{ item_date: new Date(2019, 4, 9), code: 221, description: 'Restaurante', value: -69.0}
];
var stmt;

//FUNCTIONS
function initStmtData() {
	stmt = JSON.parse(localStorage.getItem('stmtData'));
	if (stmt === undefined || stmt === null) {
		stmt = initialStatementData;
		localStorage.setItem('stmtData', JSON.stringify(stmt));
	}

}

function addStmtItemToDOM(stmtItem, id) {
	var balance = stmtItem.value;
	if (id !== 0) { balance += Number($('#balance'+(id-1)).text()); }

	$('tbody').append(`<tr id=\"${id}\""></tr>`);
	var row = $('#'+id).append(`<td>${formatDate(new Date(stmtItem.item_date))}</tr>`)
			           .append(`<td>${formatCode(stmtItem.code)}</tr>`)
			           .append(`<td>${stmtItem.description}</tr>`);
	if (stmtItem.value < 0)	{ row.append(`<td class="negative-value">${stmtItem.value.toFixed(2)}</tr>`) }
	else { row.append(`<td>${stmtItem.value.toFixed(2)}</tr>`) }
	if (balance < 0) { row.append(`<td class="negative-value" id=\"balance${id}\">${balance.toFixed(2)}</tr>`); }
	else { row.append(`<td id=\"balance${id}\">${balance.toFixed(2)}</tr>`); }
}

function rebuildStmtDOM() {
	$('tbody').empty();
	for(var i = 0; i < stmt.length; ++i){
		addStmtItemToDOM(stmt[i], i);
	}
}

//EVENTS
function orderByCode() {
	stmt.sort((a, b) => { return a.code - b.code; });
	localStorage.setItem('stmtData', JSON.stringify(stmt));
	rebuildStmtDOM();
}

$(document).ready(function() {
	initStmtData();
	rebuildStmtDOM();

	$('date-col').click();
	orderByCode();
});
