// load scripts
(function() {

	var jqueryVersion = decodeURIComponent( window.location.hash ).replace( /(?:^|#|&)jquery=([^&]*)(?:&|$)/, '$1' ) || '1.7.2',
		scripts = [
			'lib/jquery-' + jqueryVersion + '-min.js',
			'lib/jquery.scrollTo-1.4.2-min.js',
			'lib/generateId.js',
			'lib/forces.html5.constraintValidationAPI.js',
			'src/jquery.forces.forms.js',
			'src/jquery.forces.forms.highlight.js',
			'test/qunit-lifecycle.js'
		],
		i, s
	;

	for ( i = 0 ; i < scripts.length; i++ ) {
		// TODO use DOM instead of document.write
		document.write( '<script src="../' + scripts[ i ] + '"></script>' );
	}


}());
