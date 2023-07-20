var baseURL;   // fetching the base URL
var dictionary ;
var infoIconURL = "https://cdn.jsdelivr.net/gh/julianogharzeddine/ModonImages@main/InfoIcon.png" // info icon URL

$(document).ready(function () {

    // Translating the Page On Load

    dictionary = [
        { "en-US": "Our Departments", "ar-SA": "أقسامنا المختلفة", "fr-FR": "Departements" }
    ];

    // Fetching the baseURL to use it in subsequent API Calls
    baseURL = window.location.protocol + '//' + window.location.host + '/';


    // Initializing Tile Render
    initializeTiles()

    $(document).on('click', ".dd-container a", function () {
        changeLanguage()
    })

    $(document).on('click', ".dd-container", function () {
        changeLanguage()
    })

    $(document).on("click", "[name*='AddService']", function () {
        $('.runtime-content').css('opacity', '0.6')
        $('#modal').css('display', 'block')
    })

    $(document).on("click", "#closeModal", function () {
        $('.runtime-content').css('opacity', '1')
        $('#modal').css('display', 'none')
    })


    $(document).on("click", "#addService", function () {
        $('.runtime-content').css('opacity', '1')
        $('#modal').css('display', 'none')
    })


    $(document).on("click", "#addService", function () {

        let serviceName = $("#serviceName").val()
        let serviceLink = $("#serviceLink").val()


        renderNewService(serviceName, serviceLink)

        $("#serviceName").val("")
        $("#serviceLink").val("")
    })

    // Translating the Page On Load

    waitForTranslatorRender();

})


/* ------------------------------ TILE RENDERING ------------------------- */

function initializeTiles() {
    // Dynamically generating the service tiles

    fetchTiles()
        .then(function (data) {
            // Wait for the card-wrapper div to render successfully
            waitForTileWrapperRender(data);
        })
        .catch(function (error) {
            console.error(error);
        });

}

