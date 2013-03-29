(function( $ ) {
	'use strict';
	

	module( 'environment', lifecycleCVAPI );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'input#foo', '#test' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'input#bar', '#test' ).length, 1, 'form#test contains input#bar' );

		strictEqual( $( 'input#email', '#test' ).length, 1, 'form#test contains input#email' );
		strictEqual( $( 'input#email', '#test' )[ 0 ].getAttribute( 'type' ), 'email', 'input#email is @type=email' );

		strictEqual( $( 'input#part', '#test' ).length, 1, 'form#test contains input#part' );
		strictEqual( $( 'input#part' )[ 0 ].getAttribute( 'pattern' ), '[0-9][A-Z]{3}', 'input#part has @pattern' );

		strictEqual( $( '.group input#country', '#test' ).length, 1, 'form#test contains .group input#country' );
		strictEqual( $( '.group .group input#city', '#test' ).length, 1, 'form#test contains nested .group input#city' );

	});


	module( 'built-in validation', lifecycleCVAPI );

	test( 'required field message', function() {

		$( '#foo, #bar' ).each(function() {
			this.checkValidity();
		});
		strictEqual( $( '#foo' ).forcesForms( 'getValidationMessage' ), 'Must be completed', 'found message for #foo' );
		strictEqual( $( '#bar' ).forcesForms( 'getValidationMessage' ), 'Must be completed', 'found message for #bar' );
	});

	test( 'email type', function() {

		// invalid email
		$( '#email' ).val( 'foo' )[ 0 ].checkValidity();

		strictEqual( $( '#email' ).forcesForms( 'getValidationMessage' ), 'Must be an email address', 'found message for #email' );
	});

	test( 'pattern mismatch', function() {

		// invalid value
		$( '#part' ).val( 'foo' )[ 0 ].checkValidity();

		strictEqual( $( '#part' ).forcesForms( 'getValidationMessage' ), 'Must use the format shown', 'found message for #part' );
	});

	test( 'verify .forcesForm( "validationMessage" ) returns first value only', function() {

		$( '#foo, #bar' ).each(function() {
			this.checkValidity();
		});
		strictEqual( $( '#foo, #bar' ).forcesForms( 'getValidationMessage' ), 'Must be completed', 'found expected message' );
		
	});

	test( 'required field message for atomic groups', function() {

		$( '#city, #country' ).each(function() {
			this.checkValidity();
		});
		strictEqual( $( '#city' ).forcesForms( 'getValidationMessage' ), 'Must be completed', 'found message for #city' );
		strictEqual( $( '#country' ).forcesForms( 'getValidationMessage' ), 'Must be completed', 'found message for #country' );
	});


	module( 'custom validation', lifecycleCVAPI );

	test( 'can get validation message for form fields', function() {

		$( '#foo' ).val( 'foo' );
		$( '#foo' )[ 0 ].setCustomValidity( 'foo is invalid' );
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#foo' )[ 0 ].validationMessage, 'foo is invalid', 'found .validationMessage for #foo' );
		strictEqual( $( '#foo' ).forcesForms( 'getValidationMessage' ), 'foo is invalid', 'found .forcesForms( "getValidationMessage" ) for #foo' );
		strictEqual( $( '#foo' ).forcesForms( 'getValidationMessage' ), $( '#foo' )[ 0 ].validationMessage, 'getValidationMessage === validationMessage' );

		$( '#foo' )[ 0 ].setCustomValidity( '' );
		$( '#foo' )[ 0 ].checkValidity();

		strictEqual( $( '#foo' )[ 0 ].validationMessage, '', 'found .validationMessage for #foo' );
		strictEqual( $( '#foo' ).forcesForms( 'getValidationMessage' ), '', 'found .forcesForms( "getValidationMessage" ) for #foo' );
		strictEqual( $( '#foo' ).forcesForms( 'getValidationMessage' ), $( '#foo' )[ 0 ].validationMessage, 'getValidationMessage === validationMessage' );
	});


}( jQuery ));
