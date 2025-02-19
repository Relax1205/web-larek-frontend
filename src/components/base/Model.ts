import { IEvents } from "./events"; // Импорт интерфейса IEvents из модуля "events"

export abstract class Model<T> { // Абстрактный класс Model с обобщенным типом T
  constructor(data: Partial<T>, protected events: IEvents) { // Конструктор принимает частичные данные типа T и объект событий
    Object.assign(this, data); // Копирование свойств из объекта данных в текущий экземпляр класса
  }

  emitChanges(event: string, payload?: object) { // Метод для отправки события с необязательным payload
      this.events.emit(event, payload ?? {}); // Вызывает метод emit у объекта событий с указанным событием и данными (пустой объект по умолчанию)
  }
}
