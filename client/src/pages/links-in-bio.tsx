import React from 'react';
import {useParams} from "react-router-dom";

const LinksInBio = () => {
    const params = useParams()
    return(
        <main className="container  mx-auto">
            <h1>SOCIAL LINKS</h1>
            <p>{params.toString()}</p>
        </main>
    )
};

export default LinksInBio;