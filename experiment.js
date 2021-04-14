// EXPERIMENT STRUCTURE
// Informed Consent
// Instructions - Paradigm
// Pratice Trials
// Instructions - Getting Started
// Association Trials

// SET-UP
// Initialize timeline variable (required)
var timeline = [];
// Initialize variables that are re-used flexibly within trials
var initialize_experiment = {
  // Basicly an empty function that is called but does not show anything on screen
  type: "call-function",
  // Do nothing
  func: function () {},
  // Save the required data that is fed into the first trial.
  data: {
    new_dropspeed: 300,
    new_lives: 20,
  },
};

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
  canvas_size_target: [375, 400],
  // Size of the canvas where the lived are displayed [height, width]
  // NOTE: for pretty styling keep width of target & lives canvas the same
  // NOTE: the number of included lives determines the ultimate height of this canvas
  canvas_size_lives: [100, 400],

  // TIMING
  // The time whith which the target frames are updated (i.e., dropspeed)
  // NOTE: variable dependent on the last saved data (i.e., last response)
  dropspeed: function () {
    return jsPsych.data.get().last(1).values()[0].new_dropspeed;
  },
  // Change in dropspeed after fast/slow answer
  dropspeed_step_size: 50,
  // Optimal response position (i.e., no need to change dropspeed)
  // NOTE: this is in pixels, dependent on canvas target height
  optimal_time: 300,

  // LIVES
  // Number of lives to display (in first trial)
  // Fixes the styling between trials
  experiment_lives: 20,
  // Number of lives to display in this trial
  // NOTE: variable dependent on the last saved data (i.e., last response)
  lives: function () {
    return jsPsych.data.get().last(1).values()[0].new_lives;
  },

  // RESPONSES
  // Which keyboard keys participants can use to type their answers
  // NOTE: a-z characters stored in "input-parameters.js"
  // NOTE: per default the "end_key", backspace and spacebar are added.
  response_keys: available_keys,
  // Which key participants can use to submit their answers
  end_key: "Enter",

  // FEEDBACK
  // Time in milliseconds how long to display the feedback for
  feedback_duration: 250,
};

// TIMELINE: pratice trials
var timeline_practice = {
  timeline: [trial], // show the trials
  timeline_variables: [
    { target: "Chocolate", condition: "neutral" },
    { target: "Bike", condition: "positive" },
    { target: "Balloon", condition: "negative" },
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

var test = {
  type: "canvas-keys",
  target: "TEST",
  canvas_size_target: [375, 400],
  optimal_time: 375 - 100,
  lives: 20,
  canvas_size_lives: [100, 400],
  frame_time: 300,
};

// COMPILE EXPERIMENT
// (Required)
// Add all screens to the timeline
// timeline.push(informed_consent);
// timeline.push(instructions);
// timeline.push(timeline_practice);
// timeline.push(instructions_start);
// timeline.push(timeline_experiment);
timeline.push(initialize_experiment, timeline_practice);

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
