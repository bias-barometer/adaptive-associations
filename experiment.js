// EXPERIMENT STRUCTURE
    // Informed Consent
    // Welcome
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
  data: {data_type: "informed_consent"} // for sub-sequent data selection
};

// EXPERIMENT
// Add all screens to the timeline
timeline.push(informed_consent);

// Initialize the experiment
jsPsych.init({
  timeline: timeline,
  // progress bar to indicate trial times
  show_progress_bar: true,
  // manual updates within trials
  auto_update_progress_bar: false,
  message_progress_bar: "Time"
});