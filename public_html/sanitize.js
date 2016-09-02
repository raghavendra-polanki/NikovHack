
g_scannedText = [];

function CTextObject(){
 
    this.m_strText = "";
    this.m_cBoundingCoordinates = [];
}

function sanitize (data) {
   var scannedJson = JSON.parse(data.body);
   var textAnnotations = scannedJson.responses[0].textAnnotations;
   
   for(var index = 0; index < textAnnotations.length; index++){
    var textObj = new CTextObject();
    textObj.m_strText = textAnnotations[index].description;
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[0]);
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[1]);
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[2]);
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[3]);
    
    g_scannedText.push(textObj);
   }
   alert(g_scannedText[0].m_strText);
   
}
