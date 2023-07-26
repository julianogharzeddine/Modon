var baseURL;   // fetching the base URL
var isExecuting = false;

$(document).ready(function () {

    // Fetching the baseURL to use it in subsequent API Calls
    baseURL = window.location.protocol + '//' + window.location.host + '/'


    // Waiting to successfully fetch the categories to start rendering the Sidebar
    initiateSidebar()

    // Creating Notification Icon
    createNotificationIcon()


    // Appending the listeners to the generated categories and subcategories
    $(document).on('click', '.categoryItem', function () {
        var selectionIndex = $(this).data("cat")
        var targetRadio = $('[name="CategoriesDropdown"]').find(`input[type='radio'][value='${selectionIndex}']`)
        targetRadio.trigger('click')
    })

    $(document).on('click', '.subcategoryItem', function () {
        var selectionIndex = $(this).data("subcat")
        var targetRadio = $('[name="SubcategoriesDropdown"]').find(`input[type='radio'][value='${selectionIndex}']`)
        targetRadio.trigger('click')
    })

    $(document).on('click', '#bellicon', function () {
        $('#dropdownContent').toggle()
    })


})

/*  ------------------ SIDEBAR RENDERING ------------------ */

function initiateSidebar() {

    if (isExecuting) {
        // Function is already executing, so just return
        return;
    }

    isExecuting = true;

    fetchMainCategories()
        .then(function (data) {
            renderSidebar(data)
       
        })
        .catch(function (error) {
            console.error(error)
        })
}

function fetchMainCategories() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/ModonServices`,
            dataType: 'json',
            crossDomain: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent("sp_admin" + ':' + "P@ssw0rd"))))
                xhr.setRequestHeader("Content-Type", "application/json charset=UTF-8")
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
            },
            success: function (json_data) {
                resolve(json_data.value)
            },
            error: function () {
                reject('Failed to Load Tasks!')
            }
        })
    })
}

function fetchSubCategories(categoryID) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: `${baseURL}api/odatav4/v4/ModonSubservices`,
            dataType: 'json',
            crossDomain: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent("sp_admin" + ':' + "P@ssw0rd"))))
                xhr.setRequestHeader("Content-Type", "application/json charset=UTF-8")
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
            },
            success: function (json_data) {
                const filtered = json_data.value.filter((subCategory) => {
                    return subCategory.MainServiceID === categoryID
                })
                resolve(filtered)
            },
            error: function () {
                reject('Failed to Load Subcategories!')
            }
        })
    })
}

function renderSidebar(data) {
    
    let currentLang = getLanguage()

    $("[name='Sidebar']").html("")
    $("[name='Sidebar']").append(`<div id="SidebarCategoryWrapper"></div>`)
    data.map((category) => {


        const categoryID = category.ID

        if (category.IsActive == 'true') {

            fetchSubCategories(categoryID)
                .then(function (data) {
                    


                    if (data === []) {
                        $("#SidebarCategoryWrapper").append(
                            `<div class="categoryItemWrapper" >
                        <div class="categoryItem" id="${category.JavaScriptID}" data-cat="${category.ID}">
                  <img src='${category.ServiceImageURL}'>
                  <p class='categoryName'>${currentLang == 'ar-SA' ? category.ServiceNameAR : category.ServiceNameEN}</p>
                </div>
                </div>`
                        )
                    } else {
                        const subCategoriesHTML = data.map((subCategory) => {

                            if (subCategory.IsActive == 'true') {
                                return `<div class="subcategoryItem" id="${subCategory.JavaScriptID}" data-subcat="${subCategory.ID}">
                                <p class='subcategoryName'>${currentLang == 'ar-SA' ? subCategory.SubserviceNameAR : subCategory.SubserviceNameEN}</p>
                              </div>`
                            }

                        }).join('')

                        $("#SidebarCategoryWrapper").append(
                            `<div class="categoryItemWrapper">
                        <div class="categoryItem" id="${category.JavaScriptID}" data-cat="${category.ID}">
                        <img src='${category.ServiceImageURL}'>
                        <p class='categoryName'>${currentLang == 'ar-SA' ? category.ServiceNameAR : category.ServiceNameEN}</p>
                      </div>
                      <div class="subcategoriesWrapper">${subCategoriesHTML}</div>
                      </div>
                      `)
                    }

                    isExecuting = false;
      
                })
                .catch(function (error) {
                    console.error(error)
                })


        }



    })



}



// Dynamically rendering the tasks

function createNotificationIcon() {

    $('.taskDD').remove()

    // Fetching the tasks from the Endpoint 

    $.ajax({
        type: 'GET',
        url: `${baseURL}api/workflow/v1/Tasks`,
        dataType: 'json',
        crossDomain: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + window.btoa(unescape(encodeURIComponent("sp_admin" + ':' + "P@ssw0rd"))))
            xhr.setRequestHeader("Content-Type", "application/json charset=UTF-8")
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
        },
        success: function (json_data) {
            let taskArray = json_data.tasks.filter((task) => {
                return task
            })
            renderTasks(taskArray)
        },
        error: function () {
            alert('Failed to Load Tasks !')
        }
    })

}

function renderTasks(tasks) {

    const taskCount = tasks.length

    $('body').append(`
<div class="taskDD">
    <div>
        <div id="notificationCounter">
            <p id="redCircle">${taskCount}</p>
        </div>
        <img id="bellicon" src="https://srv-k2five/designer/Image.ashx?ImID=170283">
    </div>
    <div id="dropdownContent">
    </div>
</div>`)

    tasks.map((task) => {

        const dateObj = new Date(task.taskStartDate)
        const options = { weekday: 'long' }
        const dayName = new Intl.DateTimeFormat('en-US', options).format(dateObj)
        const firstThreeDigits = dayName.slice(0, 3)


        $('#dropdownContent').append(`
      <a href = "${task.formURL}" target = "_self" >
        <div class="date-icon ">${firstThreeDigits}</div>
        <div class="task-details">
          <h4>${task.activityName}</h4>
          <p>${task.serialNumber}</p>
        </div>
      </a>
`)
    })

}


/* --------------------- TRANSLATION FUNCTION ----------------- */
function getLanguage() {
    return localStorage.getItem('selected_language')
}


/* --------------------------- MISC ----------------------- */
function goTo(href) {
    if (href) {
        window.open(href, "_blank")
    }
}
