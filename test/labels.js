(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', function() {

		equal( $( 'form#test' ).length, 1, 'form#test is present' );
		equal( $( 'form#test input#foo' ).length, 1, 'form#test contains input#foo' );
		equal( $( 'form#test :radio[name=radioFoo]' ).length, 2, 'form#test contains 2 radio buttons in radioFoo group' );
		equal( $( 'form#test .group input#name-title' ).length, 1, 'form#test contains .group input#name-title' );
		equal( $( 'form#test .group input#name-given' ).length, 1, 'form#test contains .group input#name-given' );
		equal( $( 'form#test .group input#name-family' ).length, 1, 'form#test contains .group input#name-family' );

	});


	module( 'form traversal' );

	test( 'can get labels for form fields', function() {

		equal( $( '#foo' ).forcesForms( 'label' )[0], $( 'label[for=foo] > .label' )[0], 'found :text label' );
		equal( $( '#foo' ).forcesForms( 'label' ).text(), 'Foo', 'found expected label text' );

		equal( $( '#radio-foo-foo' ).forcesForms( 'label' )[0], $( 'legend > .label' )[0], 'found radio button group label' );
		equal( $( '#radio-foo-foo' ).forcesForms( 'label' ).text(), 'Radio foo', 'found expected label text' );

		equal( $( '#name-title' ).forcesForms( 'label' )[0], $( 'label[for=name-title] > .label' )[0], 'found :text label inside group' );
		equal( $( '#name-title' ).forcesForms( 'label' ).text(), 'Title', 'found expected label text' );
		equal( $( '#name-given' ).forcesForms( 'label' )[0], $( 'label[for=name-given] > .label' )[0], 'found :text label inside group' );
		equal( $( '#name-given' ).forcesForms( 'label' ).text(), 'Given names', 'found expected label text' );
		equal( $( '#name-family' ).forcesForms( 'label' )[0], $( 'label[for=name-family] > .label' )[0], 'found :text label inside group' );
		equal( $( '#name-family' ).forcesForms( 'label' ).text(), 'Family name', 'found expected label text' );

	});

	test( 'can get group label for grouped form fields', function() {

		equal( $( '#name-title' ).forcesForms( 'label', { level : 'group' })[0], $( '.group .label' )[0], 'found :text label for group' );
		equal( $( '#name-title' ).forcesForms( 'label', { level : 'group' }).text(), 'Your name', 'found expected group label text' );
		equal( $( '#name-given' ).forcesForms( 'label', { level : 'group' })[0], $( '.group .label' )[0], 'found :text label for group' );
		equal( $( '#name-given' ).forcesForms( 'label', { level : 'group' }).text(), 'Your name', 'found expected group label text' );
		equal( $( '#name-family' ).forcesForms( 'label', { level : 'group' })[0], $( '.group .label' )[0], 'found :text label for group' );
		equal( $( '#name-family' ).forcesForms( 'label', { level : 'group' }).text(), 'Your name', 'found expected group label text' );

	});

	test( 'verify .forcesForm( \'label\' ) supports jquery chaining', function() {
		// test jquery object
		equal( $( '#foo,#radio-foo-foo' ).forcesForms( 'label' )[0], $( 'label[for=foo] > .label' )[0], 'verified 1st label in jquery object' );
		equal( $( '#foo,#radio-foo-foo' ).forcesForms( 'label' )[1], $( 'legend > .label' )[0], 'verified 2nd label in jquery object' );

	});

	test( 'verify .forcesForm( \'label\', { level : \'group\' }) supports jquery chaining', function() {

		equal( $( '.group input' ).forcesForms( 'label', { level : 'group' })[0], $( '.group .label' )[0], 'verified 1st group label in jquery object' );
		equal( $( '.group input' ).forcesForms( 'label', { level : 'group' })[1], $( '.group .label' )[0], 'verified 2nd group label in jquery object' );
		equal( $( '.group input' ).forcesForms( 'label', { level : 'group' })[2], $( '.group .label' )[0], 'verified 3rd group label in jquery object' );

	});


}( jQuery ));
