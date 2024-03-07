import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";


const URL ="http://localhost:4080";
const LinksInBio = () => {
    const {slug} = useParams();
    const [url, setUrl] = useState([]);

    useEffect(() => {
        const getPage = async () => {
            const page = await fetch(`${URL}/page/${slug}`).then(res => res.json());
            setUrl(page);
        }
        getPage();
    }, []);

    return(
        <main className="container mx-auto">
            <h1>SOCIAL LINKS</h1>
            <p>slug</p>
            <p>{JSON.stringify(url)}</p>
        </main>
    )
};

export default LinksInBio;