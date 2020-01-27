import React, { useState, useEffect } from 'react';
import { IForm, IPanelParams } from './types';
import { useParameter } from '@storybook/api';
import { PARAM_KEY } from './constants';
import { getEndpoint, saveEndpoint } from './services';

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

  function handleChange(evt: any, id: number) {
    const form = forms.find(form => form.formId === id);
    const value = evt.target.value;
    //@ts-ignore
    form[evt.target.name] = value;
    setForms([...forms]);
  }

  function handleChangeRadio(evt: any, id: number) {
    debugger;
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
  }

  function handleSearch(evt: any) {
    const value = evt.target.value.toLowerCase();
    forms.forEach(form => {
      form.hideForm = !form.endpoint.toLowerCase().includes(value);
    });
    setForms([...forms]);
    setSearch(value);
  }

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
      <div>
        <input
          name={`search`}
          value={search}
          placeholder="Search endpoint"
          onChange={handleSearch}
        />
        <button onClick={handleAddNewMock}>Add New Mock</button>
        <button onClick={handleSave}>Save</button>
        <hr />
      </div>
      {forms.length === 0 && (
        <div>No endpoint defined. Let's define an endpoint.</div>
      )}
      {forms
        .filter(form => !form.hideForm)
        .map(api => {
          return (
            <div key={api.formId}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button onClick={handleRemoveMock.bind(null, api.formId)}>
                    Remove
                  </button>
                </div>
                <div>
                  Endpoint:{' '}
                  <input
                    name={`endpoint`}
                    value={api.endpoint}
                    placeholder="Endpoint"
                    onChange={e => handleChange(e, api.formId)}
                    style={{
                      width: '100%',
                    }}
                  />
                </div>
                <div>
                  Delay:{' '}
                  <input
                    name="delay"
                    value={api.delay}
                    placeholder="Delay"
                    onChange={e => handleChange(e, api.formId)}
                    style={{
                      width: '100%',
                    }}
                  />
                </div>
                <div>
                  Data Amount:{' '}
                  <input
                    name="dataAmount"
                    value={api.dataAmount}
                    placeholder="Data amount"
                    onChange={e => handleChange(e, api.formId)}
                    style={{
                      width: '100%',
                    }}
                  />
                </div>
                <div>
                  Method:
                  <select
                    value={api.method}
                    name="method"
                    onChange={e => handleChange(e, api.formId)}
                    style={{
                      width: '100%',
                    }}
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                </div>
                <div>
                  Response Code:
                  <input
                    onChange={e => handleChange(e, api.formId)}
                    name="responseCode"
                    value={api.responseCode}
                    placeholder="Endpoint"
                    style={{
                      width: '100%',
                    }}
                  />
                </div>
                <div>
                  Response Schema:{' '}
                  <textarea
                    onChange={e => handleChange(e, api.formId)}
                    name="responseBody"
                    value={api.responseBody}
                    placeholder="Endpoint"
                    rows={4}
                    style={{
                      width: '100%',
                    }}
                  />
                </div>
                <div>
                  Active:{' '}
                  <input
                    type="radio"
                    onChange={e => handleChangeRadio(e, api.formId)}
                    name={`${api.endpoint}_${api.method}_isActive`}
                    value={1}
                    id={`active_${api.formId}`}
                    checked={Boolean(api.isActive)}
                  />
                </div>
              </div>
              <hr />
            </div>
          );
        })}
    </div>
  );
};
