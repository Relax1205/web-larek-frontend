import { FormErrors, IAppState, IOrder, IOrderForm, IProductItem } from "../types"; // Импорт типов для управления состоянием приложения
import { Model } from "./base/Model"; // Импорт базовой модели

export class AppData extends Model<IAppState> { // Класс AppData для управления данными приложения
  catalog: Product[]; // Список продуктов в каталоге
  preview: string; // ID товара для предпросмотра
  basket: Product[] = []; // Корзина товаров
  order: IOrder = { // Объект заказа с полями по умолчанию
    address: '',
    payment: 'card',
    email: '',
    total: 0,
    phone: '',
    items: []
  };
  formErrors: FormErrors = {}; // Ошибки формы

  clearBasket() { // Метод для очистки корзины и товаров заказа
    this.basket = [];
    this.order.items = [];
  }

  addToOrder(item: Product) { // Метод для добавления товара в заказ
    this.order.items.push(item.id);
  }

  removeFromOrder(item: Product) { // Метод для удаления товара из заказа
    const index = this.order.items.indexOf(item.id);
    if (index >= 0) {
      this.order.items.splice(index, 1); // Удаление элемента по индексу
    }
  }

  setCatalog(items: IProductItem[]) { // Метод для установки каталога товаров
    this.catalog = items.map(item => new Product(item, this.events)); // Создание объектов Product
    this.emitChanges('items:changed', { catalog: this.catalog }); // Отправка события изменения каталога
  }

  setPreview(item: Product) { // Метод для установки товара на предпросмотр
    this.preview = item.id;
    this.emitChanges('preview:changed', item); // Отправка события изменения предпросмотра
  }

  setProductToBasket(item: Product) { // Метод добавления товара в корзину
    // Проверяем, если товар уже в корзине, не добавляем его
    if (!this.basket.some(existingItem => existingItem.id === item.id)) {
      this.basket.push(item); // Добавляем товар в корзину
    }
  }
  
  removeProductToBasket(item: Product) { // Метод удаления товара из корзины
    const index = this.basket.indexOf(item);
    if (index >= 0) {
      this.basket.splice(index, 1); // Удаление товара из корзины по индексу
    }
  }

  get statusBasket(): boolean { // Геттер для проверки пустоты корзины
    return this.basket.length === 0;
  }

  get bskt(): Product[] { // Геттер для получения товаров из корзины
    return this.basket;
  }

  set total(value: number) { // Сеттер для установки итоговой суммы заказа
    this.order.total = value;
  }

  getTotal() { // Метод для подсчета итоговой суммы заказа
    return this.order.items.reduce((a, c) => a + this.catalog.find(it => it.id === c).price, 0);
  }

  setOrderField(field: keyof IOrderForm, value: string) { // Метод для установки поля заказа
    this.order[field] = value;

    if (this.validateOrder()) { // Проверка валидности заказа
        this.events.emit('order:ready', this.order); // Отправка события готовности заказа
    } 
  }

  setContactsField(field: keyof IOrderForm, value: string) { // Метод для установки контактных данных заказа
    this.order[field] = value;

    if (this.validateContacts()) { // Проверка валидности контактных данных
        this.events.emit('order:ready', this.order); // Отправка события готовности заказа
    } 
  }

  validateOrder() { // Метод для проверки валидности заказа
    const errors: typeof this.formErrors = {};

    if (!this.order.address) { // Проверка наличия адреса
      errors.address = 'Необходимо указать адресс';
    }
    this.formErrors = errors; // Установка ошибок формы
    this.events.emit('formErrors:change', this.formErrors); // Отправка события изменения ошибок формы
    return Object.keys(errors).length === 0; // Возвращаем результат проверки
  }

  validateContacts() { // Метод для проверки валидности контактных данных
    const errors: typeof this.formErrors = {};
    if (!this.order.email) { // Проверка наличия email
      errors.email = 'Необходимо указать email';
    }
    if (!this.order.phone) { // Проверка наличия телефона
      errors.phone = 'Необходимо указать телефон';
    }
    this.formErrors = errors; // Установка ошибок формы
    this.events.emit('formErrors:change', this.formErrors); // Отправка события изменения ошибок формы
    return Object.keys(errors).length === 0; // Возвращаем результат проверки
  }
}

export class Product extends Model<IProductItem> { // Класс Product для описания товара
  id: string; // ID товара
  title: string; // Название товара
  description: string; // Описание товара
  category: string; // Категория товара
  image: string; // URL изображения товара
  price: number | null; // Цена товара
}
