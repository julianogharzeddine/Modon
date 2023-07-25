var bool = false;
var currentURL;

$(document).ready(function () {

    currentURL = window.location.href;

    const searchKeyword = "RuntimeAR";

    if (currentURL.includes(searchKeyword)) {

        setTimeout( function() {
         $(`div[name*=Card] .panel-header-wrapper .panel-header-text,div[name*=Card] .grid-header-wrapper .grid-header-text`).css('text-align', 'right')
         $('.styling-font').css('margin-left' , '1px')
         $('.styling-font').css('margin-right' , '0px')
        },2000)
      
    } else {
  setTimeout( function() {
         $(`div[name*=Card] .panel-header-wrapper .panel-header-text,div[name*=Card] .grid-header-wrapper .grid-header-text`).css('text-align', 'left')
         $('.styling-font').css('margin-left' , '1px')
         $('.styling-font').css('margin-right' , '3px')
        },2000)
     

    }

    $("[name='EnglishFlag']").on("click", function () {
        updateURL("EnglishFlag");
    });

    $("[name='ArabicFlag']").on("click", function () {
        updateURL("ArabicFlag");
    });

});

// Function to update the URL based on flag clicks
function updateURL(keyword) {
    const currentURL = window.location.href;
    let newURL;

    if (keyword === "EnglishFlag") {
        if (currentURL.includes("RuntimeAR")) {
            newURL = currentURL.replace("RuntimeAR", "Runtime");
        }

    } else if (keyword === "ArabicFlag") {
        if (!currentURL.includes("RuntimeAR")) {
            newURL = currentURL.replace("Runtime", "RuntimeAR");
        }


    }

    // Change the URL and immediately go to the new URL in the same tab
    if (newURL) {
        window.location.replace(newURL);
    }
}

//function changeLang() {
//    var lang = localStorage.getItem("selected_language")
//    if (lang == "ar-SA") {
//        $(".row:has(div[name*=Card])").css("flex-direction", "row-reverse");
//        $('.file-info-cell').find('div.file-watermark').text("إضغط هنا لتحميل ملف")
//    } else {
//        $(".row:has(div[name*=Card])").css("flex-direction", "row");
//        $('.file-info-cell').find('div.file-watermark').text("Click here to attach a file")
//    }
//}
//function waitForWrapperRenderForLang() {
//    var s = $('.dd-container'); if (s.length > 0) {
//        $(".dd-container a").on("click", () => changeLang())
//        setTimeout(() => {
//            $(".dd-selected").trigger("click")
//            $(".dd-selected").trigger("click")
//        }, 500);
//    } else { setTimeout(waitForWrapperRenderForLang, 300); }
//}
