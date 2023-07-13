// Подключение функционала "Чертогов Фрилансера"
// Подключение списка активных модулей
import { flsModules } from "../modules.js";
// Вспомогательные функции
import {
  isMobile,
  _slideUp,
  _slideDown,
  _slideToggle,
  FLS,
} from "../functions.js";
// Модуль прокрутки к блоку
import { gotoBlock } from "../scroll/gotoblock.js";
//================================================================================================================================================================================================================================================================================================================================

/*
Чтобы поле участвовало в валидации добавляем атрибут data-required
Особые проверки:
data-required="email" - вадидация E-mail

Чтобы поле валидировалось при потере фокуса, 
к атрибуту data-required добавляем атрибут data-validate

Чтобы вывести текст ошибки, нужно указать его в атрибуте data-error

data-popup-message - указываем селектор попапа который нужно показать после отправки формы (режимы data-ajax или data-dev) ! необходимо подключить функционал попапов в app.js
data-ajax - отправляем данные формы AJAX запросом по адресу указанному в action методом указанным в method
data-dev - режим разработчика - эмитируем отправку формы
data-goto-error - прокрутить страницу к ошибке
*/

// Работа с полями формы. Добавление классов, работа с placeholder

export function formFieldsInit() {
  const formFields = document.querySelectorAll(
    "input[placeholder],textarea[placeholder]"
  );
  if (formFields.length) {
    formFields.forEach((formField) => {
      formField.dataset.placeholder = formField.placeholder;
    });
  }
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if (
      targetElement.tagName === "INPUT" ||
      targetElement.tagName === "TEXTAREA"
    ) {
      if (targetElement.dataset.placeholder) {
        targetElement.placeholder = "";
      }
      targetElement.classList.add("_form-focus");
      targetElement.parentElement.classList.add("_form-focus");

      formValidate.removeError(targetElement);
    }
  });
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if (
      targetElement.tagName === "INPUT" ||
      targetElement.tagName === "TEXTAREA"
    ) {
      if (targetElement.dataset.placeholder) {
        targetElement.placeholder = targetElement.dataset.placeholder;
      }
      targetElement.classList.remove("_form-focus");
      // targetElement.parentElement.classList.remove('_form-focus');

      // Моментальная валидация
      if (targetElement.hasAttribute("data-validate")) {
        formValidate.validateInput(targetElement);
      }
    }
  });
}
// Валидация форм
export let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll("*[data-required]");
    if (formRequiredItems.length) {
      formRequiredItems.forEach((formRequiredItem) => {
        if (
          (formRequiredItem.offsetParent !== null ||
            formRequiredItem.tagName === "SELECT") &&
          !formRequiredItem.disabled
        ) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;
    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
      }
    } else if (
      formRequiredItem.type === "checkbox" &&
      !formRequiredItem.checked
    ) {
      this.addError(formRequiredItem);
      error++;
    } else {
      if (!formRequiredItem.value) {
        this.addError(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
      }
    }
    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add("_form-error");
    formRequiredItem.parentElement.classList.add("_form-error");
    let inputError =
      formRequiredItem.parentElement.querySelector(".form__error");
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML(
        "beforeend",
        `<div class="form__error">${formRequiredItem.dataset.error}</div>`
      );
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove("_form-error");
    formRequiredItem.parentElement.classList.remove("_form-error");
    if (formRequiredItem.parentElement.querySelector(".form__error")) {
      formRequiredItem.parentElement.removeChild(
        formRequiredItem.parentElement.querySelector(".form__error")
      );
    }
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll("input,textarea");
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove("_form-focus");
        el.classList.remove("_form-focus");
        formValidate.removeError(el);
      }
      let checkboxes = form.querySelectorAll(".checkbox__input");
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
        }
      }
      if (flsModules.select) {
        let selects = form.querySelectorAll(".select");
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector("select");
            flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
      formRequiredItem.value
    );
  },
};
/* Отправка форм */
export function formSubmit(validate) {
  if (flsModules.popup) {
    flsModules.popup.open("some");
  }
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener("submit", function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener("reset", function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }
  async function formSubmitAction(form, e) {
    const error = validate ? formValidate.getErrors(form) : 0;
    if (error === 0) {
      const ajax = form.hasAttribute("data-ajax");
      if (ajax) {
        // Если режим ajax
        e.preventDefault();
        const formAction = form.getAttribute("action")
          ? form.getAttribute("action").trim()
          : "#";
        const formMethod = form.getAttribute("method")
          ? form.getAttribute("method").trim()
          : "GET";
        const formData = new FormData(form);

        form.classList.add("_sending");
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData,
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove("_sending");
          formSent(form);
        } else {
          alert("Ошибка");
          form.classList.remove("_sending");
        }
      } else if (form.hasAttribute("data-dev")) {
        // Если режим разработки
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      const formError = form.querySelector("._form-error");
      if (formError && form.hasAttribute("data-goto-error")) {
        gotoBlock(formError, true, 1000);
      }
    }
  }
  // Действия после отправки формы
  function formSent(form) {
    // Создаем событие отправки формы
    document.dispatchEvent(
      new CustomEvent("formSent", {
        detail: {
          form: form,
        },
      })
    );
    // Показываем попап, если подключен модуль попапов
    // и для формы указана настройка
    setTimeout(() => {
      if (flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? flsModules.popup.open(popup) : null;
      }
    }, 0);
    // Очищаем форму
    formValidate.formClean(form);
    // Сообщаем в консоль
    formLogging(`Форма отправлена!`);
  }
  function formLogging(message) {
    FLS(`[Формы]: ${message}`);
  }
}
