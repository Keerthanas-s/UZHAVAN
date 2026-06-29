import { useMemo, useState } from "react";

export default function useFilter(data = []) {

    const [category, setCategory] = useState("");

    const [priceRange, setPriceRange] = useState({

        min: 0,
        max: Number.MAX_VALUE

    });

    const filteredData = useMemo(() => {

        return data.filter(item => {

            const categoryMatch =
                !category ||
                item.category === category;

            const priceMatch =
                item.price >= priceRange.min &&
                item.price <= priceRange.max;

            return categoryMatch && priceMatch;

        });

    }, [data, category, priceRange]);

    return {

        filteredData,

        category,
        setCategory,

        priceRange,
        setPriceRange

    };

}