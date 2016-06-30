// --INITIALIZING VARIABLES--

// FOR MESSAGING APP
$.event.special.tap.emitTapOnTaphold = false;

contactsArray = ['Addie','Maha','Jean','Boggy','Bea','Sam','Ashley'];
contactsArray=contactsArray.sort(); //alphabetize

allMsgsArray = {};
lastMsgs = {};
for (var i=0; i<contactsArray.length; i++)
{
  allMsgsArray[contactsArray[i]]='';
  lastMsgs[contactsArray[i]]='';
}

realmsg = 'hi'; // the message that triggers a response
responseDelay = 0.2; // how much time (in seconds) does it take for a response?



forcedTyping = false; // true --> players can only type phrases in goodStringArray, one after the other.
goodStringArray = ['this is the first text you type','this is the second text', 'now the third text'];
stringNum = 0;
goodString = goodStringArray[stringNum];


// FOR NOTES APP
allNotesArray = [];
allNoteTitles = [];


// RUNS WHEN THE DOM 
$(document).ready(function() {

    $('#contacts_header h2').text('Contacts ('+contactsArray.length.toString()+')')
    
    for (var i=0; i<contactsArray.length; i++)
    {
    	$('<li><a href="#msging" id="contact'+contactsArray[i]+'" data-transition="slide" onclick="contactToMsgScreen($(this));">'+contactsArray[i]+'<p class="lastmsg">'+lastMsgs[contactsArray[i]]+'</p></a></li>').appendTo($('#contacts_list'));
    }
    
    
    $('#msging').click( function(){
    	$('#msg_input').focus(); // Sets up an event handler for the messaging app: When you click anywhere the message screen, your cursor moves to the input box!
    });
    
    
    $('#sendbtn').click( function(){
    	if (forcedTyping)
    	{
    		if ($('#msg_input').val()==goodString)
    		{
    			printMsg();
    		} 
    	}
    	else 
    	{
    		printMsg();
    	}
    });
    
});


function scrollToBottom()
{
	$(document).scrollTop(10000000);
}

function convertToGoodString()
{
	goodString = goodStringArray[stringNum]; 
	$('#msg_input').val(goodString.substr(0,$('#msg_input').val().length));
}


function contactToMsgScreen(contact)
{
	//When you click on a contact name, this function immediately changes the messaging screen to reflect which contact you clicked on.  It ports the contact name and the messages already exchanged with that contact.  Easier than making a whole new <div> messaging screen for each contact you add. 
	
	currentContact = contact.contents().filter(function(){ 
	  return this.nodeType == 3; 
	})[0].nodeValue; //gets the name of the contact from the contact screen, stores in in the variable currentContact
	
	$('#msg_header h2').text(currentContact); //
	$('#msg_list').html(allMsgsArray[currentContact]);
}

function setupContactScreen()
{
	$('#contacts_header h2').text('Contacts ('+contactsArray.length.toString()+')');
}

function printMsg()
{
	//Fires when you click the Send button (or press Enter).  Prints what you typed onto the screen.  If the message is "hi", starts countdown to a response.  Then empties the input box and updates the array of messages. 
	if (stringNum < goodStringArray.length-1) {
		stringNum = stringNum+1;
	}
	
	var sendText = $('#msg_input').val();
	
	if (sendText != '') 
	{
		$('<li >'+sendText+'</li>').appendTo('#msg_list').css({'text-align':'right', 'color':'#6699ff', 'font-family':'tahoma'});
		
		if (sendText == realmsg) 
		{
			setTimeout(printResponse, responseDelay*1000.0);
		}
		
		$('#msg_list').listview('refresh');
	}
	
	$('#msg_input').val('');
	
	scrollToBottom();

	allMsgsArray[currentContact] = $('#msg_list').html(); //store all the current messages in the variable allMsgsArray (in html format)
	
	lastMsgs[currentContact] = $('#msg_list').children().last().text(); //store the last message as a string in lastMsgs
	
	$('#contacts_list').find('.lastmsg').each( function(i) {
		$(this).text(lastMsgs[contactsArray[i]]);
	});	// add the last message to the contacts screen under the right contact
	
	//alert(JSON.stringify(allMsgsArray, null, 4));
}

function printResponse()
{
	var responseText = "response";
	$('<li>'+responseText+"</li>").appendTo('#msg_list').css({'text-align':'left', 'color':'#ff6699', 'font-family':'tahoma'});
	$('#msg_list').listview('refresh');
	
	allMsgsArray[currentContact] = $('#msg_list').html();
	
	lastMsgs[currentContact] = $('#msg_list').children().last().text();
	
	$('#contacts_list').find('.lastmsg').each( function(i) {
		$(this).text(lastMsgs[contactsArray[i]]);
	});
	
	
	scrollToBottom();
}

function createNewTask(input)
{
	var taskNumber = 5//$('#todo_list').toArray().length+1;
	taskName = input.val().toString();
	if (taskName != '') 
	{
		taskHtml = '<label><input type="checkbox" name="taskbutton-'+taskNumber+'" id="taskbutton-'+taskNumber+'" onclick="taskComplete($(this));"/>'+taskName+'</label>'
	
		$('#todo_list').append(taskHtml);
	}
	$('#todo_list').trigger('create');
	input.val('');
}
function taskComplete(task)
{
	var taskDeleteTime = 500;
	task.parent().fadeOut(taskDeleteTime);
	var new_task = task.attr('disabled','disabled').attr('checked','checked').parent().clone()
	
	setTimeout(function(){
		new_task.children('label').css('color','grey');
		$('#done_list').append(new_task.fadeIn());
		new_task.children('input').attr('checked', 'checked');
	},taskDeleteTime);
}

function createNewNote()
{
	noteNumber = allNotesArray.length
	var noteContents = $('#notes_input').val();
	var noteTitle = $('#notes_titleinput').val();
	
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
		$('<li><a data-transition="slide" href="#notes_view">'+noteTitle+'<p class="note_preview">'+noteContents+'</p></a></li>').appendTo('#notes_list')
			
			.on('tap', function(e){ //run this code on regular tap
				var i = $(e.target).index(); 
				alert(JSON.stringify($(e.target), null, 4));
				$('#notes_title h2').text(noteTitle);
				$('#notes_content').text(noteContents);
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

		$('#notes_list').listview('refresh');
		
		$('.ui-btn-active').removeClass('ui-btn-active ui-focus');
	}
}

function deleteNote(note)
{
	
}
