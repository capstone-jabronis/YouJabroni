"use strict"
//=========================== Change Password ================================//
const changePasswordBtn = document.querySelector('.changePassword');
const passwordModal = document.querySelector('.modal')
const modalBackground = document.querySelector('.modal-bg')
const newPassword = document.querySelector('.newPassword')
const confirmNewPassword = document.querySelector('.confirmNewPassword')
const passwordError = document.querySelector('.password-error')
const submitPasswordBtn = document.querySelector('.submit-password')
const cancelPasswordChangeBtn = document.querySelector('.cancelPasswordChange')
const cancelEditBtn = document.querySelector('.cancel-edit')
const modalOverlay = document.querySelector('#modal-overlay');
const modalSection = document.querySelector('.edit-user');
const editProfileButton = document.querySelector('.edit-btn');
const editProfileForm = document.querySelector('.edit-form-container');
const exitBtn = document.querySelector('.exit-edit-profile-btn');
changePasswordBtn.addEventListener('click', () => {
    passwordModal.classList.toggle('hidden')
});
modalBackground.addEventListener('click', () => {
    passwordModal.classList.toggle('hidden')
    newPassword.value = ""
    confirmNewPassword.value = ""
})

confirmNewPassword.addEventListener('keyup', () => {
    passwordValidation()
})

// cancelEditBtn.addEventListener('click', () => {
//
// })
function passwordValidation() {
    if(confirmNewPassword.value === newPassword.value ) {
        confirmNewPassword.style.border = 'solid 5px'
        confirmNewPassword.style.borderColor = 'green'
        passwordError.classList.add('hidden')
        submitPasswordBtn.classList.remove('hidden')
    } else {
        confirmNewPassword.style.border = 'solid 5px'
        confirmNewPassword.style.borderColor = 'red'
        passwordError.classList.remove( 'hidden')
        submitPasswordBtn.classList.add('hidden')
    }
}

const openEditProfileModal = function () {
    modalOverlay.classList.remove('hidden');
    modalSection.classList.remove('hidden');
    editProfileForm.classList.remove('hidden');
}

const closeEditProfileModal = function () {
    modalOverlay.classList.add('hidden');
    modalSection.classList.add('hidden');
    editProfileForm.classList.add('hidden');
}

const stopPropagation = function(e) {
    e.stopPropagation();
}

modalSection.addEventListener('click', stopPropagation);
editProfileButton.addEventListener('click', openEditProfileModal);
modalOverlay.addEventListener('click', closeEditProfileModal);
exitBtn.addEventListener('click', closeEditProfileModal);

//=======================================================================//

