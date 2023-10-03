//=========================== Change Password ================================//
const changePasswordBtn = document.querySelector('.changePassword');
const passwordModal = document.querySelector('.modal')
const modalBackground = document.querySelector('.modal-bg')
changePasswordBtn.addEventListener('click', () => {
    passwordModal.classList.toggle('hidden')
});
modalBackground.addEventListener('click', () => {
    passwordModal.classList.toggle('hidden')
})