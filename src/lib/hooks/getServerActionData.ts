import { useState } from "react";


const getServerActionData = (callback: (parameter : any) => Promise<any> , callabckParameter  :any) => {
    const [data, setData] = useState(null);
    const [loading , setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getData = async () => {
        try {
            setLoading(true);
            const result = await callback(callabckParameter);
            setData(result);
            setLoading(false);
        }
        catch (error : any) {
            setError(error);
            setLoading(false);
        }
    };
    return { data, loading, error, getData };
};

export default getServerActionData;
