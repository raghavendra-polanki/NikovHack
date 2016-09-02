function talkToMakan() {
    var url = "https://makaan.com";
    var data = {
        "member": "data"
    };

    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function(data) {
            console.log(data);
        }
    });
}
