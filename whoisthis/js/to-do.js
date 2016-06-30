// --INITIALIZING VARIABLES--
tasknum = 0;
// RUNS WHEN THE DOM 
$(document).ready(function() {
	$('#todo_input').keydown(function(event){
		if ((event.which == 13)&&($(this).val() != '')) {
			createNewTask($(this).val());
		}
	});

	/*$('<fieldset/>').controlgroup({
		id : 'done_list'
	}).appendTo('#todo_complete');

	$('<fieldset/>').controlgroup({
		id : 'todo_list'
	}).appendTo('#todo_incomplete');*/

	$done = $('#done_list').controlgroup()
	$donecontainer = $done.controlgroup('container');
	$todo = $('#todo_list').controlgroup()
	$todocontainer = $todo.controlgroup('container');

	createNewTask('call mom');
	createNewTask('Hawthorne scheduling this week');
	createNewTask('linnea: I’m sorry...?');
	createNewCompleteTask('get phone working (finally)');
	createNewCompleteTask('Good app subs – kludge if need be');
	createNewCompleteTask('45 mins recovery work');
});

function createNewTask(taskText)
{
	tasknum = tasknum + 1;

	var name = 'task-' + tasknum.toString();

	var $task = $('<input>',{
		'type':'checkbox',
		'id': name,
		'name': name
	});
	var $label = $('<label>',{
		'for' : name,
		'text' : taskText
	});

	$task.appendTo($todocontainer).fadeIn();
	$label.buttonMarkup().appendTo($todocontainer);

	$todo.controlgroup('refresh').trigger('create');
	$todocontainer.enhanceWithin().trigger('create');
	$done.controlgroup('refresh').trigger('create');
	$donecontainer.enhanceWithin().trigger('create');

	$task.click(function(){
		$(this).closest('div').fadeOut(function(){
			$(this).remove();
			$('.ui-btn-inherit').buttonMarkup();
			$todo.controlgroup('refresh').trigger('create');
			$todocontainer.enhanceWithin().trigger('create');
			$done.controlgroup('refresh').trigger('create');
			$donecontainer.enhanceWithin().trigger('create'); //can't hurt
		});
		
		createNewCompleteTask(taskText);
	});

	$('#todo_input').val('');
}

function createNewCompleteTask(taskText) 
{
	tasknum = tasknum + 1;

	var name = 'task-' + tasknum.toString();

	var $task = $('<input>',{
		'type':'checkbox',
		'id': name,
		'name': name,
		'disabled': true,
		'checked': true
	});
	var $label = $('<label>',{
		'for' : name,
		'text' : taskText
	});

	$task.appendTo($donecontainer).fadeIn();
	$label.buttonMarkup().appendTo($donecontainer);

	$done.controlgroup('refresh').trigger('create');
	$donecontainer.enhanceWithin().trigger('create');
	$todo.controlgroup('refresh').trigger('create');
	$todocontainer.enhanceWithin().trigger('create');
}