// EXPERIMENT STRUCTURE
// Informed Consent
// Instructions - Paradigm
// Pratice Trials
// Instructions - Valid Answers
// Examples (in)valid Answers
// Association Trials
// Adaptive Timer
// Answer Validation
// Data
// Reaction Times
// Keystrokes
// Error corrections
// Feedback / End-of-Experiment

// SET-UP
// Initialize timeline variable (required)
var timeline = [];

// SCREEN: Informed Consent
var informed_consent = {
  // text + keyboard response
  type: "html-keyboard-response",
  // text to display
  stimulus:
    "<p> -- Informed Consent Text --- </p>" +
    "<p> If you agree with these conditions press [SPACE] to continue </p>",
  // only proceed when the spacebar is pressed
  // https://keycode.info/ for information on the textual represprentation
  choices: [" "],
  // Add information for easy data processing
  data: { data_type: "informed_consent" },
};

// SCREEN: Instructions
var instruction_experiment = {
  type: "html-keyboard-response", // text + keyboard response
  // text to display on screen
  stimulus:
    "<p>" +
    "Each time you see a word on the screen type the first" +
    " thought that comes to mind. " +
    "</p>" +
    "<br>" +
    "<p>" +
    "When you are done press [ENTER] to continue to the next word." +
    "</p>" +
    "<br>" +
    "<p> Press [SPACE] to try some examples </p>",
  // only proceed when the spacebar is pressed
  // https://keycode.info/ for information on the textual represprentation
  choices: [" "],
  // self-paced: set to infinite length
  trial_duration: null,
  // Add information for easy data processing
  data: { data_type: "instruction" },
};

// SCREEN: Practice
var practice_trials = {
  // Custom plugin
  type: "html-keyboard-text",
  stimulus: "TEST",
  response_keys: ["ALL_KEYS"],
  trial_duration: null,
  end_trial_keys: ["Enter"],
}; // END trial

// TIMELINE: pratice trials
var timeline_practice_timed = {
  timeline: [practice_trials], // show the practice trials
  timeline_variables: [
    { target_word: "car" },
    { target_word: "bike" },
    { target_word: "balloon" },
  ],
  data: { data_type: "practice" },
  randomize_order: false,
}; // END all_trials

// COMPILE EXPERIMENT
// (Required)
// Add all screens to the timeline
// timeline.push(informed_consent);
// timeline.push(instruction_experiment);
timeline.push(practice_trials);

// INITIALIZE EXPERIMENT
// (Required)
jsPsych.init({
  // Pass on the timeline variable we created with the individual trials
  timeline: timeline,
  // Allow all case responses
  case_sensitive_responses: false,
});
