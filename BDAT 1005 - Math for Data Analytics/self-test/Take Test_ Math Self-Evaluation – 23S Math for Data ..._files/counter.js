var counter = {};
window.useBeep = true;
window.OnError = null;

var statusMsg;
var timerId = null;
counter.timerRunning = false;

var ElapsedSeconds = 0;
var ElapsedMinutes = 0;
var ElapsedHours   = 0;
var RemainingSeconds = 0;
var RemainingMinutes = 0;
var RemainingHours   = 0;
var additionalHours = 0;
var additionalMinutes = 0;
var additionalSeconds = 0;
var additionalMS = 0;
var Hours = 0;
var Minutes = 0;
var Seconds = 0;
var attemptTimerCompletion = '';
var totalTimeSec = 0;
var lastCurrentTime = 0;
var lastActualTime = 0;

var startTime;
var endTime;

var halfTimeElapsedFlag = false;
var fiveMinElapsedFlag = false;
var oneMinElapsedFlag = false;
var thirtySecElapsedFlag = false;
var expirationFlag = false;
var expired = false;
var cssArrayWarning = ['timeUpWarning', 'thirtySecondWarning',
                'halfTimeWarning', 'oneMinuteWarning', 'fiveMinuteWarning'];
var timeElapsedCssArray = [ 'progressBarStyleOvertime', 'progressBarStyleOneMin', 'progressBarStyleThirtySec',
                           'progressBarStyle'];

function cssChange ( messageArea, cssClassToAdd, cssArray )
{
  for ( var i = 0; i < cssArray.length; i++)
  {
    if ( cssArray[i].indexOf ( cssClassToAdd )>=0 )
    {
      Element.addClassName( messageArea, cssClassToAdd );
    }
    else
    {
      Element.removeClassName( messageArea, cssArray[i] );
    }
  }
}
function timeElapsedBar( remainingMS )
{
  var timePercentage;
  if ( remainingMS > 0 && remainingMS <= totalTimeSec * 1000 )
  {
    timePercentage = Math.floor( ( totalTimeSec * 1000 - remainingMS ) / ( totalTimeSec * 1000 ) * 100 );

    if ( remainingMS <= 30000 )
    {
      cssChange ( $('progressBar'), 'progressBarStyleThirtySec', timeElapsedCssArray );
    }
    else if ( remainingMS <= 90000 )
    {
      cssChange ( $('progressBar'), 'progressBarStyleOneMin', timeElapsedCssArray );
    }
    else
    {
      cssChange ( $('progressBar'), 'progressBarStyle', timeElapsedCssArray );
    }
    return timePercentage;
  }
  return 100;
}
function remainingTimerMessage( remainingMS )
{
  var messageKey = null;
  var messageArea = $('timeWarningDiv');
  var closeWarning = true;
  if ( remainingMS <= 0 && !expirationFlag )
  {
    messageKey = "elapsed_time_warning.expiration";
    thirtySecElapsedFlag = true;
    fiveMinElapsedFlag = true;
    oneMinElapsedFlag = true;
    halfTimeElapsedFlag = true;
    expirationFlag = true;
    closeWarning = false; // Never close the time-expired warning

    cssChange ( messageArea, 'timeUpWarning', cssArrayWarning );

  }
  else if ( remainingMS <= 30000 && !thirtySecElapsedFlag )
  {
    messageKey = "elapsed_time_warning.halfminute";
    thirtySecElapsedFlag = true;
    fiveMinElapsedFlag = true;
    oneMinElapsedFlag = true;
    halfTimeElapsedFlag = true;
    cssChange ( messageArea, 'thirtySecondWarning', cssArrayWarning );
  }
  else if ( remainingMS <= 60000 && !oneMinElapsedFlag )
  {
    messageKey = "elapsed_time_warning.oneminute";
    oneMinElapsedFlag = true;
    fiveMinElapsedFlag = true;
    halfTimeElapsedFlag = true;
    cssChange ( messageArea, 'oneMinuteWarning', cssArrayWarning );
  }
  else if ( totalTimeSec > 300 && remainingMS <= 300000 && !fiveMinElapsedFlag )
  {
    messageKey = "elapsed_time_warning.fiveminutes";
    fiveMinElapsedFlag = true;
    halfTimeElapsedFlag = true;
    cssChange ( messageArea, 'fiveMinuteWarning', cssArrayWarning );
  }
  else if ( remainingMS * 2 <= ( endTime - startTime ) && !halfTimeElapsedFlag )
  {
    messageKey = "elapsed_time_warning.half";
    halfTimeElapsedFlag = true;
    cssChange ( messageArea, 'halfTimeWarning', cssArrayWarning );
  }
  else
  {
    messageKey = null;
  }
  if ( messageKey !== null )
  {
    var textNode = document.createTextNode(page.bundle.getString( messageKey ));
    while (messageArea.firstChild)
    {
      messageArea.removeChild(messageArea.firstChild);
    }
    messageArea.appendChild(textNode);
    messageArea.style.display = "block";
    // Make sure we don't close a recently changed warning (i.e. at 30 seconds)
    if (messageArea.warningCounter)
    {
      messageArea.warningCounter = messageArea.warningCounter + 1;
    }
    else
    {
      messageArea.warningCounter = 1;
    }
    if (closeWarning)
    {
      setTimeout("closeWarningDiv("+ messageArea.warningCounter + ")",30000);
    }
  }
}
function closeWarningDiv(warnCount)
{
  var messageArea = $("timeWarningDiv");
  if (messageArea.warningCounter == warnCount)
  {
    while (messageArea.firstChild)
    {
      messageArea.removeChild(messageArea.firstChild);
    }
    messageArea.style.display = "none";
  }
}

