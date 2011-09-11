/*
	jquery forces forms plugin

	Forms helper

	jquery.forcesForms( "label" ) -- get label element
	requires jquery

*/

if ( jQuery !== "undefined" ) {
(function( $ ){
	"use strict";

	var i = 0,

	highlightActiveAncestors = function( event ) {

		var target = $( event.target ),

			ancestorQuestions = target.parentsUntil( "form" , ".group, .questions > *" )
		;

		// deactive current previously active questions
		target.closest( "form" ).find( ".questions > *, .group" ).not( ancestorQuestions ).removeClass( "active" );

		// activate current questions
		ancestorQuestions.addClass( "active" );

	},

	validateForm = function() {

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

		}
	},

	methods = {

		// $( x ).forcesForms( "label" )
		// $( x ).forcesForms( "label", { groupLabel : true })
		// return .label associated with element or containing group
		label : function( options ) {
			return this.map(function( index, domElement ) {

				var $element = $( domElement );

				if ( typeof options === "object" && options.level === "group" ) {
					return $element.closest( ".group" ).find( ".label" )[0];

				} else if ( $element.is( ":radio" )) {
					return $element.closest( "fieldset" ).find( ".label" )[0];

				} else {
					return $element.closest( "form" ).find( "label[for=" + domElement.id + "] > .label" )[0];
				}

			});
		},

		// $( x ).forcesForms( "group" )
		// return group element for item
		group : function() {
			return this.map(function( index, domElement ) {
				return $( domElement ).parentsUntil( "form", ".group" )[0];
			});
		},

		// $( x ).forcesForms( "validate" )
		// binds validation handler function to all input, select and textarea elements within the closest form
		validate : function() {
			return this.each(function() {
				$( this ).closest( "form" )
					// remove summary from DOM on submit
					.bind( "submit", function() {
						var alert = $( this ).data( "forces.submit" );
						if ( alert ) {
							alert.remove();
						}
					})
					// bind invalid handler to form elements
					.find( "input, select, textarea" ).bind( "invalid", validateForm )
				;
			});
		},

		// $( x ).forcesForms( "validationMessage" )
		// return String validation message, e.g. "Must be completed"
		validationMessage : function() {

			var validityState = this[0].validity;

			if ( typeof validityState === "undefined" || validityState.valid === true ) {
				return "";

			} else if ( validityState.valueMissing ) {
				return "Must be completed";

			} else if ( validityState.typeMismatch ) {
				return "Must be an email address";
			}
		}

	};


	// highlight active ancestors when focus received
	$( "form a, input, select, textarea" ).live( "focus", highlightActiveAncestors );


	$.fn.forcesForms = function( method ) {

		// Method calling logic
		// http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === "object" || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( "Method " +  method + " does not exist on jQuery.forcesForms" );
		}

	};


}( jQuery ));
}
