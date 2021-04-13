// Plugin based on the template file
// Parameter types:
// BOOL, STRING, INT, FLOAT, FUNCTION, KEY, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX

// SOURCES
// Adapted from jspsych-html-keyboard-response.js
// Adapted from jspsych-survey-text.js
// Adapted from jspysch-canvas-keyboard-response.js
// Adapted from https://github.com/ilcb-crex/Online_experiments_jsPsych/blob/master/HowFast/keyseq/lib/jspsych/plugins/jspsych-key-sequence.js
// https://www.youtube.com/watch?v=XQcsFwAmbiw

jsPsych.plugins["canvas-keys"] = (function () {
  var plugin = {};

  // The information that may be passed onto the plugin
  // ... when called from a trial in the experiment.js file
  plugin.info = {
    // Custom defined name - make unique to the already existing plugins
    name: "canvas-keys",
    parameters: {
      // TARGET
      trial_target: {
        description: "A string to be displayed as the moving stimulus/enemy.",
        pretty_name: "trial_target",
        // Take a plain string as input.
        type: jsPsych.plugins.parameterType.STRING,
        // Do not provide a default so that error is thrown when not provided
        default: undefined,
      }, // END trial_target

      canvas_size_target: {
        description:
          "Array containing the height (first value) and width (second value) of the canvas element.",
        pretty_name: "canvas_size",
        // Take an array of integers as input
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        // Default to 500 px by 500 px
        default: [500, 500],
      },

      // LIVES
      trial_lives: {
        description: "The number of lives left / to be drawn on the canvas.",
        pretty_name: "trial_lives",
        // Take an integer as input
        type: jsPsych.plugins.parameterType.INT,
        // Default to all lives (N = 10),
        default: 10,
      }, // END trial_lives

      canvas_size_lives: {
        description:
          "Array containing the height (first value) and width (second value) of the canvas element.",
        pretty_name: "canvas_size",
        // Take an array of integers as input
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        // Default to 100 px by 500 px
        default: [100, 500],
      },

      // TRIAL
      trial_duration: {
        description: "How long to show trial before it ends.",
        pretty_name: "trial_duration",
        // Take an integer as input (in milliseconds)
        type: jsPsych.plugins.parameterType.INT,
        // Defaults to infinite duration (i.e., self-paced)
        default: null,
      }, // END trial_duration

      response_keys: {
        description:
          "The keyboard keys that one can use which are visualized on screen.",
        pretty_name: "response_keys",
        // Take a keyboard key code/letter as input.
        type: jsPsych.plugins.parameterType.KEY,
        // Allow passing of multiple values
        array: true,
        // Default values stored in "response-keys.js"
        default: available_keys,
      }, // END response_keys
    }, // END parameters
  }; // END plugin.info

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

    // CREATE SCREENS
    // The jsPsych styling sheet ensures that all elements (within "display_element") are centered on screen.
    function initialize_screens() {
      // Canvas element for moving target
      target_html =
        "<canvas id='canvas-target' " +
        // Draw a black border around the canvas
        "style='border:1px solid #000000;' " +
        // Set hight (from trial info - defaults to 500)
        "height='" +
        trial.canvas_size_target[0] +
        "'" +
        // Set width (from trial info - defaults to 500)
        "width='" +
        trial.canvas_size_target[1] +
        "'" +
        ">" +
        "</canvas>";

      // Canvas element for lives
      lives_html =
        "<canvas id='canvas-lives'" +
        // Draw a black border around the canvas
        "style='border:1px solid #000000;' " +
        // Set hight (from trial info - defaults to 100)
        "height='" +
        trial.canvas_size_lives[0] +
        "'" +
        // Set width (from trial info - defaults to 500)
        "width='" +
        trial.canvas_size_lives[1] +
        "'" +
        ">" +
        "</canvas>";

      // Display the participants typed responses
      response_html = "<div id='html-response'>" + "_ " + "</div> <br>";

      // Display the instruction so that participants know which
      // key to press to continue to the next trial.
      continue_html =
        "<div id='html-continue'>" +
        "Press <b> Enter </b> to continue" +
        "</div><br>";

      // Display the answer feedback in case a wrong answer is provided
      feedback_html = "<div id='html-feedback'>" + "" + "</div>";

      // RETURN
      return (
        target_html + lives_html + response_html + continue_html + feedback_html
      );
    } // END initalize_screens

    // Combine all elements and show on screen
    display_element.innerHTML = initialize_screens();

    // SHOW LIVES
    function show_lives(n_lives) {
      // SET PARAMETERS
      // NOTE: upper-left corner: (x = 0, y = 0)
      var margin = 5; // space between borders of the circles
      var canvas_width = trial.canvas_size_lives[1]; // defined in trial
      // compute left over space taking into account the margins
      var margin_width = (trial.trial_lives + 2) * margin;
      // Compute size of the lives (rounded down to whole pixels)
      var life_width = Math.floor(
        (canvas_width - margin_width) / trial.trial_lives
      );

      // Circle size in the width determines the canvasses' height.
      var canvas_height = life_width + 10;
      document.getElementById("canvas-lives").height = canvas_height;

      // INITIALIZE
      // Access the canvas element
      var canvas = document.getElementById("canvas-lives");
      // Get the 2D context
      var ctx = canvas.getContext("2d");

      // DRAW LIVES
      for (i = 1; i <= n_lives; i++) {
        // compute indeces
        life_x = (i - 0.5) * life_width + i * 5;
        life_y = canvas_height / 2;
        // DRAW CIRCLE
        // Set a custom fill color
        ctx.fillStyle = available_colors[i - 1]; // i- 1 because index starts at 0
        // arc(x, y, r, startangle, endangle)
        ctx.beginPath();
        ctx.arc(life_x, life_y, life_width / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
    show_lives(10);

    // SHOW TARGET
    function show_target(posX, posY) {
      // INITIALIZE
      // Access the canvas element
      var canvas = document.getElementById("canvas-target");
      // Get the 2D context
      var ctx = canvas.getContext("2d");

      // DRAW TEXT
      // fillText(text, x, y);
      ctx.font = "30px Courier New";
      ctx.textAlign = "center";
      ctx.fillText(trial.trial_target, posX, posY);
    }

    show_target(
      trial.canvas_size_target[0] / 2,
      trial.canvas_size_target[1] / 2
    );
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
        // Keep track of actions outside the experiment window
        interactions: jsPsych.data.getInteractionData().json(),
      };

      // move on to the next trial and save the data
      jsPsych.finishTrial(trial_data);
    } // END end_trial FUNCTION
  }; // END plugin.trila

  return plugin;
})(); // END FUNCTION
