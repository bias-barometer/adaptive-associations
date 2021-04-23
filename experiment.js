// EXPERIMENT STRUCTURE
// Informed Consent
// Instructions - Paradigm
// Pratice Trials
// Instructions - Getting Started
// Association Trials

// SET-UP
// Initialize timeline variable (required)
var timeline = [];
// Total number of times to present each selected stimulus
var n_loops_total = 1;
// Keep track of number of exectuted loops
var loop_counter = 1; // initialize - DO NOT CHANGE
// Number of Continuous Mistakes allowed before being excluded from the experiment
var continous_mistakes = 0; // initialize - DO NOT CHANGE

// UvA LAB parameters
// SOURCE: https://www.lab.uva.nl/lab/recruitment/pages/questionnaire_link_support
function getUrlVars() {
  let vars = {};
  window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );

  // vars contains all query parameters  e.g.
  // console.log(vars['tid']);
  // console.log(vars['uvanetid']); // equal to userid
  // console.log(vars['userid']);
  // console.log(vars['username']);
  return vars;
}
let labParameters = getUrlVars();

// Initialize variables that are re-used flexibly within trials
var initialize_experiment = {
  // Basicly an empty function that is called but does not show anything on screen
  type: "call-function",
  // Do nothing
  func: function () {},
  // Save the required data that is fed into the first trial.
  data: {
    new_dropspeed: 300,
    new_score: 1,
    data_type: "initialize",
  },
};

// SCREEN: Instructions
var instructions = {
  type: "instructions",
  // Show buttons for clicking
  show_clickable_nav: true,
  // Show the amount of pages left
  show_page_number: false,
  // Also allow forwarding by keyboard
  key_forward: "Enter",
  // Text on buttons
  button_label_previous: "back",
  button_label_next: "next",
  // Add information for easy data processing
  data: { data_type: "instructions" },
  // Individual pages / slides with HTML markup
  pages: [
    //
    "<p> Welcome to the Free Association Game",
    "<p> Let's have a look at the playing field <i>(you won't have to do anything)</i>. <br> We'll explain what you see after.",
  ],
};

// SCREEN: Trial
var trial = {
  // Use a custom created plugin (see plugin-canvas-keyboard.js)
  type: "canvas-keys",
  // TARGET
  // The word that should be displayed to the participants
  // NOTE: Provided from the timeline variable (flexible)
  target: jsPsych.timelineVariable("target"),
  // The condition of the trial (positive, negative, neutral)
  // Determines the color of the presented stimulus
  // NOTE: Provided from the timeline variable (flexible)
  condition: jsPsych.timelineVariable("condition"),
  // Size of the canvas where the target moves [height, width]
  // NOTE: styling may not be optimal if the height is increased too much

  // CANVAS STYLING
  canvas_size_target: [375, 600],
  // Size of the canvas where the lived are displayed [height, width]
  // NOTE: for pretty styling keep width of target & score canvas the same
  // NOTE: the number of included score determines the ultimate height of this canvas
  canvas_size_score: [20, 600],

  // TIMING
  // The time whith which the target frames are updated (i.e., dropspeed)
  // NOTE: variable dependent on the last saved data (i.e., last response)
  dropspeed: function () {
    return jsPsych.data.get().last(1).values()[0].new_dropspeed;
  },
  // Change in dropspeed after fast/slow answer
  dropspeed_step_size: 0.1,
  // Optimal response position (i.e., no need to change dropspeed)
  // NOTE: this is in pixels, dependent on canvas target height
  optimal_time: 300,

  // SCORE
  // Maximum number of trials
  // Score is visualized as a percentage of the maximum score
  total_trials: jsPsych.timelineVariable("total_trials"),
  // Score to display in this trial
  // NOTE: variable dependent on the last saved data (i.e., last response)
  score: function () {
    return jsPsych.data.get().last(1).values()[0].new_score;
  },

  // RESPONSES
  // Which keyboard keys participants can use to type their answers
  // NOTE: a-z characters stored in "input-parameters.js"
  // NOTE: per default the "end_key", backspace and spacebar are added.
  response_keys: available_keys,
  // Which key participants can use to submit their answers
  end_key: "Enter",
  // How many mistakes one is allowed to make after one another before
  // ... being excluded from the experiment
  max_continous_mistakes: 10,

  // FEEDBACK
  // Time in milliseconds how long to display the feedback for
  feedback_duration: 250,
};

