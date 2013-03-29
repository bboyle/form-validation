(function( $ ) {
	'use strict';
	

	module( 'environment', lifecycleCVAPI );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test select#select-foo' ).length, 1, 'form#test contains select#select-foo' );
		strictEqual( $( 'form#test textarea#textarea-foo' ).length, 1, 'form#test contains textarea#textarea-foo' );
		strictEqual( $( 'form#test :radio[name=radioFoo]' ).length, 5, 'form#test contains 5 radio buttons in radioFoo group' );
		strictEqual( $( 'form#test :checkbox[name="flavour"]' ).length, 3, 'form#test contains 3 checkboxes in flavour group' );
		strictEqual( $( 'form#test input#email' ).length, 1, 'form#test contains input#email' );
		strictEqual( $( 'form#test input#question' ).length, 1, 'form#test contains input#question' );
		strictEqual( $( 'form#test #name-group input#name-title' ).length, 1, 'form#test contains #name-group input#name-title' );
		strictEqual( $( 'form#test #name-group input#name-given' ).length, 1, 'form#test contains #name-group input#name-given' );
		strictEqual( $( 'form#test #name-group input#name-family' ).length, 1, 'form#test contains #name-group input#name-family' );
		strictEqual( $( 'form#test #dob input#dob-date' ).length, 1, 'form#test contains #dob input#dob-date' );
		strictEqual( $( 'form#test #dob select#dob-month' ).length, 1, 'form#test contains #dob select#dob-month' );
		strictEqual( $( 'form#test #dob input#dob-year' ).length, 1, 'form#test contains #dob input#dob-year' );
		strictEqual( $( 'form#test input#part' ).length, 1, 'form#test contains input#part' );

	});

	test( 'specific fields are present', function() {

		strictEqual( $( '[required]' )[ 0 ], $( 'input#foo' )[ 0 ], 'input#foo is the first required field' );
		strictEqual( $( '[required]' )[ 1 ], $( 'select#select-foo' )[ 0 ], 'select#select-foo is the second required field' );
		strictEqual( $( '[required]' )[ 2 ], $( 'textarea#textarea-foo' )[ 0 ], 'textarea#textarea-foo is a required field' );
		strictEqual( $( '[required]' )[ 3 ], $( 'input#radio-foo-foo' )[ 0 ], 'input#radio-foo-foo is a required field' );
		// strictEqual( $( '[required]' )[ 4 ], $( 'input#radio-foo-bar' )[ 0 ], 'input#radio-foo-bar is a required field' );
		// strictEqual( $( ':checkbox[required]' )[ 0 ], $( 'input#flavour-chocolate' )[ 0 ], 'input#flavour-chocolate is a required field' );
		// strictEqual( $( ':checkbox[required]' )[ 1 ], $( 'input#flavour-strawberry' )[ 0 ], 'input#flavour-strawberry is a required field' );
		// strictEqual( $( ':checkbox[required]' )[ 2 ], $( 'input#flavour-vanilla' )[ 0 ], 'input#flavour-vanilla is a required field' );
		ok( $( 'input#email' )[ 0 ].getAttribute( 'required' ), 'input#email is a required field' );
		strictEqual( $( 'input#email' )[ 0 ].getAttribute( 'type' ), 'email', 'input#email is an email field' );
		strictEqual( $( 'input#part' )[ 0 ].getAttribute( 'pattern' ), '[0-9][A-Z]{3}', 'input#part has @pattern' );
		ok( $( '#name-group' ).parent().hasClass( 'group' ), '#name-group is a group' );
		ok( $( '#name-group' ).parent().hasClass( 'atomic' ), '#name-group is an atomic group' );
		ok( $( '#dob' ).parent().hasClass( 'group' ), '#dob is a group' );
		ok( $( '#dob' ).parent().hasClass( 'atomic' ), '#dob is an atomic group' );

	});


	module( 'change events UI', lifecycleCVAPI );

	test( 'inline message shown on change event', 11, function() {

		$( 'input#foo' ).trigger( 'change' );
		strictEqual( $( 'label[for=foo] .alert' ).length, 1, '.alert found in label' );
		strictEqual( $( 'label[for=foo] .alert' ).text(), 'Must be completed', 'alert message is "Must be completed"' );
		
		$( ':radio[name=radioFoo]' ).eq( 0 ).trigger( 'change' );
		strictEqual( $( ':radio[name=radioFoo]' ).eq( 0 ).closest( 'fieldset' ).find( 'legend .alert' ).length, 1, '1 .alert found for radioFoo group' );

		// $( ':checkbox[name="flavour"]' ).eq( 0 ).trigger( 'change' );
		// strictEqual( $( ':checkbox[name="flavour"]' ).eq( 0 ).closest( 'fieldset' ).find( 'legend .alert' ).length, 1, '1 .alert found for flavour group' );

		$( 'input#email' ).val( 'foo' ).trigger( 'change' );
		strictEqual( $( 'label[for="email"] .alert' ).length, 1, '.alert found for invalid email' );
		strictEqual( $( 'label[for="email"] .alert' ).text(), 'Must be an email address', 'correct .alert text for invalid email' );

		$( '#select-foo' ).trigger( 'change' );
		strictEqual( $( 'label[for="select-foo"] .alert' ).length, 1, '.alert for found invalid select' );
		strictEqual( $( 'label[for="select-foo"] .alert' ).text(), 'Must be completed', 'blank warning displayed for invalid select' );

		$( '#textarea-foo' ).trigger( 'change' );
		strictEqual( $( 'label[for="textarea-foo"] .alert' ).length, 1, '.alert for found invalid textarea' );
		strictEqual( $( 'label[for="textarea-foo"] .alert' ).text(), 'Must be completed', 'blank warning displayed for invalid textarea' );

		$( '#part' ).val( 'foo' ).trigger( 'change' );
		strictEqual( $( 'label[for="part"] .alert' ).length, 1, '.alert for found invalid pattern' );
		strictEqual( $( 'label[for="part"] .alert' ).text(), 'Must use the format shown', 'pattern warning displayed for invalid value' );

	});

	test( 'inline messages are hidden when invalid input is corrected', 4, function() {
		
		$( 'input#foo' ).trigger( 'change' );

		strictEqual( $( 'label[for="foo"] .alert' ).length, 1, '.alert found in label' );
		strictEqual( $( 'label[for="foo"] .alert' ).text(), 'Must be completed', 'alert message is "Must be completed"' );

		$( 'input#foo' ).val( 'foo' );
		$( 'input#foo' ).trigger( 'change' );
		$( 'input#foo' ).trigger( 'change' );

		strictEqual( $( 'input#foo' )[ 0 ].validity.valid, true, 'foo is valid' );
		strictEqual( $( 'label[for="foo"] .alert' ).length, 0, 'no .alert found in label' );

	});

	test( 'inline validation messages update when error changes', 3, function() {
		
		$( '#email' ).val( 'foo' );
		$( '#email' ).trigger( 'change' );

		strictEqual( $( 'label[for="email"] .alert' ).text(), 'Must be an email address', 'showing invalid email message' );

		$( '#email' ).val( '' );
		$( '#email' ).trigger( 'change' );

		strictEqual( $( 'label[for="email"] .alert' ).text(), 'Must be completed', 'showing value missing message' );

		$( '#email' ).val( 'foo@example.com' );
		$( '#email' ).trigger( 'change' );

		strictEqual( $( 'label[for="email"] .alert' ).length, 0, 'no error message when valid (foo@example.com)' );

	});


	module( 'grouped alert messages', lifecycleCVAPI );

	test( 'group errors shown on group label', function() {
		
		$( '#name-given' ).trigger( 'change' );

		strictEqual( $( '#name-group .alert' ).length, 1, 'only 1 alert shown for name group' );
		strictEqual( $( '#name-group .alert' ).text(), 'Must be completed', 'showing value missing message' );
		strictEqual( $( '#name-group legend .alert' ).text(), 'Must be completed', 'alert placed inside group legend' );

	});


	module( 'after submit event UI', lifecycleCVAPI );

	test( '.invalid class removed after submit', function() {
		
		$( 'form' ).trigger( 'submit' );
		strictEqual( $( '#foo' ).closest( 'li' ).is( '.invalid' ), true, '#foo is .invalid after submit' );
		strictEqual( $( '#select-foo' ).closest( 'li' ).is( '.invalid' ), true, '#select-foo is .invalid after submit' );
		strictEqual( $( '#textarea-foo' ).closest( 'li' ).is( '.invalid' ), true, '#textarea-foo is .invalid after submit' );
		strictEqual( $( '#radio-foo-foo' ).closest( '.choices' ).closest( 'li' ).is( '.invalid' ), true, '#radio-foo-foo is .invalid after submit' );
		// strictEqual( $( '#flavour-chocolate' ).closest( '.choices' ).closest( 'li' ).is( '.invalid' ), true, '#flavour-chocolate is .invalid after submit' );

		// make valid
		$( '#foo' ).val( 'foo' ).trigger( 'change' );
		$( '#select-foo' ).val( 'foo' ).trigger( 'change' );
		$( '#textarea-foo' ).val( 'foo' ).trigger( 'change' );
		$( '#radio-foo-foo' )[ 0 ].click();
		$( '#radio-foo-foo' ).trigger( 'change' );
		// $( '#flavour-chocolate' )[ 0 ].click();
		// $( '#flavour-chocolate' ).trigger( 'change' );

		// test .invalid class removed
		strictEqual( $( '#foo' ).closest( 'li' ).is( '.invalid' ), false, '#foo is not .invalid after changing' );
		strictEqual( $( '#select-foo' ).closest( 'li' ).is( '.invalid' ), false, '#select-foo is not .invalid after changing' );
		strictEqual( $( '#textarea-foo' ).closest( 'li' ).is( '.invalid' ), false, '#textarea-foo is not .invalid after changing' );

		strictEqual( $( '#radio-foo-foo' ).is( ':checked' ), true, '#radio-foo-foo is :checked' );
		strictEqual( $( '#radio-foo-foo' ).closest( '.choices' ).closest( 'li' ).is( '.invalid' ), false, '#radio-foo-foo is not .invalid after changing' );
		// strictEqual( $( '#flavour-chocolate' ).is( ':checked' ), true, '#flavour-chocolate is :checked' );
		// strictEqual( $( '#flavour-chocolate' ).closest( '.choices' ).closest( 'li' ).is( '.invalid' ), false, '#flavour-chocolate is not .invalid after changing' );

	});

	test( '.invalid class managed for groups', function() {
		
		$( 'form' ).trigger( 'submit' );
		strictEqual( $( 'input', '#name-group' ).filter(function() {
			return ! this.validity.valid;
		}).length, 2, '2 invalid fields in group' )
		strictEqual( $( '#name-group' ).parent().is( '.invalid' ), true, '#name-group is .invalid after submit' );

		// make some of the fields valid, but NOT all
		$( '#name-given' ).val( 'foo' ).trigger( 'change' );

		strictEqual( $( '#name-group input' ).filter(function() {
			return ! this.validity.valid;
		}).length, 1, '1 invalid field in group' )
		strictEqual( $( '#name-group' ).parent().is( '.invalid' ), true, '#name-group remains .invalid if only some invalid fields are corrected' );

		// make all fields valid
		$( '#name-family' ).val( 'foo' ).trigger( 'change' );

		// test .invalid class removed
		strictEqual( $( '#name-group input' ).filter(function() {
			return ! this.validity.valid;
		}).length, 0, 'no invalid fields in group' )
		strictEqual( $( '#name-group' ).parent().is( '.invalid' ), false, '#name-group is not .invalid after correcting all invalid fields' );

	});

	test( '.invalid class managed for groups onchange', function() {
		
		$( 'form' ).trigger( 'submit' );
		strictEqual( $( '#address-group' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-group is .invalid' );
		strictEqual( $( '#address-line1' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-line1 is .invalid' );
		strictEqual( $( '#address-city' ).closest( '.compact' ).is( '.invalid' ), false, '.compact container is not .invalid' );
		strictEqual( $( '#address-city' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-city is .invalid' );
		strictEqual( $( '#address-state' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-state is .invalid' );
		strictEqual( $( '#address-postcode' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-postcode is .invalid' );
		strictEqual( $( '#address-country' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-country is .invalid' );

		// make some of the fields valid, but NOT all
		$( '#address-line1' ).val( '123 Test Circuit' ).trigger( 'change' );
		$( '#address-state' ).val( 'QLD' ).trigger( 'change' );
		$( '#address-country' ).val( 'Australia' ).trigger( 'change' );
		strictEqual( $( '#address-group' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-group is .invalid' );
		strictEqual( $( '#address-line1' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-line1 is not .invalid' );
		strictEqual( $( '#address-city' ).closest( '.compact' ).is( '.invalid' ), false, '.compact container is not .invalid' );
		strictEqual( $( '#address-city' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-city is .invalid' );
		strictEqual( $( '#address-state' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-state is not .invalid' );
		strictEqual( $( '#address-postcode' ).closest( '.questions > li' ).is( '.invalid' ), true, '#address-postcode is .invalid' );
		strictEqual( $( '#address-country' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-country is not .invalid' );

		// make all some of the fields valid, but NOT all
		$( '#address-city' ).val( 'Brisbane' ).trigger( 'change' );
		$( '#address-postcode' ).val( '4000' ).trigger( 'change' );
		strictEqual( $( '#address-group' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-group is not .invalid' );
		strictEqual( $( '#address-line1' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-line1 is not .invalid' );
		strictEqual( $( '#address-city' ).closest( '.compact' ).is( '.invalid' ), false, '.compact container is not .invalid' );
		strictEqual( $( '#address-city' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-city is not .invalid' );
		strictEqual( $( '#address-state' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-state is not .invalid' );
		strictEqual( $( '#address-postcode' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-postcode is not .invalid' );
		strictEqual( $( '#address-country' ).closest( '.questions > li' ).is( '.invalid' ), false, '#address-country is not .invalid' );

	});


	test( '.invalid class managed for atomic groups onchange after submit', function() {
		
		// set different custom errors
		$( '#dob-date' ).val( '56' ).each(function() { this.setCustomValidity( 'Must be a number (1–31)' ); }).trigger( 'change' );
		$( '#dob-year' ).val( 'YYYY' ).each(function() { this.setCustomValidity( 'Must be a number' ); }).trigger( 'change' );

		$( 'form' ).trigger( 'submit' );
		strictEqual( $( '#dob-date' ).closest( '.questions > li' ).is( '.invalid' ), true, '#dob-date is .invalid' );
		strictEqual( $( '#dob-month' ).closest( '.questions > li' ).is( '.invalid' ), true, '#dob-month is .invalid' );
		strictEqual( $( '#dob-year' ).closest( '.questions > li' ).is( '.invalid' ), true, '#dob-year is .invalid' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).is( '.invalid' ), true, '#dob atomic group is .invalid' );

		// correct 1 of the errors
		$( '#dob-date' ).val( '11' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		strictEqual( $( '#dob-date' ).closest( '.questions > li' ).is( '.invalid' ), false, '#dob-date is no longer .invalid' );
		strictEqual( $( '#dob-month' ).closest( '.questions > li' ).is( '.invalid' ), true, '#dob-month is still .invalid' );
		strictEqual( $( '#dob-year' ).closest( '.questions > li' ).is( '.invalid' ), true, '#dob-year is still .invalid' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).is( '.invalid' ), true, '#dob atomic group is still .invalid' );

		// correct all errors
		$( '#dob-month' ).each(function() { this.selectedIndex = 8; }).trigger( 'change' );
		$( '#dob-year' ).val( '1976' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		strictEqual( $( '#dob-date' ).closest( '.questions > li' ).is( '.invalid' ), false, '#dob-date is no longer .invalid' );
		strictEqual( $( '#dob-month' ).closest( '.questions > li' ).is( '.invalid' ), false, '#dob-month is no longer .invalid' );
		strictEqual( $( '#dob-year' ).closest( '.questions > li' ).is( '.invalid' ), false, '#dob-year is no longer .invalid' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).is( '.invalid' ), false, '#dob atomic group is no longer .invalid' );

	});


}( jQuery ));
