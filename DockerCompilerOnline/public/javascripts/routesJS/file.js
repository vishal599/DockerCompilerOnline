var count=0;
var noOfFiles;
var socket = io();
socket.on('foo', function(filename){
  let buttonId = filename.split('.').join('_');
  $('#'+buttonId).attr('class', 'btn btn-success');
  $('#'+buttonId).prop('disabled', false);
  // console.log(buttonId);
  count++;
  if(count==noOfFiles){
    count=0;
    $('#loader2').hide();
  }
})

$("form#direct").submit(function(event){

  event.preventDefault();
  event.stopPropagation();
  var formData = new FormData(this);
  formData.append('socket', socket.id);
  $('#loader2').show();

  $.ajax({
    url: 'http://localhost:3000/code/file',
    data : formData,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function(data){
      //TODO : open and close socket connection
    }
  }).fail(function(err){
    console.log(err)
  });
});

function myFunction(){
  $("#filesInfoGrid").empty();
  filesGridUpdate('#file-to-upload')
  $('#file-to-upload').next().after().text($('#file-to-upload').val().split('\\').slice(-1)[0]);
}

function filesGridUpdate(filesInput){
  noOfFiles=0;
  $.each($(filesInput).prop("files"), function(k,v){

    noOfFiles++;
    let filename = v['name'];
    let outputFile = filename+'-out.txt';
    let buttonId = outputFile.split('.').join('_');

    let test = "<form action='/code/download' method='POST' >"+
    "<div class='input-group mb-3'>"+
    "<input type='text' class='form-control' value='"+filename+"' disabled>"+
    "<input type='hidden' value='"+outputFile+"' name='id'/>"+
    "<div class='input-group-append'>"+
    "<button class='btn btn-outline-secondary' id='"+buttonId+"' type='submit' disabled>Download</button>"+
    "</div>"+
    "</div>"+
    "</form>";

    ($(test))//, {class:"col-sm-8", id:"name"+i}))
    .appendTo("#filesInfoGrid");
  });
}
