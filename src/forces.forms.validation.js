/*
	forces validation

	UI for form validation
	requires HTML5 constraint validaton API (recommended forces.html5.constraintValidationAPI.js)

*/

if ( jQuery !== "undefined" ) {
(function( $ ){
	"use strict";


	// display warnings for any invalid fields onsubmit
	$( "form" ).live( "submit", function() {
		
		var form = $( this ),

			invalid = form.find( "input,select,textarea" ).filter(function() {
				return this.validity && ! this.validity.valid;
			}),

			alert = form.data( "forces.submit" ) || form.data( "forces.submit", $( "<div class='status'><h1>Unable to process this form</h1></div>" )).data( "forces.submit" )
		;

		if ( invalid.length > 0 ) {
			
			// display alert
			alert.prependTo( form );

			// stop submit
			return false;
		}

	});


}( jQuery ));
}
