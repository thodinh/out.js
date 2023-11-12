import { Checkbox, message, Table } from 'antd';
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useAPIClient, useRequest } from '../../api-client';
import { SettingsCenterContext } from '../../pm';
import { useRecord } from '../../record-provider';
import { useCompile } from '../../schema-component';
import { useStyles } from '../style';

const getParentKeys = (tree, func, path = []) => {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data.key);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = getParentKeys(data.children, func, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
};
const getChildrenKeys = (data = [], arr = []) => {
  for (const item of data) {
    arr.push(item.key);
    if (item.children && item.children.length) getChildrenKeys(item.children, arr);
  }
  return arr;
};

const SettingMenuContext = createContext(null);

export const SettingCenterProvider = (props) => {
  const configureItems = useContext(SettingsCenterContext);
  return <SettingMenuContext.Provider value={configureItems}>{props.children}</SettingMenuContext.Provider>;
};

const formatPluginTabs = (data) => {
  const tabs = [];
  for (const key in data) {
    const plugin = data?.[key];
    for (const tabKey in plugin?.tabs || {}) {
      const tab = plugin?.tabs[tabKey];
      tabs.push({
        pluginTitle: plugin.title,
        ...tab,
        key: `pm.${key}.${tabKey}`,
      });
    }
  }
  return tabs;
  const arr: any[] = Object.entries(data);
  const pluginsTabs = [];
  console.log(tabs);
  arr.forEach((v) => {
    const children = Object.entries(v[1].tabs).map((k: any) => {
      return {
        key: 'pm.' + v[0] + '.' + k[0],
        title: k[1].title,
      };
    });

    pluginsTabs.push({
      title: v[1].title,
      key: 'pm.' + v[0],
      children,
    });
  });
  return pluginsTabs;
};

export const SettingsCenterConfigure = () => {
  const { styles } = useStyles();
  const record = useRecord();
  const api = useAPIClient();
  const pluginTags = useContext(SettingMenuContext);
  const items: any[] = (pluginTags && formatPluginTabs(pluginTags)) || [];
  const { t } = useTranslation();
  const compile = useCompile();
  const { loading, refresh, data } = useRequest<{
    data: any;
  }>({
    resource: 'roles.snippets',
    resourceOf: record.name,
    action: 'list',
    params: {
      paginate: false,
    },
  });
  const resource = api.resource('roles.snippets', record.name);
  const handleChange = async (checked, record) => {
    const childrenKeys = getChildrenKeys(record?.children, []);
    const totalKeys = childrenKeys.concat(record.key);
    if (!checked) {
      await resource.remove({
        values: totalKeys.map((v) => '!' + v),
      });
      refresh();
    } else {
      await resource.add({
        values: totalKeys.map((v) => '!' + v),
      });
      refresh();
    }
    message.success(t('Saved successfully'));
  };

  return (
    items?.length && (
      <Table
        className={styles}
        loading={loading}
        rowKey={'key'}
        pagination={false}
        columns={[
          {
            dataIndex: 'title',
            title: t('Plugin tab name'),
            render: (value) => {
              return compile(value);
            },
          },
          {
            dataIndex: 'pluginTitle',
            title: t('Plugin name'),
            render: (value) => {
              return compile(value);
            },
          },
          {
            dataIndex: 'accessible',
            title: t('Accessible'),
            render: (_, record) => {
              const checked = !data?.data?.includes('!' + record.key);
              return !record.children && <Checkbox checked={checked} onChange={() => handleChange(checked, record)} />;
            },
          },
        ]}
        dataSource={items}
      />
    )
  );
};
