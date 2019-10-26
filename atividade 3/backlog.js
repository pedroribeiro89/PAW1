// INITIAL VALUES
var auxdata = {};
var backlogData = [];
var nextSprintData = [];
var currentSprintData = {};
var sprintHistoryData = [];


//LOCAL STORAGE OPERATIONS
function initBacklogData() {
    scrum = JSON.parse(localStorage.getItem('scrumSimples'));
	if (scrum === undefined || scrum === null || scrum.length === 0) {
		scrum = {
			auxdata: { currentId: 1, sprintId: 1 },
			backlogData: [],
			nextSprintData: [],
			currentSprintData: { todo: [], doing: [], done: [] },
			sprintHistoryData: []
		};
		localStorage.setItem('scrumSimples', JSON.stringify(scrum));
	}
	auxdata = scrum.auxdata;
	backlogData = scrum.backlogData;
	nextSprintData = scrum.nextSprintData;
	currentSprintData = scrum.currentSprintData;
	sprintHistoryData = scrum.sprintHistoryData;
}

function saveBacklog() {
	scrum = JSON.parse(localStorage.getItem('scrumSimples'));
	scrum.auxdata = auxdata;
	scrum.backlogData = backlogData;
	scrum.nextSprintData = nextSprintData;
	scrum.sprintHistoryData = sprintHistoryData;
	localStorage.setItem('scrumSimples', JSON.stringify(scrum));
}

function saveNewSprint() {
	scrum = JSON.parse(localStorage.getItem('scrumSimples'));
	scrum.auxdata = auxdata;
	scrum.currentSprintData = currentSprintData;
	scrum.nextSprintData = nextSprintData;
	scrum.sprintHistoryData = sprintHistoryData;
	localStorage.setItem('scrumSimples', JSON.stringify(scrum));
}

function addToSprint(event) {
	for(var i = 0; i < backlogData.length; ++i) {
		if (backlogData[i].id === event.data.taskId) {
			var task = backlogData.splice(i, 1)[0];
			nextSprintData.push(task);
			sortSprint();
			saveBacklog();
			rebuildBacklogTable();
			rebuildSprintTable();
			hideShowSprintButton();
			i = backlogData.length;
		}
	}
}

function deleteTask(event) {
	for(var i = 0; i < backlogData.length; ++i) {
		if (backlogData[i].id === event.data.taskId) {
			backlogData.splice(i, 1);
			saveBacklog();
			rebuildBacklogTable();
			i = backlogData.length;
		}
	}
}

function removeFromSprint(event) {
	for(var i = 0; i < nextSprintData.length; ++i) {
		if (nextSprintData[i].id === event.data.taskId) {
			var task = nextSprintData.splice(i, 1)[0];
			backlogData.push(task);
			sortBacklog();
			saveBacklog();
			rebuildBacklogTable();
			rebuildSprintTable();
			hideShowSprintButton();
			i = backlogData.length;
		}
	}
}

//HTML BUILDER
function buildTableRowHtml(task, isBacklog = true) {
	var priorityStr = '';
	var priorityStyle = '';
	if(task.priority === 3) {
		priorityStr = 'Alta';
		priorityStyle = 'class=\"high-priority\"';
	} else if(task.priority === 2) {
		priorityStr = 'Média';
		priorityStyle = 'class=\"medium-priority\"';
	} else {
		priorityStr = 'Baixa';
		priorityStyle = 'class=\"low-priority\"';
	}

	var actions = '';
	if (isBacklog) {
		actions = `<button type="button" class="btn btn-outline-danger" id=\"addToSprintBtn${task.id}\"">Adicionar Sprint</button>
        	       <button type="button" class="btn btn-outline-danger" id=\"deleteTaskBtn${task.id}\">Deletar</button>`;
	} else {
		actions = `<button type="button" class="btn btn-outline-danger" id=\"removeFromSprint${task.id}\"">Remover</button>`;
	}

	return `<tr id=\"backlog${task.id}\"">
		<td>${task.id}</td>
        <td>${task.name}</td>
        <td>${task.description}</td>
        <td>${task.storyPoints}</td>
        <td ${priorityStyle}>${priorityStr}</td> 
        <td>${actions}</td>
	</tr>`;
}

