import { generateMock, getMockedEndpoint, getMockData } from './generator';
import { IForm } from './types';

const mockedEndpoints: IForm[] = [
  {
    method: 'GET',
    isActive: true,
    endpoint: '/test',
    formId: 1,
    responseBody: 'testBody',
    responseCode: '200',
    delay: 0,
    dataAmount: '1'
  },
  {
    method: 'GET',
    isActive: true,
    endpoint: '/test?q=*&k=1&y=2&z=*&m=3',
    formId: 2,
    responseBody: 'testBody',
    responseCode: '200',
    delay: 0,
    dataAmount: '1'
  },
  {
    method: 'GET',
    isActive: true,
    endpoint: '/test/*/a/b/*/c',
    formId: 3,
    responseBody: 'testBody',
    responseCode: '200',
    delay: 0,
    dataAmount: '1'
  },
  {
    method: 'GET',
    isActive: false,
    endpoint: '/test',
    formId: 4,
    responseBody: 'testBody',
    responseCode: '200',
    delay: 0,
    dataAmount: '1'
  },
  {
    method: 'GET',
    isActive: true,
    endpoint: '/test/*/a/*/b/*?q=1&k=*&l=2',
    formId: 5,
    responseBody: 'testBody',
    responseCode: '200',
    delay: 0,
    dataAmount: '1'
  }
];

interface ICity {
  name: string;
  population: string;
}
interface ICountry {
  name: string;
  cities: (ICity | string)[];
}
interface IMockSchema {
  name?: string;
  surname?: string;
  languages?: string[];
  countries?: (ICountry | string)[]
}
let schema: IMockSchema;
const fakerApi = '$lorem.word';

describe('mock generator', () => {
  beforeEach(() => {
    schema = {};
  });

  test('should not throw exception for mistyped faker api', () => {
    const schema = {
      name: '$name.firstame',
    };
    expect(generateMock(schema).name).toEqual('$name.firstame');
  });

  test('should not generate same objects', () => {
    const schema = {
      name: '$name.firstName',
      surname: '$name.lastName',
      age: 33
    };
    const mocks = getMockData(2, schema) as any[];
    expect(mocks.length).toBe(2);
    expect(mocks[0].name).not.toEqual(mocks[1].name);
    expect(mocks[0].surname).not.toEqual(mocks[1].surname);
    expect(mocks[0].age).toEqual(mocks[1].age);
  });

  test('should not generate array item', () => {
    const schema = {
      languages: [],
      cities: [
        "{{repeat(0)}}",
        {
          name: "$lorem.word"
        }
      ]
    };
    expect(generateMock(schema).languages).toHaveLength(0);
    expect(generateMock(schema).cities).toHaveLength(0);
  });

  test('should generate static schema', () => {
    const schema = {
      name: 'Murat',
      surname: 'Çatal',
      languages: ['Turkish', 'English'],
      places: {
        hometown: 'xxx',
        prop: {
          population: 1000000,
          isCapital: false,
        },
      },
    };
    expect(generateMock(schema)).toEqual(schema);
  });

  test('should generate static & dynamic schema', () => {
    const schema = {
      name: 'Murat',
      surname: 'Çatal',
      languages: [
        {
          name: '$name.firstName',
          date: '$date.recent(2)'
        },
      ],
      places: {
        hometown: 'xxx',
        prop: {
          population: 1000000,
          isCapital: false,
        },
      },
    };
    const generatedMock = generateMock(schema);
    expect(generatedMock.languages).toHaveLength(1);
    expect(generatedMock.languages[0].name).not.toContain("$");
    expect(generatedMock.languages[0].date).not.toContain("$");
    expect(generatedMock.places.prop.population).toEqual(1000000);
  });

  test('should generate dynamic data', () => {
    const schema = {
      name: '$name.firstName',
      surname: '$name.lastName',
      languages: ['{{repeat(2)}}', '$lorem.word'],
      hobies: [],
      friends: [
        '{{repeat(0)}}',
        '$lorem.word'
      ],
      places: {
        hometown: '$address.city',
        prop: {
          population: '$random.number',
          isCapital: '$random.boolean',
        },
      },
    };
    const generatedMock = generateMock(schema);
    expect(generatedMock.name).not.toContain('$');
    expect(generatedMock.languages).toHaveLength(2);
    expect(generatedMock.hobies).toHaveLength(0);
    expect(generatedMock.friends).toHaveLength(0);
    expect(generatedMock.languages[0]).not.toContain('$');
    expect(generatedMock.languages[1]).not.toContain('$');
    expect(generatedMock.places.hometown).not.toContain('$');
    expect(generatedMock.places.prop.isCapital).not.toContain('$');
    expect(generatedMock.places.prop.population).not.toContain('$');
  });

  test('should generate dynamic # of n item in array', () => {
    const schema = {
      name: '$name.firstName',
      surname: '$name.lastName',
      languages: [
        '{{repeat(2)}}',
        {
          name: '$lorem.word',
        },
      ],
      places: {
        hometown: '$address.city',
        prop: {
          population: '$random.number',
          isCapital: '$random.boolean',
        },
      },
    };
    const generatedMock = generateMock(schema);
    expect(generatedMock.languages).toHaveLength(2);
  });
});

describe('getMockApi', () => {
  test('should return endpoint without params', () => {
    const endpoint = getMockedEndpoint(mockedEndpoints, {
      url: '/test',
      method: 'get'
    });

    expect(endpoint?.endpoint).toEqual(mockedEndpoints[0].endpoint);
  });

  test('should return endpoint with query params', () => {
    const endpoint = getMockedEndpoint(mockedEndpoints, {
      url: '/test?q=1&k=1&y=2&z=1&m=3',
      method: 'get'
    });

    expect(endpoint?.endpoint).toEqual(mockedEndpoints[1].endpoint);
  });

  test('should return endpoint with path params', () => {
    const endpoint = getMockedEndpoint(mockedEndpoints, {
      url: '/test/123/a/b/333/c',
      method: 'get'
    });

    expect(endpoint?.endpoint).toEqual(mockedEndpoints[2].endpoint);
  });

  test('should not return false actived endpoint', () => {
    const endpoint = getMockedEndpoint(mockedEndpoints, {
      url: '/test',
      method: 'get'
    });

    expect(endpoint?.isActive).toBeTruthy();
    expect(endpoint?.formId).toEqual(mockedEndpoints[0].formId);
  });

  test('should undefined', () => {
    const endpoint = getMockedEndpoint(mockedEndpoints, {
      url: '/test',
      method: 'post'
    });

    expect(endpoint).toBeUndefined();
  });

  test('should return complex url regex', () => {
    const endpoint = getMockedEndpoint(mockedEndpoints, {
      url: '/test/q/a/w/b/e?q=1&k=3&l=2',
      method: 'get'
    });

    expect(endpoint?.formId).toEqual(5);
  });
})