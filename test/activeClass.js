(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'fields are in test form', function() {

		equal( $( 'form#test' ).length, 1, 'form#test is present' );
		equal( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		equal( $( 'form#test select#select-foo' ).length, 1, 'form#test contains select#select-foo' );
		equal( $( 'form#test :radio[name=radioFoo]' ).length, 5, 'form#test contains 5 radio buttons in radioFoo group' );
		equal( $( 'form#test textarea#textarea-foo' ).length, 1, 'form#test contains textarea#textarea-foo' );
		equal( $( 'form#test .group input#name-title' ).length, 1, 'form#test contains .group input#name-title' );
		equal( $( 'form#test .group input#name-given' ).length, 1, 'form#test contains .group input#name-given' );
		equal( $( 'form#test .group input#name-family' ).length, 1, 'form#test contains .group input#name-family' );

	});

	test( 'nothing is active', function() {

		equal( $( '.active' ).length, 0, 'no elements with match .active' );
		
	});


	module( 'active class set by events' );

	test( '.active on focus', function() {

		$( '#foo' ).trigger( 'focus' );
		equal( $( '#foo' ).parent().is( '.active' ), true, '#foo is .active' );

	});

	test( '.active moves from field to field onfocus', function() {

		$( '#foo' ).trigger( 'focus' );
		equal( $( '#foo' ).parent().is( '.active' ), true, '#foo is .active' );

		$( '#select-foo' ).trigger( 'focus' );
		equal( $( '#foo' ).parent().is( '.active' ), false, '#foo is no longer .active' );
		equal( $( '#select-foo' ).parent().is( '.active' ), true, '#select-foo is now .active' );

		$( '#radio-foo-foo' ).trigger( 'focus' );
		equal( $( '#select-foo' ).parent().is( '.active' ), false, '#select-foo is no longer .active' );
		equal( $( '#radio-foo-foo' ).closest( '.questions > li' ).is( '.active' ), true, '#radio-foo-foo is now .active' );
		equal( $( '#radio-foo-bar' ).closest( '.questions > li' ).is( '.active' ), true, '#radio-foo-foo is also .active' );

		$( '#radio-foo-bar' ).trigger( 'focus' );
		equal( $( '#radio-foo-foo' ).closest( '.questions > li' ).is( '.active' ), true, '#radio-foo-foo remains .active' );
		equal( $( '#radio-foo-bar' ).closest( '.questions > li' ).is( '.active' ), true, '#radio-foo-bar remains .active' );

		$( '#textarea-foo' ).trigger( 'focus' );
		equal( $( '#radio-foo-foo' ).closest( '.questions > li' ).is( '.active' ), false, '#radio-foo-foo is no longer .active' );
		equal( $( '#radio-foo-bar' ).closest( '.questions > li' ).is( '.active' ), false, '#radio-foo-bar is no longer .active' );
		equal( $( '#textarea-foo' ).parent().is( '.active' ), true, '#textarea-foo is now .active' );

		$( '#name-title' ).trigger( 'focus' );
		equal( $( '#textarea-foo' ).parent().is( '.active' ), false, '#textarea-foo is no longer .active' );
		equal( $( '#name-title' ).parent().is( '.active' ), true, '#name-title is now .active' );
		equal( $( '#name-title' ).closest( '.group' ).is( '.active' ), true, '#name-title .group is also .active' );

		$( '#name-given' ).trigger( 'focus' );
		equal( $( '#name-title' ).parent().is( '.active' ), false, '#name-title is no longer .active' );
		equal( $( '#name-given' ).parent().is( '.active' ), true, '#name-given is now .active' );
		equal( $( '#name-title' ).closest( '.group' ).is( '.active' ), true, '#name-title .group remains .active' );

	});


}( jQuery ));
