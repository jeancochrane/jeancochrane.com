mailData = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': 'json/story.json',
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})(); 

mailContacts = Object.keys(mailData);

glitchText = 'WŪŊȑ̮Ȓ ͆ǺǮsorr ǳƝ̵ǲɅ ɖ*ͤ͟ǰ ṿ̡ɣȁƠnoʻł ˆ̵ɤğʊǶʳ ȡLnexpectedô˒ʕ ̖(Ǳĕe˪į“̼ˮę ǍƖ_ʔƛû͕ɖ ɊɫɃƇɒɶ ŌșnþʬǶpleasƧ ʫư͋ʂ Ơɪ ͎updatȟʮÊā ɃRÄïƶ͙ȝƟ ĖǍɛ¨ȣǎ́ͦ®ĵ [Ɣ̓ûɜ ʬƹˠɴʓ ʛʎƦ ˾̰ŀƞ therŋ̍ Ɲƴ…ʟźdƻķ apologiz-ɗȨ̶D nÇ inconvƏŽ˽ȋə ʝVĉŶŒƎ'

glitched = false;

mailByThread = {};
mailActiveResponses = {};

$(document).ready(function() {
	// SET UP GLITCH DIALOG

	$('<div id="glitchdialog" data-overlay-theme="b" data-theme="b" data-role="popup" data-dismissible="false" class="ui-corner-all"><div data-role="header" class="glitch ui-corner-top"><h1>ƐʹŗªʁíŎʆĄǡĲ̌̎Ɍʢ˜¼ư̓Ŵ̾ʫɵŅɛ</h1></div><div id="glitchtext" role="main" class="ui-corner-bottom ui-content">'+glitchText+'</div><a id="glitchbtn" href="#" class="glitch ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back">Œ„I€ªwˆƒñ</a></div></div>').appendTo('#mail_options');

	$('#mail_compose').click(function(){
		$('#glitchdialog')
		.children('.glitch')
		.each(function(){
			if (glitched === false){
				$(this).glitch({maxint:0.9,minint:0.1,maxglitch:50});
			}
		});
		glitched = true;
	});

	// SET UP RECEIVE BUTTON
	
	/*$('#mail_receive').click(function(){
		receiveMail('repair_1_0');
	});*/
});

function receiveMail(mailID)
{	
	var thisPageID = $.mobile.pageContainer.pagecontainer('getActivePage').attr('id');

	var email = mailData[mailID];

	var mailText = email.body;
	var mailSender = email.sender;
	var mailTime = '';
	var mailSubject = email.subject;
	var mailResponses = email.responses;

	var threadID = mailSubject.replace(/\W/g, '');
	var newSubject = true;

	mailActiveResponses[threadID] = mailResponses;


	if (Object.keys(mailByThread).indexOf(threadID) >= 0) {
		newSubject = false
	}

	if (mailByThread[threadID] == undefined) {
		mailByThread[threadID] = '';
	}

	newMailHTML = '<div class="email"><h2>'+mailSubject+'</h2><p>'+mailText+'</p></div>';

	mailByThread[threadID] = newMailHTML.concat(mailByThread[threadID]);

	if (newSubject) {
		var newMailListItemHTML = '<li id="'+threadID+'" data-icon="false"><a href="#mail_view" data-transition="slide" class="unread-mail"><h1>'+mailSender+'</h1><p class="mail_subject">'+mailSubject+'</p><p class="mail_textpreview">'+$(mailText).eq(0).text()+' '+$(mailText).eq(1).text()+'</p><p class="mail_time ui-li-aside">'+mailTime+'</p></a></li>';

		$(newMailListItemHTML)
			.hide()
			.prependTo('#mail_list')
			.slideDown()
			.click(setupMailScreen(mailSender, mailSubject, threadID));

		if (thisPageID == 'mail_nav') {
			$('#mail_list').listview('refresh');
		}
	}

	else {
		$('#'+threadID+' a')
		.addClass('unread-mail')
		.children('h1')
		.text(mailSender+'   ('+($(mailByThread[threadID]).length-1)+')');
	}

	var noti_check = Object.keys(mailResponses)[0];

	if (noti_check == 'notification') {

		setTimeout(function(){
			
			var noti = mailActiveResponses[threadID]['notification'];

			if (noti.type == 'email') {
				getNotification('Mail', 'New email from '+noti.sender, true);
				$('[data-role="page"]').css({position : ''});
				receiveMail(noti.id);
			}
			else if (noti.type == 'message') {
				getNotification('Messaging', 'New message from '+noti.sender, true);
				$('[data-role="page"]').css({position : ''});
				receiveMsg(noti.sender, noti.id);
			}

		},20000);
	} 
}

function sendMail (threadID, mailSubject, response){

	var mailID = mailActiveResponses[threadID][response];
	var newMailHTML = '<div class="email"><h2>'+mailSubject+'</h2><p>'+response+'</p></div>';

	mailByThread[threadID] = newMailHTML.concat(mailByThread[threadID]);

	scrollToTop();
	
	receiveMail(mailID);
}

function setupMailScreen(sender, mailSubject, threadID){
	return function(){

		var responses = Object.keys(mailActiveResponses[threadID]);
		$('#'+threadID+' a').removeClass('unread-mail');
		$('#mail_title h2').html(sender);
		$('#mail_content').html(mailByThread[threadID]);

		$('#mail_response_navbar').remove();
		$('<div id="mail_response_navbar" data-role="navbar"><ul id="mail_response_options"></ul></div>').prependTo('#mail_view_footer');

		if ((responses.length == 0)||(responses[0] == 'notification')) {
			$('#mail_response_options').html('<li><a><span style="color:gray">Error: No responses could be generated</span></a></li>');
		} else {
			for (var i = 0; i < responses.length; i++) {
				var response = responses[i];
				$('<li><a><span>'+response+'</span></a></li>')
					.appendTo('#mail_response_options')
					.click(onMailResponseClick(sender, threadID, mailSubject, response));
			}
		}

		$('#mail_view_footer').trigger('create');
		/*
    	$('#mail_response_options li a').on('ready', function(){
			var heights = [];
			$('#mail_response_options li a').each(function(i){
				heights.push($(this).height());
			});
			var biggest = Math.max.apply(Math, heights);
			console.log(heights);
			console.log(biggest);
			$('#mail_response_options li a').each(function(i){
				$(this).height(biggest);
			});

			$('div.email:not(:last-child) h2').each(function(){
				$(this).text('RE: '+$(this).text());
			});
		});
		*/

		$('#mail_response_options li a').trigger('ready');
	}
}

function onMailResponseClick(sender, threadID, mailSubject, response){
	return function(){
		sendMail(threadID, mailSubject, response);
		$('#mail_response_options').html('');
		setupMailScreen(sender, mailSubject, threadID)();
	}
}
