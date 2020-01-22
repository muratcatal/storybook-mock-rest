import { generateMock } from './generator';

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
