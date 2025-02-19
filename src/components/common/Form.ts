import { ensureElement } from "../../utils/utils"; // Импорт утилиты ensureElement для поиска элементов в DOM
import { Component } from "../base/Component"; // Импорт базового класса Component
import { IEvents } from "../base/events"; // Импорт интерфейса IEvents для управления событиями

interface IFormState { // Интерфейс состояния формы
  valid: boolean; // Флаг валидности формы
  errors: string[]; // Список ошибок формы
}

export class Form<T> extends Component<IFormState> { // Класс Form, наследующий Component с типом IFormState
  protected _submit: HTMLButtonElement; // Кнопка отправки формы
  protected _errors: HTMLElement; // Элемент для отображения ошибок формы

  constructor(protected container: HTMLFormElement, protected events: IEvents) { // Конструктор принимает контейнер формы и объект событий
      super(container); // Вызов конструктора родителя

      this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container); // Поиск кнопки отправки формы
      this._errors = ensureElement<HTMLElement>('.form__errors', this.container); // Поиск элемента для отображения ошибок

      this.container.addEventListener('input', (e: Event) => { // Добавление обработчика события ввода
          const target = e.target as HTMLInputElement; // Приведение цели события к HTMLInputElement
          const field = target.name as keyof T; // Получение имени поля как ключа типа T
          const value = target.value; // Получение значения поля
          this.onInputChange(field, value); // Вызов метода обработки изменения ввода
      });

      this.container.addEventListener('submit', (e: Event) => { // Добавление обработчика события отправки формы
          e.preventDefault(); // Отключение стандартного поведения отправки формы
          this.events.emit(`${this.container.name}:submit`); // Отправка события с именем формы
      });
  }

  protected onInputChange(field: keyof T, value: string) { // Метод обработки изменения ввода
      this.events.emit(`${this.container.name}.${String(field)}:change`, { // Отправка события изменения поля формы
          field, // Имя поля
          value // Значение поля
      });
  }

    // Сеттер для установки валидности формы
    set valid(value: boolean) {
        this._submit.disabled = !value; // Отключение кнопки отправки, если форма невалидна
    }
  
    // Новый метод для ручного управления состоянием кнопки "Купить"
    disableBuyButton() {
        if (this._submit) {
         this._submit.disabled = true; // Явно отключаем кнопку
        }
    }
  
  enableBuyButton() {
    if (this._submit) {
      this._submit.disabled = false; // Включаем кнопку
    }
  }
  
  set errors(value: string) { // Сеттер для установки текста ошибок формы
      this.setText(this._errors, value); // Установка текста ошибок через метод setText
  }

  render(state: Partial<T> & IFormState) { // Метод рендера формы с обновлением состояния
      const {valid, errors, ...inputs} = state; // Деструктуризация состояния на валидность, ошибки и поля формы
      super.render({valid, errors}); // Вызов рендера родителя для обновления валидности и ошибок
      Object.assign(this, inputs); // Копирование полей формы в экземпляр класса
      return this.container; // Возвращаем контейнер формы
  }
}
