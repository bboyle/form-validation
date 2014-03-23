// constraint validation API (html5)
/*globals initConstraintValidationAPI*/
lifecycleCVAPI = (function( $ ) {
	return {
		setup: function() {
			// initialise validation (for fixture)
			initConstraintValidationAPI();
			$( 'form' ).formValidation( 'validate' );
		},

		teardown: function() {
			// scroll to top
			$( window ).scrollTo( 0 );
		}
	};
}( jQuery ));
