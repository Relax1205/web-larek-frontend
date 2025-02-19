export abstract class Component<T> { // Абстрактный класс Component с обобщенным типом T
  protected constructor(protected readonly container: HTMLElement) {} // Конструктор принимает контейнер, доступный только внутри класса и наследников

  toggleClass(element: HTMLElement, className: string, force?: boolean) { // Метод переключения CSS-класса с возможностью указать состояние
    element.classList.toggle(className, force); // Использует метод toggle для добавления/удаления класса
  }

  setDisabled(element: HTMLElement, state: boolean) { // Метод установки состояния "disabled" для элемента
    if (element) { // Проверка на существование элемента
      if (state) element.setAttribute('disabled', 'disabled'); // Если true, добавляем атрибут disabled
      else element.removeAttribute('disabled'); // Если false, удаляем атрибут disabled
    }
  }

  protected setText(element: HTMLElement, value: unknown) { // Метод установки текстового содержимого элемента
    if (element) { // Проверка на существование элемента
      element.textContent = String(value); // Преобразование значения в строку и установка его как содержимого элемента
    }
  }

  protected setImage(element: HTMLImageElement, src: string, alt?: string) { // Метод установки источника и альтернативного текста для изображения
    if(element) { // Проверка на существование элемента
      element.src = src; // Установка источника изображения
      if(alt) { // Если передан альтернативный текст
        element.alt = alt; // Установка альтернативного текста
      }
    }
  }

  render(data?: Partial<T>): HTMLElement { // Метод рендера с возможностью обновления свойств экземпляра данными
      Object.assign(this as object, data ?? {}); // Копирование данных в текущий экземпляр класса
      return this.container; // Возвращаем контейнер, связанный с компонентом
  }
}
