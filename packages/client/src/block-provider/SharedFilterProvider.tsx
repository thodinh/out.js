import React, { createContext, FC, useState } from 'react';

export enum SHARED_FILTER_CONDITION {
  AND = '$and',
  OR = '$or',
}

export type SharedFilter = {
  [K in SHARED_FILTER_CONDITION]?: any;
};

export type SharedFilterStore = Record<string, SharedFilter>;

export type SharedFilterContextValue = {
  sharedFilterStore: SharedFilter;
  setSharedFilterStore: (filterStore: SharedFilterStore) => void;
  getFilterParams: (filterStore?: SharedFilterStore) => any;
};

export const mergeFilter = (filters: any[], op = '$and') => {
  const items = filters.filter((f) => {
    if (f && typeof f === 'object' && !Array.isArray(f)) {
      return Object.values(f).filter((v) => v !== undefined).length;
    }
  });
  if (items.length === 0) {
    return {};
  }
  if (items.length === 1) {
    return items[0];
  }
  return { [op]: items };
};

export const getFilterParams = (filterStore?: SharedFilterStore) => {
  const newAssociationFilterList = Object.entries(filterStore).map(([key, filter]) => filter);
  const newAssociationFilter = newAssociationFilterList.length
    ? {
        $and: newAssociationFilterList,
      }
    : {};

  return newAssociationFilter;
};

export const SharedFilterContext = createContext<SharedFilterContextValue>({
  sharedFilterStore: {},
  setSharedFilterStore: () => {},
  getFilterParams,
});

export const concatFilter = (f1: SharedFilter, f2: SharedFilter): SharedFilter => {
  const newAnd = [f1?.$and, f2?.$and].filter((i) => i).reduce((pre, cur) => pre.concat(cur), []);
  const newOr = [f1?.$or, f2?.$or].filter((i) => i).reduce((pre, cur) => pre.concat(cur), []);
  const newFilter: SharedFilter = {};
  newAnd.length && (newFilter.$and = newAnd);
  newOr.length && (newFilter.$or = newOr);
  return newFilter;
};

export const SharedFilterProvider: FC<{ params?: any }> = (props) => {
  const [sharedFilterStore, setSharedFilterStoreUnwrap] = useState<Record<string, SharedFilter>>({});

  const setSharedFilterStore = (associationFilter: Record<string, SharedFilter>) => {
    setSharedFilterStoreUnwrap(associationFilter);
  };

  const getFilterParamsWrap = (filterStore?: SharedFilterStore) => getFilterParams(filterStore ?? sharedFilterStore);

  return (
    <SharedFilterContext.Provider
      value={{
        sharedFilterStore,
        setSharedFilterStore,
        getFilterParams: getFilterParamsWrap,
      }}
    >
      {props.children}
    </SharedFilterContext.Provider>
  );
};
