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
      target: {
        description: "A string to be displayed as the moving stimulus/enemy.",
        pretty_name: "target",
        // Take a plain string as input.
        type: jsPsych.plugins.parameterType.STRING,
        // Do not provide a default so that error is thrown when not provided
        default: undefined,
      }, // END target

      condition: {
        description:
          "A string [positive, negative, neutral] that determines the color of the presented target",
        pretty_name: "condition",
        // Take a plain string as input
        type: jsPsych.plugins.parameterType.STRING,
        // Default to neutral (black)
        default: "neutral",
      },
      // CANVAS STYLING
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

      canvas_size_score: {
        description:
          "Array containing the height (first value) and width (second value) of the canvas element.",
        pretty_name: "canvas_size",
        // Take an array of integers as input
        type: jsPsych.plugins.parameterType.INT,
        array: true,
        // Default to 100 px by 500 px
        default: [100, 500],
      },

      // TIMING
      dropspeed: {
        description:
          "An integer describing the dropspeed of the target (in milliseconds)",
        pretty_name: "dropspeed",
        // Takes an integer as input
        type: jsPsych.plugins.parameterType.INT,
      },

      dropspeed_step_size: {
        description:
          "An proportion integer describing the dropspeed adjustments (in proportion [0, 1]) to adjust dropspeed",
        pretty_name: "dropspeed_step_size",
        // Takes an integer as input
        type: jsPsych.plugins.parameterType.INT,
      },

      optimal_time: {
        description:
          "An integer describing the y-coordinates on the canvas below which we consider the answer optimal",
        pretty_name: "optimal_time",
        // Takes an integer as input
        type: jsPsych.plugins.parameterType.INT,
        // Do not provide a default as it is largely dependent on the styling
      },

      // score
      total_trials: {
        description: "The number of score overall provided in the experiment",
        pretty_name: "total_trials",
        // Take an integer as input
        type: jsPsych.plugins.parameterType.INT,
      }, // END score

      score: {
        description: "The score in this trial to show on screen",
        pretty_name: "score",
        // Take an integer as input
        type: jsPsych.plugins.parameterType.INT,
        // Do not provide a default
      },

      // RESPONSES
      response_keys: {
        description:
          "The keyboard keys that one can use which are visualized on screen.",
        pretty_name: "response_keys",
        // Take a keyboard key code/letter as input.
        type: jsPsych.plugins.parameterType.KEY,
        // Allow passing of multiple values
        array: true,
        // Default values stored in "input-parameters.js"
        default: available_keys,
      }, // END response_keys

      end_key: {
        description:
          "The key the subject is allowed to press to end the trial.",
        pretty_name: "end_key",
        // Take a string as input (because of how compareKeys works)
        type: jsPsych.plugins.parameterType.STRING,
        // Defaults to the enter-key
        default: "Enter",
      },

      max_continous_mistakes: {
        description:
          "Maximum number of continuous mistakes before the experiment is ended",
        pretty_name: "max_continous_mistakes",
        // Take an integer as input
        type: jsPsych.plugins.parameterType.INT,
        // Do not provide a default
      },

      // FEEDBACK
      feedback_duration: {
        description: "Time in milliseconds for how long to show feedback.",
        pretty_name: "feedback_duration",
        // Take an integer as input (in milliseconds)
        type: jsPsych.plugins.parameterType.INT,
        // Defaults to relatively long
        default: 250,
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

    // RESPONSE KEYS
    // Combine all response keys which should be monitored
    var all_response_keys = available_keys; // get from input-parameters.js (a-z)
    all_response_keys.push(" "); // add spacebar
    all_response_keys.push("backspace"); // add backspace for error correction
    all_response_keys.push(trial.end_key); // add the key that signals the end of the trial (enter)

    // VALID WORDS
    // Add the "unkown word" response "xxx" to the list of valid words
    valid_words.push("xxx");

    // ANIMATION
    // The number of pixels the target should drop each framerate
    // Lower numbers ensure smoother transitions
    var step_size = 10;
    // Initialize the starting position of the target (always on the top of the screen)
    posY = 0;

    // FEEDBACK
    // Initialize variables globally for later use
    var answer_speed = "";
    var new_score = null;
    var new_dropspeed = null;

    // CREATE SCREENS
    // The jsPsych styling sheet ensures that all elements (within "display_element") are centered on screen.
    function initialize_screens() {
      instruction_html =
        "<div id = 'html-instruction'> Type the <i> first </i> word(s) that comes to mind. </div><br>";

      // Canvas element for moving target
      target_html =
        "<div id='target'>" +
        "<canvas id='canvas-target' " +
        // Draw a black border around the canvas
        "style=' " +
        // Set height (from trial info)
        "height: " +
        trial.canvas_size_target[0] +
        "px; " +
        // Set width (from trial info)
        "width: " +
        trial.canvas_size_target[1] +
        "px;" +
        "'>" +
        "</canvas>" +
        "</div>";

      // Canvas element for score
      // NOTE: duplicate from the "progress bar" in jspsych.js

      score_html =
        "<div id = 'score-container' style = '" +
        // determine size
        // Set hight (from trial info - defaults to 100)
        "height: " +
        trial.canvas_size_score[0] +
        "px; " +
        // Set width (from trial info)
        "width: " +
        trial.canvas_size_score[1] +
        "px'>" +
        // Start with 1 life
        "<div id = 'score-text'>" +
        "400" +
        "</div>" +
        // Show score in bar
        // Background
        "<div id = 'score-background'>" +
        // Fill
        "<div id = 'score'>" +
        // close all
        "</div>" +
        "</div>" +
        "</div>";

      // Display the participants typed responses
      response_html = "<div id='html-response'>" + "_" + "</div> <br>";

      // Display the answer feedback in case a wrong answer is provided
      feedback_html =
        "<div id='html-feedback'>" +
        "A <span id='validity'> valid </span> responses contains " +
        "<span id='n_words'> 1 or 2 words </span> " +
        "in <span id='us_english'> US English </span> " +
        "with more than <span id='n_characters'> 2 characters. </span>" +
        "</div>";

      // Display the instruction so that participants know which
      // key to press to continue to the next trial.
      continue_html =
        "<div id='html-continue'>" +
        "<i>Press <b>" +
        trial.end_key +
        "</b> to continue </i>" +
        "</div>";

      // RETURN
      return (
        instruction_html +
        target_html +
        score_html +
        response_html +
        feedback_html +
        continue_html
      );
    } // END initalize_screens

    // SHOW score
    function show_score(score) {
      // Total trials (numeric)
      var total_trials = parseInt(trial.total_trials) + 1;

      // Computer score as percentage of total score/trials
      var score_percentage = Math.min((score / total_trials) * 100, 100);

      // Update styling (bar)
      document.getElementById("score").style.width = score_percentage + "%";
      // Update score (text)
      document.getElementById("score-text").innerHTML = score;
    } // END show_score

    // SHOW TARGET
    function show_target(posY) {
      // INITIALIZE
      // SOURCE: https://www.html5rocks.com/en/tutorials/canvas/hidpi/
      // Goal: scale the canvas to deal with high definition screens
      // Access the canvas element
      var canvas = document.getElementById("canvas-target");
      // Get the device pixel ratio, falling back to 1.
      var dpr = window.devicePixelRatio || 1;
      // Get the size of the canvas in CSS pixels.
      var rect = canvas.getBoundingClientRect();
      // Give the canvas pixel dimensions of their CSS
      // size * the device pixel ratio.
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      var ctx = canvas.getContext("2d");
      // Scale all drawing operations by the dpr, so you
      // don't have to worry about the difference.
      ctx.scale(dpr, dpr);

      // canvas.getContext("2d");
      // CLEAR CANVAS
      // clear existing canvas otherwise a trial of elements gets painted
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // DRAW TEXT
      // fillText(text, x, y);
      if (trial.condition == "positive") {
        ctx.fillStyle = "#009E73"; //green
      } else if (trial.condition == "negative") {
        ctx.fillStyle = "#D55E00"; //red
      } else {
        // All other cases is black
        ctx.fillStyle = "#000000";
      }
      ctx.font = "bold 18px Courier New";
      ctx.textAlign = "center"; // center on x,y coordinates
      ctx.fillText(trial.target, canvas.width / dpr / 2, posY);
    } // END show_target

    // ANIMATE TARGET
    // Using the setInterval time ensure that the included code is executed sequentially
    /// With the frame_time intervals
    var animate_target = setInterval(function () {
      // UPDATE TEXT
      show_target(
        // posX is constant = centralized
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
    }, trial.dropspeed);

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
      if (jsPsych.pluginAPI.compareKeys(info.key, trial.end_key)) {
        // Signal the end of the trial when the designated key is pressed
        // Ensure that correct answer is given
        var valid_response = validate_response();

        if (valid_response) {
          // End the trial because a valid response was given
          end_trial();
        }
        /*
        else {
          // Provide an alert message to indicate the need for a valid response
          document.getElementById("html-feedback").innerHTML =
            "<i>" + valid_response.message + "</i>";
        } // END IF validate response
        */
      } else if (jsPsych.pluginAPI.compareKeys(info.key, "backspace")) {
        // Remove the last letter entered to resemble a backspace action
        visible_responses.pop();
      } else {
        // A normal letter or the spacebar was pressed that should be visualized
        visible_responses.push(info.key);
      } // END IF

      // VISUALIZE RESPONSE
      if (!jsPsych.pluginAPI.compareKeys(info.key, trial.end_key)) {
        // Only needs to be shown when the trial continues
        show_response();
      }
    } // END update_response FUNCTION

    // ANSWER VALIDATION
    // An answer may only be submitted if:
    // It contains one to two words
    // Each word contains more than two characters
    // It is recognized as US English
    // Is the "xxx" do not know the word

    /* // Show feedback in the form of color coded text (included in feedback_html)
        "A <span id='validity'> valid </span> responses contains " +
        "<span id='n_words'> 1 or 2 </span> " +
        "<span id='us_english'> US English </span> words with at least " +
        "<span id='n_characters'> 3 characters</span>.";*/

    function validate_response() {
      var valid_answer = true;

      // SET COLORS
      var invalid = "rgba(213, 94, 0, 1)"; // red
      var valid = "rgba(0, 158, 115, 1)"; // green

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
        document.getElementById("n_words").style.color = invalid;
        valid_answer = false;
      } else {
        var n_words = answer.split(" ").length;

        if ((n_words == 1) | (n_words == 2)) {
          document.getElementById("n_words").style.color = valid;
        } else {
          document.getElementById("n_words").style.color = invalid;
          valid_answer = false;
        } // END IF n_words
      } // END IF answer

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

      if (n_characters > 2) {
        // All words have sufficient characters
        document.getElementById("n_characters").style.color = valid;
      } else {
        // One of the words has insufficient characters
        document.getElementById("n_characters").style.color = invalid;
        valid_answer = false;
      }

      // US ENGLISH
      // A word should be US english

      // Initialize
      var us_english_per_word = [];

      // Loop over words
      for (var w in words) {
        // Store the number of characters in each word
        us_english_per_word.push(valid_words.includes(words[w]));
      }

      // Check if all words are US english
      if (us_english_per_word.every((w) => w === true)) {
        // all words are included in the valid_words.js list
        document.getElementById("us_english").style.color = valid;
      } else {
        // one or more of the words were not US english
        document.getElementById("us_english").style.color = invalid;
        valid_answer = false;
      }

      // VALIDATION
      // Show feedback in the form of color coded text
      if (valid_answer) {
        document.getElementById("validity").style.color = valid;
      } else {
        // one of the criteria was invalid
        document.getElementById("validity").style.color = invalid;
      }

      return valid_answer;

      /*
      // VALIDATION
      // The answer should have the correct numbers of words (1 - 2)
      // AND
      // The correct number of characters in each word

      if ((n_words == 1) | (n_words == 2)) {
        // Correct number of words - check characters
        if (n_characters > 2) {
          // VALID WORD
          if (valid_words.includes(answer)) {
            // VALID answers
            validation = {
              valid: true,
              message: "", // no feedback to display
            };
          } else {
            // Non-word typed
            validation = {
              valid: false,
              message:
                "This is not an <b> US English </b> word. Use <b> backspace </b> to correct typing errors.", // diplay feedback
            };
          }
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
      */
    } // END validate_response

    // SHOW FEEDBACK
    function show_feedback() {
      // The new trial relies heavily on the speed with which an association was given
      // We destinguish between three types of answer:
      // Fast: answers were given with a lot of time to spare
      // Optimal: answers were given with minimal time to spare
      // Slow: answers were not given in time.

      if (posY < trial.optimal_time) {
        // FAST ANSWER
        // Store speed
        answer_speed = "fast";
        // score in increased
        new_score = trial.score + 1;
        // Drop speed is sped up
        new_dropspeed =
          trial.dropspeed - trial.dropspeed * trial.dropspeed_step_size;
        // Reset continuous mistakes
        continous_mistakes = 0;
      } else if (
        ((posY > trial.optimal_time) & (posY < trial.canvas_size_target[0])) |
        (posY == trial.optimal_time)
      ) {
        // OPTIMAL ANSWER
        // Store speed
        answer_speed = "optimal";
        // score is increased
        new_score = trial.score + 1;
        // Drop speed is retained
        new_dropspeed = trial.dropspeed;
        // Reset continuous mistakes
        continous_mistakes = 0;
      } else if (posY >= trial.canvas_size_target[0]) {
        // SLOW ANSWER
        // The participant did not provide an answer before the target
        // ... left the screen
        // Store speed
        answer_speed = "slow";
        // Score is decreased (but cannot drop below 0)
        new_score = Math.max(trial.score - 1, 0);
        // Drop speed is slowed down (larger increments)
        new_dropspeed =
          trial.dropspeed + trial.dropspeed * (2 * trial.dropspeed_step_size);
        // Increase continuous mistakes counter
        continous_mistakes = continous_mistakes + 1;
      }

      // SHOW NEW SCORE
      show_score((score = new_score));

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
    } // END show_feedback

    // START TRIAL
    function start_trial() {
      // Show screen elements
      display_element.innerHTML = initialize_screens();

      // Show score
      show_score((score = trial.score));

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
    }
    start_trial();

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
      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      // Show feedback
      show_feedback();

      // CHECK: Inattentiveness
      // Stop the experiment if they are not actively engaging
      if (continous_mistakes > max_continous_mistakes) {
        // Stops the current trials and remaining loops
        jsPsych.endCurrentTimeline();
      }

      // SAVE DATA
      // get Last RT
      if (all_responses.length === 0) {
        var last_RT = 0;
      } else {
        var last_RT = all_responses.pop().rt;
      }

      // End trial after showing the feedback for a few milliseconds
      jsPsych.pluginAPI.setTimeout(function () {
        // clear the display
        display_element.innerHTML = "";

        // SAVE DATA
        // gather the data to store for the trial
        var data = {
          // Word shown during the trial
          target: trial.target,
          // Condition (neutral, positive, negative)
          condition: trial.condition,
          // Canvas height = max pixels that can be dropped
          max_RT_px: trial.canvas_size_target[0], // canvas height
          // Defined optimal pixel height
          optimal_RT_px: trial.optimal_time,
          // Response time in pixels (0 is top)
          RT_px: posY,
          // Response time in ms
          RT_ms: last_RT,
          // Whether the response was fast, optimal, or slow
          speed_category: answer_speed,
          // Number of continues too slow ansers
          continous_mistakes: continous_mistakes,
          // Dropspeed with which the target moved across the canvas
          dropspeed: trial.dropspeed,
          // Adjusted dropspeed - dependent on speed_category
          new_dropspeed: new_dropspeed,
          // Number of score with which the experiment was started
          total_trials: trial.total_trials,
          // Number of score in the current trial
          score: trial.score,
          // Number of score after the trial - dependent on speed_category
          new_score: new_score,
          // The provided responses / association as one word
          association: visible_responses.join(""),
          // Each keystroke including timing
          key_responses: JSON.stringify(all_responses),
          // Keep track of actions outside the experiment window - for exclusion
          interactions: jsPsych.data.getInteractionData().json(),
        };

        // move on to the next trial and save the data
        jsPsych.finishTrial(data);
      }, trial.feedback_duration);
    } // END end_trial FUNCTION
  }; // END plugin.trila

  return plugin;
})(); // END FUNCTION
