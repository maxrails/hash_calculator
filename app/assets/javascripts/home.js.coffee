#= require sha_calculator
#= require sha1_calc

$ ->
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob)
    alert('Sorry you browser do not support HTML5')
  $('#preview_file_path').change ->
#    if this.files[0].size/(1024*1024) < 1
#      alert('Please select file with size more then 1 mb')
#    else
    $('#loading').show()
    handle_file_select(this.files[0])
