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
    data_type: "initialize",
  },
};

// SCREEN: Instructions
var instructions = {
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
    "<p> Let's have a look at the playing field (you won't have to do anything). <br> We'll explain everything after.",
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
  // NOTE: for pretty styling keep width of target & lives canvas the same
  // NOTE: the number of included lives determines the ultimate height of this canvas
  canvas_size_lives: [100, 600],

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

// TIMELINE: instruction trials
var timeline_instruction = {
  timeline: [trial], // show the trials
  timeline_variables: [{ target: "Chocolate", condition: "positive" }],
  data: { data_type: "instructions" },
}; // END timeline_instruction

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
    "<p> The word 'Chocolate' is the word of interest: <br> what is the <b> first word </b> you think of when you read it?",
    "<p> Type your first thought/association by using the keyboard <i>(a-z; backspace; space) </i>",
    "<p> Did you notice that 'Chocolate' was shown in <b> green </b>? <br> It indicates that you should give a <b> positive </b> association (e.g. 'Sweet')",
    "<p> If 'Chocolate' is shown in <b> red </b> we want you to give a <b> negative </b> association. (e.g., 'Unhealthy')",
    "<p> The little colored balls show your <b> current score </b>. <br> In this example you had 20, but you'll start with 1.",
    "<p> If you type a response <b> before </b> the target ('Chocolate') hits the bottom, you'll gain a point.",
    "<p> If you're too late you'll lose a point. Let's see if you can achieve the maximum score!",
    "<p> To keep things interesting: <br> the target will increase and decrease speed during the experiment.",
    "<p> Now lets' try and give us the positive association that 'Chocolate' is 'Sweet'...",
  ],
};

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
    "<p> 3. A word consists of <b> 2 or more characters </b> (no 'a' or 'an').",
    "<p> 4. Be quick, but type actual words; use <b> backspace </b> to correct any mistakes.",
    "<p> 5. Press the <b> Enter</b>-key to quickly submit your answer.",
    "<p> You'll now be able to practice all of this with <b> 5 practice trials </b>",
  ],
};

// TIMELINE: pratice trials
var timeline_practice = {
  timeline: [trial], // show the trials
  timeline_variables: [
    { target: "Chocolate", condition: "negative" },
    { target: "Bike", condition: "positive" },
    { target: "Balloon", condition: "negative" },
    { target: "Pen", condition: "negative" },
    { target: "Car", condition: "positive" },
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
  // Add information for easy data processing
  data: { data_type: "instructions" },
};

// TIMELINE: experiment trials
var timeline_experiment = {
  timeline: [trial], // show the trials
  timeline_variables: target_stimuli,
  data: { data_type: "experiment" },
  sample: {
    type: "without-replacement",
    size: 10, // 10 trials
  },
}; // END all_trials

// COMPILE EXPERIMENT
// (Required)
// Add all screens to the timeline
// timeline.push(informed_consent);
// timeline.push(instructions);
// timeline.push(timeline_practice);
// timeline.push(instructions_start);
// timeline.push(timeline_experiment);
timeline.push(
  // First exposure (1 trial)
  instructions,
  initialize_experiment, // set adaptive parameters
  timeline_instruction,
  // Second exposure (1 trial)
  instructions_2,
  initialize_experiment, // set adaptive parameters
  timeline_instruction,
  // Third exposure (5 trials)
  instructions_3,
  initialize_experiment, // set adaptive parameters
  timeline_practice

  /*
  initialize_experiment,
  timeline_practice,
  instructions_start,
  initialize_experiment,
  timeline_experiment*/
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
  // DEBUG
  // Show data on screen after finishing
  on_finish: function () {
    jsPsych.data.displayData();
  },
});
