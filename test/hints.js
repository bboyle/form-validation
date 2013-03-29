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

	test( 'can get hints for form fields', function() {

		strictEqual( $( '#foo' ).forcesForms( 'hint' )[0], $( 'label[for=foo] > .hint' )[0], 'found :text hint' );
		strictEqual( $( '#foo' ).forcesForms( 'hint' ).text(), 'Foo hint', 'found expected hint text' );

		strictEqual( $( '#radio-foo-foo' ).forcesForms( 'hint' )[0], $( 'legend > .hint' )[0], 'found radio button group hint' );
		strictEqual( $( '#radio-foo-foo' ).forcesForms( 'hint' ).text(), 'Hint for radio foo', 'found expected hint text' );

	});

	test( 'empty hints created on demand', function() {

		strictEqual( $( 'label[for=name-title] > .hint' ).length, 0, 'no hint for #name-title' );
		strictEqual( $( '#name-title' ).forcesForms( 'hint' ).length, 1, 'found .hint on demand' );
		strictEqual( $( '#name-title' ).forcesForms( 'hint' )[0], $( 'label[for=name-title] > .hint' )[0], '.hint was added to DOM for #name-title' );

	$( '#name-title' ).forcesForms( 'hint' ).text( 'New hint' );
		strictEqual( $( '#name-title' ).forcesForms( 'hint' ).text(), 'New hint', 'populated new .hint with text' );
	});

	test( 'can get group hint for grouped form fields', function() {

		strictEqual( $( '#name-title' ).forcesForms( 'hint', { level : 'group' })[0], $( '.group .hint' )[0], 'found :text hint for group' );
		strictEqual( $( '#name-title' ).forcesForms( 'hint', { level : 'group' }).text(), 'Will be displayed on this website', 'found expected group hint text' );
		strictEqual( $( '#name-given' ).forcesForms( 'hint', { level : 'group' })[0], $( '.group .hint' )[0], 'found :text hint for group' );
		strictEqual( $( '#name-given' ).forcesForms( 'hint', { level : 'group' }).text(), 'Will be displayed on this website', 'found expected group hint text' );
		strictEqual( $( '#name-family' ).forcesForms( 'hint', { level : 'group' })[0], $( '.group .hint' )[0], 'found :text hint for group' );
		strictEqual( $( '#name-family' ).forcesForms( 'hint', { level : 'group' }).text(), 'Will be displayed on this website', 'found expected group hint text' );

	});

	test( 'verify .forcesForm( "hint" ) supports jquery chaining', function() {
		// test jquery object
		strictEqual( $( '#foo,#radio-foo-foo' ).forcesForms( 'hint' )[0], $( 'label[for=foo] > .hint' )[0], 'verified 1st hint in jquery object' );
		strictEqual( $( '#foo,#radio-foo-foo' ).forcesForms( 'hint' )[1], $( 'legend > .hint' )[0], 'verified 2nd hint in jquery object' );

	});

	test( 'verify .forcesForm( "hint", { level : "group" }) supports jquery chaining', function() {

		strictEqual( $( '.group input' ).forcesForms( 'hint', { level : 'group' })[0], $( '.group .hint' )[0], 'verified 1st group hint in jquery object' );
		strictEqual( $( '.group input' ).forcesForms( 'hint', { level : 'group' })[1], $( '.group .hint' )[0], 'verified 2nd group hint in jquery object' );
		strictEqual( $( '.group input' ).forcesForms( 'hint', { level : 'group' })[2], $( '.group .hint' )[0], 'verified 3rd group hint in jquery object' );

	});


}( jQuery ));
