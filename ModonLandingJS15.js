var dictionary; // definining the dictionary
var baseURL;   // fetching the base URL
var redStatus = ["جديد"]
var greenStatus = ["مغلق"]
var orangeStatus = ["منشور"]
var dateIconURL = "https://srv-k2five/Designer/Image.ashx?ImID=110252"
var investStatus = "All"
var searchKeyword = ""

$(document).ready(function () {


    let currentLang = getLanguage()

    // Fetching the baseURL to use it in subsequent API Calls

    baseURL = window.location.protocol + '//' + window.location.host + '/';

    // Add click event listener to each counterCard

    $(document).on("click", ".counterCard", function () {

        // Remove 'Darker' class from all counterCard divs

        $('.counterCard').removeClass('Darker');

        // Add 'Darker' class to the clicked counterCard div

        $(this).addClass('Darker');
    })

    $(document).click(function () {
        setTimeout(function () {
            translateText()
        },1000)

    })

    $(document).on('click', ".dd-container a", function () {
        changeLanguage()
    })

    $(document).on('click', ".dd-container", function () {
        changeLanguage()
    })


    dictionary = [
        { "en-US": "New", "ar-SA": "الجديدة", "fr-FR": "Nouveau" },
        { "en-US": "Active", "ar-SA": "النشطة", "fr-FR": "Actif" },
        { "en-US": "Completed", "ar-SA": "المكتملة", "fr-FR": "Terminé" },
        { "en-US": "Created By", "ar-SA": "انشا من قبل", "fr-FR": "Créé Par" },
        { "en-US": "Investigation Status", "ar-SA": "حالة التحقيق", "fr-FR": "Statut Enquête" },
        { "en-US": "Subject", "ar-SA": "الموضوع", "fr-FR": "Sujet" },
        { "en-US": "out of", "ar-SA": "من", "fr-FR": "de" },
        { "en-US": "Status", "ar-SA": "الحالة", "fr-FR": "Statut" },
        { "en-US": "Our Services", "ar-SA": "خدماتنا المختلفة", "fr-FR": "Nos Services" },
        { "en-US": "Vacancies", "ar-SA": "عرض الطلبات", "fr-FR": "Positions" },
        { "en-US": "Apply", "ar-SA": "إنشاء طلب", "fr-FR": "Presenter" },
        { "en-US": "Reports", "ar-SA": "التقارير", "fr-FR": "Rapports" },
        { "en-US": "Recruitment", "ar-SA": "توظيف", "fr-FR": "Recrutement" },

    ];




    // Showing Investigation Options

    $(document).on('click', '#RecruitmentSubOption', function () {
        // Rendering Investigation buttons which shows the actions that can be taken
        renderInvestOptions()
    })

    // Showing all the investigations in the custom cards

    $(document).on('click', '#showAllVacancies', function () {

        // Creating the request counters

        fetchCounters()
            .then(function (data) {
                renderCounterButtons(data)
            })
            .catch(function (error) {
                console.error(error);
            });


        initiateFetchInvestigations()

        $("[name='ShowVacancies hiddenButton']").trigger("click")

    })


    // Counter cards listeners 


    $(document).on('click', '.counterCard', function () {

        investStatus = $(this).data("status")
        initiateFetchInvestigations()

    })


    // Counter cards listeners 

    $(document).on('input', '[name="SearchBox"]', function () {
        searchKeyword = $(this).val()
        initiateFetchInvestigations()
    })


    // Counter cards listeners 

    $(document).on('click', '.categoryItem', function () {


        let categoryName = $(this).find('.categoryName').text()
        let categoryID = $(this).data("cat")

        if (categoryID != 4) {
            fetchSubCategoriesJoin()
                .then(function (data) {
                    renderSubCategoryCards(data, categoryName, categoryID)
                })
                .catch(function (error) {
                    console.error(error);
                });
        }

    })

    $(document).on('click', '.sectionBrowser .cardItem', function () {
        var selectionIndex = $(this).data("subcat")
        var targetRadio = $('[name="SubcategoriesDropdown"]').find(`input[type='radio'][value='${selectionIndex}']`);
        targetRadio.trigger('click')
    })


    initiateDefaultOptions()
    waitForTranslatorRender()

})

