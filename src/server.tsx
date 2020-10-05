import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';
import { PORT, MOCK_FILE_TYPE } from './constants';
import { IForm, IMockConfig } from './types';
import decache from 'decache';
import { getConfig, appRoot } from './utils';

const MOCK_PATH = `${getConfig().mockPath}`;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

const checkMockFolder = () => {
  if (!fs.existsSync(MOCK_PATH)) {
    fs.mkdirSync(MOCK_PATH);
    fs.writeFileSync(`${MOCK_PATH}/index.js`, 'module.exports = []');
  } else if (!fs.existsSync(`${MOCK_PATH}/index.js`)) {
    fs.writeFileSync(`${MOCK_PATH}/index.js`, 'module.exports = []');
  }
};

app.get('/', (req, res) => {
  return res.send('Hello World!');
});

app.get('/endpoints', (req, res) => {
  try {
    checkMockFolder();
    decache(`${appRoot}/${MOCK_PATH}/index.js`);
    const content = require(`${appRoot}/${MOCK_PATH}/index.js`);
    res.status(200).json(content);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get('/endpoints/:type', (req, res) => {
  const { type } = req.params;
  try {
    checkMockFolder();
    const content = fs.readFileSync(
      `${MOCK_PATH}/${type}.${MOCK_FILE_TYPE}`,
      'utf8'
    );
    res.status(200).json(JSON.parse(content));
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post('/endpoints/:type', (req, res) => {
  try {
    const { type } = req.params;
    const body = req.body as IForm;
    checkMockFolder();

    fs.writeFileSync(
      `${MOCK_PATH}/${type}.${MOCK_FILE_TYPE}`,
      JSON.stringify(body, null, 2),
      {
        encoding: 'utf8',
      }
    );

    const content = fs.readFileSync(`${MOCK_PATH}/index.js`, 'utf8');
    if (!content.includes(`./${type}.json`)) {
      debugger;
      const importVariable = type.replace(/[-_]/g, '');
      const newImport = `const ${importVariable} = require('./${type}.json')`;
      const moduleExportMatch = /module\.export/.exec(content);
      let newContent = `module.exports = [...${importVariable}];`;
      if (moduleExportMatch) {
        const lastCharIndex = /\]/gm.exec(content)?.index;
        newContent = `${content.substring(
          0,
          lastCharIndex
        )}, ...${importVariable}]`;
      }
      fs.writeFileSync(
        `${MOCK_PATH}/index.js`,
        `${newImport}\n
          ${newContent};`
      );
    }

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, () =>
  console.log(`Mock server listening on http://localhost:${PORT}!`)
);
