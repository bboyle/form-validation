/*
	jquery forces forms plugin

	Forms helper

	jquery.forcesForms( "label" ) -- get label element
	requires jquery

*/

if ( jQuery !== 'undefined' ) {
(function( $ ) {
	'use strict';

	// TODO this is used by 'unique id', better wrap it in a function
	var i = 0,

	SUBMIT_TOLERANCE = 10000, // milliseconds

	DEFAULT_STATUS_HTML = '<div class="status warn"><div class="inner"><h2>Unable to process this form</h2><ol></ol></div></div>',

	// fields that validate
	candidateForValidation = 'input, select, textarea',


	// invalidFilter
	invalidFilter = function() {
		return ! this.validity.valid;	
	},


	// follow plugin conventions for storing plugin data
	// http://docs.jquery.com/Plugins/Authoring#Data
	pluginDataKey = 'forcesForms',
	pluginData = function( key, value ) {
		var dataHash = this.data( pluginDataKey ) || this.data( pluginDataKey, {}).data( pluginDataKey );

			if ( key ) {
				if ( value ) {
					dataHash[ key ] = value;
					return value;

				} else if ( typeof dataHash[ key ] !== 'undefined' ) {
					return dataHash[ key ];
				}
				return null;
			}

			return dataHash;
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
			alertElement = $this.forcesForms( 'alert' ),
			question
		;

		// is there an alert?
		if ( alertMessage === '' ) {

			// remove old alert
			alertElement.remove();

			// check if this control is still .invalid
			question = $this.parentsUntil( 'group', '.questions > li' ).eq( -1 );
			// toggle .invalid
			question.toggleClass( 'invalid', question.find( candidateForValidation ).filter( invalidFilter ).length > 0 );

		} else {

			// does alert exist?
			if ( alertElement.length === 0 ) {
				alertElement = $( '<em class="alert"/>' );
			}

			// show message
			alertElement.text( alertMessage );
			// append to form
			alertElement.appendTo( $this.forcesForms( 'label' ).parent() );

			// NOTE we don't flag the question as .invalid now
			// .invalid only happens on submit, to soften inline validation errors
			// TODO consider an .invalid-change class vs .invalid (onsubmit) as a styling hook
		}
	},

	
	// checks for invalid elements
	// returns number of invalid elements
	submitValidityCheck = function() {

		// form object
		var form = $( this ).closest( 'form' ),

			// invalid fields
			invalid = form.find( candidateForValidation ).filter(function invalidFields() {

				if ( ! invalidFields.cache ) {
					invalidFields.cache = {};

				} else if ( invalidFields[ this.name ] === true ) {
					return false;
				}
				invalidFields[ this.name ] = true;

				return this.validity && ! this.validity.valid;
			}),

			// alert container
			alert = pluginData.call( form, 'summaryElement' ) || pluginData.call( form, 'summaryElement', $( DEFAULT_STATUS_HTML )),

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
					labelId = label[ 0 ].id || label.attr( 'id', 'UNIQUE_ID_' + String( i ))[ 0 ].id,

					// get alert item
					item = pluginData.call( $this, 'summaryElement' ) || pluginData.call( $this, 'summaryElement', $( '<li><a href="#' + labelId + '"></a></li>' ))
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
		form.before( pluginData.call( form, 'summaryElement' ));
	},


	submitValidationHandler = function( event ) {
		// validate form
		var count = submitValidityCheck.call( this ),
			questions,
			form;

		// anything invalid?
		if ( count > 0 ) {
			// cancel submit
			event.stopImmediatePropagation();

			form = $( this );

			// show the error summary
			displaySummary.call( this );
			// TODO focus/scrollTo summary element

			// get top level questions
			questions = form.children( '.questions' ).children();
			// show inline alerts
			form.find( candidateForValidation ).each(function() {
				changeValidityCheck.call( this );
			});
			// add invalid class to questions that contain invalid fields
			questions.filter(function() {
				return $( this ).find( candidateForValidation ).filter( invalidFilter ).length > 0;
			}).addClass( 'invalid' );
			// remove invalid class from questions that do not contain invalid fields
			questions.filter(function() {
				return $( this ).find( candidateForValidation ).filter( invalidFilter ).length === 0;
			}).removeClass( 'invalid' );

			// cancel submit
			return false;
		}
	},


	// bind this AFTER the validation handler
	submitDoneHandler = function( event ) {
		// remove summary element from DOM on successful submit
		var form = $( this ),
			summaryElement = pluginData.call( form, 'summaryElement' ),
			lastSubmitTimeStamp;

		if ( summaryElement ) {
			summaryElement.remove();
		}

		// is this submit event too soon after the last one?
		lastSubmitTimeStamp = pluginData.call( form, 'lastSubmitTimeStamp' );
		if ( lastSubmitTimeStamp && event.timeStamp - lastSubmitTimeStamp < SUBMIT_TOLERANCE ) {
			// cancel the submit event
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;

		} else {
			// store the timestamp
			pluginData.call( form, 'lastSubmitTimeStamp', event.timeStamp );
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
		question : function( options ) {
			// looking for group?
			if ( typeof options === 'object' && options.level === 'group' ) {
				// return the group
				return this.forcesForms( 'group' );
			}

			// not looking for group
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
		// TODO allow this to be called multiple times without binding additional handlers!
		validate : function() {
			return this.each(function() {
				$( this ).closest( 'form' )
					// turn off native validation
					.attr( 'novalidate', true )
					// validate this form
					.bind( 'submit', submitValidationHandler )
					// if validation did not cancel submit…
					.bind( 'submit', submitDoneHandler )
					// bind inline validation handlers to form elements
					.find( candidateForValidation )
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
