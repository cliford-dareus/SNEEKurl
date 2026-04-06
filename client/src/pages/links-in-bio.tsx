import React from "react";
import {useParams} from "react-router-dom";
import {useGetPageQuery} from "../app/services/page";
import LinksInBioPreview from "../components/links-in-bio-preview";
import EditorProvider from "../hooks/use-editor";
import PageEditor from "../components/editor";

const LinksInBio = () => {
    const {slug} = useParams();
    const {data, isLoading, isError} = useGetPageQuery({id: slug});

    if(!data || isError || !slug ) return (
        <div>Error</div>
    )

    return (
        <EditorProvider pageId={data._id} pageDetails={data}>
            <div className="h-screen flex items-center justify-center overflow-hidden bg-black">
                <PageEditor pageId={slug!} liveMode/>
            </div>
        </EditorProvider>
    );
};

export default LinksInBio;
