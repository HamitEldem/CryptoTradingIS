var usercnt = 0;
var sWidth = window.innerWidth;
var wStr;
var users = [];
var userSelections = {};
var currentDayByUser = {};
var today = 2;
var coinName = "Bitcoin";
var coinPath = "";
var buyClicked = true;
var currentUser;
var userWallet = {};
var sellClicked = false;
var childrenoftablecount = 0;

let monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"
];

let monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var cryptocurrencies = [
    {
        name: "Cordana",
        symbol: "ada"
    },
    {
        name: "Avalanche",
        symbol: "avax"
    },
    {
        name: "Bitcoin",
        symbol: "btc"
    },
    {
        name: "Doge",
        symbol: "doge"
    },
    {
        name: "Ethereum",
        symbol: "eth"
    },
    {
        name: "Polygon",
        symbol: "pol"
    },
    {
        name: "Synthetix",
        symbol: "snx"
    },
    {
        name: "Tron",
        symbol: "trx"
    },
    {
        name: "Ripple",
        symbol: "xrp"
    }
];


$("#add-new").click(function () {
    $("body").addClass("blur");
    $("#name-box").css("display", "initial");
});
$("#name-box button").click(function () {

    $("#team-members").css("display", "none");
    $("#name-box").css("display", "none");
    $("body").removeClass("blur");
    let username = $("#name-box input").val();
    users.push(username);
    userWallet[username] = {
        TotalMoney: 1000
    };

    $("#balance-h1").text("$1000.00");

    $(".crypto-row").remove();


    console.log(username);

    drawProfiles();

    if (username != "") {
        $("#empty").html("");
        usercnt++;
        console.log(wStr);
        console.log(window.innerWidth);

    }
})

// Function to draw user profiles
function drawProfiles() {
    $("#dashed-line").css("display", "none");
    $("#profile-container").html("");
    for (let j = 0; j < users.length; j++) {
        let profile = "<div class='profiles'><div>" +
            "<img src=\"images/profile.svg\">" +
            "</div>";
        profile += "<div>";
        profile += users[j];
        profile += "</div>";
        profile += "<div class=";
        profile += "\"delete\"";
        profile += ">x</div>";
        profile += "</div>";
        $("#profile-container").append(profile);
        let leftposProfile;
        $(".profiles").each(function (i) {
            sWidth = window.innerWidth / 2 - 160 * usercnt;
            sWidth = sWidth + i * 150;
            wStr = sWidth + "px"
            $(this).css("left", wStr);
        })
    }
}

$("#profile-container").on("click", ".delete", function () {
    let userToDelete = $(this).parent().children("div").eq(1).text();
    let index = users.indexOf(userToDelete);
    users.splice(index, 1);
    usercnt--;

    drawProfiles();
})

$("#profile-container").on("click", ".profiles", function () {
    if (!$(event.target).hasClass("delete")) {
        currentUser = $(this).find("div:eq(1)").text().trim();

        showTradingPage(currentUser);

    }
});
let isPlaying = false;

// Function to show the trading page for a user
function showTradingPage(usr) {
    let usrIndex = users.indexOf(usr);
    $("#balance-h1").removeClass("hbeat");
    $("#buysell").css("display", "initial");
    $("#wallettable").css("width", "100%");
    $("#walletdiv").css("left", "45%");
    $("#forward").text("Play");
    isPlaying = false;
    $("#coins img").removeClass("hbeat");
    if (userSelections[usrIndex] != null) {
        $(`#coins img[src='${userSelections[usrIndex].path}']`).addClass("hbeat");
        drawSelection(userSelections[usrIndex].path, userSelections[usrIndex].name);
        coinName = userSelections[usrIndex].name;
        coinPath = userSelections[usrIndex].path;
    } else {
        coinName = "Bitcoin";
        coinPath = "images/btc.png";
        userSelections[usrIndex] = {
            path: coinPath,
            name: coinName
        };
        $(`#coins img[src='images/btc.png']`).addClass("hbeat");
        drawSelection(coinPath, coinName);
    }
    $("#right-side").html("");
    $("#right-side").css("display", "inherit");
    $("#content").css("display", "none");
    $("#add-new").css("display", "none");
    $("#profile-container").css("display", "none");
    displayRightTop(usr);
    console.log(usr);
    $("#trading").css("display", "inherit");
    if (currentDayByUser[usrIndex] == null) {
        currentDayByUser[usrIndex] = {
            today: 2,
            month: 0,
            totalDay: 2
        };
    }
    drawCurrentDate(usr);
    updateWalletTable(usr)
    updateWallet(usr, currentDayByUser[usrIndex].totalDay);
    $("#balance-h1").text("$" + (userWallet[currentUser].TotalMoney));
    drawCandleStick(coinName);
}

