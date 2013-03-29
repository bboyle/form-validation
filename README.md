This is a form validation package I have developed to deliver the UX I want in web forms
that use the HTML5 constraint validation API.

You're welcome to reuse, fork, modify etc. and chances are unless you like the same
markup and don't need any language other than English, you will need to.

You may also want to check out @jzaefferer's [jquery-validation]

[jquery-validation]: https://github.com/jzaefferer/jquery-validation

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

### TODO

* html5 validation for test pages
* automated execution of unit tests
* acceptance tests (currently only a placeholder)
* dependency management (local jquery copies)
* test against different versions of jquery
* package js files (combine and minify)
