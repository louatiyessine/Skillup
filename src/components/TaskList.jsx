import TaskItem from './TaskItem'

// Liste des tâches. `key={task.id}` : identifiant unique et stable (jamais l'index).
function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
