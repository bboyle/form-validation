(function( $ ) {
	'use strict';
	

	module( 'environment', lifecycleCVAPI );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'input#foo', '#test' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'select#select-foo', '#test' ).length, 1, 'form#test contains select#select-foo' );
		strictEqual( $( 'textarea#textarea-foo', '#test' ).length, 1, 'form#test contains textarea#textarea-foo' );

	});

	test( 'fields share duplicate name', 3, function() {

		strictEqual( $( 'input#foo' ).attr( 'name' ), 'foo', 'input#foo has name foo' );
		strictEqual( $( 'select#select-foo' ).attr( 'name' ), 'foo', 'select#select-foo has name foo' );
		strictEqual( $( 'textarea#textarea-foo' ).attr( 'name' ), 'foo', 'textarea#textarea-foo has name foo' );

	});

	test( 'fields are required', 3, function() {

		strictEqual( $( '[required]' )[ 0 ], $( 'input#foo' )[ 0 ], 'input#foo is the first required field' );
		strictEqual( $( '[required]' )[ 1 ], $( 'select#select-foo' )[ 0 ], 'select#select-foo is the second required field' );
		strictEqual( $( '[required]' )[ 2 ], $( 'textarea#textarea-foo' )[ 0 ], 'textarea#textarea-foo is a required field' );

	});


	module( 'form submission UI', lifecycleCVAPI );

	test( 'status message shown on submit', 5, function() {

		$( 'form' ).trigger( 'submit' );

		var status = $( '.status' );

		strictEqual( status.length, 1, '.status element is shown' );
		strictEqual( status.find( 'li' ).length, 3, '.status element contains 3 warnings' );
		strictEqual( status.find( 'li' ).eq( 0 ).text(), 'Foo: Must be completed', 'correct error for text@name=foo' );
		strictEqual( status.find( 'li' ).eq( 1 ).text(), 'Select foo: Must be completed', 'correct error for select@name=foo' );
		strictEqual( status.find( 'li' ).eq( 2 ).text(), 'Textarea foo: Must be completed', 'correct error for textarea@name=foo' );
		
	});


}( jQuery ));
