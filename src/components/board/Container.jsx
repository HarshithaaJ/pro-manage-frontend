import styles from "../css/Container.module.scss";
import { VscCollapseAll } from "react-icons/vsc";
import { IoAdd } from "react-icons/io5";
import TaskCard from "./TaskCard";
import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import { v4 as uuidv4 } from 'uuid';


function Container({
  tasks = [],
  title = "",
  moveTaskToState,
  loading,
  showPopupModal,
  addTask,
  updateTask,
  deleteTask,
  toggleCheck,
}) {
  const [collapseAll, setCollapseAll] = useState(true);
  //  const [cards,setCards] = useState();

  useEffect(() => {
  console.log("Tasks in Container:", tasks);
  }, [tasks]);


 
  // function TaskCard(e) {
  //   var text = document.getElementById(moveTaskToState);                       
  //   window.Clipboard.setData('Text', text); 
    
  // }
  
  
 
  return (
    
   
    <div className={styles.tasks_container}>
      <div className={styles.container_title}>
        <h3>{title}</h3>
        <div>
          <span onClick={() => showPopupModal(TaskForm, { addTask })}>
            {title === "To do" && <IoAdd />}
          </span>
          <span onClick={() => setCollapseAll(true)}>
            <VscCollapseAll />
          </span>
        </div>
      </div>
      <main  >
      {/* onDrop={(e)=>{TaskCard(e)}} */}
        {!loading ? (
          tasks.map((task) => {
             const uniqueKey = uuidv4();
          //  console.log('Task Key:', uniqueKey);
          
            return (
              
              <TaskCard 
                deleteTask={deleteTask}
                updateTask={updateTask}
                showPopupModal={showPopupModal}
                key={uniqueKey}
                task={task}
                moveTaskToState={moveTaskToState}
                collapseAll={collapseAll}
                setCollapseAll={setCollapseAll}
                toggleCheck={toggleCheck}
              />
            );
        
          })  
          
        ) : (
          <div className={styles.task_skeleton}>
            <div />
          </div>
        )}
      
      </main>
    </div>
  
  
  
  
  
  ) ;
}
 // const moveCard = useCallback((dragIndex, hoverIndex) => {
  //   setCard((prevCards) =>
  //     update(prevCards, {
  //       $splice: [
  //         [dragIndex, 1],
  //         [hoverIndex, 0, prevCards[dragIndex]],
  //       ],
  //     }),
  //   )
  // }, [])

  // const moveCard = useCallback((dragIndex, hoverIndex) => {
  //   setCards((prev) =>
  //    ({ ...prev, hoverIndex: [...prev[hoverIndex], dragIndex] }));
  // }, []);
export default Container;


