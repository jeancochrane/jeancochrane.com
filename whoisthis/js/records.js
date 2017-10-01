form237B_html = '<div id="form237B"> FORM 237B <p>I, Aster Flores (hereafter referred to as CLIENT), hereby authorize any duly credentialed medical practitioners at Hope and Mercy Medical Center (and affiliated treatment facilities), under the alias FixMyMentals, to EXPERIMENTAL AMNESIA THERAPY (see definition below). I recognize that I have consented to this therapy under my own volition and in the absence of coercion on the part of any guardians, companions, or employers.</p> <p>EXPERIMENTAL AMNESIA THERAPY includes, but is not limited to, the following procedures:</p> <ul> <li>The removal and subsequent analysis of CLIENT\'s supplemental memory, processing, and sensory units by hospital staff </li> <li>Medically-induced amnesia in CLIENT</li> <li>Alterations to CLIENT\'s supplemental memory, processing, and sensory units in order to reverse damage that CLIENT committed to such units prior to check-in at Hope and Mercy Medical Center </li> <li>Communications between hospital staff and CLIENT pertaining to the retrieval of information pertinent to the repair of CLIENT\'s memory, processing, and sensory units</li> </ul> <p>In addition to the above terms and conditions, by signing below, the CLIENT swears by the following statements:</p> <ol> <li>I understand that my personal and medical information, including any and all unencrypted memories stored in my supplemental memory unit(s), will be available to hospital staff for the purposes of repairing said unit(s)</li> <li>I authorize hospital staff to attempt to decrypt any and all memories that they have REASONABLE SUSPICION may have contributed to the harm I caused myself</li> <li>I recognize that EXPERIMENTAL AMNESIA THERAPY is an experimental treatment, and therefore may not produce the precise results that I or hospital staff anticipated upon check-in</li> <li>I agree NOT to read Form 237B or any related form under ANY CIRCUMSTANCES, understanding that doing so voids the possibility of recovery pursuant to the definition of EXPERIMENTAL AMNESIA THERAPY</li> </ol> <p>Signed,</p> <p>Maria Flores</p> <p>Client or Legal Guardian Signature</p> <p>CLIENT CONFIRMATION INFO</p> <p>Date of birth: 26/1/48</p> <p>SSN: 439-65-1970</p></div>'

pdr_html = '<div id="pdr"> <form id="census_form"> <input id="pdr_name" type="text" placeholder="Name"/> <input id="pdr_ssn" type="text" placeholder="SSN"/> <input id="pdr_dob" type="text" placeholder="DOB - MM/DD/YY"/> <input id="pdr_race" type="text" placeholder="Race/Ethnicity"/> <input id="pdr_sex" type="text" placeholder="Sex"/> <input id="pdr_gen" type="text" placeholder="Gender"/> <fieldset data-role="controlgroup" data-type="horizontal"> <input type="radio" name="citizen" id="citizen_yes"/> <label for="citizen_yes">Citizen</label> <input type="radio" name="citizen" id="citizen_no"/> <label for="citizen_no">Non-Citizen</label> </fieldset> <fieldset id="citizen_choices" style="display:none"> <input type="text" placeholder="Country of Origin"/> <input type="text" placeholder="Duration of Stay"/> </fieldset> <fieldset data-role="controlgroup" data-type="horizontal"> <input type="radio" name="employed" id="employed_yes"/> <label for="employed_yes">Employed</label> <input type="radio" name="employed" id="employed_no"/> <label for="employed_no">Unemployed</label> </fieldset> <fieldset id="employed_choices" style="display:none"> <input id="pdr_employer" type="text" placeholder="Employer"/> </fieldset> </form> <input id="pdr_btn" type="button" value="Submit"/> </div>'

password_popup_html = '<div id="237B_password" data-overlay-theme="b" data-theme="b" data-role="popup" data-dismissible="false" class="ui-corner-all"> <div data-role="header" class="ui-corner-top"> <h1>Encryption</h1> </div> <div role="main" class="ui-corner-bottom ui-content"> <p>This form requires a password.</p> <input id="237B_input" type="text" placeholder="Password"/> <a id="237B_passwordback" href="#" class="ui-btn ui-btn-a ui-corner-all ui-shadow ui-btn-inline" data-rel="back">Back</a> <a id="237B_button" href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline">Enter</a> </div> </div>'

