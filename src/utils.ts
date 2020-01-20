import { IMockConfig } from "./types";
import appRoot from 'app-root-path';

export const getConfig = () => {
    let config: IMockConfig;
    try {
        config = require(appRoot + '/.storybook/mockify');
    } catch (err) {
        config = require(appRoot + '/mockify');
    }
    return config.mockConfig()
};

export { appRoot };