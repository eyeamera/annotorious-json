var editor;

var init = function() {
  
  /*
    Set the editor
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

  /*
    When the window resizes call save so the annotation
    positions are updated
  */
  window.addEventListener('resize', save);

  /*
    Bind the save button
  */
  document.getElementById('save').addEventListener("click", save);

}


/*
  Called when an annotation is saved or updated
*/
var annotationUpdate =  function(annotation) {

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
  
};


var save = function(e) {

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
