function fileSlice(file, start, length){
  var end = length + start;
  if(file.mozSlice){
    return file.mozSlice(start, end);
  }else if(file.webkitSlice){
    return file.webkitSlice(start, end);
  }
};

function hash_file(file, worker,max_size) {
  var i, buffer_size, block, threads, reader, blob, handle_hash_block, handle_load_block;

  handle_load_block = function (event) {
    threads += 1;
    worker.postMessage({
      'message': event.target.result,
      'block'  : block
    });
  };

  handle_hash_block = function (event) {
    threads -= 1;
    if(threads === 0) {
      if(block.end !== max_size) {
        block.start += buffer_size;
        block.end += buffer_size;

        if(block.end > max_size) {block.end = max_size;}
        reader = new FileReader();
        reader.onload = handle_load_block;
        blob = fileSlice(file,block.start, block.end);
        reader.readAsArrayBuffer(blob);
      }
    }
  };

  buffer_size = 1024 * 1024;
  block = {
    'file_size' : max_size,
    'start' : 0
  };

  block.end = buffer_size > max_size ? max_size : buffer_size;
  threads = 0;

  worker.addEventListener('message', handle_hash_block);

  reader = new FileReader();
  reader.onload = handle_load_block;
  blob = fileSlice(file,block.start, block.end);

  reader.readAsArrayBuffer(blob);
};

function handle_worker_event(file) {
  return function (event) {
    if (event.data.result) {
      $.getJSON("/fingerprints/match.json?sha1_code="+event.data.result,function(data){
        if(data['result'] == false){
          readBlob(file);
        };
      });
    };
  };
};


function handle_file_select(CurrentFile) {
  var i, worker;
  workers = [];

  worker = new Worker('/assets/sha_calculator.js');
  worker.addEventListener('message', handle_worker_event(CurrentFile));

  hash_file(CurrentFile, worker,1024*1024);
};

function readBlob(file){
  var MaxSize = 15*1024*1024;
  var start = 0;
  if(file.size >= MaxSize){var stop = MaxSize}else{var stop = file.size-1};

  var reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) {
      $('#loading').hide();
      var StepLength = 9000;
      //console.log(evt.target.result.length/StepLength);
      var LastValue = 0;
      $('#preview_file_slice').val(evt.target.result.substring(LastValue,StepLength));
      $('#preview_file_path').val('');
      $('#new_preview').submit();
    }
  };

  blob = fileSlice(file,1,MaxSize);
  reader.readAsDataURL(blob);
};