$("#right-side").on("click", ".log-out", function () {
    $("#profile-container").css("display", "inherit");
    drawProfiles();
    $("#content").css("display", "inherit");
    $("#add-new").css("display", "inherit");
    $("#right-side").css("display", "none");
    $("#trading").css("display", "none");

});

// Function to display the current user at the top right
function displayRightTop(usr) {
    var rightTop = `<div class="current-user">
                    <div>
                        <img src="images/profile.svg" alt="">
                    </div>
                    <div>
                        ${usr}
                    </div>
                </div>
                <div class="log-out">
                    <div>
                        <img src="images/logout.svg" alt="">
                    </div>
                    <div>
                        Logout
                    </div>
                </div>`;
    $("#right-side").append(rightTop);
}

$("#coins img").click(function () {
    $("#coins img").removeClass("hbeat");
    $(this).addClass("hbeat");

    coinName = $(this).attr("alt");
    coinPath = $(this).attr("src");
    currentUser = $("#right-side .current-user div:eq(1)").text().trim();



    console.log(currentUser + " " + users.indexOf(currentUser));


    userSelections[users.indexOf(currentUser)] = {
        path: coinPath,
        name: coinName
    };

    drawSelection(coinPath, coinName);
    if (buyClicked) {
        BuySelection(coinName);
    }
    else {
        sellSelection(coinName);
    }

    drawCandleStick(coinName);

});

function drawSelection(coinPath, coinName) {
    let selected = ` <div id="selected-coin">
                    <img src=${coinPath} alt=${coinName}>
                    ${coinName}
                <span id="info" style="color:red"></span></div>`;

    $("#selection").html("");
    $("#selection").append(selected);
}

$("#next").click(function () {

    nextDayHandler();

});

let playTimer = null;

// Function to handle the next day in the simulation
function nextDayHandler() {
    let currentUser = $("#right-side .current-user div:eq(1)").text().trim();
    let usrIndex = users.indexOf(currentUser);
    if (parseInt(currentDayByUser[usrIndex].totalDay) === 365) {
        $(this).prop('disabled', false);
        $(this).add;
        $("#balance-h1").addClass("hbeat");
        $("#buysell").css("display", "none");
        $("#wallettable").css("width", "120%");
        $("#walletdiv").css("left", "10px");
        clearInterval(playTimer);
        playTimer = null;
    } else {
        currentDayByUser[usrIndex].today += 1;
        currentDayByUser[usrIndex].totalDay += 1;
        $("#balance-h1").removeClass("hbeat");
        $("#buysell").css("display", "initial");
        $("#wallettable").css("width", "100%");
        $("#walletdiv").css("left", "45%");
    }
    let currentDay;
    let day = currentDayByUser[usrIndex].today;
    let month = currentDayByUser[usrIndex].month + 1;
    let dayStr;
    let monthStr;
    if (day < 10) {
        dayStr = "0" + day;
    } else {
        dayStr = day;
    }
    if (month < 10) {
        monthStr = "0" + month;
    } else {
        monthStr = month;
    }
    currentDay = dayStr + "-" + monthStr + "-2021";
    drawCurrentDate(currentUser);
    updateWallet(currentUser, currentDay);
    let balance = 0;
    var globalBalance;
    for (let coin in userWallet[currentUser]) {
        if (userWallet[currentUser][coin].Amount > 0) {
            let abr;
            for (let crypto of cryptocurrencies) {
                if (crypto.name === coin) {
                    abr = crypto.symbol;
                }
            }
            for (let day = 0; day < market.length; day++) {
                if (market[day].date === currentDay) {
                    for (let c = 0; c < market[day].coins.length; c++) {
                        if (market[day].coins[c].code === abr) {
                            userWallet[currentUser][coin].Subtotal = parseFloat(market[day].coins[c].open * userWallet[currentUser][coin].Amount);
                            balance += userWallet[currentUser][coin].Subtotal;
                            userWallet[currentUser][coin].LastClose = market[(day - 1)].coins[c].close;
                            console.log(balance);
                            globalBalance = balance;
                        }
                    }
                }
            }
        }
    }
    $("#balance-h1").text("$" + (balance + userWallet[currentUser].TotalMoney));
    drawCandleStick(coinName);
}

