export type ApiListResponse<Type> = { // Определение обобщенного типа для списка с общим количеством элементов
    total: number, // Поле для хранения общего количества элементов
    items: Type[] // Массив элементов типа Type
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'; // Определение типа строковых литералов для HTTP-методов

export class Api { // Определение класса для работы с API
    readonly baseUrl: string; // Базовый URL, неизменяемый после инициализации
    protected options: RequestInit; // Настройки запроса для fetch

    constructor(baseUrl: string, options: RequestInit = {}) { // Конструктор класса принимает базовый URL и опции
        this.baseUrl = baseUrl; // Установка базового URL
        this.options = { // Инициализация настроек с добавлением заголовка 'Content-Type'
            headers: { 
                'Content-Type': 'application/json', // Заголовок по умолчанию для JSON-формата
                ...(options.headers as object ?? {}) // Объединение переданных заголовков с существующими
            }
        };
    }

    protected handleResponse(response: Response): Promise<object> { // Метод для обработки ответа от сервера
        if (response.ok) return response.json(); // Если ответ успешный, возвращаем данные в формате JSON
        else return response.json() // Иначе обрабатываем ошибку
            .then(data => Promise.reject(data.error ?? response.statusText)); // Отклоняем с сообщением об ошибке
    }

    get(uri: string) { // Метод для выполнения GET-запроса
        return fetch(this.baseUrl + uri, { // Выполнение запроса по URI, добавленному к базовому URL
            ...this.options, // Использование настроек запроса
            method: 'GET' // Метод запроса GET
        }).then(this.handleResponse); // Обработка ответа через handleResponse
    }

    post(uri: string, data: object, method: ApiPostMethods = 'POST') { // Метод для выполнения POST/PUT/DELETE-запросов
        return fetch(this.baseUrl + uri, { // Выполнение запроса по URI
            ...this.options, // Использование настроек запроса
            method, // Указанный метод запроса
            body: JSON.stringify(data) // Преобразование данных в строку JSON для тела запроса
        }).then(this.handleResponse); // Обработка ответа через handleResponse
    }
}
