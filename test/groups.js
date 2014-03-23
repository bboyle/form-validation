(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( '.group input#name-title', '#test' ).length, 1, 'form#test contains .group input#name-title' );
		strictEqual( $( '.group input#name-given', '#test' ).length, 1, 'form#test contains .group input#name-given' );
		strictEqual( $( '.group input#name-family', '#test' ).length, 1, 'form#test contains .group input#name-family' );
		strictEqual( $( '.group input#foo', '#test' ).length, 1, 'form#test contains .group input#foo' );
		strictEqual( $( '.group input#bar', '#test' ).length, 1, 'form#test contains .group input#bar' );
		strictEqual( $( 'input#nogroup', '#test' ).length, 1, 'form#test contains input#nogroup' );
		strictEqual( $( '.group input#nogroup', '#test' ).length, 0, 'form#test does not contain .group input#nogroup' );
		strictEqual( $( '.group input#country', '#test' ).length, 1, 'form#test contains .group input#country' );
		strictEqual( $( '.group .group input#city', '#test' ).length, 1, 'form#test contains nested .group input#city' );

	});


	module( 'form traversal' );

	test( 'can get groups for form fields', function() {

		strictEqual( $( '#name-title' ).formValidation( 'group' )[ 0 ], $( '.group' )[ 0 ], 'found group for title' );
		strictEqual( $( '#name-given' ).formValidation( 'group' )[ 0 ], $( '.group' )[ 0 ], 'found group for given name' );
		strictEqual( $( '#name-family' ).formValidation( 'group' )[ 0 ], $( '.group' )[ 0 ], 'found group for family name' );

	});

	test( 'non-grouped fields return undefined', function() {

		strictEqual( $( '#nogroup' ).formValidation( 'group' )[ 0 ], undefined, 'nogroup has no group' );

	});

	test( 'verify .formValidation( \'group\' ) supports jquery chaining', function() {
		// test jquery object
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 0 ], $( '.group' )[ 0 ], 'found group for name (title)' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 1 ], $( '.group' )[ 0 ], 'found group for name (given)' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 2 ], $( '.group' )[ 0 ], 'found group for name (family)' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 3 ], $( '.group' )[ 1 ], 'found fubar group for foo' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 4 ], $( '.group' )[ 1 ], 'found fubar group for bar' );
		// .nogroup will be removed from jquery object after .formValidation( 'group' )
		// strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 5 ], undefined, 'found undefined for ungrouped input' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 5 ], $( '.group' )[ 2 ], 'found address group for city' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 6 ], $( '.group' )[ 2 ], 'found address group for state' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 7 ], $( '.group' )[ 2 ], 'found address group for postcode' );
		strictEqual( $( 'input', '#test' ).formValidation( 'group' )[ 8 ], $( '.group' )[ 2 ], 'found address group for country' );

	});


}( jQuery ));
