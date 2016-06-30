// FOR NOTES APP
$.event.special.tap.emitTapOnTaphold = false;

allNotesArray = [];
allNoteTitles = [];


// RUNS WHEN THE DOM 
$(document).ready(function() {
	$('#notebtn').click(function(){
		createNewNote($('#notes_input').val(), $('#notes_titleinput').val());
	});
	createNewNote('Recovery Plan', 'Eggs </br>Milk </br>Beans </br>Transistors </br>PCB </br>120V', false);
	createNewNote('In case of emergency', 'Call mom', false);
	createNewNote('Colors', 'blue </br>pink </br>white </br>pink </br>blue', false);
	createNewNote('Readings', 'donna haraway </br>beth coleman </br>xenofeminism </br>A brief rant on the future of interaction design', false);
	createNewNote('What if', 'the net was a brain', false);
	createNewNote('Bigger better faster', 'bigger better faster Bigger Better Faster BIGGER BETTER FASTER STOP', false);
	createNewNote('readme.txt', 'code: addie barron </br>design: jean cochrane </br>story: addie barron, boggy, and jean cochrane </br>additional concept work: maha ahmed </br>special thanks to patrick jagoda', false);
});


function scrollToBottom()
{
	$(document).scrollTop(10000000);
}

function createNewNote(noteTitle, noteContents, refresh)
{	
	if (refresh == undefined) {refresh = true}

	var noteNumber = allNotesArray.length
	
	if (noteContents == '' || noteTitle == '')
	{
		alert('You must enter a title and a note.');
	}
	else 
	{
		allNotesArray.push(noteContents);
		allNoteTitles.push(noteTitle);
		
		$('#notes_input').val('');
		$('#notes_titleinput').val('');
		
		//print to notes screen
		$('<li><a data-transition="slide" href="#notes_view">'+noteTitle+'<p class="note_preview">'+noteContents.split('</br>')[0]+'</p></a></li>').appendTo('#notes_list')
			
			.on('tap', function(e){ //run this code on regular tap
				var i = $(e.target).index(); 
				$('#notes_title h2').html(noteTitle);
				$('#notes_content').html(noteContents);
			})
			
			.on('taphold', function(e){ // run this code on long tap
			
				var note = $(e.target)
	
				if (confirm('Delete this note?'))
				{
					var i = note.index();
					allNotesArray.splice(i,1);
					allNoteTitles.splice(i,1);
					note.parents('li').remove();
					$('#notes_list').listview('refresh');
				}
				else {
					note.removeClass('ui-btn-active ui-focus');
				} 
			});
		if (refresh) {
			$('#notes_list').listview('refresh');
		}
	}
}

function deleteNote(note)
{
	
}
