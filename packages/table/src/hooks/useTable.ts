import { useCallback, useRef, useState } from 'react';
import type { SearchType, TableReturn } from '../@types';

export function useTable<T extends object>(): TableReturn<T> {
  const [page, SetPage] = useState(1);
  const [pageSize, SetPageSize] = useState(5);
  const [searchTerm, SetSearchTerm] = useState<SearchType<T>>({});
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const tableCard = useRef<HTMLDivElement>(null);

  const nextPageHandler = (maxPage: number) =>
    SetPage((prev) => (prev < maxPage ? prev + 1 : prev));

  const prevPageHandler = () => SetPage((prev) => (prev > 1 ? prev - 1 : prev));

  const pageSizeChangeHandler = (size: number) => {
    SetPageSize(size);
    SetPage(1);
    if (size < pageSize) {
      tableCard.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onMultiSelectChange = (value: string, checked: boolean) =>
    checked
      ? setMultiSelect((prev) => [...prev, value])
      : setMultiSelect((prev) => prev.filter((item) => item !== value));

  const onSearchChangedHandler = (value: string, key: keyof T | string) => {
    if (key.toString().includes('.')) {
      const [parent, child] = key.toString().split('.');
      const newKey = `${parent}${child.charAt(0).toUpperCase()}${child.slice(
        1
      )}`;
      SetSearchTerm((prev) => ({
        ...prev,
        [newKey]: value,
      }));
    } else {
      SetSearchTerm((prev) => ({ ...prev, [key]: value }));
    }
    SetPage(1);
  };

  const resetTable = useCallback(() => {
    SetPage(1);
    SetPageSize(5);
    SetSearchTerm({});
    setMultiSelect([]);
  }, []);
  return {
    page,
    onSearchChangedHandler,
    pageSize,
    searchTerm,
    multiSelect,
    tableCard,
    nextPageHandler,
    prevPageHandler,
    pageSizeChangeHandler,
    onMultiSelectChange,
    resetTable,
  };
}
