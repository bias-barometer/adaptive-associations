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
    "<p> If you agree with these conditions press <b> Enter </b> to continue </p>",
  // only proceed when the spacebar is pressed
  // https://keycode.info/ for information on the textual represprentation of each key
  choices: ["Enter"],
  // Add information for easy data processing
  data: { data_type: "informed_consent" },
};

// SCREEN: Instructions
var instructions = {
  type: "instructions",
  pages: [
    // Welcome
    "<p> Welcome to the Free Associations Game </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> We want to know what you think about when you read a word. </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> Chocolate </p>" +
      "<br>" +
      "<p> What are you thinking about after reading this word? </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> We want you to type the <b> first </b> thought that comes to mind. </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> Let's show you what that will look like: " +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> Chocolate </p>" +
      "<p><i> This is the word we want you to read </i></p>" +
      "<br>" +
      "<p> _ </p>" +
      "<p><i> This is where we show your response when you type on the keyboard </i></p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue" +
      "<p><i> When you are done typing you can press <b> Enter </b> to continue to the next word</i></p>",
    //
    "<p> What should a response look like? </p>" +
      "<br>" +
      "<p> One or two words" +
      "<p> UPPERCASE or lowercase letters" +
      "<p> More than two characters" +
      "<p> Correct typing errors with the <b> backspace </b> </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> Are you ready to practice? Let's try! </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to practice",
  ],
  key_forward: "Enter",
};

// SCREEN: Practice
var practice_trials = {
  // Custom plugin
  type: "html-keyboard-text",
  // Get stimulus content from timeline variable
  stimulus: jsPsych.timelineVariable("target_word"),
  // Show instructions about what to do
  show_instructions: jsPsych.timelineVariable("show_instructions"),
  // All keys may be used to provide an answer
  response_keys: jsPsych.ALL_KEYS,
  // Self-paced == infinite length
  trial_duration: null,
  // How to continue to the next trial
  end_trial_key: "Enter", // add as string for proper validation
}; // END trial

// TIMELINE: pratice trials
var timeline_practice = {
  timeline: [practice_trials], // show the practice trials
  timeline_variables: [
    { target_word: "Chocolate", show_instructions: true },
    { target_word: "Bike", show_instructions: true },
    { target_word: "Balloon", show_instructions: false },
  ],
  data: { data_type: "practice" },
  randomize_order: false,
}; // END all_trials

// COMPILE EXPERIMENT
// (Required)
// Add all screens to the timeline
timeline.push(informed_consent);
timeline.push(instructions);
timeline.push(timeline_practice);

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
  // DEBUG
  // Show data on screen after finishing
  on_finish: function () {
    jsPsych.data.displayData();
  },
});
