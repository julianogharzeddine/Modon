
$(document).ready(function(){
    
    const currentURL = window.location.href;
    const searchKeyword = "RuntimeAR";
    
    if (currentURL.includes(searchKeyword)) {
        $(`div[name*=Card] .panel-header-wrapper .panel-header-text,div[name*=Card] .grid-header-wrapper .grid-header-text`).css('text-align' , 'right')
    } else {
        $(`div[name*=Card] .panel-header-wrapper .panel-header-text,div[name*=Card] .grid-header-wrapper .grid-header-text`).css('text-align' , 'left')
    }
    

});

function changeLang(){
    var lang = localStorage.getItem("selected_language")
    if (lang == "ar-SA") {
        $(".row:has(div[name*=Card])").css("flex-direction", "row-reverse");
              $('.file-info-cell').find('div.file-watermark').text("إضغط هنا لتحميل ملف")
    } else {
        $(".row:has(div[name*=Card])").css("flex-direction", "row");
        $('.file-info-cell').find('div.file-watermark').text("Click here to attach a file")
    }
    }
    function waitForWrapperRenderForLang() {
        var s = $('.dd-container'); if (s.length > 0) {
            $(".dd-container a").on("click", () => changeLang())
            setTimeout(() => {
                $(".dd-selected").trigger("click")
                $(".dd-selected").trigger("click")
            }, 500);
        } else { setTimeout(waitForWrapperRenderForLang, 300); }
    }
