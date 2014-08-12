var Localform = {
  KEY: 'TQ_response'
};

Localform.eachInput = function(form, cb) {
  var inputs = form.querySelectorAll("input");
  [].slice.call(inputs).forEach(function(input) {
    if (!input.name) return;
    if (input.type != "checkbox" && input.type != "radio") return;
    cb(input);
  });
};

Localform.getFormHash = function(form) {
  var parts = [];
  Localform.eachInput(form, function(input) {
    parts.push([input.type, input.name,
                input.getAttribute('value')].join(','));
  });
  return parts.join('|');
};

Localform.clearFormResponse = function() {
  delete sessionStorage[Localform.KEY];
};

Localform.setFormResponse = function(form) {
  sessionStorage[Localform.KEY] = JSON.stringify({
    hash: Localform.getFormHash(form),
    fields: Localform.saveForm(form)
  });
};

Localform.getFormResponse = function(form) {
  try {
    try {
      var data = JSON.parse(sessionStorage[Localform.KEY]);
    } catch (e) { return; }
    if (data.hash != Localform.getFormHash(form))
      return;
    Localform.restoreForm(form, data.fields);
    return data.fields;
  } catch (e) {
    if (window.console && console.log) console.log(e);
  }
};

Localform.restoreForm = function(form, data) {
  Localform.eachInput(form, function(input) {
    if (input.type == "checkbox" && typeof(data[input.name] == "boolean"))
      input.checked = data[input.name];
    if (input.type == "radio" && typeof(data[input.name] == "string"))
      input.checked = (data[input.name] == input.value);
  });
};

Localform.saveForm = function(form) {
  var result = {};
  Localform.eachInput(form, function(input) {
    if (input.type == "checkbox")
      result[input.name] = input.checked;
    if (input.type == "radio") {
      if (!(input.name in result)) {
        result[input.name] = "";
      }
      if (input.checked)
        result[input.name] = input.value;
    }
  });
  return result;
};

var questions, answers, reset, form;
var errorCount = 0;

function showError(html) {
  var div = document.createElement('div');

  div.innerHTML = html;
  document.body.insertBefore(div, document.body.firstChild);
  div.classList.add('error');

  errorCount++;
}

function getElementById(id) {
  var el = document.getElementById(id);

  if (!el)
    showError('There needs to be an element with <code>id="' +
              id + '"</code> on this page!');

  return el;
}

function escapeHTML(html) {
  var div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

function showResponseInfo(response) {
  var debug = document.getElementById('debug');
  if (!response || !window.DEBUG)
    return debug ? debug.parentNode.removeChild(debug) : null;
  if (!debug) {
    debug = document.createElement('div');
    debug.setAttribute('id', 'debug');
    document.body.appendChild(debug);
  }
  debug.innerHTML = '<p>This is what <code>response</code> contains:</p>' +
    '<pre>' + escapeHTML(JSON.stringify(response, null, 2)) + '</pre>' +
    '<p>To hide this panel, set <code>DEBUG = false</code>.</p>';
}

function refreshView() {
  var selectedAnswer = answers.querySelector('.selected');
  var response = Localform.getFormResponse(form);
  var answerId;

  questions.classList.add('selected');
  answers.classList.remove('selected');

  if (selectedAnswer)
    selectedAnswer.classList.remove('selected');

  showResponseInfo(response);

  if (response) {
    questions.classList.remove('selected');
    answers.classList.add('selected');
    answerId = getAnswerId(response);
    selectedAnswer = getElementById(answerId);
    if (!selectedAnswer) return;
    selectedAnswer.classList.add('selected');
  }
}

window.addEventListener('error', function(event) {
  var extra = (/\.js$/i.test(event.filename))
              ? ' of <code>' + escapeHTML(event.filename) + '</code>'
              : '';

  showError('<strong>Alas, a JavaScript error occurred.</strong><br>' +
            '<code>' + escapeHTML(event.message) + '</code> at line ' +
            event.lineno + extra);
});

window.addEventListener('DOMContentLoaded', function() {
  if (errorCount) return;

  questions = getElementById('questions');
  answers = getElementById('answers');
  reset = getElementById('reset');
  form = questions && questions.querySelector('form');

  if (!form)
    showError('Unable to find the <code>&lt;form&gt;</code> in ' +
              'the questions section of this page!');

  if (typeof(getAnswerId) != 'function')
    showError('Unable to find the JavaScript function ' +
              '<code>getAnswerId</code> on this page!');

  if (errorCount) return;

  reset.addEventListener('click', function() {
    Localform.clearFormResponse(form);
    refreshView();
  }, false);

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    Localform.setFormResponse(form);
    refreshView();
  });

  refreshView();
}, false);