// TIMELINE: instruction trials
var timeline_instruction_trial = {
  timeline: [trial], // show the trials
  timeline_variables: [
    { target: "Chocolate", condition: "positive", total_trials: "1" },
  ],
  data: { data_type: "instructions" },
}; // END timeline_instruction_trial

// SCREEN: Instructions
var instructions_2 = {
  type: "instructions",
  // Show buttons for clicking
  show_clickable_nav: true,
  // Show the amount of pages left
  show_page_number: true,
  // Also allow forwarding by keyboard
  key_forward: "Enter",
  // Text on buttons
  button_label_previous: "back",
  button_label_next: "next",
  // Add information for easy data processing
  data: { data_type: "instructions" },
  // Individual pages / slides with HTML markup
  pages: [
    //
    "<p> You just saw the playing field. It contains the following elements:",
    "<p> The moving word 'Chocolate' is the word of interest: <br> What is the <b> first word </b> you think of when you read it?",
    "<p> Type your first thought/association by using the keyboard <br><i>(a-z; backspace; space)</i>",
    "<p> Did you notice that 'Chocolate' was shown in <span style = 'color: rgba(0, 158, 115, 1)'>green</span>? <br> " +
      "It indicates that you should give a <span style = 'color: rgba(0, 158, 115, 1)'> positive </span> association (e.g. 'Sweet').",
    "<p> If 'Chocolate' is shown in <span style = 'color: rgba(213, 94, 0, 1)'>red</span> we want you to give a " +
      "<span style = 'color: rgba(213, 94, 0, 1)'> negative </span> association (e.g., 'Unhealthy').",
    "<p> Your <b> current score </b> is shown by the number and the <span style = 'color: rgba(255, 208, 0, 1)'>yellow bar</span>." +
      "<br> In this example you had 1 point (<span style = 'color: rgba(255, 208, 0, 1)'>yellow</span>) but " +
      "the maximum score (<span style = 'color: rgba(238, 238, 238, 1)'>grey</span>) was 2 points.",
    "<p> If you type a response <b> before </b> the target ('Chocolate') hits the bottom, you'll <b> gain </b> a point. <br>" +
      "<p> If you're too late you'll lose a point. ",
    "<p> Achieving the maximum score is not easy: <br>" +
      "The target will <b> increase and descrease speed </b> during the game.",
    "<p> When you start typing on the keyboard it will show up below the score bar.",
    "<p> Now lets' try and give the positive association that 'Chocolate' is 'Sweet'...",
  ],
};

// timeline_instruction_trial (repeated)

// SCREEN: Instructions
var instructions_3 = {
  type: "instructions",
  // Show buttons for clicking
  show_clickable_nav: true,
  // Show the amount of pages left
  show_page_number: true,
  // Also allow forwarding by keyboard
  key_forward: "Enter",
  // Text on buttons
  button_label_previous: "back",
  button_label_next: "next",
  // Add information for easy data processing
  data: { data_type: "instructions" },
  // Individual pages / slides with HTML markup
  pages: [
    //
    "<p> Good effort!",
    "<p> Here are a few things to know before you get started: </p>",
    "<p> 1. Type the <b> first </b> word/association that comes to mind.",
    "<p> 2. You can only type <b> 1 or 2 words </b> (no sentences).",
    "<p> 3. A word consists of <b> more than 2 characters </b> (no 'a' or 'an').",
    "<p> 4. Be quick, but type actual words; use <b> backspace </b> to correct any mistakes. <br>" +
      "We check your answer to make sure it is <b> US English </b>",
    "<p> 5. If you do <b> not</b> know the target word type <b> xxx </b> as your answer.",
    "<p> 6. Press the <b> Enter</b>-key to quickly submit your answer.",
    "<p> You'll now be able to practice with <b> 5 practice trials </b>",
  ],
};

