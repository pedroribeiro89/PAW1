scrum = {};
selectedSprint = 0;

function initScrumData() {
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
	scrum = scrum;
}

function buildStoryPointsStatistics() {
	var storyPointsNumber = 0;
	for (var i = 0; i < scrum.sprintHistoryData.length; ++i) {
		for (var j = 0; j < scrum.sprintHistoryData[i].length; ++j) { 
			storyPointsNumber += Number(scrum.sprintHistoryData[i][j].storyPoints);
		}
	}
	var sprintPointAvg = (storyPointsNumber / scrum.sprintHistoryData.length).toFixed(2);

	var backlogStoryPoints = 0;
	for (var i = 0; i < scrum.backlogData.length; ++i) {
		backlogStoryPoints += Number(scrum.backlogData[i].storyPoints);
	}

	$('#point-number').append(storyPointsNumber);
	$('#point-sprint-avg').append(isNaN(sprintPointAvg) ? 0 : sprintPointAvg);
	$('#point-backlog').append(backlogStoryPoints);
}

function buildTaskStatistics() {
	var tasksDone = 0;
	for (var i = 0; i < scrum.sprintHistoryData.length; ++i) {
		tasksDone += scrum.sprintHistoryData[i].length;
	}
	var taskNumber = scrum.backlogData.length +
					 scrum.nextSprintData.length +
					 scrum.currentSprintData.todo.length +
					 scrum.currentSprintData.doing.length +
					 scrum.currentSprintData.done.length +
					 tasksDone
	$('#tasks-number').append(taskNumber);
	$('#tasks-backlog').append(scrum.backlogData.length);
	$('#tasks-done').append(tasksDone);
}

function buildSprintsStatistics() {
	var maxSprint = 0;
	var tasksDone = 0;
	for (var i = 0; i < scrum.sprintHistoryData.length; ++i) {
		tasksDone += scrum.sprintHistoryData[i].length;
		if (maxSprint < scrum.sprintHistoryData[i].length) {
			maxSprint = scrum.sprintHistoryData[i].length;
		}
	}

	var sprintTaskAvg = (tasksDone / scrum.sprintHistoryData.length).toFixed(2);
	$('#sprint-number').append(scrum.sprintHistoryData.length);
	$('#sprint-task-avg').append(isNaN(sprintTaskAvg) ? 0 : sprintTaskAvg);
	$('#sprint-max-task').append(maxSprint);
}

function buildTaskRow(task) {
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

	return `<tr id=\"backlog${task.id}\"">
		<td>${task.id}</td>
        <td>${task.name}</td>
        <td>${task.description}</td>
        <td>${task.storyPoints}</td>
        <td ${priorityStyle}>${priorityStr}</td>
	</tr>`;
}

function buildSprintTable() {
	$('#sprintBody').empty();
	if (scrum.sprintHistoryData && scrum.sprintHistoryData.length > 0) {
		for (var i = 0; i < scrum.sprintHistoryData[selectedSprint].length; ++i) {
			$('#sprintBody').append(buildTaskRow(scrum.sprintHistoryData[selectedSprint][i]));
		}
	}
}

function buildSprintsSelect() {
	if (scrum.sprintHistoryData) {
		var optionsStr = '';
		for (var i = 0; i < scrum.sprintHistoryData.length; ++i) {
			optionsStr += `<option value="${i}">Sprint ${i+1}</option>`;
		}
		$('#sprintSelect').append(optionsStr);
		$('#sprintSelect').on('change', function() { 
			selectedSprint = this.value; 
			buildSprintTable(); 
		});
	}
}

//LOADED PAGE
$(document).ready(function() {
	initScrumData();

	buildSprintsSelect();
	selectedSprint = scrum.sprintHistoryData.length - 1
	$('#sprintSelect').val(scrum.sprintHistoryData.length - 1);
	buildSprintTable();

	buildTaskStatistics();
	buildSprintsStatistics();
	buildStoryPointsStatistics();
});