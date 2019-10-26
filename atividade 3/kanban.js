sprintData = {};
selectedTask = {};

function initCurrentSprintData() {
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
	sprintData = scrum.currentSprintData;
}

function saveSprint() {
	scrum = JSON.parse(localStorage.getItem('scrumSimples'));
	scrum.currentSprintData = sprintData;
	localStorage.setItem('scrumSimples', JSON.stringify(scrum));
}

function getTaskArray(tableId) {
	if (tableId === '#todoBody') {
		return sprintData.todo;
	} else if (tableId === '#doingBody') {
		return sprintData.doing;
	} else {
		return sprintData.done;
	}
}

function sortTaskArray(tableId) {
	var array = getTaskArray(tableId);
	array.sort((a,b) => { 
		if (a.priority === b.priority) { return a.id - b.id; }
		else { return b.priority - a.priority; }
	});
}

function unselectTask() {
	selectedTask = {};
	$('#selected-task').empty()
	$('#selected-task').attr("hidden", true);
	$('#select-task').removeAttr('hidden');
}

function changeTaskToTodo() {
	var taskArray = getTaskArray(selectedTask.tableId);
	for(var i = 0; i < taskArray.length; ++i) {
		if (taskArray[i].id === selectedTask.taskId) {
			var task = taskArray.splice(i, 1)[0];
			sprintData.todo.push(task);
			sortTaskArray('#todoBody');
			saveSprint();
			rebuildTable('#todoBody');
			rebuildTable('#doingBody');
			rebuildTable('#doneBody');
			unselectTask();
			i = taskArray.length;
		}
	}
}

function changeTaskToDoing() {
	var taskArray = getTaskArray(selectedTask.tableId);
	for(var i = 0; i < taskArray.length; ++i) {
		if (taskArray[i].id === selectedTask.taskId) {
			var task = taskArray.splice(i, 1)[0];
			sprintData.doing.push(task);
			sortTaskArray('#doingBody');
			saveSprint();
			rebuildTable('#todoBody');
			rebuildTable('#doingBody');
			rebuildTable('#doneBody');
			unselectTask();
			i = taskArray.length;
		}
	}
}

function changeTaskToDone() {
	var taskArray = getTaskArray(selectedTask.tableId);
	for(var i = 0; i < taskArray.length; ++i) {
		if (taskArray[i].id === selectedTask.taskId) {
			var task = taskArray.splice(i, 1)[0];
			sprintData.done.push(task);
			sortTaskArray('#doneBody');
			saveSprint();
			rebuildTable('#todoBody');
			rebuildTable('#doingBody');
			rebuildTable('#doneBody');
			unselectTask();
			i = taskArray.length;
		}
	}
}

function buildSelectdTaskDetail(task) {
	var priorityStr = '';
	var priorityStyle = '';
	if (task.priority === 3) {
		priorityStr = 'Alta';
		priorityStyle = 'class=\"high-priority\"';
	} else if(task.priority === 2) {
		priorityStr = 'Média';
		priorityStyle = 'class=\"medium-priority\"';
	} else {
		priorityStr = 'Baixa';
		priorityStyle = 'class=\"low-priority\"';
	}

	var btns = '';
	if (selectedTask.tableId === '#todoBody') {
		btns = `<button id="doingBtn" type="button" class="btn btn-outline-danger" id=\"\">Marcar como Fazendo</button>
      		    <button id="doneBtn" type="button" class="btn btn-outline-danger">Marcar como Feito</button>`;
	} else if (selectedTask.tableId === '#doingBody') {
		btns = `<button id="todoBtn" type="button" class="btn btn-outline-danger">Marcar como A Fazer</button>
      		    <button id="doneBtn" type="button" class="btn btn-outline-danger">Marcar como Feito</button>`;
	} else {
		btns = `<button id="todoBtn" type="button" class="btn btn-outline-danger">Marcar como A Fazer</button>
      		    <button id="doingBtn" type="button" class="btn btn-outline-danger">Marcar como Fazendo</button>`;
	}

	return `
		<h2> ${task.id} - ${task.name} </h2>
      	<p>O que fazer: ${task.description}</p>
      	<p>Story Points: ${task.storyPoints}</p>
      	<p ${priorityStyle}>Prioridade: ${priorityStr}</p>
      	${btns}
	`;
}

function showSelectedTask(task) {
	$('#select-task').attr("hidden", true);
	$('#selected-task').empty().append(buildSelectdTaskDetail(task));
	$('#selected-task').removeAttr('hidden');

	if (selectedTask.tableId === '#todoBody') {
		$('#doingBtn').click(changeTaskToDoing);
      	$('#doneBtn').click(changeTaskToDone);
	} else if (selectedTask.tableId === '#doingBody') {
		$('#todoBtn').click(changeTaskToTodo);
      	$('#doneBtn').click(changeTaskToDone);
	} else {
		$('#todoBtn').click(changeTaskToTodo);
      	$('#doingBtn').click(changeTaskToDoing);
	}
}



function selectTask(event) {
	selectedTask = { taskId: event.data.task.id, tableId: event.data.tableId }
	showSelectedTask(event.data.task);
}

function buildTableRowHtml(task) {
	var id = task.id;
	var name = task.name;
	var priority = task.priority;
	var style = '';
	if(priority === 3) {
		style = 'class=\"high-priority\"';
	} else if(priority === 2) {
		style = 'class=\"medium-priority\"';
	} else {
		style = 'class=\"low-priority\"';
	}

	return `<tr id=\"task${id}\""><td ${style}>${id} - ${name}</td></tr>`;
}

function rebuildTable(tableId) {
	var tableBody = $(tableId);
	tableBody.empty();
	var taskArray = getTaskArray(tableId);
	for (var i = 0; i < taskArray.length; ++i) {
		tableBody.append(buildTableRowHtml(taskArray[i]));
		var task = taskArray[i];
		$('#task' + task.id).click({task: task, tableId: tableId}, selectTask);
	}
}

function buildTitle() {
	if (sprintData.todo.length === 0 && sprintData.doing.length === 0 && sprintData.done.length === 0) {
		$('#start-sprint').removeAttr('hidden');
		$('#main').attr("hidden", true);
	} else {
		$('#start-sprint').attr("hidden", true);
		$('#main').removeAttr('hidden');
		$('#sprint-title').empty().append('Sprint ' + auxdata.sprintId);
	}
}

//LOADED PAGE
$(document).ready(function() {
	initCurrentSprintData();
	buildTitle();
	rebuildTable('#todoBody');
	rebuildTable('#doingBody');
	rebuildTable('#doneBody');
});