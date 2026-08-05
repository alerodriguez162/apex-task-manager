import { PRIORITY_LABELS, STATUS_LABELS, type Task } from '../types'

type TaskItemProps = {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <article className={`task-item priority-${task.priority} status-${task.status}`}>
      <div className="task-item-header">
        <h3>{task.title}</h3>
        <span className={`badge priority priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>
      {task.description && <p className="task-description">{task.description}</p>}
      <div className="task-meta">
        <span className={`badge status status-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>
    </article>
  )
}
