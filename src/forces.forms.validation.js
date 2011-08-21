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
		
		// form object
		var form = $( this ),

			// invalid fields
			invalid = form.find( "input,select,textarea" ).filter(function() {
				return this.validity && ! this.validity.valid;
			}),

			// alert container
			alert = form.data( "forces.submit" ) || form.data( "forces.submit", $( "<div class='status'><h1>Unable to process this form</h1><ol></ol></div>" )).data( "forces.submit" ),

			// messages within alert
			messages = alert.find( "ol" )
		;

		if ( invalid.length > 0 ) {

			// remove old messages
			messages.find( "li" ).remove();
			// add new messages
			invalid.each(function() {

				// find label
				var label = $( "label[for=" + this.id + "]" ),

					// get the label id
					id = label[0].id || label.attr( "id", "UNIQUE_ID_HERE" )[0].id
				;

				// create error message with link to label
				$( "<li><a href='#" + id + "'>Foo: Must be completed</a></li>" ).appendTo( messages );

			});
			
			// display alert
			alert.prependTo( form );

			// stop submit
			return false;
		}

	});


}( jQuery ));
}
