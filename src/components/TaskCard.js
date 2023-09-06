import { Droppable } from "react-beautiful-dnd";
import Card from "./Card";
import { toast } from "react-toastify";

export default function TaskCard({
  task,
  name,
  items,
  _id,
  handleEditTask,
  deleteTask,
}) {
  // delete task card in database and UI
  const handleCardDelete = (id) => {
    const groupId = _id;
    deleteTask(id, groupId);

    fetch("http://localhost:5500/removeItem", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ groupName: name, itemId: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          toast.error(`Delete Task from ${name}!`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      });
  };

  return (
    <Droppable droppableId={_id}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className="pb-3">
            <h3 className="section-heading">
              {name} <span className="text-slate-400">({items.length})</span>
            </h3>
            <hr></hr>
          </div>

          <div>
            {/*card is a single task card component*/}
            {items?.map((item, index) => (
              <Card
                task={task}
                item={item}
                index={index}
                groupId={_id}
                handleEditTask={handleEditTask}
                handleCardDelete={handleCardDelete}
              />
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
