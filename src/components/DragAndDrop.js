import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { ToastContainer, toast } from 'react-toastify';

export default function DragAndDrop({ Data }) {

  const [stores, setStores] = useState(Data);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [column, setColumn] = useState(false)
  const [task, setTask] = useState(false)
  const handleDragDrop = (result) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    if (type === "group") {
      setColumn(true)
      // if group column reorder
      const reorderedStores = [...stores];
      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      const [removedStore] = reorderedStores.splice(sourceIndex, 1);
      reorderedStores.splice(destinationIndex, 0, removedStore);
      setStores(reorderedStores);
      //update database
      fetch("https://kanban-server-topaz.vercel.app/update", {
        method: "POST",
        headers: {
          'content-type':'application/json'
        },
        body:JSON.stringify(reorderedStores)
      })
      .then(res => res.json())
      .then(data => {
        if (data.acknowledged && data.insertedCount === 3) {
          setColumn(false)
        }
      })
      
      return;
    }

    //task card reorder and new destination functionality 
    const storeSourceIndex = stores.findIndex(
      (store) => store._id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store._id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems = source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deleteItem] = newSourceItems.splice(source.index, 1);
    newDestinationItems.splice(destination.index, 0, deleteItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };
    
    setStores(newStores);
    setTask(true)
    //update task card reorder and new destination functionality in database
    fetch("https://kanban-server-topaz.vercel.app/update", {
      method: "POST",
      headers: {
        'content-type':'application/json'
      },
      body:JSON.stringify(newStores)
    })
      .then(res => res.json())
      .then(data => {
        if (data.acknowledged && data.insertedCount === 3) {
          setTask(false)
        }
      })
  };
  //task card id (uuid) create function
  function id() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
  }
  // add new task card in UI and database
  const handleAddTask = (e) => {
    e.preventDefault();
    const todo = stores.find(store => store.name === "To Do")
      
    const name = e.target.title.value;
    const desc = e.target.desc.value;

    const btnName = e.nativeEvent.submitter.name;
    if (btnName !=="close") {
      const newTask = {
        id:id(),
        name,
        desc
          }

        todo.items.push(newTask)
        fetch("https://kanban-server-topaz.vercel.app/add", {
          method: "POST",
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(newTask)
        })
        .then(res => res.json())
        .then(data => {
          if (data.acknowledged) {
            toast.success('New Task Added!', {
              position: "top-right",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              });
          }
        })
        
        
      }
    setAddTaskModal(false)
    e.target.reset();
  };
  //edit existing task and update UI an database
  const handleEditTask = (itemId, name , desc ) => {
    const editStores = [...stores];

    for (let store of editStores) {
      const itemToUpdate = store.items.find(item => item.id === itemId);
      if (itemToUpdate) {
        itemToUpdate.name = name;
        itemToUpdate.desc = desc;
        break; 
      }
    }
    setStores(editStores)
  }
  
  // delete existing task card in UI 
  const deleteTask = (id, groupId) => {
    const deleteGroupIndex = stores.findIndex(store => store._id === groupId);
    const deleteGroupItems = [...stores[deleteGroupIndex].items];
    
    const newItems = deleteGroupItems.filter(item => item.id !== id)
    const newStores = [...stores];
    newStores[deleteGroupIndex] = {
      ...stores[deleteGroupIndex],
      items: newItems
    }
    setStores(newStores);
  }

  return (
    <div className="mt-8 ">
      <ToastContainer/>
      <div className="overflow-x-auto h-screen">
        <DragDropContext onDragEnd={handleDragDrop} >
          <Droppable droppableId="ROOT" type="group" direction="horizontal">
            {(provided) => (
              <div
                className="flex"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store._id}
                    key={store._id}
                    index={index}
                    isDragDisabled={column}
                  >
                    {(provided) => (
                      <div>
                        <div
                          className="group-column"
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          {/*TaskCard is a task group column component like To Do, In process, Done*/}
                          <TaskCard
                            {...store}
                            key={store._id}
                            task={task}
                            handleEditTask={handleEditTask}
                            deleteTask={deleteTask}
                          />

                          <div
                            className={`mt-3 ${
                              store.name === "To Do" ? "block" : "hidden"
                            }`}
                          >
                            <button onClick={()=>setAddTaskModal(true)} className="addtask-btn">
                              <span className="text-[20px]">+</span>
                              Add Task
                            
                            {/*Add task Form */}
                              <div className={`form-card ${addTaskModal ? "inline-block":"hidden"}`}>
                              <form onSubmit={handleAddTask} className="px-4 pb-3">
                                <div className="my-3">
                                  <label
                                    htmlFor="text"
                                    className="text-slate-600 font-medium "
                                  >
                                    Title
                                  </label>{" "}
                                  <br />
                                  <input
                                    type="text"
                                    name="title"
                                    className="w-full rounded-md py-1 px-2 focus:outline-none"
                                  />
                                </div>

                                <div className="my-3">
                                  <label
                                    htmlFor="text"
                                    className="text-slate-600 font-medium text-left"
                                  >
                                    Description
                                  </label>{" "}
                                  <br />
                                  <textarea
                                    className="w-full  rounded-md p-2 focus:outline-none"
                                    name="desc"
                                    rows="3"
                                    maxLength={100}
                                  ></textarea>
                                    <p className="text-sm font-light text-left">Write description within 100 words</p>
                                </div>

                                <button
                                  type="submit"
                                  className="text-white font-medium bg-blue-500 py-2 px-4 rounded shadow mr-2 hover:bg-blue-600 duration-200"
                                >
                                  Add Task
                                </button>
                                  <button name="close" className="bg-white font-medium py-2 px-4 rounded shadow mx-2 hover:text-red-500">X</button>
                              </form>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