// Function to draw the candlestick chart for a given coin
function drawCandleStick(cname) {
    $("#graph").html("");
    let abr;
    for (let coin of cryptocurrencies) {
        if (coin.name === cname) {
            abr = coin.symbol;
            break;
        }
    }
    let usrIndex = users.indexOf(currentUser);
    let totalDays = currentDayByUser[usrIndex].totalDay - 1;
    var ath = -5;
    var atl = 1000000;
    for (let i = 0; i < totalDays; i++) {
        for (let c of market[i].coins) {
            if (c.code === abr) {
                if (c.high > ath) {
                    ath = c.high;
                }
                if (c.low < atl) {
                    atl = c.low;
                }
            }
        }
    }
    let leftpos = 10;
    let cWidth = 7.7;
    let cSpacing = 5;
    let bottompos;
    let startDate = 0;
    if (totalDays > 120) {
        startDate = totalDays - 120;
    }
    let k = 400;
    let heights, bottoms;
    for (let i = startDate; i < totalDays; i++) {
        k++;
        let drewToday = false;
        let widthgraph;
        widthgraph = $("#graph").width();
        temp = widthgraph / 120;
        candlewidth = temp - cSpacing;
        console.log(widthgraph, candlewidth);
        for (let c = 0; c < market[i].coins.length; c++) {
            if (market[i].coins[c].code === abr) {
                let height;
                drewToday = true;
                $("#graph").append(`<div id="${k}" class="stick" ></div>`);
                heights = (market[i].coins[c].high - market[i].coins[c].low) * (350 / (ath - atl));
                bottoms = 255 * (market[i].coins[c].low - atl) / ((ath - atl));
                if (market[i].coins[c].open > market[i].coins[c].close) {
                    $("#graph").append(`<div id="${i}" class="redCandles" style="width:${candlewidth}px"></div>`);
                    height = (market[i].coins[c].open - market[i].coins[c].close) * (350 / (ath - atl));
                    bottompos = 255 * (market[i].coins[c].close - atl) / ((ath - atl));
                } else {
                    $("#graph").append(`<div id="${i}" class="greenCandles" style="width:${candlewidth}px"></div>`);
                    height = (market[i].coins[c].close - market[i].coins[c].open) * (350 / (ath - atl));
                    bottompos = 255 * (market[i].coins[c].open - atl) / ((ath - atl));
                }
                $("#graph").append(`<div id="dashed-line"><span id="closing-price"></span></div>`);
                let leftposstick = leftpos + candlewidth / 2;
                $(`#${i}`).css("height", `${height}px`);
                $(`#${i}`).css("left", `${leftpos}px`);
                $(`#${i}`).css("bottom", `${bottompos}px`);
                $(`#${k}`).css("height", `${heights}px`);
                $(`#${k}`).css("left", `${leftposstick}px`);
                $(`#${k}`).css("bottom", `${bottoms}px`);
                $("#dashed-line").css("bottom", `${bottompos + height}px`);
                let line = (bottompos + height) + 383;
                $("#dashed-line").css("display", "inherit");
                if (drewToday)
                    drawDashedLine(market[i].coins[c].close, line);
                leftpos += cSpacing + candlewidth;
            }
        }
    }
    $("#high-price").text(`$${ath}`);
    $("#low-price").text(`$${atl}`);
}