counter.getElapsedTimeInfo = function( canUpdateTimer )
{
  var currentTime = new Date().getTime();
  var newActualTime = currentTime;
  // If we have gone back in time then assume the student is playing with their local clock.  Switch to manually guessing at time-passed.
  // This will not be totally accurate as it may take > 500ms between calls depending on system load, etc. BUT this is better than nothing
  // and will get synced to be in-line with server-duration on the next question save.
  if (currentTime < lastCurrentTime)
  {
    // In case they do something like attempt to submit and leave the alert box open (so js stops running),
    // compare the delta between the current time and last actual time to figure out elapsed time - with
    // a minimum of 500 ms because that is the interval between calls to this method
    var dif = newActualTime-lastActualTime;
    if (dif < 500)
    {
      dif = 500;
    }
    currentTime = lastCurrentTime + dif;
  }
  lastActualTime = newActualTime;
  lastCurrentTime = currentTime;
  var elapsedMS = currentTime - startTime;
  var remainingMS = endTime - currentTime;
  if ( canUpdateTimer )
  {
    remainingTimerMessage( remainingMS );
  }
  ElapsedHours   = Math.floor( elapsedMS / 3600000 );
  ElapsedMinutes = Math.floor( ( elapsedMS - (ElapsedHours*3600000) ) / 60000 );
  ElapsedSeconds = Math.floor( ( elapsedMS - (ElapsedHours*3600000) - (ElapsedMinutes*60000) ) / 1000 );
  if ( remainingMS>=0 )
  {
    RemainingHours   = Math.floor( remainingMS / 3600000 );
    RemainingMinutes = Math.floor( ( remainingMS - ( RemainingHours*3600000) ) / 60000 );
    RemainingSeconds = Math.floor( ( remainingMS - ( RemainingHours*3600000) - ( RemainingMinutes*60000) ) / 1000 );
  }
  if ( expired )
  {
    additionalMS = elapsedMS - totalTimeSec * 1000;
    additionalHours = Math.floor( additionalMS / 3600000 );
    additionalMinutes = Math.floor( ( additionalMS - (additionalHours*3600000) )  / 60000 );
    additionalSeconds = Math.floor( ( additionalMS - (additionalHours*3600000) - (additionalMinutes*60000) ) / 1000 );
  }

  Hours = expired? additionalHours : RemainingHours;
  Minutes = expired? additionalMinutes : RemainingMinutes;
  Seconds = expired? additionalSeconds : RemainingSeconds;

  var hourTitle="";
  var minuteTitle="";
  var secondTitle="";
  if ( Hours == 1)
  {
    hourTitle=page.bundle.getString("elapsed_time_title.hour", Hours);
  }
  else if (Hours>1)
  {
    hourTitle=page.bundle.getString("elapsed_time_title.hours", Hours);
  }

  if (Minutes == 1)
  {
    minuteTitle=page.bundle.getString("elapsed_time_title.minute", "<span class='timeValue'>" + (totalTimeSec>600?'0':'') + Minutes + "</span>" );
  }
  else if (Minutes>1)
  {
    minuteTitle=page.bundle.getString("elapsed_time_title.minutes", "<span class='timeValue'>" + (Minutes<10?(totalTimeSec>600?'0':''):'') + Minutes + "</span>" );
  }

  if (Seconds == 1)
  {
    secondTitle=page.bundle.getString("elapsed_time_title.second", "<span class='timeValue'>" + '0' +Seconds  + "</span>" );
  }
  else
  {
    secondTitle=page.bundle.getString("elapsed_time_title.seconds", "<span class='timeValue'>" + (Seconds<10?'0':'') +Seconds  + "</span>");
  }
  var hms = " " + hourTitle + " " + minuteTitle + " " + secondTitle;

  var returnObject = {};
  returnObject.hms = hms;
  returnObject.expired = expired;
  returnObject.remainingMS = remainingMS;

  return returnObject;
}