function fetchTiles() {

    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/ModonSections`,
            dataType: 'json',
            crossDomain: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent("sp_admin" + ':' + "P@ssw0rd"))));
                xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            },
            success: function (json_data) {
                resolve(json_data.value);
            },
            error: function () {
                reject('Failed to Load Service Tiles!');
            }
        });
    });
}

function waitForTileWrapperRender(data) {
    if ($('#sectionBrowser').length > 0) {
        renderTiles(data);
    } else {
        setTimeout(waitForTileWrapperRender, 500);
    }
}

function renderTiles(data) {

    let currentLang = getLanguage()

    $('#sectionBrowser').html('')
    $('#sectionBrowser').append('<p class="sectionBrowserTitle translatable" >أقسامنا المختلفة</p>')
    $("#sectionBrowser").append("<div id='card-wrapper'></div>")

    data.map((tile) => {

        if (tile.IsActive == 'true') {
            $("#card-wrapper").append(`
      <div class="cardItem"  id="${tile.JavaScriptID}" onclick="goTo('${tile.ServiceURL ?? ""}')">
      <div class="infoIconContainer">
      <img src="${infoIconURL}"
        class='infoIcon'>
      </div>
      <img src="${tile.ServiceImage}" class='titleImage'>
      <p class="cardTitle">${currentLang == 'ar-SA' ? tile.ServiceNameAR : tile.ServiceNameEN}</p>
      </div>
    `)
        }

    })

    translateText(currentLang)
}

function goTo(href) {
    if (href) {
        window.open(href, "_self")
    }
}



/* ---------------------- TRANSLATION FUNCTIONS ---------------------------*/

function changeLanguage() {

    setTimeout(function () {

        let currentLang = getLanguage()

        if (currentLang == "en-US") {
            translateToEnglish()

        } else if (currentLang == 'ar-SA') {
            translateToArabic()
        }

        initializeTiles()
        initiateSidebar()

    }, 1000)

}


function translateToEnglish() {
    $('.cardTitle').css('transform', 'scale(0.8)')
    $("[name='Sidebar']").css('right', '')
    $("[name='Sidebar']").css('left', '0')
    $(".form").css('right', '')
    $(".form").css('left', '22%')
    $('.taskDD').css('left', '72%')
    $('.taskDD a').css('flex-direction', 'row')
    $('.task-details p').css({
        'text-align': 'left',
        'direction': 'rtl'
    })
    $(".task-details h4").css("text-align", "left")
}

function translateToArabic() {
    $('.cardTitle').css('transform', 'scale(1.05)')
    $("[name='Sidebar']").css('left', '')
    $("[name='Sidebar']").css('right', '0')
    $(".form").css('left', '')
    $(".form").css('right', '21%')
    $('.taskDD').css('left', '19%')
    $('.taskDD a').css('flex-direction', 'row-reverse')
    $('.task-details p').css({
        'text-align': 'right',
        'direction': 'ltr'
    })
    $(".task-details h4").css("text-align", "right")
}

function getLanguage() {
    return localStorage.getItem('selected_language')
}

function waitForTranslatorRender() {
    if ($('.dd-container').length > 0) {
        $('.dd-container').click()
        $('.dd-container').click()
    } else {
        setTimeout(waitForTranslatorRender, 1000);
    }
}

function translateText(targetLang){
    let toTranslate = $('.translatable')

    toTranslate.each(function () {
        $(this).text(getFromDictionary(($(this).text().trim()), targetLang))
    })

}

function getFromDictionary(text, toLanguage) {
    for (var i = 0; i < dictionary.length; i++) {

        var entry = dictionary[i];

        if (entry.English === text) return entry[toLanguage];
        if (entry.Arabic === text) return entry[toLanguage];
        if (entry.French === text) return entry[toLanguage];

    }

    return 'Translation not found';
}
// Currently Disabled

function createModal() {
    $('body').append(`
<div id="modal">
<div id="modalHeader">
    <img src="https://cdn.jsdelivr.net/gh/julianogharzeddine/CustomFiles@main/lettre-x.png" id="closeModal">
</div>
<div id="modalBody">
    <img src="https://cdn.jsdelivr.net/gh/julianogharzeddine/CustomFiles@main/newServiceIllustration.png"
        id="modalIllustration">
    <div id="controlsDiv">
        <p class="modalLabel translatable">إسم الخدمة</p>
        <input type="text" class='input' id="serviceName" />
        <div class="modalLabel translatable">رابط الخدمة</div>
        <input type="text" class='input' id="serviceLink" />
        <div id="addService" class="translatable">إضافة</div>
    </div>
</div>
</div>
`)
}

function renderNewService(serviceName) {
    $('#card-wrapper').append(
        `<div class="cardItem" onclick="goTo('https://srv-k2five/Designer/Runtime/Form/LandingPage/')">
     <div class="infoIconContainer">
        <img src="https://srv-k2five/Designer/Runtime/File.ashx?_path=gj%2FkK8xKydFGIaBuABcSOduRX2c%3D%5Cinformation-button.png&_filerequestdata=_4XeJqbaWuJp0syOgJHEA8of-kLRzEyrnXA94YOkjasqBnsOTQgJXJ-Ybt28RDf8-rNsOJTV6GFCRJMwfDiB-T1qyY65WRx0Csth2wTf9JOReKkiiOYspbS7vEwYNJBIywx1kBd-LFpHYtIPS0xUdrkixdScIEVBKIgcyqXW3WD2a1CNZt1TjOmkHTF0prdAe6Kyil_9PHynI0KFBGfxlSpFuMC_LFnUMkZaxgfFrVy1zuKMnYwsZLNdUnn1Fg3F02l-Z5JDdXl-ChygqFDt0QT0TpYjnxCCkjbfYOS8_pU1&_height=32&_width=32&_controltype=image&XSRFToken=4399624675727584330"
            class='infoIcon'>
    </div>
        <img src="https://cdn.jsdelivr.net/gh/nourkhansa20/CustomFiles@main/mangment.jpg" class='titleImage'>
        <p class="cardTitle" id='LegalAffairs'>${serviceName}</p>
    </div>`)

}

