import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';

interface SearchComponentProps<T> {
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  searchKeys: (keyof T)[];
}

const SearchComponent = <T,>({ data, setData, searchKeys }: SearchComponentProps<T>) => {
    const [search, setSearch] = useState('');
    let filteredData = data;
    
    return (
        <Input
        className="w-60"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
    );
};

export default SearchComponent;
