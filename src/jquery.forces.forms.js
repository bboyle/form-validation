/*
	jquery forces forms plugin

	Forms helper

	jquery.forcesForms( "label" ) -- get label element

*/

if ( jQuery !== "undefined" ) {
(function( $ ){
	"use strict";

	var methods = {

		// $( x ).forcesForms( "label" )
		// return .label element
		label : function() {
			if ( this.is( ":radio" )) {
				return this.closest( "fieldset" ).find( ".label" );
			} else {
				return this.closest( "form" ).find( "label[for=" + this[0].id + "] > .label" );
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
