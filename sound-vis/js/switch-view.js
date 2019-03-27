$( "#change-view" ).click(function() {
  if (view === 1) {
    $("#container").css("display", "inline");
    $("#container2").css("display", "none");
    view = 0;
    clearParicleSystems();
  } else {
    initParticleSystems();
    $("#container").css("display", "none");
    $("#container2").css("display", "inline");
    view = 1;
  }
});
