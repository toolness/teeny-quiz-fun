This is a simple web page that guides learners towards making
their own [teeny quiz][] with HTML and JavaScript. It's intended for
potential use in the [hour of code][].

Affordances have been added that make it easier to debug the
quiz's HTML and JS in a live-reload environment like [Thimble][] and
[JS Bin][].

## API

A teeny quiz web page needs to follow a basic markup API and define one
JavaScript function. Specifically, it needs the following:

* A stylesheet link that includes `teeny-quiz.css`.

* A script tag that includes `teeny-quiz.js`.

* A `<section>` with id `questions` that contains a single `<form>`. The
  form should have:

  * any number of checkbox inputs, each with a unique `name` attribute.
  * any number of radio inputs, each with `name` and `value`
    attributes. As is standard for HTML forms, radio inputs belonging
    to the same group should have the same name.
  * a submit button.

* A `<section>` with id `answers` that contains any number of `<div>`
  children, each with a unique id. These represent different
  responses that can be given to the user based on their 
  responses to the questions.

* The answers section should also contain a button
  with id `reset`, which can be used to go back to the
  question-answering phase (this is required for live-reload
  code editors that don't have back buttons).

* A global JavaScript function called `getAnswerId`, which takes
  a single argument called *response*.

  *response* will be an object describing the user's answers
  to the quiz questions. Each property of this object
  corresponds to the `name` attribute of a form input in the
  `questions` section. For radio inputs, values will be strings
  that correspond to the selected input's `value` attribute.
  For checkboxes, values will be booleans.

  This function should perform any necessary logic on its argument
  and return a string representing the id of a `<div>` in the
  answers section of the HTML. The related `<div>` will then
  be shown to the user.

* Additionally, the page may optionally define a global variable
  called `DEBUG`. If this value is truthy, then a debug panel
  will be shown in the answer stage that displays the
  pretty-printed JSON serialization of the *response* argument
  that was passed to `getAnswerId`.

If any required elements are missing, feedback will be shown
to the user so the page doesn't just fail silently.

For a simple example that incorporates these requirements, see
`index.html`.

## Limitations

Currently, the answer phase is not regarded as a separate URL from
the question phase, which means that [back button expectations][backbtn]
are broken. This is a bug, albeit a nontrivial one to fix because
of the disparity between live-reload development environments and
published web pages.

## Deployment

To deploy to an HTML page that only includes absolute links to
its sub-resources, run `node bin/export.js` from the command line
and pipe its output somewhere.

For example, on OS X, running `node bin/export.js | pbcopy` will put
the resulting HTML in your clipboard, at which point you can
paste it into Thimble or JS Bin.

If you want to use a different base URL for the sub-resources than
the default of `http://toolness.github.io/teeny-quiz-fun/`, you
can supply it as an argument to the export script, e.g.
`node bin/export.js http://example.org/teeny-quiz/`.

  [teeny quiz]: http://www.buzzfeed.com/quiz
  [hour of code]: http://csedweek.org/
  [Thimble]: https://thimble.webmaker.org/
  [JS Bin]: http://jsbin.com/
  [backbtn]: http://baymard.com/blog/back-button-expectations
