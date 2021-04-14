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

      frame_time: {
        description:
          "An integer describing the dropspeed of the target (in milliseconds)",
        pretty_name: "frame_time",
        // Takes an integer as input
        type: jsPsych.plugins.parameterType.INT,
        default: 1000,
      },

      optimal_time: {
        description:
          "An integer describing the y-coordinates on the canvas below which we consider the answer optimal",
        pretty_name: "optimal_time",
        // Takes an integer as input
        type: jsPsych.plugins.parameterType.INT,
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

      end_trial_key: {
        description:
          "The key the subject is allowed to press to end the trial.",
        pretty_name: "end_trial_key",
        // Take a string as input (because of how compareKeys works)
        type: jsPsych.plugins.parameterType.STRING,
        // Defaults to the enter-key
        default: "Enter",
      },

      feedback_duration: {
        description: "Time in milliseconds for how long to show feedback.",
        pretty_name: "feedback_duration",
        // Take an integer as input (in milliseconds)
        type: jsPsych.plugins.parameterType.INT,
        default: 500,
      },
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
    // All response keys
    var all_response_keys = available_keys; // get from input-parameters.js (a-z)
    all_response_keys.push(" "); // add spacebar
    all_response_keys.push("backspace"); // add backspace for error correction
    all_response_keys.push(trial.end_trial_key); // add the key that signals the end of the trial (enter)
    // ANIMATION
    // The number of pixels the target should drop each framerate
    // Lower numbers ensure smoother transitions
    var step_size = 10;
    // Initialize the starting position of the target (always on the top of the screen)
    posY = 0;

    // CREATE SCREENS
    // The jsPsych styling sheet ensures that all elements (within "display_element") are centered on screen.
    function initialize_screens() {
      instruction_html =
        "<div id = 'html-instruction'> Type the <i> first </i> word(s) that comes to mind. </div><br>";

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
        "</canvas><br><br>";

      // Display the participants typed responses
      response_html = "<div id='html-response'>" + "_" + "</div> <br>";

      // Display the instruction so that participants know which
      // key to press to continue to the next trial.
      continue_html =
        "<div id='html-continue'>" +
        "Press <b>" +
        trial.end_trial_key +
        "</b> to continue" +
        "</div>";

      // Display the answer feedback in case a wrong answer is provided
      feedback_html = "<div id='html-feedback'></div>";

      // RETURN
      return (
        instruction_html +
        target_html +
        lives_html +
        response_html +
        continue_html +
        feedback_html
      );
    } // END initalize_screens

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
    } // END show_lives

    // SHOW TARGET
    function show_target(posX, posY) {
      // INITIALIZE
      // Access the canvas element
      var canvas = document.getElementById("canvas-target");
      // Get the 2D context
      var ctx = canvas.getContext("2d");

      // CLEAR CANVAS
      // clear existing canvas otherwise a trial of elements gets painted
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // DRAW TEXT
      // fillText(text, x, y);
      ctx.font = "bold 30px Courier New";
      ctx.textAlign = "center"; // center on x,y coordinates
      ctx.fillText(trial.trial_target, posX, posY);
    } // END show_target

    // ANIMATE TARGET
    // Using the setInterval time ensure that the included code is executed sequentially
    /// With the frame_time intervals
    var animate_target = setInterval(function () {
      // UPDATE TEXT
      show_target(
        // posX is constant = centralized
        trial.canvas_size_target[0] / 2,
        // posY updated with step_size
        posY
      );

      // UPDATE posY
      posY += step_size;
      // Check if target has reached the bottom
      if (posY >= trial.canvas_size_target[0]) {
        // Cancel all intervals that are still ongoing
        clearInterval(animate_target);

        // Finish the trial
        end_trial();
      }
    }, trial.frame_time);

    // SHOW RESPONSE
    // Everytime the participant presses a key, the response_html should be updated
    // to visualize what the participant typed.
    function show_response() {
      // Update the innerHTML of the <p> element
      document.getElementById("html-response").innerHTML =
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
        // Ensure that correct answer is given
        var valid_response = validate_response();

        if (valid_response.valid) {
          // End the trial because a valid response was given
          end_trial();
        } else {
          // Provide an alert message to indicate the need for a valid response
          document.getElementById("html-feedback").innerHTML =
            "<i>" + valid_response.message + "</i>";
        } // END IF validate response
      } else if (jsPsych.pluginAPI.compareKeys(info.key, "backspace")) {
        // Remove the last letter entered to resemble a backspace action
        visible_responses.pop();
      } else {
        // A normal letter or the spacebar was pressed that should be visualized
        visible_responses.push(info.key);
      } // END IF

      // VISUALIZE RESPONSE
      if (!jsPsych.pluginAPI.compareKeys(info.key, trial.end_trial_key)) {
        // Only needs to be shown when the trial continues
        show_response();
      }
    } // END update_response FUNCTION

    // ANSWER VALIDATION
    // An answer may only be submitted if:
    // It contains one to two words
    // Each word contains more than two characters
    function validate_response() {
      // CLEAN ANSWER
      // Get the total answer string
      var answer = visible_responses.join("");

      // Clean double spaces, tabs, etc.
      // Replace everything that is more than one space with one space
      answer = answer.replace(/\s+/g, " ");
      // Remove any leading or trailing spaces
      answer = answer.trim();
      // N WORDS
      // Detect the number of words that are left when the string is split by spaces
      if (answer == "") {
        var n_words = 0;
      } else {
        var n_words = answer.split(" ").length;
      }

      // N CHARACTERS
      // Detect the number of characters per word
      // Extract each word seperately
      var words = answer.split(" ");
      // Initialize
      var n_characters_per_word = [];

      // Loop over words
      for (var w in words) {
        // Store the number of characters in each word
        n_characters_per_word.push(words[w].length);
      }

      // Determine the minimum number of characters in a word
      // NOTE: for applying Math.min to an array the three ... are necessary
      n_characters = Math.min(...n_characters_per_word);

      // VALIDATION
      // The answer should have the correct numbers of words (1 - 2)
      // AND
      // The correct number of characters in each word

      if ((n_words == 1) | (n_words == 2)) {
        // Correct number of words - check characters
        if (n_characters >= 2) {
          // VALID answers
          validation = {
            valid: true,
            message: "", // no feedback to display
          };
        } else {
          // Insufficient number of characters
          validation = {
            valid: false,
            message: "Each word must have more than 2 characters.", // display feedback
          };
        }
      } else if (n_words == 0) {
        // Insufficient number of words
        validation = {
          valid: false,
          message: "Your answer is too short (required: 1 - 2 words)", // display feedback
        };
      } else if (n_words > 2) {
        // Too many words
        validation = {
          valid: false,
          message:
            "Your answer is too long (required: 1 - 2 words). Use <b> backspace </b> to shorten your answer.", // display feedback
        };
      } // END IF n_words

      return validation;
    } // END validate_response

    // SHOW FEEDBACK
    var answer_speed = "";
    var lives_posterior = null;

    function show_feedback() {
      // CATEGORIZE ANSWER
      // Boundary defined by `optimal_time` passed down with trial information
      if (posY < trial.optimal_time) {
        // An answer was provided while the target was still above the
        // ... optimal boundary time/position
        answer_speed = "fast";
        lives_posterior = trial.trial_lives;
      } else if (
        (posY > trial.optimal_time) &
        (posY < trial.canvas_size_target[0])
      ) {
        // Answer was slower than optimal time, but still within the canvas (ie in time)
        answer_speed = "optimal";
        lives_posterior = trial.trial_lives;
      } else if (posY >= trial.canvas_size_target[0]) {
        // Target hit the lower boundary - answer is out of time
        answer_speed = "slow";
        lives_posterior = trial.trial_lives - 1;
      } // END IF answer speed

      // CHANGE STYLING - TARGET
      if (answer_speed == "slow") {
        // Show slightly red screen
        document.getElementById("canvas-target").style.backgroundColor =
          "rgba(213, 94, 0, 0.3)";
      } else {
        // Show slightly green screen
        document.getElementById("canvas-target").style.backgroundColor =
          "rgba(0, 158, 115, 0.3)";
      } // END IF

      // CHANGE STYLING - LIVES
      show_lives((n_lives = lives_posterior));
    } // END show_feedback

    // START TRIAL
    // Create screens
    display_element.innerHTML = initialize_screens();

    // Show lives
    show_lives((n_lives = trial.trial_lives));

    // Add Keyboard Listeners
    // Listen to each and every key press an participant makes
    // Do not need to listen if no keys were defined
    if (trial.response_keys != jsPsych.NO_KEYS) {
      // Calls an existing function
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        // Which function to execute when the key is pressed
        // Defined above
        callback_function: update_response,
        // Which keys trigger the callback
        valid_responses: all_response_keys, // needs to be an array
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

    // END TRIAL
    // End everything that might have been going on
    // Save data
    // Proceed to next trial or end-of-experiment (automatically)

    function end_trial() {
      // STOP ongoing procecsses
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
      // Kill any remaining canvas animations
      clearInterval(animate_target);
      // kill all keyboard listeners
      if (typeof keyboardListener !== "undefined") {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // Show feedback
      show_feedback();

      // End trial after showing the feedback for a few milliseconds
      jsPsych.pluginAPI.setTimeout(function () {
        // clear the display
        display_element.innerHTML = "";

        // SAVE DATA
        // gather the data to store for the trial
        var trial_data = {
          target: trial.trial_target,
          lives: trial.trial_lives,
          lives_posterior: lives_posterior,
          canvas_height: trial.canvas_size_target[0],
          target_height: posY,
          answer_speed: answer_speed,
          final_response: visible_responses.join(""),
          responses: JSON.stringify(all_responses),
          // Keep track of actions outside the experiment window
          interactions: jsPsych.data.getInteractionData().json(),
        };

        // move on to the next trial and save the data
        jsPsych.finishTrial(trial_data);
      }, trial.feedback_duration);
    } // END end_trial FUNCTION
  }; // END plugin.trila

  return plugin;
})(); // END FUNCTION
