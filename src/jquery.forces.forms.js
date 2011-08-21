/*
	jquery forces forms plugin

	Forms helper

	jquery.forcesForms( "label" ) -- get label element
	requires jquery

*/

if ( jQuery !== "undefined" ) {
(function( $ ){
	"use strict";

	var methods = {

		// $( x ).forcesForms( "label" )
		// return .label associated with element
		label : function() {
			return this.map(function( index, domElement ) {

				var $element = $( domElement );

				if ( $element.is( ":radio" )) {
					return $element.closest( "fieldset" ).find( ".label" )[0];
				} else {
					return $element.closest( "form" ).find( "label[for=" + domElement.id + "] > .label" )[0];
				}

			});
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