// TIMELINE: pratice trials
var timeline_practice = {
  timeline: [trial], // show the trials
  timeline_variables: [
    { target: "Chocolate", condition: "negative", total_trials: "5" },
    { target: "Bike", condition: "positive", total_trials: "5" },
    { target: "Balloon", condition: "negative", total_trials: "5" },
    { target: "Pen", condition: "negative", total_trials: "5" },
    { target: "Car", condition: "positive", total_trials: "5" },
  ],
  data: { data_type: "practice" },
  randomize_order: false,
}; // END all_trials

// SCREEN: Instructions
var instructions_start = {
  type: "instructions",
  // Show buttons for clicking
  show_clickable_nav: false,
  // Show the amount of pages left
  show_page_number: false,
  // Also allow forwarding by keyboard
  key_forward: "Enter",
  // Add information for easy data processing
  data: { data_type: "instructions" },
  // Individual pages / slides with HTML markup
  pages: [
    //
    "<div style = 'text-align: left;'>" + // align text left for pretty list.
      "You are now ready to start the game: <br>" +
      "<p> 1. Type the <b> first </b> word/association that comes to mind." +
      "<p> 2. You can only type <b> 1 or 2 words </b> (no sentences)." +
      "<p> 3. A word consists of <b> more than 2 characters </b> (no 'a' or 'an')." +
      "<p> 4. Be quick, but type actual words; use <b> backspace </b> to correct any mistakes. <br>" +
      "We check your answer to make sure it is <b> US English </b>" +
      "<p> 5. If you do <b> not</b> know the target word type <b> xxx </b> as your answer." +
      "<p> 6. Press the <b> Enter</b>-key to quickly submit your answer." +
      "<br><br> <i> Press the <b> Enter</b>-key to get started! </i>" +
      "</div>",
  ],
};

// TIMELINE: EXPERIMENT
var timeline_experiment = {
  // show the canvas-keyboard trials as defined above
  timeline: [trial],
  // Select a random set of stimulus words per participant
  // NOTE: sourced from `stimuli.js`
  // NOTE: specify function below so that is called only once each experiment.
  timeline_variables: sampleStimuli(
    (n_unique = 10), // 10 jobtitles
    (n_loops = n_loops_total), // 20 repetitions
    (n_conditions = 2) // two valence conditions
  ), // number of stimulus words to sample
  // Present the trials in a random order
  randomize_order: true,
  // NOTE: A loop is always executed once, so reduce desired number of repetitions by 1
  loop_function: function () {
    // Desired number of repetitions
    if (loop_counter < n_loops_total) {
      loop_counter = loop_counter + 1; // increase loop counter to prevent infinite loop
      return true; // continues with the next loop
    } else {
      return false; // discontinues the loop
    }
  },
  // save for easy data processing
  data: { data_type: "experiment" },
};

// Custom function for sampling the required stimuli
// n_unique: number of target words to sample
// n_loops: number of times each target-condition is presented
// n_condition: number of valence conditions (positive, negative, ...)
function sampleStimuli(n_unique, n_loops, n_conditions) {
  // Sample a subset of stimuli (`target` parameter only)
  const selected_stimuli = jsPsych.randomization.sampleWithoutReplacement(
    target_stimuli,
    n_unique
  );
  // CONDITIONS
  // Each word needs to be presented in a positive and negative condition
  // Create these trials now.

  // Positive condition
  // SOURCE for deepcloning arrays: https://www.freecodecamp.org/news/how-to-clone-an-array-in-javascript-1d3183468f6a/
  var positive_trials = JSON.parse(JSON.stringify(selected_stimuli)); // duplicate array
  // Add the positive condition info
  positive_trials.forEach(function (stimulus) {
    stimulus.condition = "positive";
    // Save number of total trials
    stimulus.total_trials = n_unique * n_loops * n_conditions;
  });

  // Negative condition
  let negative_trials = JSON.parse(JSON.stringify(selected_stimuli)); // duplicate array
  // Add the negative condition info
  negative_trials.forEach(function (stimulus) {
    stimulus.condition = "negative";
    // Save number of total trials
    stimulus.total_trials = n_unique * n_loops * n_conditions;
  });

  // Return the combination of positive & negative trials
  // Order will be randomized.
  combined_trials = [].concat(positive_trials, negative_trials);
  return combined_trials;
}

