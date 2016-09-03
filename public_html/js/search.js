
g_scannedText = [];
g_scannedTextBuilderPairs = { };
g_scannedTextProjectPairs = { };
g_searchResponseIndex = 0;
g_totalSearchResponses = 0;

function CTextObject(){

    this.m_strText = "";
    this.m_cBoundingCoordinates = [];
    this.m_rHeight = 0;
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

   g_scannedText = [];
   g_scannedTextBuilderPairs = { };
   g_scannedTextProjectPairs = { };
   g_searchResponseIndex = 0;
   g_totalSearchResponses = 0;

   if(textAnnotations == null)
   {
       throwError("No Text recognized");
       return;
   }
   console.log(textAnnotations[0].description);

   var maxHeight = 0;

   for(var index = 0; index < textAnnotations.length; index++){
    if(textAnnotations[index].description.length > 0){


        if(textAnnotations[index].description.toLowerCase() != "sector"
                && textAnnotations[index].description.toLowerCase() != "noida"
                && textAnnotations[index].description.toLowerCase() != "gurgaon"){
            var textObj = new CTextObject();
            textObj.m_strText = textAnnotations[index].description;
            textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[0]);
            textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[1]);
            textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[2]);
            textObj.m_cBoundingCoordinates.push(textAnnotations[index].boundingPoly.vertices[3]);
            textObj.m_rHeight = textObj.m_cBoundingCoordinates[3].y - textObj.m_cBoundingCoordinates[0].y;
            g_scannedText.push(textObj);

            if(index >0 && textObj.m_rHeight > maxHeight){
                maxHeight = textObj.m_rHeight;
            }
        }
    }
    }

