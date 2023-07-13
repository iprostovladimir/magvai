// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

const addPost = document.querySelector(".btnPost");
const showPost = document.querySelector(".cards__row");
let currentIndex = 0;

const cardsColumns = showPost.querySelectorAll(".cards__column");
const observer = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      if (showPost.classList.contains("_watcher-view")) {
        cardsColumns.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add("new-class");
          }, index * 300);
        });
      }
    }
  }
});

observer.observe(showPost, { attributes: true });

/**
 * Выполняет асинхронный GET-запрос к указанному URL-адресу и передает полученный результат в функцию обратного вызова.
 * @param {function} cb - Функция обратного вызова, которая будет вызвана с полученным результатом в качестве аргумента.
 * @returns {void}
 */
function getPosts(cb) {
  // Создание нового объекта XMLHttpRequest
  const xhr = new XMLHttpRequest();

  // Установка метода и URL-адреса для запроса
  xhr.open(
    "GET",
    "https://my-json-server.typicode.com/iprostovladimir/testbd/db"
  );

  // Обработчик события load, который вызывается при успешном получении ответа
  xhr.addEventListener("load", () => {
    // Парсинг ответа в формат JSON
    const response = JSON.parse(xhr.responseText);
    // Вызов функции обратного вызова с полученным ответом в качестве аргумента
    cb(response);
  });

  // Обработчик события error, который вызывается при ошибке запроса
  xhr.addEventListener("error", () => {
    console.log("error");
  });

  // Отправка запроса
  xhr.send();
}
addPost.addEventListener("click", (e) => {
  getPosts((response) => {
    function handleClick() {
      for (let i = currentIndex; i < currentIndex + 5; i++) {
        let posts = response.posts[i];
        const cardImage = posts.image;
        const cardName = posts.name;
        const cardInfo = posts.info;
        const cardAbout = posts.about;
        const cardData = posts.data;
        let template = `
						<article class="cards__column">
							<div class="cards__column-image">
								<img src="./${cardImage}">
							</div>
								<div class="cards__column-content">
									<h2>${cardName}</h2>
									<h3>${cardInfo}</h3>
									<div class="cards__column-text">
										<p>
											${cardAbout}
										</p>
									</div>
									<div class="cards__column-post">
										${cardData}
									</div>
									<a href="javascript:void(0);" class="cards__column-link">Continue reading</a>
								</div>
						</article>
			`;
        if (i < response.posts.length) {
          // showPost.insertAdjacentHTML('beforeend', template);
          let clone = document.createElement("div");
          clone.innerHTML = template.trim();
          let clonedTemplate = clone.firstChild;

          if (!clonedTemplate.classList.contains("new-class")) {
            if (i >= currentIndex) {
              setTimeout(() => {
                // Добавляем новый класс в клонированную разметку
                clonedTemplate.classList.add("new-class");
              }, (i - currentIndex) * 300);
            }
          }
          // Вставляем клонированную разметку в DOM
          showPost.insertAdjacentElement("beforeend", clonedTemplate);
        }
        if (currentIndex == 15) {
          addPost.style.cssText = `display: none;`;
        }
      }
      currentIndex += 5;
    }
    handleClick();
  });
});
const telInputs = document.querySelectorAll('input[type="tel"]');

telInputs.forEach((input) => {
  Inputmask({ mask: "+7 (999) 999-9999" }).mask(input);
});
