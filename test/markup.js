(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', 4, function() {

		equal( $( 'form#test' ).length, 1, 'form#test is present' );
		equal( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		equal( $( 'label[for="foo"] .label' ).length, 0, 'input#foo label is missing .label' );
		equal( $( 'label[for="foo"] .lable' ).length, 1, 'input#foo label has typo .lable' );

	});


	module( 'handle bad label traversal', lifecycleCVAPI );

	test( 'typo in label classname', 1, function() {

		$( 'form' ).trigger( 'submit' );
		strictEqual( $( 'li', '.status' ).text(), ': Must be completed', 'handles missing label class' );

	});



}( jQuery ));
