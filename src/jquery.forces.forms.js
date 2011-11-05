/*
	jquery forces forms plugin

	Forms helper

	jquery.forcesForms( "label" ) -- get label element
	requires jquery

*/

if ( jQuery !== "undefined" ) {
(function( $ ) {
	"use strict";

	var i = 0,

	// follow plugin conventions for storing plugin data
	// http://docs.jquery.com/Plugins/Authoring#Data
	dataFormErrorSummaryElement = 'forcesForms',

	highlightActiveAncestors = function( event ) {

		var target = $( event.target ),
			ancestorQuestions = target.parentsUntil( 'form' , '.group, .questions > *' )
		;

		// deactive current previously active questions
		target.closest( 'form' ).find( '.questions > *, .group' ).not( ancestorQuestions ).removeClass( 'active' );
		// activate current questions
		ancestorQuestions.addClass( 'active' );

	},

	// helper for .label, .hint and .alert
	getLabelComponent = function( component, options ) {
		return this.map(function( index, domElement ) {

			var $element = $( domElement ),
				labelElement = null,
				foundElement = null;

			if ( typeof options === 'object' && options.level === 'group' ) {
				foundElement = $element.closest( '.group' ).find( component )[ 0 ];

			} else if ( $element.is( ':radio' )) {
				foundElement = $element.closest( 'fieldset' ).find( component )[ 0 ];

			} else {
				labelElement = $element.closest( 'form' ).find( 'label[for=' + domElement.id + ']' );
				foundElement = labelElement.children( component )[ 0 ];
				if ( ! foundElement ) {
					if ( component === '.hint' ) {
						labelElement.append( '<small class="hint"></small>' );
						foundElement = labelElement.children( component )[ 0 ];
					}
				}
			}

			return foundElement;

		});
	},
	
	changeValidityCheck = function( event ) {

		var $this = $( this ),
			alertMessage = $this.forcesForms( 'validationMessage' ),
			alertElement = $this.forcesForms( 'alert' )
		;

		// is there an alert?
		if ( alertMessage === '' ) {

			// remove old alert
			alertElement.remove();

			// TODO get 'question' wrapper, .forcesForms( 'question' )
			// TODO remove .invalid class on LI

		} else {

			// does alert exist?
			// TODO use getLabelComponent() defined above
			if ( alertElement.length === 0 ) {
				alertElement = $( '<em class="alert"/>' );
			}

			// TODO move this to changeHandler
			// is this function THE change handler?
			alertElement.text( alertMessage );
			alertElement.appendTo( $this.forcesForms( 'label' ).parent() );
			// TODO set .invalid class on LI

		}
	},

	
	// checks for invalid elements
	// returns number of invalid elements
	submitValidityCheck = function() {

		// form object
		var form = $( this ).closest( 'form' ),

			// invalid fields
			invalid = form.find( 'input, select, textarea' ).filter(function invalidFields() {

				if ( ! invalidFields.cache ) {
					invalidFields.cache = {};

				} else if ( invalidFields[ this.name ] === true ) {
					return false;
				}
				invalidFields[ this.name ] = true;

				return this.validity && ! this.validity.valid;
			}),

			// alert container
			alert = form.data( dataFormErrorSummaryElement ) || form.data( dataFormErrorSummaryElement, $( '<div class="status"><h2>Unable to process this form</h2><ol></ol></div>' )).data( dataFormErrorSummaryElement ),

			// messages within alert
			messages = alert.find( 'ol' ),

			// track groups
			lastGroupSeen = true
		;

		if ( invalid.length > 0 ) {

			// remove old messages
			messages.find( 'li' ).remove();

			// add new messages
			invalid.each(function() {

				// for unique @id
				i++;

				// get field
				var $this = $( this ),
					
					// get group (if exists)
					group = $this.parentsUntil( 'form', '.group' ),

					// get label or group label
					label = $this.forcesForms( 'label', {
						level : group.length > 0 ? 'group' : null
					}),

					// get the label id
					labelId = label[ 0 ].id || label.attr( 'id', 'UNIQUE_ID_' + ( i ).toString() )[ 0 ].id,

					// get alert item
					item = $this.data( dataFormErrorSummaryElement ) || $this.data( dataFormErrorSummaryElement, $( '<li><a href="#' + labelId + '"></a></li>' )).data( dataFormErrorSummaryElement )
				;

				if ( group.length === 0 || group[ 0 ] !== lastGroupSeen ) {
					
					// update last group seen
					lastGroupSeen = group[ 0 ];

					// create error message with link to label
					item
					.find( 'a' )
						.text( label.text().replace( /\?$/, '' ) + ': ' + $this.forcesForms( 'validationMessage' ) )
						.end()
					.appendTo( messages );

				} else {
					// remove from DOM
					item.remove();
				}
			});
		}

		return invalid.length;
	},


	// displays the summary error for a form
	displaySummary = function() {
		// form object
		var form = $( this ).closest( 'form' );
		// display alert
		form.before( form.data( dataFormErrorSummaryElement ));
	},


	submitValidationHandler = function( event ) {
		// validate form
		var count = submitValidityCheck.call( this );
		// anything invalid?
		if ( count > 0 ) {
			// cancel submit
			event.stopImmediatePropagation();

			// show the error summary
			displaySummary.call( this );
			// TODO show inline errors
			// TODO focus/scrollTo summary element

			// cancel submit
			return false;
		}
	},


	// bind this AFTER the validation handler
	submitDoneHandler = function() {
		// remove summary element from DOM on successful submit
		var summaryElement = $( this ).data( dataFormErrorSummaryElement );

		if ( summaryElement ) {
			summaryElement.remove();
		}
	},


	methods = {

		// $( x ).forcesForms( 'alert' ) -- get
		// get or set alert text (html not supported)
		alert : function( alertMessage ) {
			return this.map(function( index, domElement ) {

				var $element = $( domElement );

				if ( $element.is( ':radio, :checkbox' ) === true ) {
					return $element.closest( 'fieldset' ).find( 'legend > .alert' )[ 0 ];

				} else {
					return $( 'label[for="' + domElement.id + '"] > .alert' )[ 0 ];
				}
			});
		},


		// $( x ).forcesForms( 'label' )
		// $( x ).forcesForms( 'label', { level : group })
		// return .label associated with element or containing group
		label : function( options ) {
			return getLabelComponent.call( this, '.label', options );
		},


		// $( x ).forcesForms( 'hint' )
		// $( x ).forcesForms( 'hint', { level : group })
		// return .hint associated with element or containing group
		hint : function( options ) {
			return getLabelComponent.call( this, '.hint', options );
		},


		// $( x ).forcesForms( 'question' )
		// return question element for item
		question : function() {
			return this.map(function( index, domElement ) {
				return $( domElement ).parentsUntil( 'form', '.questions > li' )[ 0 ];
			});
		},


		// $( x ).forcesForms( 'group' )
		// return group element for item
		group : function() {
			return this.map(function( index, domElement ) {
				return $( domElement ).parentsUntil( 'form', '.group' )[ 0 ];
			});
		},


		// $( x ).forcesForms( 'validate' )
		// binds validation handler functions
		// sets @novalidate on form to disable built-in validation
		validate : function() {
			return this.each(function() {
				$( this ).closest( 'form' )
					// turn off native validation
					.attr( 'novalidate', true )
					// TODO suppress multiple submits
					// validate this form
					.bind( 'submit', submitValidationHandler )
					// if validation did not cancel submit…
					.bind( 'submit', submitDoneHandler )
					// bind inline validation handlers to form elements
					.find( 'input, select, textarea' )
						.bind( 'change', changeValidityCheck )
				;
			});
		},


		// $( x ).forcesForms( 'validationMessage' )
		// return String validation message, e.g. "Must be completed"
		validationMessage : function() {

			var validityState = this[ 0 ].validity;

			if ( typeof validityState === 'undefined' || validityState.valid === true ) {
				return '';

			} else if ( validityState.valueMissing ) {
				return 'Must be completed';

			} else if ( validityState.typeMismatch ) {
				return 'Must be an email address';
			}
		}

	};


	// highlight active ancestors when focus received
	$( 'form a, input, select, textarea' ).live( 'focus', highlightActiveAncestors );


	$.fn.forcesForms = function( method ) {

		// Method calling logic
		// http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.forcesForms' );
		}

	};


}( jQuery ));
}
