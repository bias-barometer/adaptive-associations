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
// number of frames with which the timer should be updated
var timer_frames = 10;

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
    "<p> Press [SPACE] for some examples. </p>",
  choices: ["space"], // only proceed when the spacebar is pressed
  trial_duration: null, // set to infinite length
  data: {data_type: "instruction"}, // for sub-sequent data selection
  on_load: function() {
    // Remove progress bar from screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  }
};

// SCREEN: Practice - Untimed
var practice_trial_no_time = {
  type: "survey-text", // text + answer box + continue button
  questions: [{prompt:"driving"}], // target to display
  choices: "ALL_KEYS", // enable full keyboard (enter = continue)
  trial_duration: null, // set to infinite length == self=paced
  data: {data_type: "practice"}, // for sub-sequent data selection
  button_label: "Submit Answer",
  on_load: function() {
    // Remove progress bar from screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  }
};

// SCREEN: Instructions - Timer
var instruction_timer = {
  type: "html-keyboard-response", // text + keyboard response
  stimulus: // text to display
  "<p> In the previous example you were able to do everything at your own pace. " +
  "We are now going to ask you to be as <b> fast </b> as possible. </p>" +
  "<p> The time you have left is shown at the top, similar to what you can see now. " +
  "The time you have for each response changes, so give your answer <b> before the timer runs out! </b></p>" + 
  "<p> We want you to be fast, but <b> prevent (typing) errors. </b>" + 
  "More on that after you've practiced with the timer. </p>" + 
  "<p> Press [SPACE] to continue. </p>",
  choices: ["space"], // only proceed when the spacebar is pressed
  trial_duration: null, // set to infinite length
  data: {data_type: "instruction"}, // for sub-sequent data selection
  // TIMER
  // Visibility
  on_load: function() {
    // Show progress bar on screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "visible";
    // proportion of bar filled between 0 (empty) and 1 (full)
    jsPsych.setProgressBar(0.75); 
  }
};

// SCREEN: Practice - Timed
var practice_trial_timed = {
  // one prompt = one target + answer box at a time
  type: "survey-text",
  // target_word comes from the timeline variables specified below
  questions: [{prompt: jsPsych.timelineVariable('target_word'), name: "practice_trial"}],
  choices: "ALL_KEYS", // the entire keyboard can be used
  trial_duration: jsPsych.timelineVariable('trial_timer'), // comes from timeline below
  button_label: "Submit Answer", // button text to display
  // TRIAL TIMER
  on_start: function () {
    // Show progress bar on screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "visible";

    // Start with the full bar 0 (empty) and 1 (full)
    jsPsych.setProgressBar(1);

    // initialize update loop
    for (let i = 0; i < (timer_frames + 1); i++) { 
      // Compute required delay
      var trial_timer = jsPsych.timelineVariable('trial_timer', true); // true to get value instead of function
      var time_per_frame = trial_timer / timer_frames;
      var timer_delay = time_per_frame * i; // add to each loop for staggered release

      update_timer(i, timer_delay);

    } // END i LOOP 
    
    function update_timer(i, timer_delay) {
      // timeout function executes a task AFTER a delay.
      // To create iterations an incremental delay has to be set for every trial
      setTimeout(function() { 
        // update value
        var new_val = 1 - (i * (1 / timer_frames));
      
        if (new_val === 0) {
          // document.querySelector('input[type="submit"]').disabled = false;
          // document.getElementById("jspsych-survey-text-form").submit();
          // auto submit form by "clicking" the button.
          document.getElementById("jspsych-survey-text-next").click();
        }
        
        jsPsych.setProgressBar(new_val); // value between 0 (empty) and 1 (full)

      }, timer_delay); 
      
    } // END update_timer LOOP 
  } // END on_load function
}; // END trial

// TIMELINE: pratice trials
var timeline_practice_timed = {
  timeline: [practice_trial_timed], // show the practice trials
  timeline_variables: [
    {target_word: "car",
     trial_timer: 10000},
    {target_word: "bike",
     trial_timer: 5000},
    {target_word: "balloon",
     trial_timer: 7500},
  ], 
  data: {data_type: "practice"},
  randomize_order: false
}; // END all_trials

// SCREEN: Instruction - Accuracy
var instruction_accuracy = {
  type: "html-keyboard-response", // text + keyboard response
  stimulus: // text to display
  "<p> In the previous examples you praticed with typing at a higher speed. </p>" +
  "<p> In this experiment we want you to be both <b> fast </b> & <b> accurate </b>. " +
  "But what do we mean with 'accurate'? </p>" +
  "<p> It means that we want valuable responses from you that we can present to others. " +
  "This includes <b> best practices </b> such as: </p> " +
  "<ul>" +
      "<li>" + "Preventing typing errors" +
      "<li>" + "Typing real words" +
      "<li>" + "<b>No</b> keyboard bashing (asdahsiudaisdya)" +
      "<li>" + "Preventing repeated answers" + 
  "</ul>" + 
  "<p> Press [SPACE] to see some examples of (in)accurate answers. </p>",
  choices: ["space"], // only proceed when the spacebar is pressed
  trial_duration: null, // set to infinite length
  data: {data_type: "instruction"}, // for sub-sequent data selection
  // TIMER
  // Visibility
  on_load: function() {
    // Hide progress bar on screen
    document.getElementById("jspsych-progressbar-container").style.visibility = "hidden";
  }
};

// EXPERIMENT
// Add all screens to the timeline
// timeline.push(informed_consent);
// timeline.push(instruction_experiment);
// timeline.push(practice_trial_no_time);
// timeline.push(instruction_timer);
// timeline.push(timeline_practice_timed);
timeline.push(instruction_accuracy);

// Initialize the experiment
jsPsych.init({
  timeline: timeline,
  // progress bar to indicate trial times
  show_progress_bar: true,
  // manual updates within trials
  auto_update_progress_bar: false,
  message_progress_bar: "Time"
});