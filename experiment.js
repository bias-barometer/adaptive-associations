// EXPERIMENT STRUCTURE
// Informed Consent
// Instructions - Paradigm
// Pratice Trials
// Instructions - Getting Started
// Association Trials

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
    "<p> Welcome to the Free Associations ... </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> We want to know what you think about when you read a word. </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> For example, what are you thinking about after reading the word: </p>" +
      "<br>" +
      "<p> Chocolate </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> We want you to type the <b> first </b> thought that comes to mind. </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> Let's show you what the Free Associations ... looks like: " +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> <b>Chocolate </b> </p>" +
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
      "<p> You can only use lowercase letters (a-z) </p>" +
      "<p> Use the <b> backspace </b> to correct typing errors </p>" +
      "<br>" +
      "<p> Only type 1 or 2 words (no sentences) </p>" +
      "<p> Each word should contain more than 2 characters (no 'a' or 'an') </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to continue",
    //
    "<p> Are you ready to practice? Let's give it a try! </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> for 3 practice words",
  ],
  key_forward: "Enter",
};

// SCREEN: Trial
var trial = {
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
  timeline: [trial], // show the trials
  timeline_variables: [
    { target_word: "Chocolate", show_instructions: true },
    { target_word: "Bike", show_instructions: true },
    { target_word: "Balloon", show_instructions: false },
  ],
  data: { data_type: "practice" },
  randomize_order: false,
}; // END all_trials

// SCREEN: Start Experiment
var instructions_start = {
  type: "instructions",
  key_forward: "Enter",
  pages: [
    // Welcome
    "<p> Well done! You are now ready for the real deal. </p>" +
      "<br>" +
      "<p> Remember: </p>" +
      "<br>" +
      "<p> You can only use lowercase letters (a-z) </p>" +
      "<p> Use the <b> backspace </b> to correct typing errors </p>" +
      "<br>" +
      "<p> Only type 1 or 2 words (no sentences) </p>" +
      "<p> Each word should contain more than 2 characters (no 'a' or 'an') </p>" +
      "<br>" +
      "<p> Press <b> Enter </b> to get started",
  ],
};

// TIMELINE: experiment trials
var timeline_experiment = {
  timeline: [trial], // show the trials
  timeline_variables: [
    { target_word: "Male", show_instructions: false },
    { target_word: "Female", show_instructions: false },
    { target_word: "Gay", show_instructions: false },
    { target_word: "Lesbian", show_instructions: false },
    { target_word: "Asian", show_instructions: false },
    { target_word: "Black", show_instructions: false },
    { target_word: "Politician", show_instructions: false },
    { target_word: "Lawyer", show_instructions: false },
  ],
  data: { data_type: "experiment" },
  randomize_order: true, // randomize the trials
  repetitions: 2, // present each trial twice.
}; // END all_trials

// COMPILE EXPERIMENT
// (Required)
// Add all screens to the timeline
timeline.push(informed_consent);
timeline.push(instructions);
timeline.push(timeline_practice);
timeline.push(instructions_start);
timeline.push(timeline_experiment);

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
