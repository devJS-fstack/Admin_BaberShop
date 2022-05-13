
navheader.style.display = 'none'

const upload_element = document.querySelector('.avatar-uploader');
const upload_input = document.querySelector('.el-upload__input');
const upload_dragger = document.querySelector('.el-upload-dragger');
const clearImg_upload = document.querySelector('.avatar-uploader__trash');

//  function log err
const div_category = document.querySelectorAll('.adm-form-item .el-form-item');
const err_div = document.querySelectorAll('.adm-form-item__error')
function errInputCategory(index, text) {
    div_category[index].classList.remove('is-success');
    div_category[index].classList.add('is-error');
    err_div[index].textContent = text;
}

function successInputCategory(index, text) {
    div_category[index].classList.add('is-success');
    div_category[index].classList.remove('is-error');
    err_div[index].textContent = text;
}
// variable to add employee
var haveImg = false;
var idstore_add = -1;
var idmanager;

//  input

const inputSurName = document.getElementById('input-surname-employee__add');
const inputNameEmployee = document.getElementById('input-name-employee__add');
const inputStore = document.querySelector('#input-store-employee__add');
const inputManager = document.querySelector('#input-manager-employee__add');
const inputCCCD = document.querySelector('#input-cccd-employee__add');
const inputEmail = document.querySelector('#input-email-employee__add');
const inputPhone = document.querySelector('#input-phone-employee__add');
const inputSex = document.querySelector('#input-sex-employee__add');
const inputService = document.querySelector('#input-service_assign__add');

upload_element.onclick = (e) => {
    upload_input.click();
    upload_input.onchange = () => {
        isUpload = true;
        var upload_img = "";
        const file = upload_input.files[0];
        upload_img = URL.createObjectURL(file)
        upload_dragger.innerHTML = `
        <div class="uploaded-photo-preview">
            <img src="${upload_img}" alt="">
        </div>
        `
        haveImg = true;
        clearImg_upload.style.display = 'block';
    }
}

clearImg_upload.onclick = () => {
    upload_dragger.innerHTML = `
    <div class="el-upload-dragger__upload">
    <div>
        <i
            class="el-icon-upload fa-solid fa-cloud-arrow-up"></i>
        <div class="el-upload__text mt-2">
            Nhấn vào để tải ảnh lên
        </div>
    </div>
</div>
        `
    clearImg_upload.style.display = 'none';
    haveImg = false;
}


// handle dropdown

const dropDown_storeEmployee = document.querySelector('#dropdown-store__employee');
const dropDown_managersEmployee = document.querySelector('#dropdown-managers__employee');
const dropDown_sexEmployee = document.querySelector('#dropdown-sex__employee');
const dropDown_servicesEmployee = document.querySelector('#dropdown-services__employee');
const arrows_down = document.querySelectorAll('.el-select__caret');
const itemDropdown_store = document.querySelectorAll('.item-store__dropdown');
const itemDropdown_managers = document.querySelectorAll('.item-managers__dropdown');
const itemDropdown_sex = document.querySelectorAll('.item-sex__dropdown');
const itemDropdown_service = document.querySelectorAll('.item-service__dropdown');


// variable scroll 
var scrollStore = 450;
var scrollManager = 450;
var scrollSex = 545;
var scrollService = 354;
const modalAddEmployee = document.querySelector('#add-employee_modal')

