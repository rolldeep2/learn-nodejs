console.log('hello, world');

interface ICloth {
  top: string;
  bottom: string;
  socks: string | null;
  hat?: string | null;
}

interface IPerson {
  id: number;
  name: string;
  age: number;
  cloth: ICloth;
}

const me: IPerson = {
  id: 1,
  name: '이영우',
  age: 28,
  cloth: {
    top: 'white shirt',
    bottom: 'black pants',
    socks: 'black socks',
  },
};

console.log(me);
