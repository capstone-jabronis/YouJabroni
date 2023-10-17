const loadingOverlay = document.querySelector('.hide-loader');
const fileInput = document.getElementById('fileInput');
const previewImage = document.querySelector('.previewImage');
const profilePicButton = document.querySelector("#profilePic");
const client = filestack.init(FILESTACK_API_KEY);
const options = {
    accept: ["image/*"],
    fromSources: ["local_file_system", "url"],
    transformations: {
        crop: false,
        circle: true,
        rotate: true,
        force: true
    },
    imageMax: [400, 400],
    onFileUploadFinished: file => {

        fileInput.value = file.url;
        previewImage.src = file.url;

    },
    onFileSelected: file => {
        // If you throw any error in this function it will reject the file selection.
        // The error message will be displayed to the user as an alert.
        if (file.size > 1000 * 1000) {
            throw new Error('File too big, select something smaller than 1MB');
        }
    },
    onClose: () => {
        loadingOverlay.classList.add('hidden');
    },
};
profilePicButton.addEventListener('click', (e) => {
    e.preventDefault();
    loadingOverlay.classList.remove('hidden');
    client.picker(options).open();
    client.on('upload.error', (filestackError) => {
        console.log(filestackError);
    });
});




// fileInput.addEventListener('change', (e) => {
// const file =e.target.files[0];
// client.upload(file)
//     .then((response) => {
//         const url = response.url;
//         previewImage.src = url;
//     })
//     .catch((error) => {
//         console.error("error uploading image: ", error);
//     })
// });
