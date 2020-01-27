import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { getEndpoints } from './services';
import { IForm } from './types';
import url from 'url';

export const getMockedEndpoint = (
  endpoints: IForm[],
  config: {
    url: string;
    method: string;
    baseURL?: string;
  }
) => {
  return endpoints.find(api => {
    const apiUrl = api.endpoint.startsWith('/')
      ? api.endpoint.slice(1)
      : api.endpoint;

    let fullApiUrl: string = `${config.baseURL || '/'}${apiUrl}`;
    if (config.url.startsWith('/') && !fullApiUrl.startsWith('/')) {
      fullApiUrl = '/' + fullApiUrl;
    }
    if (!fullApiUrl.includes('*')) {
      return (
        fullApiUrl === config.url && api.method === config.method?.toUpperCase()
      );
    } else {
      const parsedUrl = url.parse(fullApiUrl, true);
      const pathParams = parsedUrl.pathname?.split('/') ?? [];
      const parsedQueryParams = parsedUrl.query;

      const incomingUrl = url.parse(config.url, true);
      const incomingUrlPathParams = incomingUrl.pathname?.split('/') ?? [];
      const incomingQueryParams = incomingUrl.query;

      if (pathParams?.length !== incomingUrlPathParams.length) {
        return null;
      }

      let continueForQueryParams = true;
      for (let i = 0; i < pathParams.length; i++) {
        if (
          pathParams[i] === '*' ||
          pathParams[i] === incomingUrlPathParams[i]
        ) {
          continue;
        } else if (pathParams[i] !== incomingUrlPathParams[i]) {
          continueForQueryParams = false;
          break;
        }
      }

      if (!continueForQueryParams) {
        return null;
      }

      if (
        Object.keys(parsedQueryParams).length !==
        Object.keys(incomingQueryParams).length
      ) {
        return null;
      }

      const keys = Object.keys(parsedQueryParams);
      let foundApi = true;
      for (let key of keys) {
        if (
          parsedQueryParams[key] === '*' ||
          parsedQueryParams[key] === incomingQueryParams[key]
        ) {
          continue;
        } else {
          foundApi = false;
          break;
        }
      }

      return foundApi;
    }
  });
};

const getMockedApi = async (config: any) => {
  const result = (await getEndpoints()) as IForm[];
  return getMockedEndpoint(result, config);
};

export const generateMock = (schema: any) => {
  if (!schema) return;

  if (typeof schema === 'object') {
    const keys = Object.keys(schema);
    for (const key of keys) {
      const value = schema[key];
      if (Array.isArray(value)) {
        let generatedData;
        let amountOfArray = 1;
        if (value.length === 2 && typeof value[0] === 'string') {
          if (value[0].startsWith('{{repeat(')) {
            const repeatStr = value[0].toString();
            const startIndex = repeatStr.indexOf('(');
            const lastIndex = repeatStr.indexOf(')');
            amountOfArray = +repeatStr.substring(startIndex + 1, lastIndex);
            value.shift();
          }
        }
        const arraySchema = JSON.parse(JSON.stringify(value));
        for (let i = 0; i < amountOfArray; i++) {
          const mValue = JSON.parse(JSON.stringify(arraySchema));
          for (const arrayVal of mValue) {
            generatedData = generateMock(arrayVal);
          }
          if (i === 0) {
            schema[key].pop();
          }
          schema[key].push(generatedData);
        }
      } else if (
        typeof value === 'string' &&
        value.toString().startsWith('$')
      ) {
        const fakerValue: string[] = value.slice(1).split('.');
        schema[key] = faker[fakerValue[0]][fakerValue[1]]();
      } else if (typeof value === 'object') {
        generateMock(value);
      }
    }
  } else {
    if (schema.toString().startsWith('$')) {
      schema = faker.fake(`{{${schema.slice(1)}}}`);
    }
  }
  return schema;
};

const getMockData = (dataAmount: number, schema: any): any => {
  const result: any[] = [];
  for (let i = 0; i < dataAmount; i++) {
    const generatedMock = generateMock(schema);
    result.push(generatedMock);
  }

  return dataAmount === 1 ? result[0] : result;
};

export const bindMock = (configuredAxios: any) => {
  const mock = new MockAdapter(configuredAxios, {
    delayResponse: 300,
  });

  mock.onAny().reply(config => {
    return getMockedApi(config).then(mockedApi => {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          if (mockedApi) {
            let reponseBody = '';
            try {
              reponseBody = JSON.parse(mockedApi?.responseBody);
            } catch (err) {
              reponseBody = mockedApi?.responseBody;
            }
            const mock = getMockData(+mockedApi.dataAmount, reponseBody);
            resolve([mockedApi.responseCode, mock]);
          } else {
            resolve([500, { success: false }]);
          }
        }, mockedApi?.delay ?? 0);
      });
    });
  });
};
