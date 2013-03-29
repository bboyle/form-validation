(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test is present' );
		strictEqual( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		strictEqual( $( 'form#test :radio[name=radioFoo]' ).length, 2, 'form#test contains 2 radio buttons in radioFoo group' );
		strictEqual( $( 'form#test .group input#name-title' ).length, 1, 'form#test contains .group input#name-title' );
		strictEqual( $( 'form#test .group input#name-given' ).length, 1, 'form#test contains .group input#name-given' );
		strictEqual( $( 'form#test .group input#name-family' ).length, 1, 'form#test contains .group input#name-family' );

	});


	module( 'form traversal' );

	test( 'can get question for form fields', function() {

		strictEqual( $( '#foo' ).forcesForms( 'question' )[ 0 ], $( '#foo' ).closest( '.questions > li ')[ 0 ], 'found :text question' );
		strictEqual( $( '#radio-foo-foo' ).forcesForms( 'question' )[ 0 ], $( '#radio-foo-foo' ).closest( '.questions > li ')[ 0 ], 'found radio button group question' );
		strictEqual( $( '#name-title' ).forcesForms( 'question' )[ 0 ], $( '#name-title' ).closest( '.questions > li ')[ 0 ], 'found grouped :text question' );

	});

	test( 'can get group question for grouped form fields', function() {

		strictEqual( $( '#name-title' ).forcesForms( 'question', { level : 'group' })[ 0 ], $( '#name-title' ).closest( '.questions > li' ).parents( '.questions > li' )[ 0 ], 'found question for group' );
		strictEqual( $( '#name-given' ).forcesForms( 'question', { level : 'group' })[ 0 ], $( '#name-given' ).closest( '.questions > li' ).parents( '.questions > li' )[ 0 ], 'found question for group' );
		strictEqual( $( '#name-family' ).forcesForms( 'question', { level : 'group' })[ 0 ], $( '#name-family' ).closest( '.questions > li' ).parents( '.questions > li' )[ 0 ], 'found question for group' );

	});

	test( 'verify .forcesForm( "question" ) supports jquery chaining', function() {
		// test jquery object
		strictEqual( $( '#foo,#radio-foo-foo' ).forcesForms( 'question' )[ 0 ], $( '#foo' ).closest( '.questions > li ')[ 0 ], 'verified 1st question in jquery object' );
		strictEqual( $( '#foo,#radio-foo-foo' ).forcesForms( 'question' )[ 1 ], $( '#radio-foo-foo' ).closest( '.questions > li ')[ 0 ], 'verified 2nd question in jquery object' );

	});

	test( 'verify .forcesForm( "question", { level : "group" }) supports jquery chaining', function() {

		strictEqual( $( '.group input' ).forcesForms( 'question', { level : 'group' })[ 0 ], $( '.group' )[ 0 ], 'verified 1st group question in jquery object' );
		strictEqual( $( '.group input' ).forcesForms( 'question', { level : 'group' })[ 1 ], $( '.group' )[ 0 ], 'verified 2nd group question in jquery object' );
		strictEqual( $( '.group input' ).forcesForms( 'question', { level : 'group' })[ 2 ], $( '.group' )[ 0 ], 'verified 3rd group question in jquery object' );

	});


}( jQuery ));
