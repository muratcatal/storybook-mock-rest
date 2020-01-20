export interface IForm {
    formId: number;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    responseBody: string;
    responseCode: string;
    delay: number;
    dataAmount: string;
    hideForm?: boolean;
    isActive?: boolean;
}

export interface IPanelParams {
    type: string;
}

export interface IMockConfig {
    mockConfig: () => {
        mockPath: string;
    }
}