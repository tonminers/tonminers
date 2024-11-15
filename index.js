$( document ).ready(function() {
    const app = new App();
    window["app"] = app;
});

const BACKEND = "https://tmtmtmfdsafdsafsa.chickenkiller.com"

class App {

    activeScreen;
    previousScreen;
    tg;
    tgid;
    tmu;
    simulationRunning;
    lastUpdated;
    simulating;
    timeLock;
    tmout;
    data;
    ref;
    menuActive;

    constructor() {
        this.simulationRunning = false;
        this.tgid = 7967928871;
        this.simulating = false;
        this.menuActive = false;
        try {
            this.activeScreen = "home";
            this.tg = Telegram.WebApp;
            this.tg.SettingsButton.show();
            this.tg.SettingsButton.onClick(function() {
                app.openScreen("settings");
            });
            this.tg.BackButton.onClick(function() {
                app.openScreen(app.previousScreen);
            });
    
            const params = new URLSearchParams(Telegram.WebApp.initData);
            const userData = Object.fromEntries(params);
            userData.user = JSON.parse(userData.user);

            this.tgid = userData.user.id;
            this.ref = userData.start_param;
    
            $("#first_name").html(userData.user.first_name);
        } catch (e) {
            $("#first_name").html("Dev");
        }
        this.loadData();
    }

