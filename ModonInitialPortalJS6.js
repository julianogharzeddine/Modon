var baseURL;   // fetching the base URL
var infoIconURL = "https://cdn.jsdelivr.net/gh/julianogharzeddine/ModonImages@main/InfoIcon.png" // info icon URL
var currentLanguage;

$(document).ready(function () {

    // Setting the current language
    currentLanguage = getLanguage();

    // Fetching the baseURL to use it in subsequent API Calls
    baseURL = window.location.protocol + '//' + window.location.host + '/';


    // Dynamically generating the service tiles

    fetchTiles()
        .then(function (data) {
            // Wait for the card-wrapper div to render successfully
            waitForWrapperRender(data);
        })
        .catch(function (error) {
            console.error(error);
        });


    // Creating the currently hidden modal

    createModal();

    $(document).on('click', ".dd-container", function () {
        changeLanguage()
    })

    
    $(document).on('click', ".dd-container a", function () {
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

   waitForTranslatorHeaderRender()

})

    function waitForWrapperRender(data) {
        if ($('#sectionBrowser').length > 0) {
            renderTiles(data);
        } else {
            setTimeout(waitForWrapperRender, 500);
        }
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

    function renderTiles(data) {

        $('#sectionBrowser').html('')
        $('#sectionBrowser').append('<p class="sectionBrowserTitle" id="OurDepartments">أقسامنا المختلفة</p>')
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
          <p class="cardTitle">${currentLanguage == 'ar-SA' ? tile.ServiceNameAR : tile.ServiceNameEN}</p>
          </div>
        `)
            }

        })
    }

    function goTo(href) {
        if (href) {
            window.open(href, "_self")
        }
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


function changeLanguage() {

    setTimeout(function () {
        var lang = getLanguage()

        if (lang == "en-US") {
            translateToEnglish()
        } else if (lang == 'ar-SA') {
            translateToArabic()
        }

    }, 500)

}




function translateToEnglish() {

    $('.browseDepartmentDetails').text('Department Info')
    $('.empNoWrap').css('flex-direction', 'row')
    $('.empCountLabel').text('members')
    $('#OurDepartments').text('Our Departments')
    $('#IT').text("IT")
    $('#Architecture').text("Architecture")
    $('#Operations').text("Operations")
    $('#Research').text("Research")
    $("#Maintenance").text("Maintenance")
    $('#LegalAffairs').text("Legal Affairs")
    $('.cardTitle').css('transform', 'scale(0.8)')
    $("[name='Sidebar']").css('right', '')
    $("[name='Sidebar']").css('left', '0')
    $(".form").css('right', '')
    $(".form").css('left', '22%')
    $('.taskDD').css('left', '72%')
}

function translateToArabic() {

    $('.browseDepartmentDetails').text('تعرّف على القسم')
    $('.empNoWrap').css('flex-direction', 'row-reverse')
    $('.empCountLabel').text('فردًا في القسم')
    $('#OurDepartments').text('أقسامنا المختلفة')
    $('#IT').text("تكنولوجيا المعلومات")
    $('#Architecture').text("الهندسة")
    $('#Operations').text("العمليات")
    $('#Research').text("الأبحاث")
    $("#Maintenance").text("الصيانة")
    $('#LegalAffairs').text("إدارة القضايا و التحقيقات")
    $('.cardTitle').css('transform', 'scale(1.05)')
    $("[name='Sidebar']").css('left', '')
    $("[name='Sidebar']").css('right', '0')
    $(".form").css('left', '')
    $(".form").css('right', '21%')
    $('.taskDD').css('left', '19%')
}


function translate() {
    let LSLang = localStorage.getItem('selected_language')
    let targetLang = ""

    switch (LSLang) {
        case 'en-US':
            targetLang = 'English'
            $('.taskDD').css('left', '72%')
            $('[name="Sidebar"]').css('right', '')
            $('[name="Sidebar"]').css('left', '0')
            $('.runtime-form').css('left', '')
            $('.runtime-form').css('left', '20%')
            $('.counterCard').css('flex-direction', 'row-reverse')
            $('.dateWrapper').css('flex-direction', 'row-reverse')
            $('.card-rows').css('flex-direction', 'row-reverse')
            $('.cardHeader').css('flex-direction', 'row')
            $('.investNoStatusWrap').css('flex-direction', 'row')
            $('#subcategories-card-wrapper').css('direction', 'ltr')
            $('#card-wrapper').css('direction', 'ltr')
            $('.taskDD a').css('flex-direction', 'row')
            $('.task-details p').css({
                'text-align': 'left',
                'direction': 'rtl'
            })
            $(".task-details h4").css("text-align", "left")
            break
        case 'ar-SA':
            targetLang = 'Arabic'
            $('.taskDD').css('left', '20%')
            $('[name="Sidebar"]').css('left', '')
            $('[name="Sidebar"]').css('right', '0')
            $('[name="Sidebar"]').css('left', '')
            $('.runtime-form').css('left', '5%')
            $('.counterCard').css('flex-direction', 'row-reverse')
            $('.dateWrapper').css('flex-direction', 'row')
            $('.card-rows').css('flex-direction', 'row-reverse')
            $('.cardHeader').css('flex-direction', 'row')
            $('.investNoStatusWrap').css('flex-direction', 'row')
            $('#subcategories-card-wrapper').css('direction', 'rtl')
            $('#card-wrapper').css('direction', 'rtl')
            $('.taskDD a').css('flex-direction', 'row-reverse')
            $('.task-details p').css({
                'text-align': 'right',
                'direction': 'ltr'
            })
            $(".task-details h4").css("text-align", "right")
            break
        case 'fr-FR':
            targetLang = 'French'
            $('.taskDD').css('right', '72%')
            $('[name="Sidebar"]').css('right', '')
            $('[name="Sidebar"]').css('left', '0')
            $('.runtime-form').css('left', '')
            $('.runtime-form').css('left', '20%')
            $('.counterCard').css('flex-direction', 'row-reverse')
            $('.card-rows').css('flex-direction', 'row-reverse')
            $('.cardHeader').css('flex-direction', 'row')
            $('.dateWrapper').css('flex-direction', 'row')
            $('#subcategories-card-wrapper').css('direction', 'ltr')
            $('#card-wrapper').css('direction', 'ltr')
            $('.taskDD a').css('flex-direction', 'row')
            $('.task-details p').css({
                'text-align': 'left',
                'direction': 'rtl'
            })
            $(".task-details h4").css("text-align", "left")
            break
    }

    let toTranslate = $('.translatable')

    toTranslate.each(function () {
        $(this).text(getFromDictionary(($(this).text().trim()), targetLang))
    })
}

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


function getLanguage() {
    return localStorage.getItem('selected_language')
}

function waitForTranslatorHeaderRender() {
    if ($('.dd-select').length > 0) {
        $('.dd-select').click()
    } else {
        setTimeout(waitForTranslatorHeaderRender, 50);
    }
}
