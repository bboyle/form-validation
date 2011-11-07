var lifecycleCVAPI = {
	setup: function() {
		initConstraintValidationAPI();
		$( 'form' ).forcesForms( 'validate' );
	}
};
