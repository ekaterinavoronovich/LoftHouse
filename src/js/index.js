import mobileNav from './modules/mobile-nav.js';
import mask from './libs/phoneMask/mask.js';


mobileNav();

mask('[data-tel-input]');

// Удаляем '+' если больше ничего не введено, чтобы показать placeholder
const phoneInputs = document.querySelectorAll('[data-tel-input]');
phoneInputs.forEach((input)=>{
	input.addEventListener('input', ()=>{
		if (input.value == '+') input.value = '';
	})
	input.addEventListener('blur', ()=>{
		if (input.value == '+') input.value = '';
	})
});

//Map

	// Функция ymaps.ready() будет вызвана, когда
// загрузятся все компоненты API, а также когда будет готово DOM-дерево.
ymaps.ready(init);
function init(){
	// Создание карты.
	var map = new ymaps.Map('map', {
		// Координаты центра карты.
		// Порядок по умолчанию: «широта, долгота».
		// Чтобы не определять координаты центра карты вручную,
		// воспользуйтесь инструментом Определение координат.
		center: [59.943543, 30.338928],
		// Уровень масштабирования. Допустимые значения:
		// от 0 (весь мир) до 19.
		zoom: 16,
	});

	var myPlacemark = new ymaps.Placemark(
		[59.943543, 30.338928],
		{
			balloonContent: `
				<div class="balloon">
					<div class="balloon__address">Наб. реки Фонтанки 10-15</div>
					<div class="balloon__contacts">
						<a href="tel:+78121234567">+8 (812) 123-45-67</a>
					</div>
				</div>
			`,
		},
		{
			iconLayout: 'default#image',
			iconImageHref: './img/icon/location-pin.svg',
			iconImageSize: [40, 40],
			iconImageOffset: [-20, -40],
		}
	);

	map.controls.remove('geolocationControl'); // удаляем геолокацию
	map.controls.remove('searchControl'); // удаляем поиск
	map.controls.remove('trafficControl'); // удаляем контроль трафика
	map.controls.remove('typeSelector'); // удаляем тип

	// map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
	// map.controls.remove('zoomControl'); // удаляем контрол зуммирования
	map.controls.remove('rulerControl'); // удаляем контрол правил
	map.behaviors.disable(['scrollZoom']); // отключаем скролл карты (опционально)

	map.geoObjects.add(myPlacemark);
    myPlacemark.balloon.open();

}

//youtubeLightbox

// ! Селектор для ссылок - на которых нужно вызывать youtubeLightbox
const linksBtnsSelector = 'a[data-youtubeLightbox]';
// const linksBtnsSelector = '.lightbox';

// load Youtube API code asynchronously
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var isiOS = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)/i) != null; //boolean check for iOS devices

var youtubelightbox = document.getElementById('youtubelightbox');
var player; // variable to hold new YT.Player() instance

// Hide lightbox when clicked on
youtubelightbox.addEventListener(
	'click',
	function () {
		this.style.display = 'none';
		player.stopVideo();
	},
	false
);

// Exclude youtube iframe from above action
youtubelightbox
	.querySelector('.youtubelightbox__centeredchild')
	.addEventListener(
		'click',
		function (e) {
			e.stopPropagation();
		},
		false
	);

// define onYouTubeIframeAPIReady() function and initialize lightbox when API is ready
function onYouTubeIframeAPIReady() {
	createlightbox();
}

// Extracts the Youtube video ID from a well formed Youtube URL
function getyoutubeid(link) {
	// Assumed Youtube URL formats
	// https://www.youtube.com/watch?v=Pe0jFDPHkzo
	// https://youtu.be/Pe0jFDPHkzo
	// https://www.youtube.com/v/Pe0jFDPHkzo
	// and more

	//See http://stackoverflow.com/a/6904504/4360074
	var youtubeidreg =
		/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
	return youtubeidreg.exec(link)[1]; // return Youtube video ID portion of link
}

// Creates a new YT.Player() instance
function createyoutubeplayer(videourl) {
	player = new YT.Player('youtubelightboxPlayer', {
		videoId: videourl,
		playerVars: { autoplay: 1 },
	});
}

// Main Youtube lightbox function
function createlightbox() {
	var targetlinks = document.querySelectorAll(linksBtnsSelector);

	for (var i = 0; i < targetlinks.length; i++) {
		var link = targetlinks[i];
		link._videoid = getyoutubeid(link); // store youtube video ID portion of link inside _videoid property
		targetlinks[i].addEventListener(
			'click',
			function (e) {
				youtubelightbox.style.display = 'block';
				if (typeof player == 'undefined') {
					// if video player hasn't been created yet
					createyoutubeplayer(this._videoid);
				} else {
					if (isiOS) {
						// iOS devices can only use the "cue" related methods
						player.cueVideoById(this._videoid);
					} else {
						player.loadVideoById(this._videoid);
					}
				}
				e.preventDefault();
			},
			false
		);
	}
}

onYouTubeIframeAPIReady();