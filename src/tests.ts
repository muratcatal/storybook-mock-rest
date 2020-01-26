import { generateMock, getMockedEndpoint } from './generator';
import { IForm } from './types';

// const schemas = [
//   [{
//     name: 'Murat',
//     surname: 'Çatal',
//     languages: ['Turkish', 'English'],
//     places: {
//       hometown: 'xxx',
//       prop: {
//         population: 1000000,
//         isCapital: false,
//       },
//     },
//   },'static schema',],
//   {
//     name: 'Murat',
//     surname: 'Çatal',
//     languages: [
//       {
//         name: '$name.firstName',
//       },
//     ],
//     places: {
//       hometown: 'xxx',
//       prop: {
//         population: 1000000,
//         isCapital: false,
//       },
//     },
//   },
//   {
//     name: '$name.firstName',
//     surname: '$name.lastName',
//     languages: ['{{repeat(2)}}', '$lorem.word'],
//     places: {
//       hometown: '$address.city',
//       prop: {
//         population: '$random.number',
//         isCapital: '$random.boolean',
//       },
//     },
//   },
//   {
//     name: '$name.firstName',
//     surname: '$name.lastName',
//     languages: [
//       '{{repeat(2)}}',
//       {
//         name: '$lorem.word',
//       },
//     ],
//     places: {
//       hometown: '$address.city',
//       prop: {
//         population: '$random.number',
//         isCapital: '$random.boolean',
//       },
//     },
//   },
// ];

// describe('mock generator',()=> {
//   test.each(schemas)('test',()=> {
//     const mock = generateMock(schemas);
//   })
// })

describe('mock generator', () => {
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
    expect(generateMock(schema)).toEqual(schema);
  });

  test('should generate dynamic data', () => {
    const schema = {
      name: '$name.firstName',
      surname: '$name.lastName',
      languages: ['{{repeat(2)}}', '$lorem.word'],
      places: {
        hometown: '$address.city',
        prop: {
          population: '$random.number',
          isCapital: '$random.boolean',
        },
      },
    };
    expect(generateMock(schema)).toBeTruthy();
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
    expect(generateMock(schema).languages).toHaveLength(2);
  });
});

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