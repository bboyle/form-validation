var lifecycleCVAPI = {
	setup: function() {
		initConstraintValidationAPI();
		$( 'form' ).forcesForms( 'validate' );
	},
	teardown: function() {
		initConstraintValidationAPI();
		$( 'form' ).forcesForms( 'validate' );
	}
};
