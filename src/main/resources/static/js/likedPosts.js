const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
const postElement = document.querySelector("#likedPost");
const userIDElement = document.querySelector("#results");
let userID2 = userIDElement.getAttribute("dataId");
let url2 = `/${userID2}/liked`;
const isAuthenticated = document.querySelector("[data-authenticated]");
let USER_POST_ID = [];