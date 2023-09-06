import { useEffect, useState } from "react";
import DragAndDrop from "./DragAndDrop";
import Loading from "./Loading";
import LeftSideMenu from "./LeftSideMenu";

export default function Board() {
    const [Data, setData] = useState(null)

    useEffect(() => {
        fetch("https://kanban-server-topaz.vercel.app")
            .then(res =>res.json())
            .then(data =>setData(data))
             
    }, [])

    let content;
    if (Data === null) {
        content = <Loading/>
    }
    else if (Data) {
        content = <DragAndDrop Data={Data} key={(Data.length)}/>  
    }

  return (
    <div>
        <div className="flex">
            <LeftSideMenu/> 
            <div className="w-[100%] sm:w-[80%] sm:ml-5 ">
                {/*kanban project board*/}
                {content}
            </div>
        </div>
    </div>
  )
}
