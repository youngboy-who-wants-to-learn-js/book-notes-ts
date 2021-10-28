class Person {
  constructor(public name: string, public year: number) {}
}

const personVlad = new Person("vlad", 21);
console.log(personVlad);

//----

let user: { readonly name: string } = {
  name: "Vlad",
};

//---

let airplaneSeatingAssignments: {
  [key: string]: string;
} = {
  seat1: "test1",
  seat2: "test2",
};

//----
// ([number] | [number, number])[]
let trainFares: [number, number?][] = [[24, 24.4], [1], [12, 23]];

//----

let friends: [string, ...string[]] = ["vlad", "alex", "kirill"];
let list: [number, boolean, ...string[]] = [12, false, "sda", "dfs"];

//---

{
  type A = readonly string[];
  type B = Readonly<string[]>;
  type C = ReadonlyArray<string>;

  type D = readonly [number, string];
  type E = Readonly<[number, string]>;
}

//---

{
  function sum(...numbers: number[]): number {
    return numbers.reduce((a, c) => a + c, 0);
  }

  const result = sum(1, 2, 3);
}

//----

{
  function fancyDate(this: Date) {
    return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`;
  }
  fancyDate.call(new Date());
}

//----

{
  type Log = (message: string, userId?: string) => void;

  let log: Log = (message, userId = "Not logged in") => {
    let time = new Date().toISOString();
    console.log(time, message, userId);
  };
}

//---

{
  function times(f: (index: number) => void, n: number) {
    for (let i = 0; i < n; i++) {
      f(i);
    }
  }

  //   times((n) => console.log(n), 4);
}

//----
{
  /*
  type CreateElement = {
    (tag: "a"): HTMLAnchorElement;
    (tag: "canvas"): HTMLCanvasElement;
    (tag: "table"): HTMLTableElement;
    (tag: string): HTMLElement;
  };

  let createElement: CreateElement = (tag: string): HTMLElement => {
    // ...
  };

    function createElement(tag: 'a'): HTMLAnchorElement 
    function createElement(tag: 'canvas'): HTMLCanvasElement 
    function createElement(tag: 'table'): HTMLTableElement 
    function createElement(tag: string): HTMLElement {
 // ...
}
  */

  // function foo(x: number): void;
  function foo(x: string) {
    switch (typeof x) {
      case "number":
        console.log("number");
        break;
      case "string":
        console.log("string");
        break;
    }
  }
}

//---
// !Обобщенный тип
// type Filter<T> = {
//   (array: T[], f: (item: T) => boolean): T[];
// привязать тип явно, например в const filter: Filter<number> = () =>
// };
{
  type Filter = {
    <T>(array: T[], f: (item: T) => boolean): T[];
  };
  const filter: Filter = (array, callback) => {
    let res = [];

    for (const elem of array) {
      if (callback(elem)) {
        res.push(elem);
      }
    }

    return res;
  };
  // number
  filter([1, 2, 3], (_) => _ > 2);
  // string
  filter(["a", "b"], (_) => _ !== "b");
  // (c) T привязан к {firstName: string}
  let names = [
    { firstName: "beth" },
    { firstName: "caitlyn" },
    { firstName: "xin" },
  ];
  filter(names, (_) => _.firstName.startsWith("b"));

  function map<T, U>(array: T[], f: (item: T) => U): U[] {
    let result = [];
    for (let i = 0; i < array.length; i++) {
      result[i] = f(array[i]);
    }
    return result;
  }
}

//---
//! Псевдонимы обобщенных типов

{
  type MyEvent<T> = {
    target: T;
    type: string;
  };

  type TimedEvent<T> = {
    event: MyEvent<T>;
    from: Date;
    to: Date;
  };
}

//---
// Ограниченный полиморфизм
{
  type TreeNode = {
    value: string;
  };
  type LeafNode = TreeNode & {
    isLeaf: true;
  };
  type InnerNode = TreeNode & {
    children: [TreeNode] | [TreeNode, TreeNode];
  };

  function mapNode<T extends TreeNode>(
    node: T,
    f: (value: string) => string
  ): T {
    return {
      ...node,
      value: f(node.value),
    };
  }
}

//-----
//
{
  function call<T extends unknown[], R>(f: (...args: T) => R, ...args: T): R {
    return f(...args);
  }
}

//-----
// Предустановки обобщенных типов
{
  // @ts-ignore
  type MyEvent<T extends HTMLElement = HTMLElement> = {
    target: T;
    type: string;
  };

  type MyEvent2<
    Type extends string,
    // @ts-ignore
    Target extends HTMLElement = HTMLElement
  > = {
    target: Target;
    type: Type;
  };
}

//! Классы и наследование
//-----
// шахматный движок
{
  type Color = "Black" | "White";
  type File = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H";
  type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  class Game {
    private pieces = Game.makePieces();

    private static makePieces() {
      return [
        // Короли
        new King("White", "E", 1),
        new King("Black", "E", 8),
        // Ферзи
        // new Queen("White", "D", 1),
        // new Queen("Black", "D", 8),
        // // Слоны
        // new Bishop("White", "C", 1),
        // new Bishop("White", "F", 1),
        // new Bishop("Black", "C", 8),
        // new Bishop("Black", "F", 8),
        // ...
      ];
    }
  }

  abstract class Piece {
    protected position: Position;
    constructor(private readonly color: Color, file: File, rank: Rank) {
      this.position = new Position(file, rank);
    }

    moveTo(position: Position) {
      this.position = position;
    }

    abstract canMoveTo(position: Position): boolean;
  }

  class Position {
    constructor(private file: File, private rank: Rank) {}

    distanceFrom(position: Position) {
      return {
        rank: Math.abs(position.rank - this.rank),
        file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0)),
      };
    }
  }

  class King extends Piece {
    canMoveTo(position: Position) {
      let distance = position.distanceFrom(position);
      return distance.rank < 2 && distance.file < 2;
    }
  }
  // class Queen extends Piece {}
  // class Bishop extends Piece {}
  // class Knight extends Piece {}
  // class Rook extends Piece {}
  // class Pawn extends Piece {}
}

//-----
// Использование this в качестве возвращаемого типа
{
  class Set {
    has(value: number): boolean {
      return true;
    }

    add(value: number): this {
      return this;
    }
  }

  class MutableSet extends Set {
    delete(value: number): boolean {
      return true;
    }
  }
}

//! Интерфейсы
//-----
//
{
  type Sushi1 = {
    calories: number;
    salty: boolean;
    tasty: boolean;
  };

  interface Sushi2 {
    calories: number;
    salty: boolean;
    tasty: boolean;
  }

  {
    type Food = {
      calories: number;
      tasty: boolean;
    };

    type Sushi = Food & {
      salty: boolean;
    };

    type Cake = Food & {
      sweet: boolean;
    };
  }
  {
    interface Food {
      calories: number;
      tasty: boolean;
    }
    interface Sushi extends Food {
      salty: boolean;
    }
    interface Cake extends Food {
      sweet: boolean;
    }
  }
}

//-----
// Отличие type от interface
{
  {
    type A = number;
    type B = A | string;
  }

  interface A {
    good(x: number): string;
    bad(x: number): string;
  }
  // @ts-ignore ошибка нельзя расширить при несооответствии
  interface B extends A {
    good(x: string | number): string;
    bad(x: string): string;
  }
  {
    type A = {
      good(x: number): string;
      bad(x: number): string;
    };

    type B = {
      good(x: string | number): string;
      bad(x: string): string;
    } & A;
  }
}

//----
// слияние деклараций
{
  interface User {
    name: string;
  }

  interface User {
    age: number;
  }

  let user: User = {
    name: "User",
    age: 21,
  };
}

//----
// implementation
{
  interface Animal {
    readonly name: string;
    eat(food: string): void;
    sleep(hours: number): void;
  }

  interface Feline {
    meow(): void;
  }

  class Cat implements Animal {
    name = "Cat";

    eat(food: string) {
      console.info("Cat eat ", food);
    }

    sleep(hours: number) {
      console.info("Cat sleep ", hours);
    }

    meow() {
      console.info("meow meow");
    }
  }
}

//----
//
{
  interface MyMap<K, V> {
    get(key: K): V;
    set(key: K, value: V): void;
  }
}

//----
// примeси
{
  type ClassConstructor = new (...args: any[]) => {};

  // @ts-ignore
  function withEZDebug<C extends ClassConstructor<{ getDebugValue(): object }>>(
    Class: C
  ) {
    // @ts-ignore
    return class extends Class {
      debug() {
        let Name = Class.constructor.name;
        // @ts-ignore
        let value = this.getDebugValue();
        return Name + "(" + JSON.stringify(value) + ")";
      }
    };
  }
}

//----
// final class
{
  class MessageQueue {
    private constructor(private messages: string[]) {}
  }
}

//----
// паттерн фабрика - это способ создать объект, на базе которого можно
// формировать объекты схожего типа.
{
  type Shoe = {
    purpose: string;
  };
  class BalletFlat implements Shoe {
    purpose = "dancing";
  }
  class Boot implements Shoe {
    purpose = "woodcutting";
  }
  class Sneaker implements Shoe {
    purpose = "walking";
  }

  let Shoe = {
    create(type: "balletFlat" | "boot" | "sneaker"): Shoe {
      switch (type) {
        case "balletFlat":
          return new BalletFlat();
        case "boot":
          return new Boot();
        case "sneaker":
          return new Sneaker();
      }
    },
  };
}

//----
// Паттерн строитель. Строитель является способом отделить конструкцию объекта от его
// фактической реализации
{
  class RequestBuilder {
    private data: object | null = null;
    private method: "get" | "post" | null = null;
    private url: string | null = null;
    setMethod(method: "get" | "post"): this {
      this.method = method;
      return this;
    }
    setData(data: object): this {
      this.data = data;
      return this;
    }
    setURL(url: string): this {
      this.url = url;
      return this;
    }
    send() {
      // ...
    }
  }
}

//----
//
{
  class Animal {}
  class Bird extends Animal {
    chirp() {}
  }
  class Crow extends Bird {
    caw() {}
  }

  function chirp(bird: Bird): Bird {
    bird.chirp();
    return bird;
  }

  // chirp(new Animal());
  chirp(new Bird());
  chirp(new Crow());
}
//----
// Проверка лишних свосйтв
{
  type Options = {
    baseURL: string;
    cacheSize?: number;
    tier?: "prod" | "dev";
  };

  class API {
    constructor(private options: Options) {}
  }

  new API({
    baseURL: "https://api.mysite.com",
    tier: "prod",
  });

  new API({
    baseURL: "https://api.mysite.com",
    // @ts-ignore
    badTier: "prod", // Ошибка TS2345: аргумент типа '{baseURL:
  }); // string; badTier: string}' несовместим
  // с параметром типа 'Options'.

  new API({
    baseURL: "https://api.mysite.com",
    badTier: "prod",
  } as Options);

  let badOptions = {
    baseURL: "https://api.mysite.com",
    badTier: "prod",
  };

  new API(badOptions);

  let options: Options = {
    baseURL: "https://api.mysite.com",
    // @ts-ignore
    badTier: "prod", // Ошибка TS2322: тип '{baseURL: string;
  }; // badTier: string}'несовместим с типом
  // 'Options'.

  new API(options);
}
//----
// уточнение
{
  // Мы используем объединение строчных литералов для описания
  // возможных значений, которые может иметь единица измерения CSS
  type Unit = "cm" | "px" | "%";

  // Перечисление единиц измерения
  let units: Unit[] = ["cm", "px", "%"];

  // Проверить каждую ед. изм. и вернуть null, если не будет совпадений
  function parseUnit(value: string): Unit | null {
    for (let i = 0; i < units.length; i++) {
      if (value.endsWith(units[i])) {
        return units[i];
      }
    }
    return null;
  }

  type Width = {
    unit: Unit;
    value: number;
  };
  function parseWidth(width: number | string | null | undefined): Width | null {
    // Если width — null или undefined, вернуть заранее.
    if (width == null) {
      return null;
    }
    // Если width — number, предустановить пикселы.
    if (typeof width === "number") {
      return { unit: "px", value: width };
    }
    // Попытка получить единицы измерения из width.
    let unit = parseUnit(width);
    if (unit) {
      return { unit, value: parseFloat(width) };
    }
    // В противном случае вернуть null.
    return null;
  }
}
//----
//Типы размеченного объединениЯ
{
  type UserTextEvent = {
    type: "TextEvent";
    value: string; // @ts-ignore
    target: HTMLInputElement;
  };
  type UserMouseEvent = {
    type: "MouseEvent";
    value: [number, number]; // @ts-ignore
    target: HTMLElement;
  };
  type UserEvent = UserTextEvent | UserMouseEvent;
  function handle(event: UserEvent) {
    if (event.type === "TextEvent") {
      event.value; // string
      event.target; // HTMLInputElement
      // ...
      return;
    }
    event.value; // [number, number]
    event.target; // HTMLElement
  }
}
//----
//
{
  type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  type Day = Weekday | "Sat" | "Sun";
  // если не обработать все случаи, тайпскрипт может выдасть ошибку, что надо либо доработать все или возвраать Day | undefined
  function getNextDay(w: Weekday): Day | undefined {
    switch (w) {
      case "Mon":
        return "Tue";
      case "Fri":
        return "Sat";
      // case "Tue":
      //   return "Wed";
      // case "Wed":
      //   return "Thu";
      // case "Thu":
      //   return "Fri";
    }
  }
}
//----
// Оператор подключения (key in)
{
  type APIResponse = {
    user: {
      userId: string;
      friendList: {
        count: number;
        friends: {
          firstName: string;
          lastName: string;
        }[];
      };
    };
  };

  type FriendList = APIResponse["user"]["friendList"];
  function renderFriendList(friendList: FriendList) {
    // ...
  }
}
//----
// Оператор ( keyof )
{
  type APIResponse = {
    user: {
      userId: string;
      friendList: {
        count: number;
        friends: {
          firstName: string;
          lastName: string;
        }[];
      };
    };
  };
  type ResponseKeys = keyof APIResponse; // 'user'
  type UserKeys = keyof APIResponse["user"]; // 'userId' | 'friendList'
  type FriendListKeys = keyof APIResponse["user"]["friendList"]; // 'count' | 'friends'

  type ActivityLog = {
    lastEvent: Date;
    events: {
      id: string;
      timestamp: Date;
      type: "Read" | "Write";
    }[];
  };

  type Get = {
    <O extends object, K1 extends keyof O>(o: O, k1: K1): O[K1];
    <O extends object, K1 extends keyof O, K2 extends keyof O[K1]>(
      o: O,
      k1: K1,
      k2: K2
    ): O[K1][K2];
    <
      O extends object,
      K1 extends keyof O,
      K2 extends keyof O[K1],
      K3 extends keyof O[K1][K2]
    >(
      o: O,
      k1: K1,
      k2: K2,
      k3: K3
    ): O[K1][K2][K3];
  };
  let get: Get = (object: any, ...keys: string[]) => {
    let result = object;
    keys.forEach((k) => (result = result[k]));
    return result;
  };

  get(
    {
      lastEvent: new Date(),
      events: {
        id: "sda",
        timestamp: new Date(),
        type: "Read",
      },
    },
    "events",
    "type"
  );
}

//----
// Tип Record
{
  type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  type Day = Weekday | "Sat" | "Sun";

  let nextDay: Record<Weekday, Day> = {
    Mon: "Tue",
    Tue: "Wed",
    Wed: "Thu",
    Thu: "Fri",
    Fri: "Sat",
  };
}
//----
// Отображенные типы
{
  type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
  type Day = Weekday | "Sat" | "Sun";
  //  nextDay —  это объект с ключом для каждого Weekday, чье значение — это Day

  let nextDay: { [K in Weekday]: Day } = {
    Mon: "Tue",
    Tue: "Wed",
    Wed: "Thu",
    Thu: "Fri",
    Fri: "Sat",
  };

  type Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type Account = {
    id: number;
    isEmployee: boolean;
    notes: string[];
  };
  // Сделать все поля опциональными
  type OptionalAccount = {
    [K in keyof Account]?: Account[K];
  };
  // Сделать все поля допускающими null
  type NullableAccount = {
    [K in keyof Account]: Account[K] | null;
  };
  // Сделать все поля read-only
  type ReadonlyAccount = {
    readonly [K in keyof Account]: Account[K];
  };
  // Снова сделать все поля записываемыми (эквивалент Account)
  type Account2 = {
    -readonly [K in keyof ReadonlyAccount]: Account[K];
  };

  // Снова сделать все поля обязательными (эквивалент Account)
  type Account3 = {
    [K in keyof OptionalAccount]-?: Account[K];
  };
}
//----
// Встроенные отображенные типы
{
  // Record<Keys, Values>
  // Объект с ключами типа Keys и значениями типа Values.
  // Partial<Object>
  // Помечает каждое поле в Object как опциональное.
  // Required<Object>
  // Помечает каждое поле в Object как обязательное.
  // Readonly<Object>
  // Помечает каждое поле в Object только для чтения.
  // Pick<Object, Keys>
  // Возвращает подтип Object только с заданными Keys.
}
//----
// Паттерн объект-компаньон
{
  type Currency = {
    unit: "EUR" | "GBP" | "JPY" | "USD";
    value: number;
  };
  // @ts-ignore
  let Currency = {
    DEFAULT: "USD",
    from(value: number, unit = Currency.DEFAULT): Currency {
      return { unit, value };
    },
  };

  /*
import {Currency} from './Currency'
let amountDue: Currency = {
 unit: 'JPY',
 value: 83733.10
}
let otherAmountDue = Currency.from(330, 'EUR')
  Используйте этот паттерн, когда тип и объект семантически связаны, 
  а объект предоставляет служебные методы, которые оперируют с типом.
  МОжно импортировать и то и другое за раз
*/
}
//----
// as const
{
  let e = [1, { x: 2 }] as const;
  let x = { a: 1, b: 2 } as const;
  // x.a = 4; не можем, потому что это readonly свойство
}
//----
// сделать кортеж
{
  function tuple<T extends unknown[]>(...ts: T): T {
    return ts;
  }

  let a = tuple(1, false, "a");
  type x = typeof a;
  let arr: x = [1, true, "3"];
}
//----
// Пользовательские защиты типов
{
  // :boolean
  function isString(a: unknown): a is string {
    return typeof a === "string";
  }

  function parseInput(input: string | number) {
    let formattedInput: string;
    if (isString(input)) {
      formattedInput = input.toUpperCase(); // Ошибка TS2339: свойство
      // 'toUpperCase' не существует
    } // в типе 'number'.
  }
}
//----
// условные типы
{
  type IsString<T> = T extends string ? true : false;
  type A = IsString<string>; // true
  type B = IsString<number>; // false
}
//----
// Распределение условных типов
{
  /*
  string extends T ? A : B
  string extends T ? A : B

  (string | number) extends T ? 
  A : B
  (string extends T ? A : B) | 
  (number extends T ? A : B)

  (string | number | boolean) 
  extends T ? A : B
  (string extends T ? A : B) | 
  (number extends T ? A : B) | 
  (boolean extends T ? A : B)
  */
  // Without<T, U>, вычисляющее, какие типы есть в T, но отсутствуют в U
  type Without<T, U> = T extends U ? never : T;
  type A = Without<boolean | number | string, boolean>; // number | string

  /*
  1. Начнем с вводных данных:
  type A = Without<boolean | number | string, boolean>
  2. Распределим условие по объединению:
  type A = Without<boolean, boolean>
  | Without<number, boolean>
  | Without<string, boolean>
  3. Сделаем подстановку в определение Without и применим T и U: 
  type A = (boolean extends boolean ? never : boolean)
  | (number extends boolean ? never : number)
  | (string extends boolean ? never : string)
  4. Вычислим условия:
  type A = never
  | number
  | string
  5. Упростим:
  type A = number | string
  */
}
//----
// Ключевое слово infer - объявление обобщенного типа
{
  type ElementType<T> = T extends unknown[] ? T[number] : T;
  type A = ElementType<number[]>; // number

  type ElementType2<T> = T extends (infer U)[] ? U : T;
  type B = ElementType2<number[]>; // number
  /*
  type SecondArg<F> = F extends (a: any, b: infer B) => any ? B : never
   Получаем тип Array.slice
  type F = typeof Array['prototype']['slice']
  type A = SecondArg<F> // number | undefined

  второй аргумент [].slice является number | undefined, и мы 
узнаем об этом в процессе компиляции
  */
}
//----
// Bстроенные условные типы
{
  /**
   Exclude<T, U>
  Подобно уже знакомому типу Without, он вычисляет, какие типы есть 
  в T, но отсутствуют в U:
  type A = number | string
  type B = string
  type C = Exclude<A, B> // number
  Extract<T, U>
  Вычисляет типы в T, которые можно присвоить U:
  type A = number | string
  type B = string
  type C = Extract<A, B> // string
  NonNullable<T>
  Вычисляет версию T, исключающую null и undefined:
  type A = {a?: number | null}
  type B = NonNullable<A['a']> // number
  ReturnType<F>
  Вычисляет возвращаемый тип функции (вопреки ожиданиям, это не 
  сработает для обобщенных типов и перегруженных функций):
  type F = (a: number) => string
  type R = ReturnType<F> // string
  InstanceType<C>
  Вычисляет тип экземпляра конструктора класса:
  type A = {new(): B}
  type B = {b: number}
  type I = InstanceType<A> // {b: number}
   */
}
//----
// Утверждения типов
{
  function formatInput(input: string) {
    // ...
  }
  function getUserInput(): string | number {
    // ...
    return "";
  }
  let input = getUserInput();
  // Утверждение, что input это string
  formatInput(input as string);
  // Его эквивалент
  formatInput(<string>input);
}
//----
// !Ненулевые утверждения
{
  // TypeScript предпологает,
  // что тип определен: T | null | undefined станет T, number | string | null
  // станет number | string и т. д.
}
//----
// Утверждения явного присваивания
{
  let userId!: string;
  fetchUser();
  userId.toUpperCase(); // OK
  function fetchUser() {
    // userId = globalCache.get("userId");
  }
}
//----
//
function tuple<T extends unknown[]>(...ts: T): T {
  return ts;
}
// Сообщаем TypeScript о .zip
interface Array<T> {
  zip<U>(list: U[]): [T, U][];
}
// Реализуем .zip
Array.prototype.zip = function <T, U>(this: T[], list: U[]): [T, U][] {
  return this.map((v, k) => tuple(v, list[k]));
};

// !Обработка ошибок ts

// Проверка допустимости указанной даты
function isValid(date: Date) {
  return (
    Object.prototype.toString.call(date) === "[object Date]" &&
    !Number.isNaN(date.getTime())
  );
}

function ask() {
  // @ts-ignore
  return prompt("When is your birthday?");
}

//----
// return null
{
  function parse(birthday: string): Date | null {
    let date = new Date(birthday);
    if (!isValid(date)) {
      return null;
    }
    return date;
  }

  let date = parse(ask());
  if (date) {
    console.info("Date is", date.toISOString());
  } else {
    console.error("Error parsing date for some reason");
  }
}

//----
// throw error
{
  // Кастомизированные типы ошибок
  class InvalidDateFormatError extends RangeError {}
  class DateIsInTheFutureError extends RangeError {}

  /**
* @throws {InvalidDateFormatError} Пользователь некорректно ввел 
дату рождения.
* @throws {DateIsInTheFutureError} Пользователь ввел дату рождения 
из будущего.
*/
  function parse(birthday: string): Date {
    let date = new Date(birthday);
    if (!isValid(date)) {
      throw new InvalidDateFormatError("Enter a date in the form YYYY/MM/DD");
    }
    if (date.getTime() > Date.now()) {
      throw new DateIsInTheFutureError("Are you a timelord?");
    }
    return date;
  }

  try {
    let date = parse(ask());
    console.info("Date is", date.toISOString());
  } catch (e) {
    if (e instanceof InvalidDateFormatError) {
      console.error(e.message || e);
    } else if (e instanceof DateIsInTheFutureError) {
      console.error(e.message || e);
    } else {
      throw e;
    }
  }
}
//----
// Возврат исключений
{
  class InvalidDateFormatError extends RangeError {}
  class DateIsInTheFutureError extends RangeError {}
  function parse(
    birthday: string
  ): Date | InvalidDateFormatError | DateIsInTheFutureError {
    let date = new Date(birthday);
    if (!isValid(date)) {
      return new InvalidDateFormatError("Enter a date in the form  YYYY/MM/DD");
    }
    if (date.getTime() > Date.now()) {
      return new DateIsInTheFutureError("Are you a timelord?");
    }
    return date;
  }

  let result = parse(ask()); // Либо дата, либо ошибка.
  if (result instanceof InvalidDateFormatError) {
    console.error(result.message);
  } else if (result instanceof DateIsInTheFutureError) {
    console.info(result.message);
  } else {
    console.info("Date is", result.toISOString());
  }
}
//----
// Пример типизация redis client
type RedisClient = {
  on(event: "ready", f: () => void): void;
  on(event: "error", f: (e: Error) => void): void;
  on(
    event: "reconnecting",
    f: (params: { attempt: number; delay: number }) => void
  ): void;
};

{
  type Events = {
    ready: void;
    error: Error;
    reconnecting: { attempt: number; delay: number };
  };

  type RedisClient = {
    on<E extends keyof Events>(event: E, f: (arg: Events[E]) => void): void;
    emit<E extends keyof Events>(event: E, arg: Events[E]): void;
  };
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
//----
//
{
}
