/*
	forces validation

	UI for form validation
	requires HTML5 constraint validaton API (recommended forces.html5.constraintValidationAPI.js)
	requires jquery.forces.forms.js

*/

if ( jQuery !== "undefined" ) {
(function( $ ){
	"use strict";


	// display warnings for any invalid fields onsubmit
	$( "form :submit" ).live( "click", function() {
		
		// form object
		var form = $( this ).closest( "form" ),

			// invalid fields
			invalid = form.find( "input, select, textarea" ).filter(function invalidFields() {

				if ( ! invalidFields.cache ) {
					invalidFields.cache = {};

				} else if ( invalidFields[ this.name ] === true ) {
					return false;					

				}

				invalidFields[ this.name ] = true;

				return this.validity && ! this.validity.valid;
			}),

			// alert container
			alert = form.data( "forces.submit" ) || form.data( "forces.submit", $( "<div class='status'><h1>Unable to process this form</h1><ol></ol></div>" )).data( "forces.submit" ),

			// messages within alert
			messages = alert.find( "ol" ),

			// counter
			i = 0,

			// track groups
			lastGroupSeen = true

		;

		if ( invalid.length > 0 ) {

			// remove old messages
			messages.find( "li" ).remove();

			// add new messages
			invalid.each(function() {

				// for unique @id
				i = i + 1;

				// get field
				var $this = $( this ),
					
					// get group (if exists)
					group = $this.parentsUntil( "form", ".group" ),

					// get label or group label
					label = $this.forcesForms( "label", {
						level : group.length > 0 ? "group" : null
					}),

					// get the label id
					labelId = label[0].id || label.attr( "id", "UNIQUE_ID_" + ( i ).toString())[0].id
				;

				if ( group.length === 0 || group[0] !== lastGroupSeen ) {
					
					// update last group seen
					lastGroupSeen = group[0];

					// create error message with link to label
					$( "<li><a href='#" + labelId + "'>" + label.text().replace( /\?$/, "" ) + ": " + $this.forcesForms( "validationMessage" ) + "</a></li>" ).appendTo( messages );

				}

			});
			
			// display alert
			form.before( alert );

			// stop submit
			return false;
		}

	});


}( jQuery ));
}