function resetClockWithTimeRemaining( remainingTimeInMS )
{
  expirationFlag = false;
  expired = false;

  var messageArea = $('timeWarningDiv');
  setTimeout("closeWarningDiv(" + messageArea.warningCounter + ")",1000);

  timeElapsedBar( remainingTimeInMS );
  remainingTimerMessage( remainingTimeInMS );
  startClock( 0, remainingTimeInMS / 1000, attemptTimerCompletion )
}

counter.showTime = function()
{
  var elapsedTimeInfo = counter.getElapsedTimeInfo( true );

  if ( !elapsedTimeInfo.expired )
  {
	var remainingPer = timeElapsedBar( elapsedTimeInfo.remainingMS );
	    $("cl" ).innerHTML = "<span class='timeLabel'><h3 style='display:inline'>" + page.bundle.getString( "remaining_time_title" ) + "</h3></span>" + elapsedTimeInfo.hms;
	    $( 'progressBar' ).style.width = remainingPer+'%';

    if ( elapsedTimeInfo.remainingMS <= 0 )
    {
    	  //Check with the server to determine precisely if the time for the assessment has elapsed.
    	  assessment.queryRemainingTimeInMS().then( function ( remainingTimeInMS ) {
    		  if (remainingTimeInMS <= 0)
    		  {
    			 counter.endAttemptTime( totalTimeSec, attemptTimerCompletion );
    		  }
    		  else
    		  {
    			 //The server says this assessment has some time left, so something must have bumped the clock time forward.
    			 //Reset the timer so that we don't submit the assessment too early.
    			 resetClockWithTimeRemaining( remainingTimeInMS );
    		  }
    	  }
    	  );
    }
  }
  else
  {
    $("cl").innerHTML = page.bundle.getString( "additional_time_title", '<h3 style=\'display:inline\'>', '</h3>', '<span class=\'continuousTimerWarning\'>', elapsedTimeInfo.hms, '</span>' );

    $( 'progressBar' ).style.width = '100%';
    cssChange ( $('progressBar'), 'progressBarStyleOvertime', timeElapsedCssArray );
  }
};

// shows the remaining time on the 'Test Continue' screen
counter.showRemainingTime = function( elapsedSec, timeLimitSec, timerCompletion )
{
  // initialize global js variables that are normally initialized by startClock().
  lastCurrentTime = new Date().getTime();
  startTime = lastCurrentTime - ( elapsedSec * 1000 );
  endTime = startTime + timeLimitSec * 1000;
  attemptTimerCompletion = timerCompletion;
  totalTimeSec = timeLimitSec;

  var elapsedTimeInfo = counter.getElapsedTimeInfo( false );
  var msg = elapsedTimeInfo.expired ? page.bundle.getString.getString( "additional_time_title", '', '', '', elapsedTimeInfo.hms, ''  )
      : page.bundle.getString( "your_remaining_time", elapsedTimeInfo.hms  );
  var insertionDiv = $( 'timerInstructionId' );
  insertionDiv.innerHTML = insertionDiv.innerHTML + ' ' + msg;
}


function stopClock()
{
  if (counter.timerRunning)
  {
    timerId.stop();
  }
  counter.timerRunning = false;
}

