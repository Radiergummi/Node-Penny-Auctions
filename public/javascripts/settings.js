$(document).ready(function () {
  $(document).on('submit', 'form.save-settings', function (event) {
    event.preventDefault();

    var form = $(this),
        inputElements = form.find('input'),
        userData = new FormData();

    // append inputs to the form data object
    for (var i = 0; i < inputElements.length; i ++) {
      if (inputElements[ i ].type === 'checkbox') {
        var checkbox = inputElements[ i ];
        userData.append(checkbox.id, (checkbox.checked === true ? 'true' : 'false'));
      }

      if (inputElements[ i ].type === 'file') {
        var fileUpload = inputElements[ i ];

        userData.append(fileUpload.id, fileUpload.files[ 0 ]);
        continue;
      }

      userData.append(inputElements[ i ].id, inputElements[ i ].value);
    }

    $.ajax({
      url:         window.location.pathname + '/edit',
      method:      'POST',
      data:        userData,
      contentType: false,
      processData: false,

      error: function (response, status, thrownError) {
        console.log(response);
        displayErrorMessage(form, JSON.parse(response).errorMessage);
      },

      success: function (data, status, response) {
      }
    });
  });
});
