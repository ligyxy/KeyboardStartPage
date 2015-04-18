// Open setting page
function SettingPopup(btnName, tabid) {
    // URL is too dirty
    chrome.windows.create({url : "popup.html?btn="+btnName+'&tabid='+tabid,
        type: "popup",
        height: 300,
        width: 500,
        top: 300,
        left: 300
    });
}

// Open default link
function JumpToDefaultLink(BtnId) {
    // parm BtnId: li_1
    var defaultLinks = {
        'li_y': 'http://youtube.com',
        'li_c': 'http://www.crowdskout.com',
        'li_g': 'https://www.google.com'
    };
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, {url: defaultLinks[BtnId]});
    });
}

// Open link in the same tab
function JumpToLink(BtnId) {
    // parm BtnId: li_1
    chrome.storage.sync.get(BtnId, function(val) {
        if (val[BtnId] !== null && typeof val[BtnId] !== "undefined"){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab = tabs[0];
                chrome.tabs.update(tab.id, {url: val[BtnId]});
            });
        }
        else{
        //TODO: blink the button with another color
        }
    });
}

// Open link in a new tab
function JumpToLinkInNewTab(BtnId) {
    chrome.storage.sync.get(BtnId, function(val) {
        if (val[BtnId] !== null && typeof val[BtnId] !== "undefined"){
            window.open(val[BtnId]);
        }
        else{
            //TODO: blink the button with another color
        }
    });
}

// Delete link
function DeleteLink(BtnId) {
    chrome.storage.sync.remove(BtnId);
}

// Refesh tab
function RefreshTab(tabid) {
    chrome.tabs.reload(tabid);
}

// Close tab
function CloseTab(tabid) {
    chrome.tabs.remove(tabid);
}