// Function to draw the current date for a user
function drawCurrentDate(currentUser) {
    let usrIndex = users.indexOf(currentUser);
    console.log(currentDayByUser[usrIndex].today);
    if (currentDayByUser[usrIndex].today > monthDays[currentDayByUser[usrIndex].month]) {
        currentDayByUser[usrIndex].month += 1;
        currentDayByUser[usrIndex].today = 1;
    }
    let dayDate = `  <div>
                    <h1>Day ${currentDayByUser[usrIndex].totalDay}</h1>
                </div>
                <div>
                    <h2>${currentDayByUser[usrIndex].today} ${monthNames[currentDayByUser[usrIndex].month]} 2021</h2>
                </div>`
    $("#day-date").html("");
    $("#day-date").append(dayDate);
}

$("#buybtn").click(function () {
    $("#buybtn").css("background-color", "green");
    $("#buybtn").css("color", "white");
    $("#sellbtn").css("background-color", "white");
    $("#sellbtn").css("color", "gray");
    $("#buyCoin").css("background-color", "green");
    BuySelection(coinName);


});

$("#sellbtn").click(function () {
    $("#sellbtn").css("background-color", "red");
    $("#sellbtn").css("color", "white");
    $("#buyCoin").css("background-color", "red");
    $("#buybtn").css("background-color", "white");
    $("#buybtn").css("color", "black");
    sellSelection(coinName);
});

// Function to add a coin to the user's wallet
function addtowallet(cuser, cname) {
    let abr;
    for (let coin of cryptocurrencies) {
        if (coin.name === cname)
            abr = coin.symbol;
    }
    var usrIndex = users.indexOf(cuser);
    var amount = parseFloat($("#amountInp").val());
    var datestr;
    let day = currentDayByUser[usrIndex].today;
    let month = currentDayByUser[usrIndex].month + 1;
    let dayStr;
    let monthStr;
    if (day < 10) {
        dayStr = "0" + day;
    } else {
        dayStr = day;
    }
    if (month < 10) {
        monthStr = "0" + month;
    } else {
        monthStr = month;
    }
    datestr = dayStr + "-" + monthStr + "-2021";
    var subtotal = 0;
    var lastclose = 0;
    for (let day = 0; day < market.length; day++) {
        if (market[day].date === datestr) {
            for (let c = 0; c < market[day].coins.length; c++) {
                if (market[day].coins[c].code === abr) {
                    subtotal = parseFloat(market[day].coins[c].open * amount);
                    lastclose = market[(day - 1)].coins[c].close;
                }
            }
        }
    }
    if (!userWallet[cuser][cname]) {
        userWallet[cuser][cname] = {
            Coin: cname,
            Amount: 0,
            Subtotal: 0,
            LastClose: lastclose
        };
    }
    if (buyClicked) {
        userWallet[cuser][cname].Amount += amount;
        userWallet[cuser][cname].Subtotal += subtotal;
        userWallet[cuser].TotalMoney -= subtotal;
    } else if (sellClicked) {
        userWallet[cuser][cname].Amount -= amount;
        userWallet[cuser][cname].Subtotal -= subtotal;
        userWallet[cuser].TotalMoney += subtotal;
    }
    userWallet[cuser][cname].LastClose = lastclose;
    updateWalletTable(cuser);
    $("#amountInp").val(" ");
}

// Function to update the user's wallet based on the current day
function updateWallet(cuser, cDay) {
    for (let coin in userWallet[cuser]) {
        if (userWallet[cuser][coin].Amount > 0) {
            let abr;
            for (let crypto of cryptocurrencies) {
                if (crypto.name === coin) {
                    abr = crypto.symbol;
                }
            }
            for (let day = 0; day < market.length; day++) {
                if (market[day].date === cDay) {
                    for (let c = 0; c < market[day].coins.length; c++) {
                        if (market[day].coins[c].code === abr) {
                            userWallet[cuser][coin].Subtotal = parseFloat(market[day].coins[c].open * userWallet[cuser][coin].Amount);
                            userWallet[cuser][coin].LastClose = market[(day - 1)].coins[c].close;
                        }
                    }
                }
            }
        }
    }
    updateWalletTable(cuser);
}
$(function () {
    $("#amountText").on("keyup", function (e) {

        let abr;
        for (let coin of cryptocurrencies) {
            if (coin.name === coinName)
                abr = coin.symbol;
        }

        var usrIndex = users.indexOf(currentUser);
        var amount = parseFloat($("#amountInp").val());

        var datestr;
        let day = currentDayByUser[usrIndex].today;
        let month = currentDayByUser[usrIndex].month + 1;
        let dayStr;
        let monthStr;

        if (day < 10) {
            dayStr = "0" + day;
        } else {
            dayStr = day;
        }

        if (month < 10) {
            monthStr = "0" + month;
        }
        else {
            monthStr = month;
        }

        datestr = dayStr + "-" + monthStr + "-2021";

        var subtotal = 0;
        var lastclose = 0;
        for (let day of market) {
            if (day.date === datestr) {
                for (let c of day.coins) {
                    if (c.code === abr) {
                        subtotal = parseFloat(c.open * amount);
                        console.log($("#curtext"));
                        lastclose = c.close;
                        if ($("#amountInp").val() != "") {
                            $("#curtext").text(subtotal);
                        }
                        else {
                            $("#curtext").text("");
                        }

                    }
                }
            }
        }
        $("#buyCoin").click(function () {
            $("#curtext").text("");
        })




    })
})

