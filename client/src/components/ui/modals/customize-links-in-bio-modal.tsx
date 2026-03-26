import Dialog, {DialogContent, DialogDescription, DialogHeader, DialogTitle} from "../dialog";
import {getSiteUrl} from "../../../Utils/getSiteUrl";
import React from "react";

const CustomizeLinksInBioModal = () => {
    return(
        <Dialog>
            <DialogHeader>
                <div className="flex items-center gap-3">
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 200 250"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M0 62.5V200L62.5 250V112.5H137.5V200L200 250V112.5L87.5 0V62.5H0Z"
                            fill="currentColor"
                        />
                    </svg>
                    <div>
                        <DialogTitle>Edit Link</DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            Customize your Page
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>
            <DialogContent>
                <div className="px-6 py-4">

                </div>
            </DialogContent>
        </Dialog>
    )
};

export default CustomizeLinksInBioModal;