function initiateDefaultOptions() {

    let currentLang = getLanguage()

    fetchSubCategoriesJoin()
        .then(function (data) {

            if (currentLang == 'ar-SA')
                renderSubCategoryCards(data, "الموارد البشرية", 1)
            else
                renderSubCategoryCards(data, "HR", 1)

        })
        .catch(function (error) {
            console.error(error);
        });

}

function initiateFetchInvestigations() {

    // Creating the investigation cards

    fetchInvestigations()
        .then(function (data) {
            waitForInvestWrapperRender(data)
        })
        .catch(function (error) {
            console.error(error);
        });

}

// Wait for the Card Wrapper

function waitForInvestWrapperRender(data) {
    if ($('#card-wrapper').length > 0) {
        renderInvestCards(data);
    } else {
        setTimeout(waitForInvestWrapperRender, 500);
    }
}


// Fetching investigation details 

function fetchInvestigations() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/RequestView_1`,
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
                reject('Failed to Load Investigations!');
            }
        });
    });
}


// Rendering Investigation Cards

function renderInvestCards(data) {

    $('#card-wrapper').html("")
    let filteredResults = 0;

    data.map((investigation) => {

        let status = investigation.Status
        let refNo = investigation.RefNo
        let creationDate = investigation.CreatedOn
        let creator = investigation.CreatedBy
        let subject = investigation.InvestigationSubject

        let containsKeyword =
            refNo.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            creationDate.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            creator.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            subject.toLowerCase().includes(searchKeyword.toLowerCase());

        let targetArray = []

        switch (investStatus) {
            case "Complete":
                targetArray = greenStatus;
                break;
            case "Active":
                targetArray = orangeStatus;
                break;
            case "New":
                targetArray = redStatus;
                break;
            default: targetArray = [];
                break;
        }

        console.log(targetArray)

        if (containsKeyword) {
            if (investStatus == "All" || targetArray.includes(status)) {
                $('#card-wrapper').append(`<div class="cardItem"><div class="cardHeader"><div class="investNoStatusWrap"><div class="status" style="background-color: ${redStatus.includes(status) ? "red" : (orangeStatus.includes(status) ? "orange" : (greenStatus.includes(status) ? "green" : "red"))};"></div><div class="investNo"><a href='https://srv-k2five/Runtime/Runtime/Form/RO.Form/?RefNo=${refNo}'>${refNo}</a></div></div><div class='dateWrapper'><div class="date">${new Date(creationDate).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).split("/").reverse().join("/")}</div><img src='${dateIconURL}' /></div></div><div class="cardBody"><div class="card-rows"><p class="reqCreator labelVal">${creator}</p><p class="reqCreatorLabel labelTitle translatable">انشا من قبل</p></div><div class="card-rows"><p class="reqCreator labelVal">${status}</p><p class="reqCreatorLabel labelTitle translatable">حالة التحقيق</p></div><div class="card-rows"><p class="reqSubject labelVal">${subject}</p><p class="reqSubjectLabel labelTitle translatable">الموضوع</p></div></div></div>`);
                filteredResults++
            }
        }

    })

    if (filteredResults === 0) $('#noInvestigationsFound').text("No Items Found")
    else $('#noInvestigationsFound').text("")

}



// Fetching subcategories

function fetchSubCategoriesJoin() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/ModonJoinedServices`,
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
                reject('Failed to Load Counters !');
            }
        });
    });
}

// Fetching request counters 

