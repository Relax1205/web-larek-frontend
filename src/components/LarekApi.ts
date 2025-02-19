import { IOrder, IOrderResult, IProductItem } from "../types"; // Импорт типов данных
import { Api, ApiListResponse } from "./base/api"; // Импорт базового API класса и ответов

export class LarekApi extends Api { // Класс для работы с API Larek, наследует от базового Api
  cdn: string; // Свойство для хранения CDN (Content Delivery Network) URL

  constructor(cdn: string, baseUrl: string, options?: RequestInit) { // Конструктор для инициализации базового URL и CDN
    super(baseUrl, options); // Вызов конструктора родительского класса
    this.cdn = cdn; // Установка CDN
  }

  // Метод для получения списка продуктов
  getProductList() {
    return this.get('/product') // Отправка GET-запроса по пути '/product'
      .then((data: ApiListResponse<IProductItem>) => { // Ожидаемый ответ - список товаров
        return data.items.map((item) => ({ ...item })); // Возвращаем массив товаров
      });
  }

  // Метод для размещения заказа
  orderProducts(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order) // Отправка POST-запроса на создание заказа
      .then((data: IOrderResult) => data); // Возвращаем результат заказа
  }
}
