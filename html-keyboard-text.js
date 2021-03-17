// Parameter types:
// BOOL, STRING, INT, FLOAT, FUNCTION, KEY, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX

// Adapted from jspsych-html-keyboard-response.js
// Adapted from jspsych-survey-text.js

jsPsych.plugins["html-keyboard-text"] = (function () {
  // Do not touch
  var plugin = {};

  // The information that may be passed onto the plugin
  // ... when called from a trial
  plugin.info = {
    name: "html-keyboard-text",
    parameters: {
      // The text to display on screen
      stimulus: {
        // Allow HTML within the string
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Stimulus",
        // Do not provide a default so that error is thrown when not provided
        default: undefined,
        description: "The HTML string to be displayed",
      },
      // Which keyboard keys one is allowed to use to provide an answer
      response_keys: {
        type: jsPsych.plugins.parameterType.KEY,
        // Allow passing of multiple values
        array: true,
        pretty_name: "Response Keys",
        // Defaults to all keys being allowed
        default: jsPsych.ALL_KEYS,
        description:
          "The keys the subject is allowed to press to respond to the stimulus.",
      },
      // How long the trial should last
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Trial duration",
        // Defaults to infinite duration (i.e., self-paced)
        default: null,
        description: "How long to show trial before it ends.",
      },
      // Which key ends the trial
      end_trial_keys: {
        type: jsPsych.plugins.parameterType.KEY,
        // Allow passing of multiple values
        array: true,
        pretty_name: "End Trial Choices",
        // Defaults to all keys being allowed
        default: undefined,
        description:
          "The keys the subject is allowed to press to end the trial.",
      },
    },
  };

  // display_element is the name of the HTML object that can be modified
  // trial information follows from the info parameters specified above
  plugin.trial = function (display_element, trial) {
    // STIMULUS
    // create a new div element
    stimulus_html =
      "<div id='html-keyboard-text-stimulus'>" + trial.stimulus + "</div> <br>";

    // DRAW RESPONSE
    response_html =
      "<div id='html-keyboard-text-response'>" + "|" + "</div> <br>";

    // END TRIAL
    // Display the instruction so that participants know which
    // key to press to continue to the next trial.
    continue_html =
      "<div id='html-keyboard-text-continue'>" +
      "Press <b>" +
      trial.end_trial_keys +
      "</b> to continue" +
      "</div><br>";

    // What should happen when the trial is ended
    // NOTE: needs to be added to the script BEFORE the keyboardListener is added
    var end_trial = function () {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill all keyboard listeners
      if (typeof keyboardListener !== "undefined") {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        stimulus: trial.stimulus,
      };

      // clear the display
      display_element.innerHTML = "";

      // move on to the next trial and save the data
      jsPsych.finishTrial(trial_data);
    };

    // Create a keyboard listener so that when the end_trial_keys key is pressed
    // the trial actually ends.

    // Do need to listen if no keys were defined
    if (trial.end_trial_keys != jsPsych.NO_KEYS) {
      // Calls an existing function
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        // Which function to execute when the key is pressed
        // Defined below
        callback_function: end_trial,
        // Which keys trigger the callback
        valid_responses: trial.end_trial_keys,
        // Save RT based on key press rather than audio?
        // see jsPsych.js/module.getKeyboardResponse
        rt_method: "performance",
        // keyboard listener is removed once it is activated
        persist: false,
        // Do not validate long key presses
        allow_held_key: false,
      });
    }

    // UPDATE SCREEN
    display_element.innerHTML = stimulus_html + response_html + continue_html;

    // data saving
    var trial_data = {
      parameter_name: "parameter value",
    };

    // end trial
    jsPsych.finishTrial(trial_data);
  };

  return plugin;
})();
