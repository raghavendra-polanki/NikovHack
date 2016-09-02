
g_scannedText = [];
g_scannedTextProjectPairs = { };

function CTextObject(){
 
    this.m_strText = "";
    this.m_cBoundingCoordinates = [];
}

function CProjectObject(){
    this.m_title = "";
    this.m_entityName = "";
    this.m_entityID = "";
    this.m_builderName = "";
    this.m_city = "";
}
function sanitize (data) {
   var scannedJson = JSON.parse(data.body);
   var textAnnotations = scannedJson.responses[0].textAnnotations;
   
   if(textAnnotations == null)
   {
       alert("No Text recognized");
       return;
   }
   
   for(var index = 0; index < textAnnotations.length; index++){
    var textObj = new CTextObject();
    textObj.m_strText = textAnnotations[index].description;
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[0]);
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[1]);
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[2]);
    textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[3]);
    
    g_scannedText.push(textObj);
    
   }
   alert(g_scannedText.length);
   
   for(var wordIndex = 0; wordIndex < g_scannedText.length; wordIndex++){
       searchInMakan(g_scannedText[wordIndex]);
   }
   
}

function talkToMakan() {
    var url = "https://www.makaan.com/columbus/app/v5/typeahead?query=tulip%20ivory&typeAheadType=project&city=&usercity=Gurgaon&rows=5&category=buy&view=buyer&sourceDomain=Makaan&format=json";
    var data = {
        "member": "data"
    };

    $.ajax({
        type: "GET",
        url: url,
        data: "",
        success: function(data) {
            console.log(data);
        }
    });
}

function searchInMakan(query) {
    var url = "https://www.makaan.com/columbus/app/v5/typeahead?&typeAheadType=project\n\
                    &category=buy&view=buyer&query=" + query;


    $.ajax({
        type: "GET",
        url: url,
        data: "",
        success: function(response) {
            
            var data = response.data;
            g_scannedTextProjectPairs[query] = [];
            for(var dataIndex = 0; dataIndex < data.length; dataIndex++){
                 var projObject = new CProjectObject();
                 projObject.m_title = data[dataIndex].displayText;
                 projObject.m_entityID = data[dataIndex].entityId;
                 projObject.m_entityName = data[dataIndex].entityName;
                 projObject.m_builderName = data[dataIndex].builderName;
                 projObject.m_city = data[dataIndex].city;
                 
                 g_scannedTextProjectPairs[query].push(projObject);
                 
            }
            
            var alertString = query + ":\n";
            
            for(var dataIndex = 0; dataIndex < data.length; dataIndex++){
                
                alertString += g_scannedTextProjectPairs[query][dataIndex].m_title;
                alertString += "\n"

            }
            
            alert(alertString);
            
            
        }
    });
}
