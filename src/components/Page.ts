import { ensureElement } from "../utils/utils"; // Импорт утилиты для обеспечения элемента
import { Component } from "./base/Component"; // Импорт базового компонента
import { IEvents } from "./base/events"; // Импорт интерфейса для работы с событиями

// Интерфейс, описывающий структуру данных страницы
interface IPage {
  catalog: HTMLElement[]; // Массив элементов каталога
}

// Класс для работы с компонентами страницы
export class Page extends Component<IPage> {
  protected _counter: HTMLElement; // Элемент счетчика корзины
  protected _catalog: HTMLElement; // Элемент каталога
  protected _wrapper: HTMLElement; // Обертка страницы
  protected _basket: HTMLElement; // Элемент корзины

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container); // Вызов конструктора родительского класса

    // Обеспечение наличия элементов на странице
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');

    // Добавление обработчика события для открытия корзины
    this._basket.addEventListener('click', () => {
      this.events.emit('basket:open'); // Эмитирование события открытия корзины
    });
  }

  // Сеттер для установки значения счетчика корзины
  set counter(value: number) {
    this.setText(this._counter, String(value)); // Установка текста в элемент счетчика
  }

  // Сеттер для обновления каталога товаров
  set catalog(items: HTMLElement[]) {
      this._catalog.replaceChildren(...items); // Замена содержимого каталога
  }

  // Сеттер для блокировки/разблокировки обертки страницы
  set locked(value: boolean) {
    if (value) {
        this._wrapper.classList.add('page__wrapper_locked'); // Добавление класса блокировки
    } else {
        this._wrapper.classList.remove('page__wrapper_locked'); // Удаление класса блокировки
    }
  }
}
