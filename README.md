This is a form validation package I have developed to deliver the UX I want in web forms
that use the HTML5 constraint validation API.

This plugin *does not work* with jQuery 1.9+ due to the removal of [`.live()`](http://api.jquery.com/live/)

You're welcome to reuse, fork, modify etc. and chances are unless you like the same
markup and don't need any language other than English, you will need to.

You may also want to check out @jzaefferer's [jquery-validation](https://github.com/jzaefferer/jquery-validation)


## Notes

### Traversal

* find a `label` for a form field
* find a `group` containing a form field

### Attributes

* find the current `validationMessage` for a form field

### UI

* `.active` indicates user last interacted with this question or group
* display list of validation alerts in a box `.status`

### Validation
* validate html5 `@required`
* validate html5 `@type=email`

## TODO

* documentation!!
* separate highlight script to a separate repo
* separate submit suppression into a separate repo?
* html5 validation for test pages
* cucumber acceptance tests
* test against different versions of jquery
* support jQuery 1.9+ (and continue backwards compatibility for jQuery 1.4.4+)
