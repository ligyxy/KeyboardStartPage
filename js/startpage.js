// Get the current tab id
chrome.tabs.getSelected(null, function(tab){
    window.MainTabId = tab.id
});

function btnHover(btn){
    $("#li_" + btn).addClass("active");
    setTimeout(function(){
        $("#li_" + btn).removeClass("active");
    }, 200);
}

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.getBackgroundPage(function (bg) {
        chrome.storage.sync.get(['bgColor', 'default', 'defaultActions'], function(val){
            // Update background color
            var defaultColor = bg.DefaultBGColor;
            var initialColor = defaultColor;
            if (val['bgColor'] !== null && typeof val['bgColor'] !== "undefined") {
                initialColor = val['bgColor']
            }else{
                chrome.storage.sync.set({bgColor: defaultColor});
            }
            $('html').css('background', initialColor);

            // Set default links and settings if it's the first time
            if (val['default'] != "passed" || typeof val['default'] === "undefined"){
                var defaultValue = bg.DefaultLink;
                chrome.storage.sync.set(defaultValue);
                // Refresh page to get new icons
                bg.RefreshTab(window.mainTabId);
            }
            // If option is empty, passing default value
            if (val['defaultActions'] != "passed" || typeof val['defaultActions'] === "undefined"){
                chrome.storage.sync.set(bg.DefaultActions);
            }
        });
    });
});

var Keys = "1234567890abcdefghijklmnopqrstuvwxyz";
var BtnPrefix = "li_";

chrome.storage.sync.get(null, function (val) {
    for(var i=0; i<Keys.length; i++) {
        var btnName = Keys.charAt(i);
        var BtnId = BtnPrefix + btnName;

        // register the hover action to display edit button
        $('#li_' + btnName).hover(
            function() {
                $(this).addClass('visible');
            },
            function() {
                $(this).removeClass('visible');
            }
        );

        // edit button
        var editBtn = document.getElementById(BtnId).getElementsByClassName("edit")[0];
        editBtn.addEventListener('click', function () {
            // Get the button name
            var TargetBtnId = this.parentNode.parentNode.getAttribute('id');
            // when clicking small icon, don't open the link
            event.cancelBubble=true;
            // Open the setting page
            chrome.runtime.getBackgroundPage(function(e){
                e.SettingPopup(TargetBtnId, window.MainTabId);
            });
        });

        // delete button
        var deleteBtn = document.getElementById(BtnId).getElementsByClassName("delete")[0];
        deleteBtn.addEventListener('click', function () {
            var TargetBtnId = this.parentNode.parentNode.getAttribute('id');
            // when clicking small icon, don't open the link
            event.cancelBubble=true;
            // Only delete when the value is not null
            if (val[TargetBtnId] !== null && typeof val[TargetBtnId] !== "undefined"){
                // Delete the stored link
                chrome.storage.sync.remove(TargetBtnId);
                // delete the icon
                var favicon = $("#" + TargetBtnId + " img");
                favicon.attr("src", "#");
                favicon.css("visibility", "hidden");
            }
        });

        // Key clicking
        var clickBtn = document.getElementById(BtnId);
        clickBtn.addEventListener('click', function (event) {
            var TargetBtnId = this.getAttribute('id');
            chrome.runtime.getBackgroundPage(function(e) {
                if (event.which == 2 && event.shiftKey) {
                    // Shift + middle click
                    e.JumpToLink(TargetBtnId, val['ShiftMiddleClick']);
                } else if (event.metaKey && event.shiftKey) {
                    // Command + Shift + click or Ctrl + Shift + click
                    e.JumpToLink(TargetBtnId, val['CtrlShiftClick']);
                } else if (event.metaKey || event.ctrlKey) {
                    //Ctrl + click or Command + click
                    e.JumpToLink(TargetBtnId, val['CtrlClick']);
                } else if (event.which == 2) {
                    // middle click
                    e.JumpToLink(TargetBtnId, val['MiddleClick']);
                } else if (event.shiftKey) {
                    // Shift + click
                    e.JumpToLink(TargetBtnId, val['ShiftClick']);
                } else {
                    // left click
                    e.JumpToLink(TargetBtnId, val['Click']);
                }
            });
        });

        (function(btnName) {
            // <Key>
            Mousetrap.bind(btnName, function () {
                chrome.runtime.getBackgroundPage(function(e){e.JumpToLink(BtnPrefix + btnName, val['Key']);});
                btnHover(btnName);
            });

            // Shift + <Key>
            Mousetrap.bind('shift+'+btnName, function () {
                chrome.runtime.getBackgroundPage(function (e){e.JumpToLink(BtnPrefix + btnName, val['ShiftKey']);});
                btnHover(btnName);
            });
        })(btnName);

        // Whether displaying favicon
        (function(BtnId) {
            var favicon = $("#" + BtnId + " img");
            if (val[BtnId] !== null && typeof val[BtnId] !== "undefined"){
                favicon.attr("src", "http://www.google.com/s2/favicons?domain=" + val[BtnId]);
                favicon.css("visibility", "visible");
            }
        })(BtnId);
    }
});