function startClock( elapsedSec, timeLimitSec, timerCompletion )
{
  stopClock();
  var messageArea = $("timeWarningDiv");
  messageArea.setAttribute("aria-live", "assertive");
  messageArea.setAttribute("aria-relevant", "additions");
  lastCurrentTime = new Date().getTime();
  startTime = lastCurrentTime - (elapsedSec * 1000);
  endTime = startTime + timeLimitSec * 1000;
  attemptTimerCompletion = timerCompletion;
  totalTimeSec = timeLimitSec;
  timerId = new PeriodicalExecuter(counter.showTime, 0.5);
  counter.timerRunning = true;
  counter.toggleTimerDisplay(ClientCache.getItem("elapsed_time.hide.timer.pref") );
}

function fixClock( elapsedSec )
{
  lastCurrentTime = new Date().getTime();
  startTime = lastCurrentTime - (elapsedSec * 1000);
  endTime = startTime + totalTimeSec * 1000;
  // restart the clock on each save.
  stopClock();
  timerId = new PeriodicalExecuter(counter.showTime, 0.5);
  counter.timerRunning = true;
}

counter.endAttemptTime = function( timeLimitSec, timerCompletion )
{
  // if the timer is of Continual
  if ( timerCompletion.indexOf( 'C' ) >= 0 )
  {
    expired = true;
    if ( confirm( page.bundle.getString( "elapsed_time_warning.end" ) ) )
    {
      assessment.userReallyWantsToSubmit = true;
      //the purpose is to call confirmSubmit so no message here;
      if ( confirmSubmit( '' ))
      {
        stopClock();
        assessment.resetFields();
        document.forms.saveAttemptForm.method.value = 'notajax'; // Make sure we don't go through the ajax-save logic on the server - aside from that we don't care about the method value
        document.forms.saveAttemptForm.save_and_submit.value = 'true';
        document.forms.saveAttemptForm.timer_completion.value = 'C';
        try
        {
          assessment.submitAttemptForm();
        }
        catch (err)
        {
          // If we had an error, continue to clear the saveandsubmit value
        }
        document.forms.saveAttemptForm.save_and_submit.value='';
      }
      //clear the flag after the validation
      assessment.userReallyWantsToSubmit = false;
    }
  }
  // if the timer is of Hardstop
  else if ( timerCompletion.indexOf( 'H' ) >= 0 )
  {
    stopClock();
    assessment.resetFields();
    skipValidation = true;
    validateForm();
    skipValidation = false;

    document.forms.saveAttemptForm.method.value = 'notajax'; // Make sure we don't go through the ajax-save logic on the server - aside from that we don't care about the method value
    document.forms.saveAttemptForm.save_and_submit.value = 'true';
    document.forms.saveAttemptForm.timer_completion.value = 'H';

    //Per LRN-57577, if user press and hold the Esc key cross the point of auto-submitting,
    //the submitting will be held and the user is able to submit it after the the timer expired.
    //So the key pressing/holding need be disabled during the submission when the timer is expired.
    document.onkeydown = counter.onKeyPressHandler;
    try
    {
      assessment.submitAttemptForm();
    }
    catch (err2)
    {
      // If we had an error, continue to clear the saveandsubmit value
    }
    document.forms.saveAttemptForm.save_and_submit.value='';
  }
};

counter.onKeyPressHandler = function (event)
{
  if (!event)
    event = window.event;
  if (event.preventDefault)
    event.preventDefault();
};

counter.toggleTimerDisplay = function(newState)
{
  var tb = $('timerBar');
  var tbt = $('timerText');
  var tt = $('timerToggle');

  var saveState = false;
  if (newState == 'toggle')
  {
    saveState = true;
  }
  if ((saveState && tb.style.display == '') || newState == 'hide')
  {
    tb.hide();
    tbt.hide();
    tt.innerHTML = page.bundle.getString( "elapsed_time.show.timer" );
    tt.title = page.bundle.getString( "elapsed_time.show.timer" );
    tt.addClassName('label').addClassName('timer-collapsed').removeClassName('timer-expanded');
    newState = 'hide';
  }
  else
  {
    tb.show();
    tbt.show();
    tt.innerHTML = "";
    tt.title= page.bundle.getString( "elapsed_time.hide.timer" );
    tt.addClassName('timer-expanded').removeClassName('label').removeClassName('timer-collapsed');
    newState = 'show';
  }
  if (saveState)
  {
    ClientCache.setItem( "elapsed_time.hide.timer.pref", newState);
  }
};

function showConfirm(message)
{
  return ( confirm( message ) ? true : false );
}
