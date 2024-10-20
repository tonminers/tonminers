$( document ).ready(function() {
    const params = new URLSearchParams(Telegram.WebApp.initData);
    const userData = Object.fromEntries(params);
    userData.user = JSON.parse(userData.user);

    $("#first_name").html(userData.user.first_name);

    const tg = Telegram.WebApp.MainButton;
    tg.setText("New TON Mining Power Units (TMPU)");
    tg.show();
});