import { ensureElement } from "../../utils/utils"; // Импорт утилиты ensureElement для безопасного поиска элементов DOM
import { Component } from "../base/Component"; // Импорт базового класса Component
import { IEvents } from "../base/events"; // Импорт интерфейса IEvents для управления событиями

interface IModalData { // Интерфейс данных модального окна
  content: HTMLElement; // Содержимое модального окна
}

export class Modal extends Component<IModalData> { // Класс Modal, наследующий Component с типом IModalData
  protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
  protected _content: HTMLElement; // Контейнер для содержимого модального окна

  constructor(container: HTMLElement, protected events: IEvents) { // Конструктор принимает контейнер и объект событий
    super(container); // Вызов конструктора родителя

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container); // Поиск кнопки закрытия модального окна
    this._content = ensureElement<HTMLElement>('.modal__content', container); // Поиск контейнера для содержимого модального окна

    this._closeButton.addEventListener('click', this.close.bind(this)); // Добавление обработчика события клика на кнопку закрытия
    this.container.addEventListener('click', this.close.bind(this)); // Добавление обработчика клика на контейнер для закрытия модального окна
    this._content.addEventListener('click', (event) => event.stopPropagation()); // Остановка распространения кликов внутри содержимого
  }

  set content(value: HTMLElement) { // Сеттер для установки содержимого модального окна
    this._content.replaceChildren(value); // Заменяет текущее содержимое новым элементом
  }

  open() { // Метод открытия модального окна
      this.container.classList.add('modal_active'); // Добавление класса для активации модального окна
      this.events.emit('modal:open'); // Отправка события открытия модального окна
  }

  close() { // Метод закрытия модального окна
      this.container.classList.remove('modal_active'); // Удаление класса активации модального окна
      this.content = null; // Очищаем содержимое окна
      this.events.emit('modal:close'); // Отправка события закрытия модального окна
  }

  render(data: IModalData): HTMLElement { // Метод рендера модального окна
      super.render(data); // Вызов рендера родителя для установки данных
      this.open(); // Открываем модальное окно после рендера
      return this.container; // Возвращаем контейнер модального окна
  }
}
