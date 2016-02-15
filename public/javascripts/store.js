/*
 global $
 */

$(document).ready(function () {
  $('.item .meta .product-time-left').each(function (index) {
    var element = $(this);

    element.countdown({
      date:   element.data('time-to-start'),
      render: function (data) {
        this.el.innerHTML = this.leadingZeros(data.hours) + ':' +
            this.leadingZeros(data.min) + ':' +
            this.leadingZeros(data.sec);
      }
    });
  });
});
