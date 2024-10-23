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

const BACKEND = "https://a780-31-217-1-8.ngrok-free.app"

class App {

    activeScreen;
    tg;
    tgid;

    constructor() {
        this.tgid = 7967928871;
        try {
            this.activeScreen = "home";
            this.tg = Telegram.WebApp;
            this.tg.SettingsButton.show();
            this.tg.SettingsButton.onClick(function() {
                app.openScreen("settings");
            });
    
            const params = new URLSearchParams(Telegram.WebApp.initData);
            const userData = Object.fromEntries(params);
            userData.user = JSON.parse(userData.user);

            this.tgid = userData.user.id;
            alert(this.tgid);
    
            $("#first_name").html(userData.user.first_name);
        } catch (e) {
            $("#first_name").html("Dev");
        }
        this.loadData();
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

    copyLink() {
        var link = $("#refLink").html();
        $("#copy").val(link);

        var copyText = document.getElementById("copy");

        copyText.select();
        copyText.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(copyText.value);

        $("#refLinkSuccess").fadeIn(function() {
            setTimeout(function() {
                $("#refLinkSuccess").fadeOut();
            }, 2000);
        });
    }

    copyAddress() {
        var copyText = document.getElementById("addressDeposit");

        copyText.select();
        copyText.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(copyText.value);

        $("#addressDepositSuccess").fadeIn(function() {
            setTimeout(function() {
                $("#addressDepositSuccess").fadeOut();
            }, 2000);
        });
    }

    loadData() {
        $.ajax({
            // beforeSend: function(request) {
            //     request.setRequestHeader("ngrok-skip-browser-warning", 'true');
            // },
            method: "GET",
            dataType: "json",
            url: BACKEND + "/data/" + this.tgid,
            success: function(data) {
                console.log(data);
            }
        });
    }

}