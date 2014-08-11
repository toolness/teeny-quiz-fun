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

var questions = document.querySelector('#questions');
var answers = document.querySelector('#answers');
var reset = document.querySelector('#reset');
var form = questions.querySelector('form');

function refreshView() {
  var selectedAnswer = answers.querySelector('.selected');
  var response = Localform.getFormResponse(form);
  var answerId;

  questions.classList.add('selected');
  answers.classList.remove('selected');

  if (selectedAnswer)
    selectedAnswer.classList.remove('selected');

  if (response) {
    questions.classList.remove('selected');
    answers.classList.add('selected');
    answerId = getAnswerId(response);
    selectedAnswer = document.getElementById(answerId);
    if (!selectedAnswer)
      throw new Error('unable to find element with id ' + answerId);
    selectedAnswer.classList.add('selected');
  }
}

window.addEventListener('DOMContentLoaded', refreshView, false);

reset.addEventListener('click', function() {
  Localform.clearFormResponse(form);
  refreshView();
}, false);

form.addEventListener('submit', function(event) {
  event.preventDefault();
  Localform.setFormResponse(form);
  refreshView();
});
