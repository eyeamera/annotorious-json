var editor;

var init = function() {
  
  /*
    Setup the editor
  */
  editor = ace.edit("json");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/json");
  editor.getSession().setUseSoftTabs(true);
  editor.getSession().setTabSize(2);

  /*
    Call to update the annotation json whenever something
    changes
  */
  anno.addHandler('onAnnotationCreated', annotationUpdate);
  anno.addHandler('onAnnotationUpdated', annotationUpdate);
  anno.addHandler('onAnnotationRemoved', annotationUpdate);

  /*
    When the window resizes call save so the annotation
    positions are updated
  */
  window.addEventListener('resize', save);

  /*
    Bind the save button
  */
  document.getElementById('save').addEventListener("click", save);

  /*
    Bind the upload form
  */
  document.getElementById('fileForm').addEventListener('submit', upload);
}


/*
  Called when an annotation is saved or updated
*/
var annotationUpdate = function(annotation) {

  /*
    Retrieve the annotation objects from annotorious
  */
  var annos = anno.getAnnotations();
  
  var output = [];


  /*
    Loop annotorious' objects and format them to 
    match annotorious' addAnnotation() input object
  */
  for(var i = 0; i < annos.length; i++) {
    output.push({
      src: annos[i].src,
      text: annos[i].text,
      shapes: [{
        type: annos[i].shapes[0].type,
        geometry: annos[i].shapes[0].geometry
      }]
    });
  }

  /*
    Write the output to the editor
  */
  editor.setValue(JSON.stringify(output, null, 2));

  /*
    Make the JSON available for download
  */
  document.getElementById('download').href = "data:text/json," + JSON.stringify(output);

  
};

/*
  Called to save the JSON in the editor and load 
  annotations into annotorious
*/
var save = function() {

  /*
    Load json from editor
  */
  var annos = JSON.parse(editor.getValue());
  
  /*
    Clear annotations 
  */
  anno.removeAll();

  /*  
    Loop the annotations and add the into annotorious
  */  
  for(var i = 0; i < annos.length; i++) {
    anno.addAnnotation(annos[i]);
  }

};

/*
  Handles the upload form submission
  Referenced/Thanks to: http://stackoverflow.com/questions/7346563/loading-local-json-file
*/
var upload = function(e) {

  /*
    Prevent the form from actually submitting
  */
  e.preventDefault();

  /*
    Make sure our browser supports this feature
  */
  if(typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
  }

  /*
    Read the file contents, and callback to 
    uploadComplete() when done
  */
  var input = document.getElementById('fileUpload');
  file = input.files[0];
  fr = new FileReader();
  fr.onload = uploadComplete;
  fr.readAsText(file);

};

/*
  Handles the file upload read completion
*/
var uploadComplete = function(e) {
  /*
    Parse the JSON so we can pretty format it for
    the editor
  */
  var json = JSON.parse(e.target.result);

  /*
    Place the pretty json in the editor
  */
  editor.setValue(JSON.stringify(json, null, 2));

  // These two calls below are bit redundant

  /*
    Call save to load the editor's json into annotorious
  */
  save();

  /*
    Call annotation update to it's available for download
  */  
  annotationUpdate();

}