//    g_scannedText = g_scannedText.filter( function( item, index, inputArray ) {
//       return inputArray.indexOf(item) == index;
//    });

   var heightFilteredText = [];
   heightFilteredText.push(g_scannedText[0]);
   for(var wordIndex = 1; wordIndex < g_scannedText.length; wordIndex++){
       if(g_scannedText[wordIndex].m_rHeight > 0.0 * maxHeight){
           heightFilteredText.push(g_scannedText[wordIndex]);
       }
   }

   g_scannedText = heightFilteredText;

   alert(g_scannedText.length + ":\n" + g_scannedText[0].m_strText);
   console.log(g_scannedText.length);
   console.log(g_scannedText[0].m_strText);

   g_totalSearchResponses = g_scannedText.length - 1;

   for(var wordIndex = 1; wordIndex < g_scannedText.length; wordIndex++){
       searchProjectInMakan(g_scannedText[wordIndex].m_strText);
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

function searchBuilderInMakan(query) {
    var url = "https://www.makaan.com/columbus/app/v5/typeahead?&typeAheadType=builder\n\
                    &category=buy&view=buyer&query=" + query;


    $.ajax({
        type: "GET",
        url: url,
        data: "",
        success: function(response) {

            g_searchResponseIndex++;

            var data = response.data;
            if(data.length > 0){
                g_scannedTextBuilderPairs[query] = [];
                for(var dataIndex = 0; dataIndex < data.length; dataIndex++){
                     var projObject = new CProjectObject();
                     projObject.m_title = data[dataIndex].displayText;
                     projObject.m_entityID = data[dataIndex].entityId;
                     projObject.m_entityName = data[dataIndex].entityName;
                     projObject.m_builderName = data[dataIndex].builderName;
                     projObject.m_city = data[dataIndex].city;

                     g_scannedTextBuilderPairs[query].push(projObject);

                }

            }

            if(g_searchResponseIndex == g_totalSearchResponses)
            {
                g_searchResponseIndex = 0;
                onBuilderSearchFinish();
                //onProjectSearchFinish();
            }


        }
    });
}

function onBuilderSearchFinish(){

        var alertString = "";
       for(var wordIndex = 1; wordIndex < g_scannedText.length; wordIndex++){
            var query = g_scannedText[wordIndex].m_strText;

            var data = g_scannedTextBuilderPairs[query];
            if(data){
                alertString = alertString + query + ":\n";
            for(var dataIndex = 0; dataIndex < data.length; dataIndex++){

                alertString += data[dataIndex].m_title;
                alertString += "\n"

            }
            }
        }

        for(var wordIndex = 1; wordIndex < g_scannedText.length; wordIndex++){
            searchProjectInMakan(g_scannedText[wordIndex].m_strText);
        }

        console.log(alertString);
        // alert(alertString);
}

function searchProjectInMakan(query) {
    var url = "https://www.makaan.com/columbus/app/v5/typeahead?&typeAheadType=project\n\
                    &rows=50&category=buy&view=buyer&query=" + query;


    $.ajax({
        type: "GET",
        url: url,
        data: "",
        success: function(response) {

            g_searchResponseIndex++;

            var data = response.data;
            if(data.length > 0){
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

            }

            if(g_searchResponseIndex == g_totalSearchResponses)
            {
                onProjectSearchFinish();
            }


        }
    });
}

function onProjectSearchFinish(){

        var alertString = "";
       for(var wordIndex = 1; wordIndex < g_scannedText.length; wordIndex++){
            var query = g_scannedText[wordIndex].m_strText;

            var data = g_scannedTextProjectPairs[query];
            if(data){
                alertString = alertString + query + ":\n";
            for(var dataIndex = 0; dataIndex < data.length; dataIndex++){

                alertString += data[dataIndex].m_title;
                alertString += "\n"

            }
            }
        }
        console.log(alertString);
        alert("ProjectSearch finished")
        //alert(alertString);

        //matchBuilderAndProject();
        //matchProjectToProject();
        matchBuilderProjectTogether();
}

function matchBuilderProjectTogether(){

        var builderArray = [];
        var projectArray = [];

        for(var query in g_scannedTextProjectPairs){

            var projData = g_scannedTextProjectPairs[query];
         loop2 :
             for(var projDataIndex = 0; projDataIndex < projData.length; projDataIndex++){

                 if(projData[projDataIndex].m_builderName.toLowerCase() === query.toLowerCase())
                 {
                     builderArray.push(projData[projDataIndex].m_builderName);
                     //projectArray.push(projData[projDataIndex]);
                     break;
                 }
                 else if(projData[projDataIndex].m_entityName.toLowerCase() === query.toLowerCase())
                 {
                     projectArray.push(projData[projDataIndex]);
                     //break;
                 }
                 else
                 {
//                     var spliceArray = projData[projDataIndex].m_entityName.toLowerCase().split(" ");
//                     for(var spliceIndex = 0; spliceIndex < spliceArray.length; spliceIndex++){
//                         if(spliceArray[spliceIndex] === query.toLowerCase()){
//                             projectArray.push(projData[projDataIndex]);
//                             break loop2;
//                         }
//                     }
                 }
             }
         }
         var builderAlert = "Builders : \n";
         for(var builderIndex = 0; builderIndex < builderArray.length; builderIndex++){
             builderAlert += builderArray[builderIndex] + "\n";
         }

         var projectAlert = "Projects : \n";

         for(var projectIndex = 0; projectIndex < projectArray.length; projectIndex++){
             projectAlert += projectArray[projectIndex].m_entityName + "\n";
         }

        alert(builderAlert);
         console.log(builderAlert);

        alert(projectAlert);
        console.log(projectAlert);

        var finalArray = [];

        if(builderArray.length == 0){

            finalArray = projectArray;

        }else{
            for(var builderIndex = 0; builderIndex < builderArray.length; builderIndex++){
                for(var projectIndex = 0; projectIndex < projectArray.length; projectIndex++){
                    if(builderArray[builderIndex] == projectArray[projectIndex].m_builderName){
                        finalArray.push(projectArray[projectIndex]);
                    }
                }

            }
        }

        var finalProjectAlert = "Final Projects : \n";
        for(var projectIndex = 0; projectIndex < finalArray.length; projectIndex++){
            finalProjectAlert += finalArray[projectIndex].m_builderName + " " +finalArray[projectIndex].m_entityName + "\n";
        }

       alert(finalProjectAlert);
       console.log(finalProjectAlert);

       if(finalArray.length == 0) throwError("No projects found");
       else loadDetails(finalArray);

}


function matchBuilderAndProject(){

    for(var query in g_scannedTextProjectPairs){

        var projData = g_scannedTextProjectPairs[query];

        for(var projDataIndex = 0; projDataIndex < projData.length; projDataIndex++){

            var projBuilder = projData[projDataIndex].m_builderName;

            for(var builderQuery in g_scannedTextBuilderPairs){

                var builderData = g_scannedTextBuilderPairs[builderQuery];

                for(var builderDataIndex = 0; builderDataIndex < builderData.length; builderDataIndex++){

                    if(projBuilder === builderData[builderDataIndex].m_builderName)
                    {
                        var result = builderData[builderDataIndex].m_builderName + " : " + projData[projDataIndex].m_entityName;

                        // alert(result);
                        console.log(result);
                    }

                }

            }

        }
    }
}

function matchProjectToProject(){

    for(var projQuery1 in g_scannedTextProjectPairs){

        var projData1 = g_scannedTextProjectPairs[projQuery1];

        for(var projData1Index = 0; projData1Index < projData1.length; projData1Index++){

            var projName = projData1[projData1Index].m_entityName;

            for(var projQuery2 in g_scannedTextProjectPairs){

                if(projQuery2 != projQuery1){
                var projData2 = g_scannedTextProjectPairs[projQuery2];

                for(var projData2Index = 0; projData2Index < projData2.length; projData2Index++){

                    if(projName === projData2[projData2Index].m_entityName){
                        var result = projData2[projData2Index].m_builderName + " : " + projData2[projData2Index].m_entityName;

                        // alert(result);
                        console.log(result);
                    }

                }
            }
            }

        }
    }

}
