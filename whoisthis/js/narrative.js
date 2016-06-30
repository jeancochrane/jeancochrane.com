//NARRATIVE 
openingQs = ['How old are you?','Who is the current president?']
skipIntro = false;

$(document).ready(function(){
	receiveMsg('Linnea', 'linnea_0_0');
	if (!skipIntro) {
		$('#mailoverlaydiv').fadeIn(3000, function(){
			openingQs = ['How old are you?','Who is the current president?']
			$('#mailoverlaybtn').click( function(){
				if (($('#mailoverlayinput').val() != '')&&(openingQs.length > 0)) 
				{
					var newMsg = openingQs.shift();
					$('#mailoverlaydiv').fadeOut(1000, function(){
						$('#mailoverlaymsg').html(newMsg);
						$('#mailoverlayinput').val('');
						$('#mailoverlaydiv').fadeIn(1000);
					});
				}
				else if (openingQs.length == 0) {
					$('#mailoverlaydiv').fadeOut(1000);
					$('#mailoverlay').fadeOut(5000, function(){
						$(this).remove();
						notificationsPossible = true;
						$(document).on('vclick','[data-navigate]', function() {
				            $(this).animate({opacity: 0.5}, 'fast', function(){
				            $(this).animate({opacity: 1.0}, 'fast', function(){
				                    var url = $(this).data('navigate');

				                    if (url != '#glitch_2') {
				                        $(':mobile-pagecontainer').pagecontainer('change', url, {transition:'pop'});
				                    }

				                    if (url == '#glitch_1') {
				                        setTimeout( function(){
				                            $(':mobile-pagecontainer').pagecontainer('change', '#home', {transition:'pop', reverse: true});
				                        }, 1000);
				                    }

				                    else if (url=='#glitch_2') {
				                        var $glitchpopup = $('<div id="home_glitch_dialog" data-overlay-theme="b" data-theme="b" data-dismissible="false" class="ui-corner-all"><div data-role="header" class="glitch ui-corner-top"><h1>ƐʹŗªʁíŎʆĄǡĲ̌̎Ɍʢ˜¼ư̓Ŵ̾ʫɵŅɛ</h1></div><div id="glitchtext" role="main" class="ui-corner-bottom ui-content">'+glitchText+'</div><a id="glitchbtn" href="#" class="glitch ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back">Œ„I€ªwˆƒñ</a></div></div>').popup();

				                        $glitchpopup.popup('open');
				                    }
				                }); // close second animate callback
				            }); // close first animate callback
				        }); // close app click handler
						getNotification('Mail', 'New email from FixMyMentals\u00AE',true);
				        receiveMail('repair_0_0');
					});
				}
			});
		});
	} else {
		$('#mailoverlay').remove();
		$('#home').hide()
		$('#home').fadeIn(1000, function(){
        notificationsPossible = true;
        $(document).on('vclick','[data-navigate]', function() {
            $(this).animate({opacity: 0.5}, 'fast', function(){
            $(this).animate({opacity: 1.0}, 'fast', function(){
                    var url = $(this).data('navigate');

                    if (url != '#glitch_2') {
                        $(':mobile-pagecontainer').pagecontainer('change', url, {transition:'pop'});
                    }

                    if (url == '#glitch_1') {
                        setTimeout(function(){
                            $(':mobile-pagecontainer').pagecontainer('change', '#home', {transition:'pop', reverse: true});
                        }, 1000);
                    }

                    else if (url=='#glitch_2') {
                        var $glitchpopup = $('<div id="home_glitch_dialog" data-overlay-theme="b" data-theme="b" data-dismissible="false" class="ui-corner-all"><div data-role="header" class="glitch ui-corner-top"><h1>ƐʹŗªʁíŎʆĄǡĲ̌̎Ɍʢ˜¼ư̓Ŵ̾ʫɵŅɛ</h1></div><div id="glitchtext" role="main" class="ui-corner-bottom ui-content">'+glitchText+'</div><a id="glitchbtn" href="#" class="glitch ui-btn ui-corner-all ui-shadow ui-btn-inline" data-rel="back">Œ„I€ªwˆƒñ</a></div></div>').popup();

                        $glitchpopup.popup('open');
                    }
                });
            });
        });
    });
	}

	/*for (var i=0;i<3;i++) {
		receiveMsg('Mom');
		counterArray['Mom'] = i+1;
	}

	for (var i=0;i<2;i++) {
		receiveMsg('Hawthorne');
		counterArray['Hawthorne'] = i+1;
	}

	for (var i=0;i<12;i++) {
		receiveMsg('Linnea');
		counterArray['Linnea'] = i+1;
	}*/

	$('#mailoverlayinput').on('keydown', function(e){
		if (e.which == 13) {
			$('#mailoverlaybtn').click();
		}
	});
});