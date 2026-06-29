import { useMemo, useState } from "react";

export default function useSearch(data = [], searchKeys = []) {

    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = useMemo(() => {

        if (!searchTerm.trim()) return data;

        return data.filter(item =>
            searchKeys.some(key =>
                String(item[key] ?? "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            )
        );

    }, [data, searchTerm, searchKeys]);

    return {

        searchTerm,
        setSearchTerm,
        filteredData

    };

}