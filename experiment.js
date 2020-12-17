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
// Start point for the adaptive timer
var trial_timer = 500;

// SCREEN: Informed Consent
var informed_consent = {
  // text + keyboard response
  type: "html-keyboard-response",
  stimulus: // text to display
  "<p> -- Informed Consent Text --- </p>" +
  "<p> If you agree with these conditions press [SPACE] to continue </p>",
  choices: ["space"], // only proceed when the spacebar is pressed
  data: {data_type: "informed_consent"}, // for sub-sequent data selection
  on_load: function() {
    // Remove progress bar from screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  }
};

// SCREEN: Instructions
var instruction_experiment = {
  type: "html-keyboard-response", // text + keyboard response
  stimulus: // text to display
  "<p>Please read this carefully, " + 
  "as it will tell you what to do next. </p>" + 
    "<p> On the screen you will see one word. For example the word 'Disney'. </p>" +
    "<p> We want you to write down your <b> first </b> thought or association with that word. " +
    "When you are done you can continue to the next word by pressing the <b>'Continue'-button </b> or " +
    "by pressing the <b>'Enter'-key</b>. </p>" + 
    "<p> Press [SPACE] for your first example. </p>",
  choices: ["space"], // only proceed when the spacebar is pressed
  trial_duration: null, // set to infinite length
  data: {data_type: "instruction"}, // for sub-sequent data selection
  on_load: function() {
    // Remove progress bar from screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  }
};

// EXPERIMENT
// Add all screens to the timeline
timeline.push(informed_consent);
timeline.push(instruction_experiment);

// Initialize the experiment
jsPsych.init({
  timeline: timeline,
  // progress bar to indicate trial times
  show_progress_bar: true,
  // manual updates within trials
  auto_update_progress_bar: false,
  message_progress_bar: "Time"
});