// SCREEN: End of Experiment

// Early End due to too many mistakes
var EoE_mistakes = {
  type: "instructions",
  // Show buttons for clicking
  show_clickable_nav: false,
  // Show the amount of pages left
  show_page_number: false,
  // Also allow forwarding by keyboard
  key_forward: "Enter",
  // Add information for easy data processing
  data: { data_type: "end-of-experiment" },
  // Individual pages / slides with HTML markup
  pages: [
    // Create as function so that the context is retrieved upon presentation
    function () {
      var text =
        "<p> <b> You have reached the end of the <i> Free Association Game </i></b><br>" +
        "Thank you for participating! <br> <br>" +
        "Unfortunately you made " +
        continous_mistakes +
        " mistakes in a row. <br>" +
        "Please let us know if you were experiencing technical difficulties, " +
        "<br> did not understand the task, <br> " +
        "or where having other issues. " +
        "<br><br>" +
        "You can contact us via <b> s.a.m.hogenboom@uva.nl </b>" +
        "<br> <br> <i> Press the <b> Enter</b>-key to return to the Lab-page <i>";

      return text;
    },
  ],
};

var timeline_EoE_mistakes = {
  timeline: [EoE_mistakes],
  conditional_function: function () {
    if (continous_mistakes > 10) {
      return true;
    } else {
      return false;
    }
  },
};

var EoE_normal = {
  type: "instructions", // Show buttons for clicking
  show_clickable_nav: false,
  // Show the amount of pages left
  show_page_number: false,
  // Also allow forwarding by keyboard
  key_forward: "Enter",
  // Add information for easy data processing
  data: { data_type: "end-of-experiment" },
  // Individual pages / slides with HTML markup
  pages: [
    // Create as function so that the context is retrieved upon presentation
    function () {
      var text =
        "<p> <b> You have reached the end of the <i> Free Association Game </i></b><br>" +
        "Thank you for participating! <br> <br>" +
        "<p>You scored " +
        Math.min(
          jsPsych.data.get().last(1).values()[0].new_score,
          jsPsych.data.get().last(1).values()[0].total_trials
        ) +
        " / " +
        jsPsych.data.get().last(1).values()[0].total_trials +
        " points." +
        "<br><br>" +
        "Please get in touch if you have any remarks about the game. <br>" +
        "You can contact us via <b> s.a.m.hogenboom@uva.nl </b>" +
        "<br> <br> <i> Press the <b> Enter</b>-key to return to the Lab-page <i>";

      return text;
    },
  ],
};

var timeline_EoE_normal = {
  timeline: [EoE_normal],
  conditional_function: function () {
    if (continous_mistakes <= 10) {
      return true;
    } else {
      return false;
    }
  },
};

// COMPILE EXPERIMENT
// (Required)
// Add all screens to the timeline
timeline.push(
  // First exposure (1 trial)
  instructions,
  initialize_experiment, // set adaptive parameters
  timeline_instruction_trial,

  // Second exposure (1 trial)
  instructions_2,
  initialize_experiment, // set adaptive parameters
  timeline_instruction_trial,

  // Third exposure (5 trials)
  instructions_3,
  initialize_experiment, // set adaptive parameters
  timeline_practice,

  // The experiment
  instructions_start,
  initialize_experiment, // set adaptive parameters
  timeline_experiment,

  // End of Experiment feedback
  timeline_EoE_mistakes,
  timeline_EoE_normal
);

// INITIALIZE EXPERIMENT
// (Required)
jsPsych.init({
  // Pass on the timeline variable we created with the individual trials
  timeline: timeline,
  // Allow all case responses
  case_sensitive_responses: false,
  // Exclude users with a too small browser window,
  exclusions: {
    min_width: 800,
    min_height: 600,
  },
  // Refer back to UvA Lab website
  on_finish: function () {
    window.location =
      "https://www.lab.uva.nl/lab/index.php/projects/end_online_project/" +
      labParameters["tid"];
  },
});
