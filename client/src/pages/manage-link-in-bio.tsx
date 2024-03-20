import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetPageQuery} from "../app/services/page";
import {LuArrowLeft} from "react-icons/lu";

type  Props = {};

const ManageLinkInBio = ({}: Props) => {
    const Navigate = useNavigate();
    const {id} = useParams();
    const {data, isLoading}= useGetPageQuery({id});

    return(
        <section className="relative">
            <div className="sticky top-0 z-20 mb-2 flex gap-4 rounded-md border border-slate-200 bg-slate-100 px-4 py-1">
                <div onClick={() => Navigate(-1)} className="flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-4 py-0.5">
                    <LuArrowLeft />
                    Back
                </div>
            </div>

            <div className="">
                Manage Link in Bio
            </div>
        </section>
    )
};

export default ManageLinkInBio;