    openScreen(screen) {
        this.previousScreen = this.activeScreen;
        this.activeScreen = screen;
        $("#screen_" + this.previousScreen).fadeOut(function() {
            $("#screen_" + screen).fadeIn();
        });
        if (screen == "home") {
            this.tg.BackButton.hide();
        } else {
            this.tg.BackButton.show();
        }
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
            }, 5000);
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
            }, 5000);
        });
    }

    loadData() {
        var r = window.location.href
        $.ajax({
            method: "GET",
            url: BACKEND + "/data/" + this.tgid + "/" + this.ref,
            success: function(data) {
                app.data = data;
                $("#refLink").html("t.me/TonMinersRobot/tonminers?startapp=" + data.code);
                $("#earnings").html(data.earnings);
                $("#tmu").html(data.tmu.toFixed(9));
                app.tmu = data.tmu;
                app.lastUpdated = new Date(data.last_updated);
                app.timeLock = new Date(data.time_lock);
                $("#addressDeposit").val(data.addr_deposit);
                if (data.addr_withdraw != data.code) {
                    $("#addressWithdraw").val(data.addr_withdraw);
                }
                app.checkSimulation();
                app.calculateTmuStats();
            }
        });
    }

    countEarnings() {
        app.calculateTmuStats();
        var earnings = app.getRewards();
        $("#earnings").html(earnings);
        if (app.simulationRunning) {
            app.tmout = setTimeout(app.countEarnings, 1000);
        }
    }

    checkSimulation() {
        if (this.tmu > 0) {
            $("#minergif").show();
            $("#buttongif").show();
            this.simulationRunning = true;
            this.countEarnings();
            this.getRewards();
        } else {
            $("#minerpng").show();
            $("#buttonpng").show();
        }
    }

    startSimulation() {
        if (this.simulationRunning) {
            $("#startstop").html("Start");
            this.simulationRunning = false;
            $("#minergif").hide();
            $("#minerpng").show();
        } else {
            $("#startstop").html("Stop");
            $("#minerpng").hide();
            $("#minergif").show();
            this.simulationRunning = true;
            this.countEarnings();
            $("#simulationMessage").fadeIn();
            if (!this.simulating) {
                this.lastUpdated = new Date();
                this.tmu = 1;
                this.simulating = true;
                $("#tmu").html(this.tmu.toFixed(9));
            }
        }
    }

    getRewards() {
        var now = new Date();
        var diff = now - this.lastUpdated;
        diff /= 1000;
        var r = diff * this.tmu / (3000 * 3600);
        return r.toFixed(9);
    }

    calculateTmuStats() {
        var now = new Date();
        var mdiff = now - this.timeLock;
        var diff = mdiff / 1000;
        var days = diff / 86400;
        var percentf = days / 60;
        var percent = (percentf * 100).toFixed(0);
        if (percent > 100) {
            percent = 100;
        }
        var price = percentf.toFixed(2);
        var amount = percentf * this.tmu;
        $("#percent").html(percent);
        $("#price").html(price);
        $("#amount").html(amount.toFixed(9));
        $("#progress-bar").width(percent + "%")
    }

    compound() {
        $("#successMessage").html("<small><strong>Reward compounding done successfully.</strong></small>");

        $("#successMessage").fadeIn(function() {
            setTimeout(function() {
                $("#successMessage").fadeOut();
            }, 5000);
        });

        $.ajax({
            method: "POST",
            url: BACKEND + "/compound/" + this.tgid,
            success: function(data) {
                clearTimeout(app.tmout);
                app.loadData();
            }
        });
    }

    checkPayment() {
        $("#payment").fadeOut(function() {
            $("#paymentLoading").fadeIn();
            $.ajax({
                method: "GET",
                url: BACKEND + "/paid/" + app.tgid,
                success: function(data) {
                    $("#paymentLoading").fadeOut(function() {
                        $("#payment").fadeIn();
                        if (data.success) {
                            clearTimeout(app.tmout);
                            app.loadData();

                            $("#minerpng").hide();
                            $("#buttonpng").hide();
                            $("#minergif").show();
                            $("#buttongif").show();

                            $("#simulationMessage").hide();
                            app.simulating = false;
    
                            $("#depositSuccess").fadeIn(function() {
                                setTimeout(function() {
                                    $("#depositSuccess").fadeOut();
                                }, 5000);
                            });
                        } else {
                            $("#depositError").fadeIn(function() {
                                setTimeout(function() {
                                    $("#depositError").fadeOut();
                                }, 5000);
                            });
                        }
                    });
                }
            });
        });
    }

    saveSettings() {
        var av = $("#addressWithdraw").val();

        $("#settings").fadeOut(function() {
            $("#settingsLoading").fadeIn();
            $.ajax({
                method: "POST",
                url: BACKEND + "/save/" + app.tgid,
                data: {
                    address_withdraw: av,
                },
                success: function(data) {
                    $("#settingsLoading").fadeOut(function() {
                        $("#settings").fadeIn();
                        if (data.success) {
                            $("#settingsSuccess").fadeIn(function() {
                                setTimeout(function() {
                                    $("#settingsSuccess").fadeOut();
                                }, 5000);
                            });
                            clearTimeout(app.tmout);
                            app.loadData();
                        } else {
                            $("#settingsError").fadeIn(function() {
                                setTimeout(function() {
                                    $("#settingsError").fadeOut();
                                }, 5000);
                            });
                        }
                    });
                }
            });
        });
    }

    withdraw() {
        var r = this.getRewards();
        if (r > 0.001) {
            if (this.data.addr_withdraw != this.data.code) {
                this.tg.showConfirm("Are you sure you want to withdraw your rewards?", function(sure) {
                    if (sure) {
                        $.ajax({
                            method: "POST",
                            url: BACKEND + "/withdraw/" + app.tgid,
                            success: function(data) {
                                clearTimeout(app.tmout);
                                app.loadData();
                            }
                        });
    
                        $("#successMessage").html("<small><strong>Withdraw done successfully.</strong></small>");
    
                        $("#successMessage").fadeIn(function() {
                            setTimeout(function() {
                                $("#successMessage").fadeOut();
                            }, 5000);
                        });
                    }
                });
            } else {
                $("#addressError").fadeIn(function() {
                    setTimeout(function() {
                        $("#addressError").fadeOut();
                    }, 5000);
                });
                this.openScreen("settings");
            }
        } else {
            $("#errorMessage").html("<small><strong>Minimum withdrawal amount is 0.001 TON.</strong></small>");
    
            $("#errorMessage").fadeIn(function() {
                setTimeout(function() {
                    $("#errorMessage").fadeOut();
                }, 5000);
            });
        }
    }

    showCancel() {
        if (this.data.addr_withdraw != this.data.code) {
            if (this.tmu > 0 && !this.simulating) {
                this.openScreen("cancel");
            } else {
                this.tg.showAlert("You don't have any TMU to cancel.");
            }
        } else {
            $("#addressError").fadeIn(function() {
                setTimeout(function() {
                    $("#addressError").fadeOut();
                }, 5000);
            });
            this.openScreen("settings");
        }        
    }

    cancel() {
        this.tg.showConfirm("Are you sure you want to cancel your TMU?", function(sure) {
            if (sure) {
                $("#cancel").fadeOut(function() {
                    $("#cancelLoading").fadeIn();
                    $.ajax({
                        method: "POST",
                        url: BACKEND + "/cancel/" + app.tgid,
                        success: function(data) {
                            clearTimeout(app.tmout);
                            app.loadData();
        
                            $("#minergif").hide();
                            $("#buttongif").hide();
                            $("#minerpng").show();
                            $("#buttonpng").show();
        
                            $("#successMessage").html("<small><strong>TMU canceled successfully.</strong></small>");
        
                            $("#successMessage").fadeIn(function() {
                                setTimeout(function() {
                                    $("#successMessage").fadeOut();
                                    $("#cancelLoading").hide();
                                    $("#cancel").show();
                                }, 5000);
                            });
        
                            app.openScreen("home");
                        }
                    });
                });
            }
        });
    }

    updateCalc() {
        var inv = parseFloat($("#investment").val());
        $("#calctmu").html(inv.toFixed(9));
        var eds = (inv * 0.008).toFixed(9);
        var edb = (inv * 0.011).toFixed(9);
        $("#eds").html(eds);
        $("#edb").html(edb);

        var days = parseFloat($("#days").val());

        var es = (eds * days).toFixed(9);
        var eb = (edb * days).toFixed(9);

        $("#es").html(es);
        $("#eb").html(eb);

        var ecs = ((inv * (1.008**days)) - inv).toFixed(9);
        var ecb = ((inv * (1.011**days)) - inv).toFixed(9);
        
        $("#ecs").html(ecs);
        $("#ecb").html(ecb);
    }

    menuClicked() {
        if (!app.menuActive) {
            app.openScreen("menu");
            app.menuActive = true;
        } else {
            window.history.go(-1);
            app.openScreen(app.previousScreen);
            app.menuActive = false;
        }
    }

}