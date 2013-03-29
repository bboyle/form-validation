(function( $ ) {
	'use strict';
	

	var userInitiatedSubmit = function() {
			$( '#test :submit' )[ 0 ].click();
		},

		makeFormValid = function() {
			$( '#foo, #select-foo, #textarea-foo, #question' ).val( 'foo' );
			$( '#radio-foo-foo' )[ 0 ].checked = true;
			$( '#email' ).val( 'foo@example.com' );
			$( '#name-given' ).val( 'John' );
			$( '#name-family' ).val( 'Smith' );
		}
	;


	module( 'environment', lifecycleCVAPI );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'input#foo', '#test' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'select#select-foo', '#test' ).length, 1, 'form#test contains select#select-foo' );
		strictEqual( $( 'textarea#textarea-foo', '#test' ).length, 1, 'form#test contains textarea#textarea-foo' );
		strictEqual( $( ':radio[name="radioFoo"]', '#test' ).length, 5, 'form#test contains 5 radio buttons in radioFoo group' );
		strictEqual( $( 'input#email', '#test' ).length, 1, 'form#test contains input#email' );
		strictEqual( $( 'input#question', '#test' ).length, 1, 'form#test contains input#question' );
		strictEqual( $( '.group input#name-title', '#test' ).length, 1, 'form#test contains .group input#name-title' );
		strictEqual( $( '.group input#name-given', '#test' ).length, 1, 'form#test contains .group input#name-given' );
		strictEqual( $( '.group input#name-family', '#test' ).length, 1, 'form#test contains .group input#name-family' );

	});

	test( 'specific fields are present', 11, function() {

		strictEqual( $( '[required]' )[ 0 ], $( 'input#foo' )[ 0 ], 'input#foo is the first required field' );
		strictEqual( $( '[required]' )[ 1 ], $( 'select#select-foo' )[ 0 ], 'select#select-foo is the second required field' );
		strictEqual( $( '[required]' )[ 2 ], $( 'textarea#textarea-foo' )[ 0 ], 'textarea#textarea-foo is a required field' );
		strictEqual( $( '[required]' )[ 3 ], $( 'input#radio-foo-foo' )[ 0 ], 'input#radio-foo-foo is a required field' );
		strictEqual( $( '[required]' )[ 4 ], $( 'input#email' )[ 0 ], 'input#email is a required field' );
		strictEqual( $( 'input#email' )[ 0 ].getAttribute( 'type' ), 'email', 'input#email is an email field' );
		strictEqual( $( 'input#email' )[ 0 ].getAttribute( 'type' ), 'email', 'input#email is an email field' );
		// bug 5 @id="name" @name="name"
		strictEqual( $( 'input#name' ).attr( 'name' ), 'name', 'input#name exists and @name is "name"' );
		ok( $( 'input#name' ).attr( 'required' ), 'input#name is required' );
		strictEqual( $( 'input#name' ).val(), '', 'input#name value is ""' );
		strictEqual( document.getElementById( 'consultationResponse:group:0:question:3:answerTL:value' ).id, 'consultationResponse:group:0:question:3:answerTL:value', 'field with complex @id is present' );

	});

	test( 'specific text is present', function() {

		strictEqual( $( 'label[for=question] .label' ).text().slice( -1 ), '?', 'input#question label ends with ?' );

	});

	test( 'no validation warnings are present', function() {

		strictEqual( $( '.status' ).length, 0, '.status elements should not exist' );

	});


	module( 'form submission UI', lifecycleCVAPI );

	test( 'status message shown on submit', function() {

		$( 'form' ).trigger( 'submit' );

		var status = $( '.status' );
		console.log( status );

		strictEqual( status.length, 1, '.status element is shown' );
		strictEqual( status.find( 'h2' ).length, 1, '.status element contains 1 h2 element' );
		strictEqual( status.find( 'h2' ).text(), 'Please check your answers', '.status h2 has correct text' );
		strictEqual( status.find( 'ol' ).length, 1, '.status element contains 1 ol element' );
		
	});

	test( 'status message shown when button clicked', function() {
		
		$( 'form :submit' )[ 0 ].click();

		var status = $( '.status' );

		strictEqual( status.length, 1, '.status element is shown' );
		strictEqual( status.find( 'h2' ).length, 1, '.status element contains 1 h2 element' );
		strictEqual( status.find( 'h2' ).text(), 'Please check your answers', '.status h2 has correct text' );
		strictEqual( status.find( 'ol' ).length, 1, '.status element contains 1 ol element' );

	});

	test( 'only one status message shown on multiple submit', function() {

		userInitiatedSubmit();
		userInitiatedSubmit();
		strictEqual( $( '.status' ).length, 1, 'only 1 .status element is shown' );
		
	});

	test( 'server side status block is reused', 2, function() {

		// add simulated server-side status
		$( '#test' ).before( '<div class="status warn"><h2>Server side messages</h2><p>Simulated message embedded in HTML response from server.</p></div>' );

		strictEqual( $( '.status' ).length, 1, '.status element is shown before submit' );

		userInitiatedSubmit();
		strictEqual( $( '.status' ).length, 1, 'only 1 .status element is shown after submit' );

	});

	test( 'correct errors shown in status', 10, function() {
		
		$( '#email' ).val( 'foo' );

		userInitiatedSubmit();

		var status = $( '.status' );

		strictEqual( status.find( 'li' ).length, 9, '9 errors displayed' );
		strictEqual( status.find( 'li' ).eq( 0 ).text(), 'Foo: Must be completed', 'required field message is displayed for input' );
		strictEqual( status.find( 'li' ).eq( 1 ).text(), 'Select foo: Must be completed', 'required field message is displayed for select' );
		strictEqual( status.find( 'li' ).eq( 2 ).text(), 'Textarea foo: Must be completed', 'required field message is displayed for textarea' );
		strictEqual( status.find( 'li' ).eq( 3 ).text(), 'Radio foo: Must be completed', 'required field message is displayed for radio buttons' );
		strictEqual( status.find( 'li' ).eq( 4 ).text(), 'Email: Must be an email address', 'type mismatch message is displayed for email field' );
		strictEqual( status.find( 'li' ).eq( 5 ).text(), 'What is your answer: Must be completed', 'question mark is removed from label in status message' );
		strictEqual( status.find( 'li' ).eq( 6 ).text(), 'Your name: Must be completed', 'group message is displayed for 3 group controls' );
		strictEqual( status.find( 'li' ).eq( 7 ).text(), 'Address: Must be completed', 'group message is displayed for atomic group' );
		strictEqual( status.find( 'li' ).eq( 8 ).text(), 'Q3 Why don\'t you own a pet: Must be completed', 'message is displayed for textarea with complex @id' );

	});

	test( 'errors link to the correct label from status', function() {
		
		$( '#email' ).val( 'foo' );

		userInitiatedSubmit();

		var status = $( '.status' );

		strictEqual( $( status.find( 'a' ).eq( 0 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( 'label[for=foo] > .label' )[ 0 ], 'error message links to input label' );
		strictEqual( $( status.find( 'a' ).eq( 1 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( 'label[for=select-foo] > .label' )[ 0 ], 'error message links to select label' );
		strictEqual( $( status.find( 'a' ).eq( 2 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( 'label[for=textarea-foo] > .label' )[ 0 ], 'error message links to textarea label' );
		strictEqual( $( status.find( 'a' ).eq( 3 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( ':radio[name=radioFoo]' ).eq( 0 ).closest( 'fieldset' ).find( '.label' )[ 0 ], 'error message links to radio button group label' );
		strictEqual( $( status.find( 'a' ).eq( 4 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( 'label[for=email] .label' )[ 0 ], 'error message links to email label' );
		strictEqual( $( status.find( 'a' ).eq( 6 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( '#name-title' ).closest( 'fieldset' ).find( '.label' )[ 0 ], 'error message links to group label' );
		strictEqual( $( status.find( 'a' ).eq( 7 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( '#address-line1' ).closest( 'fieldset' ).find( '.label' )[ 0 ], 'error message links to group label (from address)' );
		strictEqual( $( status.find( 'a' ).eq( 7 ).attr( 'href' ).replace( /^.*#/, '#' ) )[ 0 ], $( '#address-city' ).closest( 'fieldset' ).find( '.label' )[ 0 ], 'error message links to group label (from nested group in address)' );

	});

	test( 'status messages are reused for additional errors', function() {
		
		$( '#email' ).val( '' );
		userInitiatedSubmit();

		var emailLink = $( '.status a:contains(Email)' );

		strictEqual( emailLink.text(), 'Email: Must be completed', 'found email required message' );
		userInitiatedSubmit();

		strictEqual( $( '.status a:contains(Email)' ).text(), 'Email: Must be completed', 'found email required message after second submit' );
		strictEqual( $( '.status a:contains(Email)' )[ 0 ], emailLink[ 0 ], 'same link element used after second submit' );
		strictEqual( $( '.status a:contains(Email)' ).parent()[ 0 ], emailLink.parent()[ 0 ], 'same list item element used after second submit' );

		$( '#email' ).val( 'foo' );
		userInitiatedSubmit();

		strictEqual( $( '#email' )[ 0 ].validity.valid, false, '#email is invalid' );
		strictEqual( $( '#email' )[ 0 ].validity.typeMismatch, true, '#email has a typeMismatch' );
		strictEqual( $( '.status a:contains(Email)' ).text(), 'Email: Must be an email address', 'found email type mismatch message after third submit' );
		strictEqual( $( '.status a:contains(Email)' )[ 0 ], emailLink[ 0 ], 'same link element used after third submit' );
		strictEqual( $( '.status a:contains(Email)' ).parent()[ 0 ], emailLink.parent()[ 0 ], 'same list item element used after third submit' );

	});

	test( 'errors are cleared when fields are valid', function() {
		
		$( '#foo' ).val( 'foo' );
		$( '#email' ).val( 'foo@example.com' );
		$( '#name-given' ).val( 'John' );
		$( '#name-family' ).val( 'Smith' );
		$( document.getElementById( 'consultationResponse:group:0:question:3:answerTL:value' )).val( 'foo' );

		userInitiatedSubmit();

		var status = $( '.status' );

		strictEqual( status.find( 'li' ).length, 6, '6 errors remain' );

		strictEqual( status.find( 'li' ).filter(function() {
			return $( this ).text() === 'Foo: Must be completed';
		}).length, 0, 'Foo: Must be completed message is not present' );

		strictEqual( status.find( 'li' ).filter(function() {
			return $( this ).text() === 'Email:';
		}).length, 0, 'Email: message is not present' );

	});

	test( 'error summary is not shown when all fields are valid', function() {
		
		userInitiatedSubmit();

		strictEqual( $( '.status' ).length, 1, 'status was found' );

		// make all fields valid
		$( '#foo, #select-foo, #textarea-foo' ).val( 'foo' );
		$( '#radio-foo-foo' ).trigger( 'click' );
		$( '#email' ).val( 'foo@example.com' );
		$( '#question' ).val( 'answer' );
		$( '#name-given' ).val( 'John' );
		$( '#name-family' ).val( 'Smith' );
		$( '#name' ).val( 'Jonny' );
		$( '#address-line1' ).val( '123 Testing Circuit' );
		$( '#address-city' ).val( 'Brisbane' );
		$( '#address-state' ).val( 'Queensland' );
		$( '#address-postcode' ).val( '4000' );
		$( '#address-country' ).val( 'Australia' );
		$( document.getElementById( 'consultationResponse:group:0:question:3:answerTL:value' )).val( 'foo' );

		userInitiatedSubmit();

		strictEqual( $( '.status' ).length, 0, 'status no longer present' );
		strictEqual( $( 'form#test' ).find( '.invalid' ).length, 0, '.invalid no longer present' );

	});

	test( 'invalid class is toggled after submit', function() {
		
		userInitiatedSubmit();

		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
		strictEqual( $( '#foo' ).forcesForms( 'question' ).is( '.invalid' ), true, '#foo question is .invalid' );
		strictEqual( $( '#name-title' )[ 0 ].validity.valid, true, '#name-title is valid' );
		strictEqual( $( '#name-given' )[ 0 ].validity.valid, false, '#name-given is invalid' );
		strictEqual( $( '#name-family' )[ 0 ].validity.valid, false, '#name-given is invalid' );
		strictEqual( $( '#name-given' ).closest( '.group' ).is( '.invalid' ), true, '#name-given question is .invalid' );

		// make valid
		$( '#foo' ).val( 'foo' );
		$( '#name-given, #name-family, #name' ).val( 'foo' );
		userInitiatedSubmit();

		strictEqual( $( '#foo' )[ 0 ].validity.valid, true, '#foo is valid' );
		strictEqual( $( '#foo' ).forcesForms( 'question' ).is( '.invalid' ), false, '#foo question is not .invalid' );
		strictEqual( $( '#name-title' )[ 0 ].validity.valid, true, '#name-title is valid' );
		strictEqual( $( '#name-given' )[ 0 ].validity.valid, true, '#name-given is valid' );
		strictEqual( $( '#name-family' )[ 0 ].validity.valid, true, '#name-family is valid' );
		strictEqual( $( '#name-given' ).closest( '.group' ).is( '.invalid' ), false, '#name-given question is not .invalid' );
	});


	test( 'inline alerts visible after submit', function() {
		
		userInitiatedSubmit();

		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );

		strictEqual( $( '#foo' ).forcesForms( 'question' ).find( '.alert' ).length, 1, '#foo has 1 alert displayed' );
		strictEqual( $( '#foo' ).forcesForms( 'question' ).find( '.alert' ).text(), 'Must be completed', '#foo alert has correct text' );

		strictEqual( $( '#radio-foo-foo' ).forcesForms( 'question' ).find( '.alert' ).length, 1, '#radio-foo-foo has 1 alert displayed' );
		strictEqual( $( '#radio-foo-foo' ).forcesForms( 'question' ).find( '.alert' ).text(), 'Must be completed', '#radio-foo-foo alert has correct text' );

	});


	test( 'inline alerts visible for invalid autofilled fields', function() {
		
		// simulate autofill email
		$( '#email' ).val( 'foo' ); // do not fire focus, change or blur events!

		strictEqual( $( '#email' ).forcesForms( 'question' ).find( '.alert' ).length, 0, '#email has no alert displayed' );

		userInitiatedSubmit();

		strictEqual( $( '#email' )[ 0 ].validity.valid, false, '#email is invalid' );
		strictEqual( $( '#email' ).forcesForms( 'question' ).find( '.alert' ).length, 1, '#email has 1 alert displayed' );
		strictEqual( $( '#email' ).forcesForms( 'question' ).find( '.alert' ).text(), 'Must be an email address', '#email alert has correct text' );

	});


	test( 'inline alerts not present for valid autofilled fields', function() {
		
		// simulate autofill email
		$( '#email' ).val( 'foo@example.com' ); // do not fire focus, change or blur events!

		strictEqual( $( '#email' ).forcesForms( 'question' ).find( '.alert' ).length, 0, '#email has no alert displayed' );

		userInitiatedSubmit();

		strictEqual( $( '#email' )[ 0 ].validity.valid, true, '#email is valid' );
		strictEqual( $( '#email' ).forcesForms( 'question' ).find( '.alert' ).length, 0, '#email has no alert displayed' );

	});


}( jQuery ));