// input click 
inputStore.onclick = () => {
    if (dropDown_storeEmployee.getAttribute('style') == 'min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none;') {
        arrows_down[0].style.transform = 'rotate(0deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollStore}px; left: 400px;display:block;`
    }
    else {
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none`
    }
}

inputManager.onclick = () => {
    if (dropDown_managersEmployee.getAttribute('style') == 'min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[1].style.transform = 'rotate(0deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollManager}px; left: 883px;display:block;`
    }
    else {
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputSex.onclick = () => {
    if (dropDown_sexEmployee.getAttribute('style') == 'min-width: 260px; transform-origin: center bottom; z-index: 2030; display: none;') {
        arrows_down[2].style.transform = 'rotate(0deg)';
        dropDown_sexEmployee.style = `min-width: 260px; transform-origin: center top; z-index: 2026; position: fixed; top: ${scrollSex}px; right: 200px;display:block;`
    }
    else {
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropDown_sexEmployee.style = `min-width: 260px; transform-origin: center bottom; z-index: 2030; display: none`
    }
}

inputService.onclick = () => {
    if (dropDown_servicesEmployee.getAttribute('style') == 'min-width: 920px; transform-origin: center bottom; z-index: 2026; display: none;') {
        arrows_down[3].style.transform = 'rotate(0deg)';
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollService}px; right: 204px;display:block;`
    }
    else {
        arrows_down[3].style.transform = 'rotate(180deg)';
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

// oninput text
inputSurName.oninput = () => {
    if (inputSurName.value == '') {
        errInputCategory(1, 'Bạn vui lòng nhập họ của nhân viên')
    } else {
        successInputCategory(1, '')
    }
}

inputNameEmployee.oninput = () => {
    if (inputNameEmployee.value == '') {
        errInputCategory(2, 'Bạn vui lòng nhập tên của nhân viên')
    } else {
        successInputCategory(2, '')
    }
}

inputCCCD.oninput = () => {
    inputCCCD.value = inputCCCD.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (inputCCCD.value == '') {
        errInputCategory(6, 'Bạn vui lòng nhập CCCD/CMND của nhân viên')
    } else {
        successInputCategory(6, '')
    }
}

inputEmail.oninput = () => {
    if (inputEmail.value == '') {
        errInputCategory(8, 'Bạn vui lòng nhập email của nhân viên')
    } else {
        successInputCategory(8, '')
    }
}

inputPhone.oninput = () => {
    inputPhone.value = inputPhone.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    if (inputPhone.value == '') {
        errInputCategory(9, 'Bạn vui lòng nhập số điện thoại của nhân viên')
    } else {
        successInputCategory(9, '')
    }
}


// modal scroll

modalAddEmployee.onscroll = function () {
    var scrollTop = modalAddEmployee.scrollTop;
    scrollStore = 450 - scrollTop;
    scrollManager = 450 - scrollTop;
    scrollSex = 545 - scrollTop;
    scrollService = 354 - scrollTop;
    if (dropDown_storeEmployee.style.display == 'block') {
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollStore}px; left: 400px;display:block;`
    }
    if (dropDown_managersEmployee.style.display == 'block') {
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollManager}px; left: 883px;display:block;`
    }
    if (dropDown_sexEmployee.style.display == 'block') {
        dropDown_sexEmployee.style = `min-width: 260px; transform-origin: center bottom; z-index: 2030; display: none`
    }
    if (dropDown_servicesEmployee.style.display == 'block') {
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center top; z-index: 2030; position: fixed; top: ${scrollService}px; right: 204px;display:block;`
    }

}


//  event onmouse

let isOver_store = false;
let isOver_manager = false;
let isOver_sex = false;
let isOver_serive = false;

dropDown_storeEmployee.onmouseover = function () {
    isOver_store = true;
}

dropDown_storeEmployee.onmouseleave = function () {
    isOver_store = false;
}

dropDown_managersEmployee.onmouseover = function () {
    isOver_manager = true;
}

dropDown_managersEmployee.onmouseleave = function () {
    isOver_manager = false;
}

dropDown_sexEmployee.onmouseover = function () {
    isOver_sex = true;
}

dropDown_sexEmployee.onmouseleave = function () {
    isOver_sex = false;
}

dropDown_servicesEmployee.onmouseover = function () {
    isOver_serive = true;
}

