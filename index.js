$( document ).ready(function() {
    const params = new URLSearchParams(Telegram.WebApp.initData);
    const userData = Object.fromEntries(params);
    userData.user = JSON.parse(userData.user);

    $("#first_name").html(userData.user.first_name);
});