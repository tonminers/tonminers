$( document ).ready(function() {
    // const params = new URLSearchParams(Telegram.WebApp.initData);
    // const userData = Object.fromEntries(params);
    // userData.user = JSON.parse(userData.user);

    // $("#first_name").html(userData.user.first_name);

    // const tg = Telegram.WebApp;

    // tg.MainButton.setText("⚪️ Compound");
    // tg.MainButton.show();

    // tg.SecondaryButton.setText("⚪️ Withdraw");
    // tg.SecondaryButton.show();
    // tg.SecondaryButton.color = tg.MainButton.color;
    // tg.SecondaryButton.textColor = tg.MainButton.textColor;

    // tg.BackButton.show();

    const app = new App();
    window["app"] = app;
});

class App {

    activeScreen;
    tg;

    constructor() {
        this.activeScreen = "home";
        this.tg = Telegram.WebApp;
    }

    openScreen(screen) {
        $("#screen_" + this.activeScreen).fadeOut(function() {
            $("#screen_" + this.activeScreen).fadeIn();
            app.activeScreen = screen;
        });
        this.tg.BackButton.show();
    }

    test() {
        alert("dfdsafdsads");
    }

}