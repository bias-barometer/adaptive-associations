// Plugin based on the template file
// Parameter types:
// BOOL, STRING, INT, FLOAT, FUNCTION, KEY, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX

// Adapted from jspsych-html-keyboard-response.js
// Adapted from jspsych-survey-text.js
// Adapted from https://github.com/ilcb-crex/Online_experiments_jsPsych/blob/master/HowFast/keyseq/lib/jspsych/plugins/jspsych-key-sequence.js
// https://www.youtube.com/watch?v=XQcsFwAmbiw

jsPsych.plugins["html-keyboard-text"] = (function () {
  // Do NOT touch
  var plugin = {};

  // The information that may be passed onto the plugin
  // ... when called from a trial in the experiment.js file
  plugin.info = {
    // Custom defined name - make unique to the already existing plugins
    name: "html-keyboard-text",
    parameters: {
      // The text to display on screen
      stimulus: {
        // Allow HTML within the string
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: "Stimulus",
        // Do not provide a default so that error is thrown when not provided
        default: undefined,
        description: "The HTML string to be displayed as the stimulus",
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
      // Which key ends the trial so that mouse actions are not required
      end_trial_key: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "End Trial Choices",
        // Defaults to the enter-key
        default: "Enter",
        description:
          "The key the subject is allowed to press to end the trial.",
      },
    },
  };

  // What actually happens in the trial (actions, visualizations etc)
  // `display_element` is the name of the HTML object that can be modified. Basicly covers the
  // ... entire screen.
  // `trial` is the information about the trial, as specified in plugin.info.
  plugin.trial = function (display_element, trial) {
    // SET UP
    // Keep track of all given responses (keys + rts)
    var all_responses = [];
    // Keep track of the string that should be visualized on screen
    var visible_responses = [];

    // CREATE SCREEN
    // We want to create mulitple elements to be visualized on screen
    // To later have full control over styling and/or moving of the elements we will create
    // three seperate div elements
    // NOTE: the jsPsych styling sheet ensures centering on screen!

    // Display the stimulus prompt
    stimulus_html =
      "<div id='html-keyboard-text-stimulus'>" + trial.stimulus + "</div> <br>";

    // Display the participants typed responses
    response_html =
      "<div id='html-keyboard-text-response'>" +
      "<p id='text-response'>" +
      " _ " +
      "</p> </div> <br>";

    // Display the instruction so that participants know which
    // key to press to continue to the next trial.
    continue_html =
      "<div id='html-keyboard-text-continue'>" +
      "Press <b>" +
      trial.end_trial_key +
      "</b> to continue" +
      "</div><br>";

    // Combine all elements and show on screen
    display_element.innerHTML = stimulus_html + response_html + continue_html;

    // SHOW RESPONSE
    // Everytime the participant presses a key, the response_html should be updated
    // to visualize what the participant typed.
    function show_response() {
      // Update the innerHTML of the <p> element
      display_element.querySelector("#text-response").innerHTML =
        // Show the combined letters as one concatenated string
        visible_responses.join("") + "_";
    } // END show_response FUNCTION

    // UPDATE RESPONSE
    // Update the visisble response based on the key that was pressed by the participant
    // Exceptional cases:
    // Ending the trial (end_trial)
    // Pressing the spacebar (convert to " ")
    // Pressing the left- or right-arrow (convert to different index)

    function update_response(info) {
      // `info` is passed down from the keyBoardListener API

      // SAVE RESPONSE
      // Save the pressed key and the response time
      all_responses.push(info);

      // PROCESS RESPONSE
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.end_trial_key)) {
        // Signal the end of the trial when the designated key is pressed
        // Custom function
        end_trial();
      } else if (jsPsych.pluginAPI.compareKeys(info.key, "space")) {
        // A spacebar press should be converted to an empty space
        visible_responses.push(" ");
      } else if (jsPsych.pluginAPI.compareKeys(info.key, "backspace")) {
        // Remove the last letter enterred to resemble a backspace action
        visible_responses.pop();
      } else {
        // A normal letter was pressed that should be visualized
        visible_responses.push(info.key);
      } // END IF

      // VISUALIZE RESPONSE
      if (!jsPsych.pluginAPI.compareKeys(info.key, trial.end_trial_key)) {
        // Only needs to be shown when the trial continues
        show_response();
      }
    } // END update_response FUNCTION

    // END TRIAL
    // End everything that might have been going on
    // Save data
    // Proceed to next trial or end-of-experiment (automatically)

    function end_trial() {
      // STOP ongoing procecsses
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill all keyboard listeners
      if (typeof keyboardListener !== "undefined") {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // clear the display
      display_element.innerHTML = "";

      // SAVE DATA
      // gather the data to store for the trial
      var trial_data = {
        stimulus: trial.stimulus,
        final_response: visible_responses.join(""),
        responses: JSON.stringify(all_responses),
      };

      // move on to the next trial and save the data
      jsPsych.finishTrial(trial_data);
    } // END end_trial FUNCTION

    // KEYBOARD LISTENER
    // Listen to each and every key press an participant makes

    // Do not need to listen if no keys were defined
    if (trial.response_keys != jsPsych.NO_KEYS) {
      // Calls an existing function
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        // Which function to execute when the key is pressed
        // Defined below
        callback_function: update_response,
        // Which keys trigger the callback
        valid_responses: trial.response_keys, // needs to be an array
        // Save RT based on key press rather than audio stimuli
        // see jsPsych.js/module.getKeyboardResponse
        // performance.now();
        rt_method: "performance",
        // keyboard listener remains active for additional keypresses
        persist: true,
        // Do not validate long key presses
        allow_held_key: false,
      });
    } // END IF keyBoardListener
  }; // END plugin.trial

  return plugin;
})();
