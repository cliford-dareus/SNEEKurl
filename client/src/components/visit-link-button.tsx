import {ReactNode, useState} from "react";
import VisitLinkPassword from "./modals/visit-link-password";
import {API_URL} from "../Utils/common";
import {useEditor} from "../hooks/use-editor";

type Props = {
    url: string;
    children: ReactNode;
};

const VisitLinkButton = ({url, children}: Props) => {
    const {state} = useEditor();
    const [active, setActive] = useState<{ status: boolean; url: string | null }>({status: false, url: null});

    return (
        <>
            <div
                className="cursor-pointer"
                onClick={async () => {
                    if (!state.editor.liveMode) return;
                    try {
                        await fetch(`${API_URL}/short/${url}`).then(
                            (res) => {
                                if (res.status === 403) {
                                    setActive({status: true, url: url});
                                }

                                if (res.status === 200)
                                    [window.open(`${API_URL}/short/${url}`)];
                            }
                        );
                    } catch (error) {
                        window.open(`${API_URL}/short/${url}`);
                    }
                }}
            >
                {children}
            </div>

            <VisitLinkPassword
                status={active.status}
                url={active.url!}
                setStatus={setActive}
            />
        </>
    );
};

export default VisitLinkButton;
