import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ServerUrl from '../config/config';
import { ReactComponent as TodoSVG } from '../assets/ToDoSVG.svg';
import { ReactComponent as InProgressSVG } from '../assets/InProgressSVG.svg';
import { ReactComponent as DoneSVG } from '../assets/DoneSVG.svg';
import hourGlass from '../assets/hour glass.svg';
import Pencil from '../assets/Pencil.svg';
import Check from '../assets/check.svg';
import done from '../assets/done.svg';
import inprogress from '../assets/inprogress.svg';
import todo from '../assets/todo.svg';

const ProjectTasks = ({ projectId,setstaus,setHeading }) => {
  const [tasks, setTasks] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: []
  });
  const statusIcons = {
    TODO: TodoSVG,
    IN_PROGRESS: InProgressSVG,
    DONE: DoneSVG
  };
  useEffect(()=>{
    setHeading("Project Tasks");
    setstaus(" ");
  },[setHeading,setstaus])
 
  const navigate = useNavigate();

  const project = projectId.ProjectId;
  const fetchCalledRef = useRef(false);
  const fetchTasks = async () => {
    try {
      console.log(`Fetching tasks for projectId: ${project}`);
      const res = await axios.get(`${ServerUrl.apiUrl}api/tasks/project/${project}`);
      const groupedTasks = res.data.reduce(
        (acc, task) => {
          acc[task.status].push(task);
          return acc;
        },
        { TODO: [], IN_PROGRESS: [], DONE: [] }
      );
      setTasks(groupedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleAddTask = () => {
    navigate(`/addtask/${project}`);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!fetchCalledRef.current) {
          console.log(`Fetching tasks for projectId: ${project}`);
          fetchCalledRef.current = true;
          const res = await axios.get(`${ServerUrl.apiUrl}api/tasks/project/${project}`);
          const groupedTasks = res.data.reduce(
            (acc, task) => {
              acc[task.status].push(task);
              return acc;
            },
            { TODO: [], IN_PROGRESS: [], DONE: [] }
          );
          setTasks(groupedTasks);
          // console.log('Fetched tasks:', groupedTasks);
        }
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    if (project) {
      fetchTasks();
    }
  }, [project]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;

    // Only proceed if the status has changed
    if (sourceStatus !== destStatus) {
      const sourceTasks = Array.from(tasks[sourceStatus]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      const destTasks = Array.from(tasks[destStatus]);
      destTasks.splice(destination.index, 0, movedTask);

      setTasks((prevTasks) => ({
        ...prevTasks,
        [sourceStatus]: sourceTasks,
        [destStatus]: destTasks
      }));

      try {
        await axios.put(`${ServerUrl.apiUrl}api/tasks/${movedTask._id}`, { status: destStatus });
        // Fetch tasks after updating the task status
        await fetchTasks();
      } catch (error) {
        console.error('Failed to update task status:', error);
      }
    } else {
      // If the task is moved within the same group, just reorder the tasks
      const reorderedTasks = Array.from(tasks[sourceStatus]);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks((prevTasks) => ({
        ...prevTasks,
        [sourceStatus]: reorderedTasks
      }));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="w-100 d-flex flex-column align-items-end my-2">
        <button className="add-task-btn" onClick={handleAddTask}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.19 2H7.81C4.17 2 2 4.17 2 7.81V16.18C2 19.83 4.17 22 7.81 22H16.18C19.82 22 21.99 19.83 21.99 16.19V7.81C22 4.17 19.83 2 16.19 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" fill="white" />
          </svg>
          Add Task
        </button>
      </div>
      <div className="task-board">
        {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div className="task-column" ref={provided.innerRef} {...provided.droppableProps}>
                <div className="status-header mb-3 d-flex justify-content-between w-100 align-items-center">
                  <h2 className="m-0">{status.replace('_', ' ')}</h2>
                  {React.createElement(statusIcons[status])}
                </div>
                <div className="task-item-cnt d-flex flex-column w-100">
                  {tasks[status].map((task, index) => (
                    <Draggable key={task._id} draggableId={task._id} index={index}>
                      {(provided) => (
                        // <a href={`/task/${task.taskId}`}>
                          <div className="task-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => navigate(`/task/${task.taskId}`)}>
                            <div className="w-100 d-flex justify-content-between">
                              <h6 className="task-name m-0">{task.name}</h6>
                              <h6 className="task-alias m-0">{new Date(task.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h6>
                            </div>
                            <div className="task-description d-flex justify-content-between w-100 align-items-center">
                              <div className="d-flex gap-2 align-items-center justify-content-between">
                                {task.status === 'TODO' && <img src={todo}></img>}
                                {task.status === 'IN_PROGRESS' && <img src={inprogress}></img>}
                                {task.status === 'DONE' && <img src={done}></img>}

                                <h4 className="task-alias m-0"> {task.taskAlias}</h4>
                              </div>
                              <div>
                                {task.status === 'TODO' && <img src={Pencil}></img>}
                                {task.status === 'IN_PROGRESS' && <img src={hourGlass}></img>}
                                {task.status === 'DONE' && <img src={Check}></img>}
                              </div>
                            </div>
                          </div>
                        // </a>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default ProjectTasks;