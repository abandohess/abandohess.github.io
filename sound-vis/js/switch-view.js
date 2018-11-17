let showCircle = true;
$( "#change-view" ).click(function() {
   // $("#container").css("display", "none");
  showCircle = !showCircle;
  if (showCircle) {
    $("#container").css("display", "inline");
    $("#container2").css("display", "none");
  } else {
     $("#container").css("display", "none");
     $("#container2").css("display", "inline");
  }
});
