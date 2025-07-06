$(document).ready(function(){
  $('.select2').select2();
  $(".datepicker2").datepicker({
    //dateFormat: "dd-mm-yy",
    dateFormat: "DD, MM dd, yy",
    changeMonth: true,
    changeYear: true,
    onSelect: function(dateText) {
              // Update the selected date div with the chosen date
     $(".selected-date").text(dateText);
    }
});
$('.data_Table').DataTable();
// Event handler for when the Select2 dropdown is opened
$('.select_emp2').on('select2:open', function (e) {
  // Add custom class to the Select2 container
  $('.select2-container.select2-container--default.select2-container--open').addClass('emp2_custom');
});

$(".datepicker").datepicker({
  //dateFormat: "dd-mm-yy",
    dateFormat: "M d, yy",
    changeMonth: true,
    changeYear: true
});

$('#backpage').click(function() {
  window.history.back();
});

});

  