$(document).ready(function() {
	$('#237B_listitem').append(password_popup_html);

	$('fieldset div .ui-radio').click(function(e){
		var thisID = e.target.attr('id');
		console.log('clicked');
	    if (thisID == 'citizen_yes'){
	        $('#citizen_choices').slideUp();
	    }
	    else if (thisID == 'citizen_no'){
	        $('#citizen_choices').slideDown();
	    }
	    else if (thisID == 'employed_no'){
	    	$('#employed_choices').slideUp();
	    }
	    else if (thisID == 'employed_yes'){
	    	$('#employed_choices').slideDown();
	    }
	});

	$('#237B_passwordback').click( function(){
		$('#237B_input').val('');
	});

	$('#pdr_listitem').click(function(){
		$('#records_title h2').text('Personal Data Request');
		$('#records_content')
			.empty()
			.html(pdr_html)
			.trigger('create');

		$('div.ui-radio input').click(function(){

			var thisID = $(this).attr('id');

		    if (thisID == 'citizen_yes'){
		        $('#citizen_choices').slideUp();
		    }
		    else if (thisID == 'citizen_no'){
		        $('#citizen_choices').slideDown();
		    }
		    else if (thisID == 'employed_no'){
		    	$('#employed_choices').slideUp();
		    }
		    else if (thisID == 'employed_yes'){
		    	$('#employed_choices').slideDown();
		    }
		});

		$('#pdr_btn').click(function(){
			var name_check = 
				(GetVal('#pdr_name') == 'aster flores');
			var ssn_check = (
				(GetVal('#pdr_ssn') == '439-65-1970') ||
				(GetVal('#pdr_ssn') == '439651970') );
			var dob_check = (
				(GetVal('#pdr_dob') == '01/26/48') ||
				(GetVal('#pdr_dob') == '1/26/48') );
			var race_check = 
				(GetVal('#pdr_race') == 'white');
			var sex_check = (
				(GetVal('#pdr_sex') == 'male') ||
				(GetVal('#pdr_sex') == 'm') ||
				(GetVal('#pdr_sex') == 'man') );
			var gen_check = (
				(GetVal('#pdr_gen') == 'female') ||
				(GetVal('#pdr_gen') == 'f') ||
				(GetVal('#pdr_gen') == 'woman') );
			var citizen_check = ($('label[for="citizen_yes"]').hasClass('ui-radio-on'));
			var employed_check = ($('label[for="employed_yes"]').hasClass('ui-radio-on'));
			var employer_check = (
				(GetVal('#pdr_employer') == 'datadouble') ||
				(GetVal('#pdr_employer') == 'data double') );

			console.log('name: ' + name_check);

			if (name_check && ssn_check && dob_check && race_check && sex_check && gen_check && citizen_check && employed_check && employer_check) 
			{
				getNotification('Mail','New mail from Census Bureau', true);
				receiveMail('census_5_0');
			}
			else {
				$('#records_content').effect('shake',{times:2});
			}
		});
	});
	
	$('#237B_input').keydown( function(event){
		if (event.keyCode == 13) {
			$('#237B_button').click();
		}
	});

	$('#237B_button').click( function() {
		if ($('#237B_input').val()==='HARAWAY')
		{
			$('#237B_passwordback').click();

			$('#237B_listitem').fadeOut( 'slow', function(){
				var div = $('<li id="237B_listitem"><a id="237B_link" href="#records_view" data-transition="slide">Form 237B</a></li>').hide();
				$(this).replaceWith(div);
				$('#records_list').listview('refresh');
				$('#237B_listitem').fadeIn('slow');

				$('#237B_listitem').click( function(){
					$('#records_title h2').text('Form 237B');
					$('#records_content')
						.empty()
						.html(form237B_html)
						.trigger('create');
				});

				$('#records_list').listview('refresh');
			});
			
			
		}
		else {
			$('#237B_password').effect('shake',{times:2});
			$('#237B_input').val('');
		}
	});
});

function GetVal (id) {
	return $(id).val().toLowerCase();
}