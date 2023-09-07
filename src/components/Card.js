import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { BiEdit } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function Card({
  task,
  item,
  index,
  groupId,
  handleEditTask,
  handleCardDelete,
}) {
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState(item.name);
  const [desc, setDesc] = useState(item.desc);

  const handleCardEdit = () => {
    setEditModal(true);
  };
  const handleEditForm = (e) => {
    e.preventDefault();
    const itemId = item.id;
    handleEditTask(itemId, name, desc);
    setEditModal(false);

    fetch("https://kanban-server-three.vercel.app/edititem", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        groupId,
        itemId,
        name,
        desc,
      }),
    }).then(res => res.json())
      .then(data => {
        toast.info('Task Update Success', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
      })
  };
  const HandleEditFormClose = (e) => {
    e.preventDefault();
    setEditModal(false);
  };
  return (
    <Draggable
      draggableId={item.id}
      index={index}
      key={item.id}
      isDragDisabled={task}
    >
      {(provided) => (
        <div
          className="bg-white my-2 p-3 rounded shadow group relative cursor-wait"
          {...provided.dragHandleProps}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-slate-600 font-medium">{item?.name}</h3>
            <div className="relative">
              <BiEdit
                onClick={() => handleCardEdit(item?.id)}
                size={23}
                className="task-icon right-9  hover:text-green-600"
              />
              <RiDeleteBin5Fill
                onClick={() => handleCardDelete(item?.id)}
                size={23}
                className="task-icon right-1  hover:text-red-600 "
              />
            </div>
          </div>

          <p className="text-slate-400 py-1">{item?.desc}</p>

          <div
            className={`absolute bg-white pt-2 w-[277px] left-0 top-0 drop-shadow rounded-lg z-[9999] ${
              editModal ? "inline-block" : "hidden"
            }`}
          >
            <form onSubmit={handleEditForm} className="px-4 pb-3">
              <div className="my-3">
                <input
                  type="text"
                  name="title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 rounded-md py-1 px-2 text-slate-700 font-medium focus:outline-none"
                />
              </div>
              <div className="my-1">
                <textarea
                  className="w-full bg-gray-100 rounded-md p-2 text-slate-500 focus:outline-none"
                  name="desc"
                  rows="4"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  maxLength={100}
                ></textarea>
              </div>
              <button
                type="submit"
                className="text-white font-medium bg-blue-500 py-2 px-4 rounded shadow mr-2 hover:bg-blue-600 duration-200"
              >
                Edit Task
              </button>
              <button
                onClick={HandleEditFormClose}
                className="bg-white font-medium py-2 px-4 rounded shadow mx-2 hover:text-red-600"
              >
                X
              </button>
            </form>
          </div>
        </div>
      )}
    </Draggable>
  );
}
