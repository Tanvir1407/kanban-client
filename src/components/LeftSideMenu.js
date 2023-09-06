import { BsListTask, BsPeople } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { PiNotePencilDuotone } from "react-icons/pi";

export default function LeftSideMenu() {
  return (
    <div className=" bg-white w-[15%] h-screen shadow hidden sm:inline-block">
      {/*left side menu */}
      <div className="bg-gray-50 m-5 py-4 px-2 rounded-md">
        <h1 className="text-slate-600 text-center text-lg font-medium">
          My Kanban Project
        </h1>
      </div>
      <hr />
      <div className="my-5">
        <ul>
          <li className="side-nav">
            <BsListTask /> <span className="pl-2 hidden lg:inline">Board</span>
          </li>
          <li className="side-nav">
            <BsPeople /> <span className="pl-2 hidden lg:inline">Members</span>
          </li>
          <li className="side-nav">
            <PiNotePencilDuotone /> <span className="pl-2 hidden lg:inline">Add Notes</span>
          </li>
          <li className="side-nav">
            <CiSettings /> <span className="pl-2 hidden lg:inline">Project Settings</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
