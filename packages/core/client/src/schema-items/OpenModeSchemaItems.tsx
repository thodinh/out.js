import { useField, useFieldSchema } from '@formily/react';
import { Select } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDesignable } from '../schema-component';
import { SchemaSettings } from '../schema-settings';

interface Options {
  openMode?: boolean;
  openSize?: boolean;
}
export const OpenModeSchemaItems: React.FC<Options> = (options) => {
  const { openMode = true, openSize = true } = options;
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const openModeValue = fieldSchema?.['x-component-props']?.['openMode'] || 'drawer';

  return (
    <>
      {openMode ? (
        <SchemaSettings.SelectItem
          title={t('Open mode')}
          options={[
            { label: t('Drawer'), value: 'drawer' },
            { label: t('Dialog'), value: 'modal' },
          ]}
          value={openModeValue}
          onChange={(value) => {
            field.componentProps.openMode = value;
            const schema = {
              'x-uid': fieldSchema['x-uid'],
            };
            schema['x-component-props'] = fieldSchema['x-component-props'] || {};
            schema['x-component-props'].openMode = value;
            fieldSchema['x-component-props'].openMode = value;
            // when openMode change, set openSize value to default
            Reflect.deleteProperty(fieldSchema['x-component-props'], 'openSize');
            dn.emit('patch', {
              schema: schema,
            });
            dn.refresh();
          }}
        />
      ) : null}
      {openSize && ['modal', 'drawer'].includes(openModeValue) ? (
        <SchemaSettings.Item title="Popup size">
          <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
            {t('Popup size')}
            <Select
              bordered={false}
              options={[
                { label: t('Small'), value: 'small' },
                { label: t('Middle'), value: 'middle' },
                { label: t('Large'), value: 'large' },
              ]}
              value={
                fieldSchema?.['x-component-props']?.['openSize'] ??
                (fieldSchema?.['x-component-props']?.['openMode'] == 'modal' ? 'large' : 'middle')
              }
              onChange={(value) => {
                field.componentProps.openSize = value;
                const schema = {
                  'x-uid': fieldSchema['x-uid'],
                };
                schema['x-component-props'] = fieldSchema['x-component-props'] || {};
                schema['x-component-props'].openSize = value;
                fieldSchema['x-component-props'].openSize = value;
                dn.emit('patch', {
                  schema: schema,
                });
                dn.refresh();
              }}
              style={{ textAlign: 'right', minWidth: 100 }}
            />
          </div>
        </SchemaSettings.Item>
      ) : null}
    </>
  );
};
