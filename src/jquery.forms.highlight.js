/*
	jquery forces forms plugin

	Forms helper

	requires jquery

*/

(function( $ ) {
	'use strict';


	var highlightActiveAncestors = function( event ) {

		var target = $( event.target ),
			ancestorQuestions = target.parentsUntil( 'form' , '.group, .questions > li' )
		;

		// deactive current previously active questions
		target.closest( 'form' ).find( '.questions > *, .group' ).not( ancestorQuestions ).removeClass( 'active' );
		// activate current questions
		ancestorQuestions.addClass( 'active' );

	};


	// highlight active ancestors when focus received
	$( 'form a, input, select, textarea' ).live( 'focus', highlightActiveAncestors );


}( jQuery ));
