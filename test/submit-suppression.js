(function( $ ) {
	'use strict';
	

	var userInitiatedSubmit = function() {
			$( '#test :submit' )[ 0 ].click();
		},

		submitted = 0;


	// bind submit counter
	$( 'form' ).live( 'submit', function() {
		submitted++;
		ok( submitted <= 3, 'submit event detected' );
	});


	module( 'submit suppression', lifecycleCVAPI );

	test( 'invalid submit is not suppressed', 6, function() {

		// setup
		submitted = 0;

		$( '#foo' )[ 0 ].setCustomValidity( 'invalid' );
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
		userInitiatedSubmit(); // should submit (1)
		strictEqual( typeof $( '#test' ).data( 'formValidation' ).lastSubmitTimeStamp, 'undefined', 'lastSubmitTimeStamp is undefined' );

		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
		userInitiatedSubmit(); // should submit (2)
		strictEqual( typeof $( '#test' ).data( 'formValidation' ).lastSubmitTimeStamp, 'undefined', 'lastSubmitTimeStamp is undefined' );
		
		strictEqual( $( '#foo' )[ 0 ].validity.valid, false, '#foo is invalid' );
		userInitiatedSubmit(); // should submit (3)
		strictEqual( typeof $( '#test' ).data( 'formValidation' ).lastSubmitTimeStamp, 'undefined', 'lastSubmitTimeStamp is undefined' );
		
	});

	test( '(SLOW!) submit cannot be triggered more than once per 10 seconds', 3, function() {

		// setup
		submitted = 0;
		$( '#test' ).removeData( 'formValidation' );

		userInitiatedSubmit(); // should submit (1)
		userInitiatedSubmit(); // should be suppressed -
		userInitiatedSubmit(); // should be suppressed -

		stop();
		setTimeout(function() {

			start();
			userInitiatedSubmit(); // should submit (2)
			userInitiatedSubmit(); // should be suppressed -

			stop();
			setTimeout(function() {

				start();
				userInitiatedSubmit(); // should submit (3)
				userInitiatedSubmit(); // should be suppressed -

			}, 10000 );
		}, 10000 );

	});


}( jQuery ));
