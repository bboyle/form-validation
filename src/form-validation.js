/*
	Form validation helper

	requires jquery (tested with 1.4.4 and 1.7.2)
	requires jquery.scrollTo plugin
	requires generate-id plugin
	requires HTML5 constraint validation API (native browser or polyfill)
	tested with polyfill forces.html5.constraintValidationAPI

*/

(function( $ ) {
	'use strict';


	var SUBMIT_TOLERANCE = 10000, // milliseconds

	DEFAULT_STATUS_HTML = '<div class="status warn"><div class="inner"><h2>Please check your answers</h2><ol></ol></div></div>',

	// fields that validate
	candidateForValidation = 'input, select, textarea',


	// invalidFilter
	invalidFilter = function() {
		return ! ( this.disabled || this.validity.valid );
	},


	// follow plugin conventions for storing plugin data
	// http://docs.jquery.com/Plugins/Authoring#Data
	pluginDataKey = 'formValidation',
	pluginData = function( key, value ) {
		var dataHash = this.data( pluginDataKey ) || this.data( pluginDataKey, {}).data( pluginDataKey );

		if ( typeof key !== 'undefined' ) {
			if ( typeof value !== 'undefined' ) {
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
				foundElement = $element.formValidation( 'group' ).find( component )[ 0 ];

			} else if ( $element.is( ':radio, :checkbox' )) {
				foundElement = $element.closest( 'fieldset' ).find( component )[ 0 ];

			} else {
				labelElement = $element.closest( 'form' ).find( 'label[for="' + domElement.id + '"]' );
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


	changeValidityCheck = function() {

		var $this = $( this ),
			alertElement = $this.formValidation( 'alert' ),
			alertLevel,
			invalidContainers
		;

		// is this control valid?
		if ( this.validity.valid ) {

			// is it part of a group that contain other invalid controls?
			if ( $this.formValidation( 'question' ).find( '.alert' ).filter( alertElement ).length > 0 ) {
				alertElement.remove();
			} else {
				// update message from first invalid field in group
				invalidContainers = $this.formValidation( 'group' ).find( candidateForValidation ).filter( invalidFilter );
				if ( invalidContainers.length > 0 ) {
					alertElement.text( invalidContainers.formValidation( 'getValidationMessage' ));
				} else {
					// all fields valid
					alertElement.remove();
				}
			}

			// remove invalid class from ancestors that do not contain invalid fields
			$this.parentsUntil( 'form', '.invalid' ).filter(function() {
				return $( this ).find( candidateForValidation ).filter( invalidFilter ).length === 0;
			})
				// remove .invalid class
				.removeClass( 'invalid' )
				// remove old alerts (change handler should have already done this)
				.find( '.alert' ).remove()
			;

		} else {

			// does alert exist?
			if ( alertElement.length === 0 ) {
				alertElement = $( '<em class="alert"/>' );
			}

			// show message
			alertElement.text( $this.formValidation( 'getValidationMessage' ));
			// append to form
			if ( $this.formValidation( 'group' ).hasClass( 'atomic' )) {
				alertLevel = { 'level' : 'group' };
			}

			$this.formValidation( 'label', alertLevel ).parent().find( '.label, abbr[title="(required)"]' ).eq( -1 ).after( alertElement );

			// NOTE we don't flag the question as .invalid now
			// .invalid only happens on submit, to soften inline validation errors
		}
	},


	// checks for invalid elements
	// returns number of invalid elements
	submitValidityCheck = function() {

		// form object
		var form = $( this ).closest( 'form' ),

			// invalid fields
			invalid = form.find( candidateForValidation ).filter(function invalidFields() {

				// skip disabled
				if ( this.disabled ) {
					return false;
				}

				if ( ! invalidFields.cache ) {
					invalidFields.cache = {};

				} else if ( invalidFields.cache[ this.name ] === true ) {
					return false;
				}
				invalidFields.cache[ this.name ] = true;

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

				// get field
				var $this = $( this ),
					// get group (if exists)
					group = $this.formValidation( 'group' ),
					// get label or group label
					label = $this.formValidation( 'label', {
						level : group.length > 0 ? 'group' : null
					}),
					// get the label id
					labelId = label[ 0 ].id || label.generateId( 'label-' + this.id )[ 0 ].id,
					// get alert item
					item = pluginData.call( $this, 'summaryElement' ) || pluginData.call( $this, 'summaryElement', $( '<li><a href="#' + labelId + '"></a></li>' ))
				;

				if ( group.length === 0 || group[ 0 ] !== lastGroupSeen ) {

					// update last group seen
					lastGroupSeen = group[ 0 ];

					// create error message with link to label
					item
						.find( 'a' )
							.text( label.text().replace( /\?$/, '' ) + ': ' + $this.formValidation( 'getValidationMessage' ) )
							.end()
						.appendTo( messages )
					;

				} else {
					// remove from DOM
					item.remove();
				}
			});
		}

		return invalid.length;
	},


	submitValidationHandler = function( event ) {
		// validate form
		var count = submitValidityCheck.call( this ),
			form = $( this );

		// remove invalid class from questions that do not contain invalid fields
		form.find( '.invalid' ).filter(function() {
			return $( this ).find( candidateForValidation ).filter( invalidFilter ).length === 0;
		})
			// remove .invalid class
			.removeClass( 'invalid' )
			// remove old alerts (change handler should have already done this)
			.find( '.alert' ).remove()
		;


		// anything invalid?
		if ( count > 0 ) {
			// cancel submit
			event.stopImmediatePropagation();
			event.preventDefault();

			// show the error summary
			(function( form ) {
				var summary = pluginData.call( form, 'summaryElement' );
				// hide any previous status blocks
				form.prev( '.status' ).not( summary ).remove();
				// show the new summary
				form.before( summary.fadeIn() );
				// focus/scrollTo summary element
				// required jquery.scrollTo plugin
				// http://flesler.blogspot.com/2007/10/jqueryscrollto.html
				$( window ).scrollTo( summary );
			}( form ));

			// find all the invalid fields
			form.find( candidateForValidation ).filter( invalidFilter ).each(function() {
				// update inline alerts
				changeValidityCheck.call( this );
			})
				// set .invalid on ancestor LI elements
				.parentsUntil( 'form', '.questions > li' )
				// but not sections
				.not( '.section, .compact' )
				.addClass( 'invalid' )
			;

			// cancel submit
			return false;
		}
	},


	// bind this AFTER the validation handler
	// only invoked if validation did not prevent submit
	submitDoneHandler = function( event ) {
			// use event.timeStamp when available and $.now() otherwise
		var timeStamp = event.timeStamp || $.now(),
			form = $( this ),
			summaryElement = pluginData.call( form, 'summaryElement' ),
			lastSubmitTimeStamp
		;

		// remove summary element from DOM on successful submit
		if ( summaryElement ) {
			summaryElement.remove();
		}

		// is this submit event too soon after the last one?
		lastSubmitTimeStamp = pluginData.call( form, 'lastSubmitTimeStamp' );
		if ( lastSubmitTimeStamp && timeStamp - lastSubmitTimeStamp < SUBMIT_TOLERANCE ) {
			// cancel the submit event
			event.stopImmediatePropagation();
			event.preventDefault();
			return false;

		} else {
			// store the timestamp
			pluginData.call( form, 'lastSubmitTimeStamp', timeStamp );
		}
	},


	// plugin methods
	methods = {

		// $( x ).formValidation( 'alert' ) -- get
		// get alert text
		alert : function() {
			return this.map(function( index, domElement ) {

				var $element = $( domElement ),
					group;

				if ( $element.is( ':radio, :checkbox' ) === true ) {
					return $element.closest( 'fieldset' ).find( 'legend > .alert' )[ 0 ];

				} else {
					// atomic groups
					group = $element.formValidation( 'group' ).filter( '.atomic' );
					if ( group.length > 0 ) {
						return group.find( 'legend > .alert' )[ 0 ];

					} else {
						return $( 'label[for="' + domElement.id + '"] > .alert' )[ 0 ];
					}
				}
			});
		},


		// $( x ).formValidation( 'label' )
		// $( x ).formValidation( 'label', { level : group })
		// return .label associated with element or containing group
		label : function( options ) {
			return getLabelComponent.call( this, '.label', options );
		},


		// $( x ).formValidation( 'hint' )
		// $( x ).formValidation( 'hint', { level : group })
		// return .hint associated with element or containing group
		hint : function( options ) {
			return getLabelComponent.call( this, '.hint', options );
		},


		// $( x ).formValidation( 'question' )
		// return question element for item
		question : function( options ) {
			// looking for group?
			if ( typeof options === 'object' && options.level === 'group' ) {
				// return the group
				return this.formValidation( 'group' );
			}

			// not looking for group
			return this.map(function( index, domElement ) {
				return $( domElement ).parentsUntil( 'form', '.questions > li' )[ 0 ];
			});
		},


		// $( x ).formValidation( 'group' )
		// return group element for item
		group : function() {
			return this.map(function( index, domElement ) {
				return $( domElement ).parentsUntil( 'form', '.group' ).filter(function() {
					// ignore groups that do not contain fieldsets
					return $( this ).children( 'fieldset' ).length > 0;
				})[ 0 ];
			});
		},


		// $( x ).formValidation( 'validate' )
		// binds validation handler functions
		// sets @novalidate on form to disable built-in validation
		// TODO allow this to be called multiple times without binding additional handlers!
		validate : function() {
			return this.each(function() {
				$( this ).closest( 'form' )
					// turn off native validation
					.attr( 'novalidate', true )
					// unbind and rebind handlers
					.unbind( 'submit', submitDoneHandler )
					.unbind( 'submit', submitValidationHandler )
					// validate this form
					.bind( 'submit', submitValidationHandler )
					// if validation did not cancel submit…
					.bind( 'submit', submitDoneHandler )
					// bind inline validation handlers to form elements
					.find( candidateForValidation )
						.unbind( 'change', changeValidityCheck )
						.bind( 'change', changeValidityCheck )
				;
			});
		},


		// $( x ).formValidation( 'getValidationMessage' )
		// return String validation message, e.g. "Must be completed"
		getValidationMessage : function() {

			var validityState = this[ 0 ].validity;

			if ( typeof validityState === 'undefined' || validityState.valid === true ) {
				return '';

			} else if ( validityState.valueMissing ) {
				return 'Must be completed';

			} else if ( validityState.customError ) {
				return this[ 0 ].validationMessage;

			} else if ( validityState.typeMismatch ) {
				return 'Must be an email address';

			} else if ( validityState.patternMismatch ) {
				return 'Must use the format shown';

			} else {
				return 'Must be a valid answer';
			}
		}

	};


	$.fn.formValidation = function( method ) {

		// Method calling logic
		// http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.formValidation' );
		}

	};


	// legacy API
	$.fn.forcesForms = $.fn.formValidation;


}( jQuery ));