dropDown_servicesEmployee.onmouseleave = function () {
    isOver_serive = false;
}
inputStore.onfocusout = () => {
    if (!isOver_store) {
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none`
    }
}

inputManager.onfocusout = () => {
    if (!isOver_manager) {
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

inputSex.onfocusout = () => {
    if (!isOver_sex) {
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropDown_sexEmployee.style = `min-width: 260px; transform-origin: center bottom; z-index: 2030; display: none`
    }
}

inputService.onfocusout = () => {
    if (!isOver_serive) {
        arrows_down[3].style.transform = 'rotate(180deg)';
        dropDown_servicesEmployee.style = `min-width: 920px; transform-origin: center bottom; z-index: 2026; display: none`
    }
}

// variable click item dropdown

var indexPreStore = -1;
var indexPreManager = -1;
var indexPreSex = -1;
let countService = 0;
const spans_store = document.querySelectorAll('.item-store__dropdown span');
const spans_manager = document.querySelectorAll('.item-managers__dropdown span');
const spans_sexs = document.querySelectorAll('.item-sex__dropdown span');
const spans_service = document.querySelectorAll('.item-service__dropdown span');


// event click item dropdown

itemDropdown_store.forEach((item, index) => {
    item.onclick = function () {
        if (indexPreStore != -1) {
            itemDropdown_store[indexPreStore].classList.remove('selected');
        }
        inputStore.value = spans_store[index].textContent.trim();
        arrows_down[0].style.transform = 'rotate(180deg)';
        dropDown_storeEmployee.style = `min-width: 492.575px; transform-origin: center top; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPreStore = index;
        idstore_add = item.getAttribute('data-store');
    }
})

itemDropdown_managers.forEach((item, index) => {
    item.onclick = function () {
        if (indexPreManager != -1) {
            itemDropdown_managers[indexPreManager].classList.remove('selected');
        }
        inputManager.value = spans_manager[index].textContent.trim();
        arrows_down[1].style.transform = 'rotate(180deg)';
        dropDown_managersEmployee.style = `min-width: 450px; transform-origin: center bottom; z-index: 2026; display: none`
        item.classList.add('selected');
        indexPreManager = index;
        idmanager = item.getAttribute('data-manager');
    }
})

itemDropdown_sex.forEach((item, index) => {
    item.onclick = function () {
        if (indexPreSex != -1) {
            itemDropdown_sex[indexPreSex].classList.remove('selected');
        }
        inputSex.value = spans_sexs[index].textContent.trim();
        arrows_down[2].style.transform = 'rotate(180deg)';
        dropDown_sexEmployee.style = `min-width: 260px; transform-origin: center bottom; z-index: 2030; display: none`
        item.classList.add('selected');
        indexPreSex = index;
    }
})
var indexFirstChecking = -1;
var indexIsChecking = -1;
function getIndexIsChecking() {
    for (var i = 0; i < itemDropdown_service.length; i++) {
        if (itemDropdown_service[i].classList.contains('selected')) {
            indexIsChecking = i;
            break;
        }
    }
}
const tags_service = document.querySelector('.el-select__tags span');
var countClick = 0;
itemDropdown_service.forEach((item, index) => {
    item.onclick = () => {
        inputService.value = " ";
        inputService.placeholder = "";
        inputService.focus();
        countClick++;
        if (countClick == 1) {
            indexFirstChecking = index;
        }
        if (item.classList.contains('selected')) {
            item.classList.remove('selected');
            if (indexFirstChecking == index && countClick > 1) {
                getIndexIsChecking();
                indexFirstChecking = indexIsChecking;
                const tagsText = document.querySelector('.el-select__tags-text')
                tagsText.innerHTML = spans_service[indexIsChecking].textContent.trim()
            }
            countService--;
            if (countService == 1) {
                const spanCount = document.querySelectorAll('.el-tag--info');
                spanCount[1].remove();
            }
            else if (countService > 1) {
                const spanCount = document.querySelectorAll('.el-tag--info');
                spanCount[1].textContent = `+${countService - 1}`
            }
            else {
                const spanCount = document.querySelectorAll('.el-tag--info');
                spanCount[0].remove();
                inputService.placeholder = 'Lựa Chọn Dịch Vụ Cho Phép';
                inputService.value = '';
                countClick = 0;
            }
        } else {
            countService++;
            item.classList.add('selected');
            if (countService == 2) {
                tags_service.innerHTML += `<span
                class="el-tag el-tag--info el-tag--small el-tag--light">
                <span class="el-select__tags-text">
                    +${countService - 1}
                </span>
            </span>`
            } else if (countService > 2) {
                const spanCount = document.querySelectorAll('.el-select__tags-text');
                spanCount[1].textContent = `+${countService - 1}`
            }
            else {
                tags_service.innerHTML = `
                    <span
                        class="el-tag el-tag--info el-tag--small el-tag--light">
                        <span class="el-select__tags-text">
                            ${spans_service[index].textContent.trim()}
                        </span>
                    </span>`
            }
        }
    }
})



