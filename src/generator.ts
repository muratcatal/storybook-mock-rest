import MockAdapter from 'axios-mock-adapter';
import faker from 'faker';
import { getEndpoints } from './services';
import { IForm } from './types';

export const bindMock = (configuredAxios: any) => {
    const mock = new MockAdapter(configuredAxios, {
        delayResponse: 300,
    });
    const getMockedApi = async (config: any) => {
        const result = await getEndpoints() as IForm[];
        return result.find(api => {
            const apiUrl = api.endpoint.startsWith('/')
                ? api.endpoint.slice(1)
                : api.endpoint;

            const fullApiUrl = `${config.baseURL || '/'}${apiUrl}`;

            return (
                (fullApiUrl === config.url) &&
                api.method === config.method?.toUpperCase()
            );

        });
    }

    const generateMock = (schema: any) => {
        if (!schema) return;

        const keys = Object.keys(schema);
        for (const key of keys) {
            const value = schema[key];
            if (Array.isArray(value)) {
                let generatedData;
                let amountOfArray = 1;
                if (value.length === 2) {
                    if (value[0].startsWith('{{repeat(')) {
                        const repeatStr = value[0].toString();
                        const startIndex = repeatStr.indexOf('(');
                        const lastIndex = repeatStr.indexOf(')');
                        amountOfArray = repeatStr.substring(startIndex + 1, lastIndex);
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
            } else if (typeof value !== 'object' && value.startsWith('$')) {
                schema[key] = faker.fake(`{{${value.slice(1)}}}`);
            } else if (typeof value === 'object') {
                generateMock(value);
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

    mock.onAny().reply(config => {
        return getMockedApi(config).then(mockedApi => {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    if (mockedApi) {
                        let reponseBody = '';
                        try {
                            reponseBody = JSON.parse(mockedApi?.responseBody)
                        } catch (err) {
                            reponseBody = mockedApi?.responseBody;
                        }
                        const mock = getMockData(
                            +mockedApi.dataAmount,
                            reponseBody
                        );
                        resolve([mockedApi.responseCode, mock]);
                    } else {
                        resolve([500, { success: false }]);
                    }
                }, mockedApi?.delay ?? 0);
            });
        });
    });
};