//DOM OPERATIONS
function rebuildBacklogTable() {
	var tableBody = $('#backlogBody');
	tableBody.empty();
	for (var i = 0; i < backlogData.length; ++i) {
		tableBody.append(buildTableRowHtml(backlogData[i]));
		$('#addToSprintBtn'+backlogData[i].id).click({taskId: backlogData[i].id}, addToSprint);
		$('#deleteTaskBtn'+backlogData[i].id).click({taskId: backlogData[i].id}, deleteTask);
	}
}

function rebuildSprintTable() {
	var tableBody = $('#sprintBody');
	tableBody.empty();
	for (var i = 0; i < nextSprintData.length; ++i) {
		tableBody.append(buildTableRowHtml(nextSprintData[i], false));
		$('#removeFromSprint'+nextSprintData[i].id).click({taskId: nextSprintData[i].id}, removeFromSprint);
	}
}

//BACKLOG OPERATIONS
function getNextBacklogId() {
	var id = auxdata.currentId;
	auxdata.currentId += 1;
	return id;
}

function sortBacklog() {
	backlogData.sort((a, b) => { 
		if (a.priority === b.priority) { return a.id - b.id; }
		else { return b.priority - a.priority; }
	});
}

function sortSprint() {
	nextSprintData.sort((a, b) => { 
		if (a.priority === b.priority) { return a.id - b.id; }
		else { return b.priority - a.priority; }
	});
}

function addBacklogTask(form) {
	var name = $('#nameInput').val();
	var desc = $('#descriptionInput').val();
	var storyPoints = $('#storyPointsInput').val();
	var priority = Number($('#priorityInput').val());
	var newTask = {
		id: getNextBacklogId(),
		name: name, 
		description: desc, 
		storyPoints: storyPoints, 
		priority: priority 
	};
	backlogData.push(newTask);
	sortBacklog();
	saveBacklog();
	rebuildBacklogTable();
}

function startNewSprint() {
	if (auxdata.sprintId !== 1) {
		sprintHistoryData.push(currentSprintData.done);
	}
	
	var newSprintTodo = [];
	newSprintTodo.push(...currentSprintData.todo);
	newSprintTodo.push(...currentSprintData.doing);
	newSprintTodo.push(...nextSprintData);

	newSprintTodo.sort((a, b) => { 
		if (a.priority === b.priority) { return a.id - b.id; }
		else { return b.priority - a.priority; }
	});

	currentSprintData.todo = newSprintTodo;
	currentSprintData.doing = [];
	currentSprintData.done = [];

	nextSprintData = [];

	auxdata.sprintId += 1;
	saveNewSprint();

	$('#sprintBody').empty();
	hideShowSprintButton();
}

//TASK MODAL
function validateForm(form, event) {
	if (form.checkValidity() === false) {
    	event.preventDefault();
        event.stopPropagation();
    }
    form.classList.add('was-validated');
}

function cleanForm() {
	$('#nameInput').val(null);
	$('#descriptionInput').val(null);
	$('#storyPointsInput').val(null);
	$('#priorityInput').val(2);
}

function configureTaskModal() {
	var form = document.getElementById('createTaskForm');
 	form.addEventListener('submit', (event) => validateForm(form, event), false);

    $('#modalButton').click((event) => {
    	validateForm(form, event);
        if (form.checkValidity() === true) {
          addBacklogTask(form);
          $('#createTaskModal').modal('hide');
          cleanForm();
        }
    });
}

function hideShowSprintButton() {
	if (nextSprintData.length > 0) {
		$('#startSprintBtn').removeAttr('hidden');
	} else {
		$('#startSprintBtn').attr("hidden", true);
	}
}

function configureSprintModal() {
	hideShowSprintButton();
    $('#sprintButton').click((event) => {
    	$('#startSprintModal').modal('hide');
        startNewSprint();
    });
}

//LOADED PAGE
$(document).ready(function() {
	initBacklogData();
	configureTaskModal();
	configureSprintModal();
	rebuildBacklogTable();
	rebuildSprintTable();
});