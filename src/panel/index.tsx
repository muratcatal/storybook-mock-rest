import React, { useState, useEffect } from 'react';
import { IForm, IPanelParams } from '../types';
import { useParameter } from '@storybook/api';
import { PARAM_KEY } from '../constants';
import { getEndpoint, saveEndpoint } from '../services';
import {
  PanelHeader,
  SearchWrapper,
  ButtonWrapper,
  PanelWrapper,
} from './styles';
import AceEditor from 'react-ace';
import { Form, Description } from '@storybook/components';

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

const Field = Form.Field;
const Select = Form.Select;
const Button = Form.Button;
const Input = Form.Input;

export const Panel: React.FC = () => {
  const [forms, setForms] = useState<IForm[]>([]);
  const [search, setSearch] = useState('');
  const { type } = useParameter<IPanelParams>(PARAM_KEY, {
    type: '',
  });

  useEffect(() => {
    async function fetchEndpoints() {
      if (type) {
        const endpoints = await getEndpoint(type);
        setForms(endpoints ?? []);
      }
    }
    fetchEndpoints();
    return () => {
      setForms([]);
      setSearch('');
    };
  }, [type]);

  const handleChange = (evt: any, id: number) => {
    const form = forms.find(form => form.formId === id);
    const value = evt.target.value;
    //@ts-ignore
    form[evt.target.name] = value;
    setForms([...forms]);
  };

  const handleResponseBodyChange = (newValue: string, id: number) => {
    const form = forms.find(form => form.formId === id);
    //@ts-ignore
    form.responseBody = newValue;
    setForms([...forms]);
  };

  const handleChangeRadio = (evt: any, id: number) => {
    const form = forms.find(form => form.formId === id);
    const newForms = forms.map(f => {
      if (f.formId === id) {
        f.isActive = true;
      } else if (
        f.formId !== id &&
        f.endpoint === form?.endpoint &&
        f.method === form.method
      ) {
        f.isActive = false;
      }
      return f;
    });

    setForms([...newForms]);
  };

  const handleSearch = (evt: any) => {
    const value = evt.target.value.toLowerCase();
    forms.forEach(form => {
      form.hideForm = !form.endpoint.toLowerCase().includes(value);
    });
    setForms([...forms]);
    setSearch(value);
  };

  const handleSave = async () => {
    let normalizedForm: Omit<IForm, 'formId'>[] = [];
    forms.forEach(form => {
      const {
        formId,
        endpoint,
        responseCode,
        responseBody,
        hideForm,
        isActive,
        ...formFields
      } = form;
      normalizedForm.push({
        ...formFields,
        endpoint: endpoint.trim(),
        responseCode: responseCode.trim(),
        responseBody: responseBody ? JSON.parse(responseBody) : '',
        isActive: Boolean(isActive),
      });
    });
    const result = await saveEndpoint(type, normalizedForm);
    if (result) {
      window.alert('Saved');
    } else {
      window.alert('Could not saved');
    }
  };

  const handleAddNewMock = () => {
    let firstId = forms.length > 0 ? forms[0].formId : 1;
    let obj: IForm = {
      formId: firstId ? firstId - 1 : -1,
      endpoint: '',
      method: 'GET',
      responseBody: '',
      responseCode: '200',
      delay: 0,
      dataAmount: '1',
      isActive: false,
    };

    setForms([obj, ...forms]);
  };

  const handleRemoveMock = (formId: number) => {
    setForms(forms.filter(form => form.formId !== formId));
  };

  return (
    <div>
      <PanelHeader>
        <SearchWrapper>
          <Input
            name={`search`}
            value={search}
            placeholder="Search endpoint"
            onChange={handleSearch}
            size="100%"
          />
        </SearchWrapper>
        <ButtonWrapper>
          <Button onClick={handleAddNewMock}>Define new endpoint</Button>
          <Button onClick={handleSave}>Save</Button>
        </ButtonWrapper>
        <hr />
      </PanelHeader>
      {forms.length === 0 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Description markdown="No endpoint defined. Let's define an endpoint." />
        </div>
      )}
      {forms
        .filter(form => !form.hideForm)
        .map(api => {
          return (
            <PanelWrapper key={api.formId}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Field label="Active">
                    <input
                      type="checkbox"
                      onChange={e => handleChangeRadio(e, api.formId)}
                      name={`${api.endpoint}_${api.method}_isActive`}
                      value={1}
                      id={`active_${api.formId}`}
                      checked={Boolean(api.isActive)}
                    />
                  </Field>
                  <Button
                    onClick={handleRemoveMock.bind(null, api.formId)}
                    style={{ marginRight: 5 }}
                  >
                    Remove
                  </Button>
                </div>
                <Field label="Endpint">
                  <Input
                    name={`endpoint`}
                    value={api.endpoint}
                    placeholder="Endpoint"
                    onChange={e => handleChange(e, api.formId)}
                    size="100%"
                  />
                </Field>
                <Field label="Delay (ms)">
                  <Input
                    name="delay"
                    value={api.delay}
                    placeholder="Delay"
                    onChange={e => handleChange(e, api.formId)}
                    size="100%"
                  />
                </Field>
                <Field label="Data amount">
                  <Input
                    name="dataAmount"
                    value={api.dataAmount}
                    placeholder="Data amount"
                    onChange={e => handleChange(e, api.formId)}
                    size="100%"
                  />
                </Field>
                <Field label="Method">
                  <Select
                    value={api.method}
                    name="method"
                    onChange={e => handleChange(e, api.formId)}
                    size="100%"
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                    <option>PATCH</option>
                  </Select>
                </Field>
                <Field label="Response Code">
                  <Input
                    onChange={e => handleChange(e, api.formId)}
                    name="responseCode"
                    value={api.responseCode}
                    placeholder="Endpoint"
                    size="100%"
                  />
                </Field>
                <Field>
                  <AceEditor
                    placeholder="Response schema"
                    mode="json"
                    theme="tomorrow"
                    name="blah2"
                    fontSize={13}
                    width="100%"
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    value={api.responseBody}
                    onChange={e => handleResponseBodyChange(e, api.formId)}
                    setOptions={{
                      enableBasicAutocompletion: false,
                      enableLiveAutocompletion: false,
                      enableSnippets: false,
                      showLineNumbers: false,
                      tabSize: 2,
                    }}
                  />
                </Field>
              </div>
              <hr />
            </PanelWrapper>
          );
        })}
    </div>
  );
};
