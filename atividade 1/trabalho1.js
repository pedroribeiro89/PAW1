var selectedImage;
var imageListItens;

function selectImage(event) {
	for (var i = 0; i < imageListItens.length; ++i) {
		imageListItens[i].classList.remove('selected-image');
	}
	event.target.classList.add('selected-image');
	selectedImage.src = event.target.src;
}

window.onload = function() {
	selectedImage = document.querySelector('#imglist figure img');

	imageListItens = document.querySelectorAll('#imglist ul li img');
	for (var i = 0; i < imageListItens.length; ++i) {
		imageListItens[i].addEventListener('click', selectImage);
	}
	
	imageListItens[0].classList.add('selected-image');
	selectedImage.src = imageListItens[0].src;
};