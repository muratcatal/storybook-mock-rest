# Storybook Rest Endpoint Mock

![latest-version](https://img.shields.io/github/v/release/muratcatal/storybook-mock-rest?style=plastic) ![npm-version](https://img.shields.io/npm/v/storybook-mock-rest?style=plastic)

Manage and mock your endpoints via Storybook panel

![](https://media.giphy.com/media/YrHTWIiGxI284xIuxt/giphy.gif)

**Currently supports axios library.**

## What you can do?

Mock panel is a storybook addon to help mocking and managing mocked endpoints on a UI.

### Features

- Realistic data generating for response data
- Adding delay to response
- Changing response type dynamicly
- Mocking different response types
- Mocked requests and responses shown in console

### Usage

#### Defining response schema

You can both define your schema props to generate dynamic data or to show directly static data.

- To define dynamic data, start with "$" sign such as $name.firstName
- Arrays in schema
  - To get n number of array items add {{repeat(n)}} to your first item and your array's schema as second item

\*\* We are using FakerJS behind, you can check [FakerJS's Github](https://github.com/marak/Faker.js/) to check their APIs.

```json
{
  "name": "$name.firstName",
  "age": 33,
  "scores": [
    {
      "point": "$random.number"
    }
  ],
  "places": [
    "{{repeat(2)}}",
    {
      "name": "$address.city"
    }
  ]
}
```

Above example will generate

```json
{
  "name": "Murat",
  "age": 33,
  "scores": [
    {
      "point": 5
    }
  ],
  "places": [
    {
      "name": "Istanbul"
    },
    {
      "name": "Ankara"
    }
  ]
}
```

#### Defining endpoints

- Static endpoint: /users/list
- For dynamic endpoints that has dynamic values
  - /users/_/list?page=_&limit=5

You can use asterix char in your endpoints to define that field is dynamic. Above second endpoint will match;

- /users/admin/list?page=1&limite=5
- /users/banned/list?page=2&limite=5

## Installation

```bash
  yarn add storybook-mock-rest -D
```

## Configuration

### Step 1

Add to your storybook's addon config

```javascript
import 'storybook-mock-rest/register';
```

### Step 2

Add a mockify.js file under .storybook folder

```javascript
const mockConfig = () => {
  const config = {
    // path where your mocks will be saved
    mockPath: './mocks',
  };

  return config;
};

module.exports = {
  mockConfig,
};
```

### Step 3

Bind your axios client to our mock api.

```javascript
import { bindMock } from 'storybook-mock-rest';

const axiosClient = axios.create(); // implementation can be changed according to your needs.

bindMock(axiosClient);
```

### Step 4

In your story file, add a mockPanel parameter. Type is the unique identifier that will map your
story with mock panel.

```javascript
export default {
  title: 'My Component',
  component: ListComponent,
  parameters: {
    mockPanel: {
      type: 'list-component',
    },
  },
};
```

### Step 5

You should run a mock server behind to generate dynamic datas. It should be start while you start your storybook. So you can add a simple script to your package.json file to run it.

```json
{
  "scripts": {
    "mock-server": "node ./node_modules/storybook-mock-rest/dist/server.js"
  }
}
```

## NOTES

- You can see your requests and their responses on your console

## Contribution

All contributions are welcome.

For bugs please visit [issues page](https://github.com/muratcatal/storybook-mock-rest/issues)
