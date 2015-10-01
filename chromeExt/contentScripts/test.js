
var text = 'Hey';
console.log(text);
var thumbsUp = document.getElementsByClassName("thumbUpButton")[0];
thumbsUp.addEventListener("click", function(e) {
	alert(text);
});