// Подключение функционала "Чертогов Фрилансера"
import { isMobile, getHash } from "../functions.js";
// Импорт класса наблюдателя.
import { ScrollWatcher } from "../../libs/watcher.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "./gotoblock.js";
// Переменная контроля добавления события window scroll.
let addWindowScrollEvent = false;
//====================================================================================================================================================================================================================================================================================================

// При подключении модуля обработчик события запустится автоматически
setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event("windowScroll");
    window.addEventListener("scroll", function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);
