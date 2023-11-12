import { ISchema } from '@formily/react';
import { defaultProps, operators, unique } from './properties';
import { IField } from './types';

export const email: IField = {
  name: 'email',
  type: 'object',
  group: 'basic',
  order: 4,
  title: '{{t("Email")}}',
  sortable: true,
  default: {
    type: 'string',
    // name,
    uiSchema: {
      type: 'string',
      // title,
      'x-component': 'Input',
      'x-validator': 'email',
    },
  },
  availableTypes: ['string'],
  hasDefaultValue: true,
  properties: {
    ...defaultProps,
    unique,
  },
  filterable: {
    operators: operators.string,
  },
  titleUsable: true,
  schemaInitialize(schema: ISchema, { block }) {
    if (['Table', 'Kanban'].includes(block)) {
      schema['x-component-props'] = schema['x-component-props'] || {};
      schema['x-component-props']['ellipsis'] = true;
    }
  },
};
