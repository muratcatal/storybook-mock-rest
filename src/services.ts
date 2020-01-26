import { IForm } from "./types";
import { PORT } from "./constants";

export const getEndpoints = async (): Promise<IForm[] | null> => {
    try {
        const response = await fetch(`http://localhost:${PORT}/endpoints`);
        if (response.status === 200) {
            let forms: IForm[] = [];
            const data = await response.json();
            data.forEach((api: IForm, index: number) => {
                let obj: IForm = {
                    formId: index,
                    endpoint: api.endpoint,
                    method: api.method,
                    responseBody: JSON.stringify(api.responseBody, null, 2),
                    responseCode: api.responseCode,
                    delay: api.delay,
                    dataAmount: api.dataAmount || '1',
                    isActive: Boolean(api.isActive)
                };

                forms.push(obj);
            });
            return forms;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export const getEndpoint = async (type: string): Promise<IForm[] | null> => {
    try {
        const response = await fetch(`http://localhost:${PORT}/endpoints/${type}`);
        if (response.status === 200) {
            let forms: IForm[] = [];
            const data = await response.json();
            data.forEach((api: IForm, index: number) => {
                let obj: IForm = {
                    formId: index,
                    endpoint: api.endpoint,
                    method: api.method,
                    responseBody: JSON.stringify(api.responseBody, null, 2),
                    responseCode: api.responseCode,
                    delay: api.delay,
                    dataAmount: api.dataAmount || '1',
                    isActive: Boolean(api.isActive)
                };

                forms.push(obj);
            });
            return forms;
        }
        return null;
    } catch (err) {
        return null;
    }
}

export const saveEndpoint = async (type: string, form: Omit<IForm, 'formId'>[]) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(form)
        };
        const result = await fetch(`http://localhost:${PORT}/endpoints/${type}`, requestOptions);
        if (result.status === 200) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}