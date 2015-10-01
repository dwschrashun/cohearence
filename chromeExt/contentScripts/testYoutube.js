var songObj = {
    href: location.href,
    title: document.getElementById("eow-title").textContent.trim()
};

chrome.runtime.sendMessage('gotSong', function (response) {
    console.log('response from router:', response);
});
