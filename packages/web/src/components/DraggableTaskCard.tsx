import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { TaskWithBlocked } from '../stores'
import type { Agent } from '@flux/shared'
import { AGENT_CONFIG } from '@flux/shared'

// Agent logo components
const AgentLogos: Record<Agent, () => preact.JSX.Element> = {
  claude: () => (
    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6zm4 4h-2v-2h2v2zm0-4h-2V7h2v6z" />
    </svg>
  ),
  codex: () => (
    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  ),
  gemini: () => (
    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z" />
    </svg>
  ),
  other: () => (
    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1a1 1 0 011 1v3a1 1 0 01-1 1h-1v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1H2a1 1 0 01-1-1v-3a1 1 0 011-1h1a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM7.5 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
    </svg>
  ),
}

interface DraggableTaskCardProps {
  task: TaskWithBlocked
  epicColor?: string
  epicTitle?: string
  taskNumber?: number
  onClick?: () => void
}

export function DraggableTaskCard({
  task,
  epicColor = '#9ca3af',
  epicTitle = 'Unassigned',
  taskNumber,
  onClick,
}: DraggableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { task },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  const handleClick = () => {
    if (!isDragging && onClick) {
      onClick()
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      class={`bg-base-100 rounded-lg shadow-sm p-4 cursor-grab hover:shadow-md transition-shadow active:cursor-grabbing touch-none ${
        task.blocked ? 'ring-2 ring-warning/50' : ''
      }`}
      onClick={handleClick}
      {...(listeners as any)}
      role={attributes.role}
      tabIndex={attributes.tabIndex}
      aria-pressed={attributes['aria-pressed']}
      aria-roledescription={attributes['aria-roledescription']}
      aria-describedby={attributes['aria-describedby']}
    >
      {/* Epic Label */}
      <div class="flex items-center gap-1.5 mb-2">
        <span
          class="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: epicColor }}
        />
        <span class="text-xs text-base-content/50 font-medium">{epicTitle}</span>
        {task.blocked && (
          <span class="ml-auto text-xs bg-warning/20 text-warning px-1.5 py-0.5 rounded font-medium">
            Blocked
          </span>
        )}
      </div>

      {/* Title */}
      <h4 class="font-semibold text-sm mb-1">{task.title}</h4>

      {/* Notes/Description */}
      {task.notes && (
        <p class="text-xs text-base-content/50 mb-3 line-clamp-2">{task.notes}</p>
      )}

      {/* Footer */}
      <div class="flex items-center justify-between mt-auto pt-2">
        <div class="flex items-center gap-2">
          {task.status === 'todo' && (
            <>
              <progress class="progress progress-warning w-10" value={0} max={100} />
              <span class="badge badge-ghost badge-warning badge-xs">To do</span>
            </>
          )}
          {task.status === 'in_progress' && (
            <>
              {task.agent && (
                <span class="flex items-center text-info">
                  {AgentLogos[task.agent]()}
                </span>
              )}
              <progress class="progress progress-warning w-10" />
              <span class="badge badge-ghost badge-warning badge-xs">
                {task.agent ? `${AGENT_CONFIG[task.agent].label} is working` : 'Agent working'}
              </span>
            </>
          )}
          {task.status === 'done' && (
            <>
              <progress class="progress progress-success w-10" value={100} max={100} />
              <span class="badge badge-ghost badge-success badge-xs">Done</span>
            </>
          )}
          {task.depends_on.length > 0 && (
            <div class={`flex items-center gap-1 text-xs ${task.blocked ? 'text-warning' : 'text-base-content/40'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" transform="rotate(180 10 10)" />
              </svg>
              <span>{task.depends_on.length}</span>
            </div>
          )}
        </div>

        {/* Task Number */}
        {taskNumber && (
          <span class="text-xs text-base-content/40">#{taskNumber}</span>
        )}
      </div>
    </div>
  )
}
