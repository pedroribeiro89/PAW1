// INITIAL VALUES
backlogData = {};
var backlog;

function initBacklogData() {
	// scrum = JSON.parse(localStorage.getItem('scrumSimples'));
	// if (scrum === undefined || scrum === null || scrum.length === 0) {
	// 	scrum = {};
	// 	localStorage.setItem('scrumSimples', JSON.stringify(scrum));
	// }
}

//LOADED PAGE
$(document).ready(function() {
	initBacklogData();
	build();
});