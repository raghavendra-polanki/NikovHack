function submitNumber() {
    // console.log($(".contact-input-wrapper .input").val());
    if($(".contact-input-wrapper .input").val() && $(".contact-input-wrapper .input").val() > 1000500090) {
        $(".contact-input-wrapper").fadeOut(100);
        $(".contact-input-wrapper.contact-response").fadeIn(100);
    }
}

function openModal(id) {
    $("#" + id).fadeIn(200);
}

function closeModal(id) {
    $("#" + id).fadeOut(200);
}

function switchToTab(id) {
    // $("#tab" + id).fadeIn(0);
    // for (var i = 1; i <= 3; i++)
    //     if(id != i) $("#tab" + i).fadeOut(200);

    $("#tab1, #tab2, #tab3").fadeOut(100);
    $("#tab" + id).fadeIn(100);

    // if(id == 2) $("#tab2").fadeIn(200)
    $(".tab-controller-wrapper span").removeClass('filled');
    $(".tab-controller-wrapper span:nth-of-type(" + id + ")").addClass('filled');
}
