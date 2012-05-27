lifecycleCVAPI = {
		setup: function() {
			// initialise validation (for fixture)
			initConstraintValidationAPI();
			$( 'form' ).forcesForms( 'validate' );
		},

		teardown: function() {
			// scroll to top
			$( window ).scrollTo( 0 );
		}
	}
;
