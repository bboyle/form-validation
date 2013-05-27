(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', 25, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test label[for=foo] .alert' ).length, 1, 'input#foo label contains .alert' );
		strictEqual( $( 'form#test input#bar' ).length, 1, 'form#test contains input#bar' );
		strictEqual( $( 'form#test label[for=bar] .alert' ).length, 0, 'input#bar label does not contain .alert' );
		strictEqual( $( 'form#test input#email' ).length, 1, 'form#test contains input#email' );
		strictEqual( $( 'form#test label[for=email] .alert' ).length, 1, 'input#foo label contains .alert' );
		strictEqual( $( 'form#test :radio[name=radioFoo]' ).length, 2, 'form#test contains 2 radio buttons in radioFoo group' );
		strictEqual( $( 'form#test :radio[name=radioFoo]' ).closest( 'fieldset' ).find( 'legend > .alert' ).length, 1, 'radioFoo group legend contains .alert' );

		strictEqual( $( 'form#test #name-group input#name-title' ).length, 1, 'form#test contains #name-group input#name-title' );
		strictEqual( $( 'form#test #name-group input#name-given' ).length, 1, 'form#test contains #name-group input#name-given' );
		strictEqual( $( 'form#test #name-group input#name-family' ).length, 1, 'form#test contains #name-group input#name-family' );
		ok( $( '#name-group' ).parent().hasClass( 'group' ), '#name-group is a group' );
		ok( $( '#name-group' ).parent().hasClass( 'atomic' ), '#name-group is an atomic group' );

		strictEqual( $( 'form#test #dob input#dob-date' ).length, 1, 'form#test contains #dob input#dob-date' );
		strictEqual( $( 'form#test #dob select#dob-month' ).length, 1, 'form#test contains #dob select#dob-month' );
		strictEqual( $( 'form#test #dob input#dob-year' ).length, 1, 'form#test contains #dob input#dob-year' );
		ok( $( '#dob' ).parent().hasClass( 'group' ), '#dob is a group' );
		ok( $( '#dob' ).parent().hasClass( 'atomic' ), '#dob is an atomic group' );

		strictEqual( $( 'input#country', '#postal-address' ).length, 1, '#postal-address contains .group input#country' );
		ok( $( '#postal-address' ).parent().hasClass( 'group' ), '#postal-address is a group' );
		ok( $( '#postal-address' ).parent().hasClass( 'atomic' ), '#postal-address is an atomic group' );
		strictEqual( $( '.group', '#postal-address' ).length, 1, '#postal-address contains one nested .group' );
		strictEqual( $( '.atomic', '#postal-address' ).length, 0, '#postal-address contains no nested atomic groups' );
		strictEqual( $( '.group input#city', '#postal-address' ).length, 1, '#postal-address contains nested .group input#city' );
	});


	module( 'inline validation messages (alerts)' );

	test( 'can get alert value', 6, function() {

		strictEqual( $( '#foo' ).formValidation( 'alert' )[ 0 ], $( 'label[for=foo] > .alert' )[ 0 ], 'found alert' );
		strictEqual( $( '#foo' ).formValidation( 'alert' ).text(), 'Must be completed', 'found expected alert text' );

		strictEqual( $( ':radio[name=radioFoo]' ).eq( 0 ).formValidation( 'alert' )[ 0 ], $( 'legend > .alert' )[ 0 ], 'found alert for radio group' );
		strictEqual( $( ':radio[name=radioFoo]' ).eq( 0 ).formValidation( 'alert' ).text(), 'Must be completed', 'found expected alert text for radio group' );
		strictEqual( $( ':radio[name=radioFoo]' ).eq( 1 ).formValidation( 'alert' )[ 0 ], $( 'legend > .alert' )[ 0 ], 'found alert for 2nd radio button' );
		strictEqual( $( ':radio[name=radioFoo]' ).eq( 1 ).formValidation( 'alert' )[ 0 ], $( ':radio[name=radioFoo]' ).eq( 0 ).formValidation( 'alert' )[ 0 ], 'Must be completed', 'same alert used for both radio buttons' );

	});

	test( 'can get group alert for atomic group', 5, function() {
		
		strictEqual( $( '#name-given' ).formValidation( 'alert' )[ 0 ], $( '#name-group > legend > .alert' )[ 0 ], 'found alert for given name' );
		strictEqual( $( '#name-family' ).formValidation( 'alert' )[ 0 ], $( '#name-group > legend > .alert' )[ 0 ], 'found alert for family name' );
		strictEqual( $( '#name-given' ).formValidation( 'alert' ).text(), 'Must be completed', 'found expected alert text for given name' );

		$( '#test :submit' )[ 0 ].click();
		strictEqual( $( '#postcode' ).formValidation( 'alert' )[ 0 ], $( '#postal-address > legend > .alert' )[ 0 ], 'found alert for postcode' );
		strictEqual( $( '#street-address' ).formValidation( 'alert' )[ 0 ], $( '#postal-address > legend > .alert' )[ 0 ], 'found alert for street address' );
	});


	module( 'inline validation messages (alerts)', lifecycleCVAPI );

	test( 'alert managed for atomic groups onchange', 7, function() {
		
		// set custom error
		$( '#dob-date' ).val( '56' ).each(function() { this.setCustomValidity( 'Date must be a number (1–31)' ); }).trigger( 'change' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#dob contains 1 alert' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).text(), 'Date must be a number (1–31)', '#dob alert text is correct' );

		$( '#dob-year' ).val( 'YYYY' ).each(function() { this.setCustomValidity( 'Year must be a 4-digit number' ); }).trigger( 'change' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#dob contains 1 alert' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).text(), 'Year must be a 4-digit number', '#dob alert text updated to most recent error' );

		// correct 1 of the errors
		$( '#dob-year' ).val( '1976' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#dob contains 1 alert' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).text(), 'Date must be a number (1–31)', '#dob alert text is updated to first error within group' );

		// correct all errors
		$( '#dob-date' ).val( '11' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		$( '#dob-month' ).each(function() { this.selectedIndex = 8; }).trigger( 'change' );
		strictEqual( $( '#dob' ).closest( '.atomic' ).find( '.alert' ).length, 0, '#dob contains no alerts' );

	});

	test( 'alert managed for mixed groups onchange', 11, function() {
		
		// make state and country valid for this test
		$( '#state, #country' ).val( 'foo' ).trigger( 'change' );

		// set different custom error in nested group
		$( '#city' ).val( 'foo' ).each(function() { this.setCustomValidity( 'Foo is not a city' ); }).trigger( 'change' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#postal-address contains 1 alert' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).text(), 'Foo is not a city', '#postal-address alert text is correct' );

		// set different custom error in nested group
		$( '#postcode' ).val( 'foo' ).each(function() { this.setCustomValidity( 'Must be a number' ); }).trigger( 'change' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#postal-address still contains 1 alert' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).text(), 'Must be a number', '#postal-address alert text is updated' );

		// set different custom outside nested group
		$( '#street-address' ).val( 'foo' ).each(function() { this.setCustomValidity( 'Must be a street or post office box' ); }).trigger( 'change' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#postal-address still contains 1 alert' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).text(), 'Must be a street or post office box', '#postal-address alert text is updated' );

		// fix error inside nested group
		$( '#postcode' ).val( '4000' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#postal-address still contains 1 alert' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).text(), 'Must be a street or post office box', '#postal-address alert text has not changed' );

		// fix error outside nested group
		$( '#street-address' ).val( '1 Roma Street' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).length, 1, '#postal-address still contains 1 alert' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).text(), 'Foo is not a city', '#postal-address alert text changed to last error remaining' );

		// fix remaining error inside nested group
		$( '#city' ).val( 'Brisbane' ).each(function() { this.setCustomValidity( '' ); }).trigger( 'change' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).find( '.alert' ).length, 0, '#postal-address contains no alerts' );
	});


}( jQuery ));
