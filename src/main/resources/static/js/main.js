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

cancelEditBtn.addEventListener('click', () => {

})
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

//=======================================================================//

