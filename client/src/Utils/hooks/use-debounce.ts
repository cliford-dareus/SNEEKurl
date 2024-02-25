import {useEffect, useRef, useState} from "react";

export function UseDebounce<T>(value: T, time=500): T {
    const [debounceValue, setDebounceValue] = useState<T>(value)
    const timeRef = useRef<NodeJS.Timeout>()

    useEffect(() => {
        timeRef.current = setTimeout(()=> setDebounceValue(value), time);
        return () => clearTimeout(timeRef.current)
    }, [value, time]);

    return debounceValue;
}
