This is a simple web page that guides learners towards making
their own [teeny quiz][] with HTML and JavaScript. It's intended for
potential use in the [hour of code][].

Affordances have been added that make it easier to debug the
quiz's HTML and JS in a live-reload environment like [Thimble][] and
[JS Bin][].

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