// Function to update the wallet table display
function updateWalletTable(cuser) {
    $(".crypto-row").remove();
    let amnt = (1000 - userWallet[cuser].TotalMoney);
    $("#wallet-rem").text(`$${amnt}`);
    for (let coin in userWallet[cuser]) {
        if (userWallet[cuser][coin].Amount > 0) {
            $("#wallettable").append(
                `<tr class="crypto-row">
                            <td>${userWallet[cuser][coin].Coin}</td>
                             <td>${userWallet[cuser][coin].Amount}</td>
                            <td>$${userWallet[cuser][coin].Subtotal}</td>
                            <td>$${userWallet[cuser][coin].LastClose}</td>
                         </tr>`
            );
        }
    }
}

$("#buyCoin").click(function () {
    var amount2 = $("#amountInp").val();
    addtowallet(currentUser, coinName);

}
);

// Function to handle buying a coin
function BuySelection(coinName) {
    buyClicked = true;
    sellClicked = false;
    let selected = coinName;
    $("#buyCoin").html("");
    $("#buyCoin").html(`Buy ${selected}`);
}

// Function to handle selling a coin
function sellSelection(coinName) {
    buyClicked = false;
    sellClicked = true;
    let selected = coinName;
    $("#buyCoin").html("");
    $("#buyCoin").html(`Sell ${selected}`);
}

var num1 = 0;






$("#candle-stick").on("mouseenter", ".greenCandles, .redCandles", function () {
    let abr;
    for (let coin of cryptocurrencies) {
        if (coin.name === coinName)
            abr = coin.symbol;
    }
    let idname = $(this).attr("id");
    var lastclose = 0;
    var highvalue = 0;
    var lowvalue = 0;
    var openvalue = 0;
    var todaysdate;
    for (let j = 0; j < market.length; j++) {
        if (parseInt(idname) == j) {
            for (c = 0; c < market[j].coins.length; c++) {
                if (market[j].coins[c].code == abr) {
                    lastclose = market[j].coins[c].close;
                    openvalue = market[j].coins[c].open;
                    highvalue = market[j].coins[c].high;
                    lowvalue = market[j].coins[c].low;
                    todaysdate = market[j].date;
                    $("#info").append(`Date: ${todaysdate} Open: $${openvalue} Close: $${lastclose} High: $${highvalue} Low: $${lowvalue}`);
                }
            }
        }
    }

}).on("mouseleave", ".greenCandles, .redCandles", function () {
    $("#info").text("");
});


$("#forward").click(function () {


    if (!isPlaying) {
        playTimer = setInterval(nextDayHandler, 100);
        isPlaying = true;
        $(this).text("Pause");
        $("#pause").css("display", "inherit");
        $("#fast").css("display", "none");

    } else {
        clearInterval(playTimer);
        playTimer = null;
        isPlaying = false;
        $(this).text("Play");
        $("#pause").css("display", "none");
        $("#fast").css("display", "inherit");
    }
});

$("#team-members").on("mouseenter", function (e) {
    $("#prompt").css("display", "inherit");
})

$("#team-members").on("mouseleave", function (e) {
    $("#prompt").css("display", "none");
})

// Function to draw a dashed line on the graph
function drawDashedLine(price, close) {
    $("#closing-price").text("$" + price);
}
