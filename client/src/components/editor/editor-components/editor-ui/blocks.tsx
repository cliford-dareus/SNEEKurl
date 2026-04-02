import {BsBodyText, BsBoxes, BsCalendar, BsImage, BsLink, BsTextarea} from "react-icons/bs";

export const blocks = [
    {
        label: "Container",
        id: "container",
        group: "layout",
        category: "Container",
        icon: <BsBoxes className="text-xl"/>,
    },
    {
        label: "2 Column",
        id: "2Col",
        group: "layout",
        category: "Container",
        icon: <BsBoxes className="text-xl"/>,
    },
    {
        label: "Calendar",
        id: "calendar",
        group: "block",
        category: "block",
        icon: <BsCalendar className="text-xl"/>
    },
    {
        label: "Link",
        id: "link",
        group: "block",
        category: "block",
        icon: <BsLink className="text-xl"/>
    },
    {
        label: "Image",
        id: "image",
        group: "block",
        category: "block",
        icon: <BsImage className="text-xl"/>
    },
    {
        label: "Website List",
        id: "websiteList",
        group: "block",
        category: "block",
        icon: <BsBodyText className="text-xl"/>
    },
    {
        label: "Text",
        id: "p",
        group: "block",
        category: "block",
        icon: <BsTextarea className="text-xl"/>
    }
]