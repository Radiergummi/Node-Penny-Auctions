$(document).ready(function() {
  /**
   * User socket handlers
   */
  socket.on('user.updatePaymentUnits', function(data) {
    $('.user .credits .count').text(data);
  });

  var validationErrors = [];

  /**
   * Toggles the visual edit elements
   */
  $('.edit-profile').on('click', function(event) {
    var form   = $('form.profile'),
        button = $(this);

    toggleEdit(form);

    button.toggleClass('enabled');
    if (button.hasClass('enabled')) {
      button.text('Abbrechen');
    } else {
      button.text('Bearbeiten');
    }

  });


  /**
   * Uploads the profile fields to the server
   */
  $(document).on('click', '.save-profile', function(event) {
    var form          = $('form.profile'),
        inputElements = form.find('input'),
        userData      = new FormData();

    // Validation configuration
    var validationConfig = {
      onElementValidate: function(valid, $el, $form, errorMess) {
        if (!valid) {
          // gather up the failed validations
          errors.push({
            el:    $el,
            error: errorMess
          });
        }
      }
    };

    // reset error array
    validationErrors = [];

    // validate form
    if (!form.isValid(validationConfig, false)) {
      for (var i = 0; i < validationErrors.length; i++) {
        displayErrorMessage(form, validationErrors[ i ]);
      }
    }

    // set empty checkboxes to false
//    for (var i = 0; i < inputElements)

    // append inputs to the form data object
    for (var i = 0; i < inputElements.length; i++) {
      if (inputElements[ i ].type === 'checkbox') {
        var checkbox = inputElements[ i ];
        userData.append(checkbox.id, (checkbox.prop('checked') === true ? 'true' : 'false'));
      }

      if (inputElements[ i ].type === 'file') {
        var fileUpload = inputElements[ i ];

        userData.append(fileUpload.id, fileUpload.files[0]);
        continue;
      }

      userData.append(inputElements[ i ].id, inputElements[ i ].value);
    }


    $.ajax({
      url:         window.location.pathname + '/edit',
      method:      'POST',
      contentType: false,
      processData: false,
      data:        userData,

      error:       function(response, status, thrownError) {
        console.log(response);
        displayErrorMessage(form, response.errorMessage || response.responseText);
      },

      success:     function(data, status, response) {
        toggleEdit(form);
        $('.edit-profile').text('Bearbeiten').removeClass('enabled');
      }
    });
  });


  $(document).on('click', 'form.enabled .upload-overlay', function(event) {
    var button = $(this),
        form   = button.parents('form');

    if ($('#profileImage').length === 0) {
      form.append('<input type="file" id="profileImage" accept="image/*">');
    }

    $('#profileImage').click();
  });


  $(document).on('change', '#profileImage', function(event) {
    if (this.files && this.files[ 0 ]) {
      var reader = new FileReader();
      reader.onload = function(event) {
        $('.profile-picture img').attr('src', event.target.result);
      };
      reader.readAsDataURL(this.files[ 0 ]);
    }
  });


  /**
   * Appends an error message to the message container of the specified form
   *
   * @param form
   * @param error
   */
  function displayErrorMessage (form, error) {
    form.find('.error-messages').append('<div class="message">' + error + '</div>');
  }


  /**
   * toggles the editability for the specified form
   *
   * @param form
   */
  function toggleEdit (form) {
    if (form.hasClass('enabled')) {
      form.removeClass('enabled');
      form.find('input').prop('disabled', true);
      form.find('button.save-profile').remove();
    } else {
      form.addClass('enabled');
      form.find('input').prop('disabled', false);
      form.append('<button type="button" class="save-profile">Speichern</button>');
    }
  }
});
