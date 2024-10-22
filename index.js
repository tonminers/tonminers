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
        this.tg.SettingsButton.show();
        this.tg.SettingsButton.onClick(function() {
            app.openScreen("settings");
        });

        const params = new URLSearchParams(Telegram.WebApp.initData);
        const userData = Object.fromEntries(params);
        userData.user = JSON.parse(userData.user);

        $("#first_name").html(userData.user.first_name);
    }

    openScreen(screen) {
        $("#screen_" + this.activeScreen).fadeOut(function() {
            $("#screen_" + screen).fadeIn();
            app.activeScreen = screen;
        });
        if (screen == "home") {
            this.tg.BackButton.hide();
        } else {
            this.tg.BackButton.show();
            this.tg.BackButton.onClick(function() {
                app.openScreen("home");
            });
        }
    }

    test() {
        alert("dfdsafdsads");
    }

}