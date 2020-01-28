$(function() {
  $("#createNewUser").submit(function() {
    event.preventDefault();
    $.ajax({
      url: "/api/exercise/new-user",
      type: "post",
      data: getFormDataObject("createNewUser"),
      success: displayResult
    });
  });

  $("#getAllUsers").submit(function() {
    event.preventDefault();
    $.ajax({
      url: "/api/exercise/users",
      type: "get",
      success: displayResult
    });
  });

  $("#addExercise").submit(function() {
    event.preventDefault();
    $.ajax({
      url: "/api/exercise/add",
      type: "post",
      data: getFormDataObject("addExercise"),
      success: displayResult
    });
  });

  $("#getLog").submit(function() {
    event.preventDefault();
    $.ajax({
      url: "/api/exercise/log?" + $("#getLog").serialize(),
      type: "get",
      success: displayResult
    });
  });

  function getFormDataObject(formId) {
    return $("#" + formId)
      .serializeArray()
      .reduce(function(object, item) {
        object[item.name] = item.value;
        return object;
      }, {});
  }

  function displayResult(result) {
    $("#apiOutput").text(JSON.stringify(result, null, 2));
    hljs.highlightBlock(document.getElementById("apiOutput"));
    $("#apiOutputModal").modal("show");
  }
});