function fetchCounters() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/RequestView_1`,
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
                reject('Failed to Load Counters !');
            }
        });
    });
}


// Rendering the counter buttons

function renderCounterButtons(data) {

    let completedNo = 0
    let activeNo = 0
    let newNo = 0
    let totalReq = data.length

    data.map((investigation) => {

        if (redStatus.includes(investigation.Status)) newNo++
        else if (greenStatus.includes(investigation.Status)) completedNo++
        else activeNo++

        totalReq++
    })

    let content = `
  <div class="Complete counterCard" data-status="Complete">
      <p id="completeCounter" class="counterCircle">${completedNo}</p>
      <p class="counterLabel translatable">المكتملة</p>
      <p class="totalcounter"><span class='translatable'>من </span> ${totalReq}</p>
  </div>
  <div class="Active counterCard" data-status="Active">
      <p id="activeCounter" class="counterCircle">${activeNo}</p>
      <p class="counterLabel translatable">النشطة</p>
      <p class="totalcounter"><span class='translatable'>من </span> ${totalReq}</p>
  </div>
  <div class="New counterCard" data-status="New">
      <p id="newCounter" class="counterCircle">${newNo}</p>
      <p class="counterLabel translatable">الجديدة</p>
      <p class="totalcounter"><span class='translatable'>من </span> ${totalReq}</p>
  </div>
  `
    $("#reqCounter").html("")
    $("#reqCounter").append(content)
}


function renderInvestOptions() {

    $("#subOptions").find('.sectionBrowserTitle').remove()
    $("#subOptions").prepend(`<p class="sectionBrowserTitle translatable">توظيف</p>`)

    $('#InvestigationCards').html("")
    $('#InvestigationCards').append(`
  <div class="cardItem" id='showAllVacancies'>
      <img src="https://cdn.jsdelivr.net/gh/julianogharzeddine/ModonImages@main/AllVacancies.jpg" class='titleImage'>
      <p class="cardTitle translatable">عرض الطلبات</p>
  </div>
  <div class="cardItem" onclick="goTo('')">
      <img src="https://cdn.jsdelivr.net/gh/julianogharzeddine/ModonImages@main/NewVacancy.jpg" class='titleImage'>
      <p class="cardTitle translatable">إنشاء طلب</p>
  </div>
  <div class="cardItem"  onclick="goTo('')">
      <img src="https://cdn.jsdelivr.net/gh/julianogharzeddine/ModonImages@main/Reports.jpg" class='titleImage'>
      <p class="cardTitle translatable">التقارير</p>
  </div>
  
  `)
}

// Rendering the SubCategory Cards

function renderSubCategoryCards(data, categoryName, categoryID) {

    let currentLang = getLanguage()

    $(".sectionBrowserTitle").remove()
    $('.sectionBrowser').prepend(`<p class="sectionBrowserTitle">${categoryName}</p>`)

    $('#subcategories-card-wrapper').html("")
    data.map((item) => {
        if (item.MainServiceID === categoryID && item.IsActive == 'true') {
            $('#subcategories-card-wrapper').append(`<div class="cardItem" id="${item.JavaScriptID}" data-subcat="${item.ID}"><img src="${item.SubserviceImageURL}" class='titleImage'><p class="cardTitle">${currentLang == 'ar-SA' ? item.SubserviceNameAR : item.SubserviceNameEN}</p></div>`)
        }

    })

}


function changeLanguage() {

    setTimeout(function () {

        let currentLang = getLanguage()

        if (currentLang == "en-US") {
            translateToEnglish()

        } else if (currentLang == 'ar-SA') {
            translateToArabic()
        }

   
        initiateSidebar()

    }, 1000)

}
function translateToArabic() {
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
    $('.sectionBrowser .sectionBrowserTitle').css('flex-direction', 'row-reverse')
}

function translateToEnglish() {
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
    $('.sectionBrowser .sectionBrowserTitle').css('flex-direction', 'row')
}

function getFromDictionary(text, toLanguage) {
    for (var i = 0; i < dictionary.length; i++) {

        var entry = dictionary[i];

        if (entry["en-US"] === text) return entry[toLanguage];
        if (entry["ar-SA"] === text) return entry[toLanguage];
        if (entry["fr-FR"] === text) return entry[toLanguage];

    }

    return 'Translation not found';
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

function translateText() {
    let toTranslate = $('.translatable')

    toTranslate.each(function () {
        $(this).text(getFromDictionary(($(this).text().trim()), getLanguage()))
    })
}
