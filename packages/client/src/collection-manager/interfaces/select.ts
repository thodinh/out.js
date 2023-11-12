import { ISchema } from '@formily/react';
import { dataSource, defaultProps, operators } from './properties';
import { IField } from './types';

export const select: IField = {
  name: 'select',
  type: 'object',
  group: 'choices',
  order: 2,
  title: '{{t("Single select")}}',
  sortable: true,
  default: {
    type: 'string',
    // name,
    uiSchema: {
      type: 'string',
      // title,
      'x-component': 'Select',
      enum: [],
    },
  },
  availableTypes: ['string'],
  hasDefaultValue: true,
  properties: {
    ...defaultProps,
    'uiSchema.enum': dataSource,
  },
  filterable: {
    operators: operators.enumType,
  },
  titleUsable: true,
  schemaInitialize(schema: ISchema, { block }) {
    const props = (schema['x-component-props'] = schema['x-component-props'] || {});
    props.style = {
      ...(props.style || {}),
      width: '100%',
    };

    if (['Table', 'Kanban'].includes(block)) {
      props['ellipsis'] = true;
    }
  },
};
