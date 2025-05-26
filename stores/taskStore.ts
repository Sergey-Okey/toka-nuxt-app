// stores/tasks.ts
import { ref, computed, onMounted, watch } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export interface Tag {
  name: string
  color?: string
}

export interface Task {
  id: string
  title: string
  completed: boolean
  dueDate?: string
  completedAt?: string
  createdAt: string
  category?: string
  priority: 'none' | 'low' | 'medium' | 'high'
  tags?: Tag[]
  description?: string
  timeSpent?: number
  lastModified: string
}

export const useTaskStore = defineStore('tasks', () => {
  // Состояние хранилища
  const tasks = useStorage<Task[]>('tasks', [])
  const tagColors = useStorage<Record<string, string>>('tagColors', {})

  // Инициализация
  const initialize = () => {
    if (tasks.value.length === 0) {
      // Пример начальных задач для демонстрации
      tasks.value = [
        {
          id: '1',
          title: 'Завершить проект',
          completed: false,
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          priority: 'high',
          tags: [{ name: 'работа' }],
          lastModified: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Купить продукты',
          completed: true,
          completedAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          priority: 'medium',
          tags: [{ name: 'дом' }],
          lastModified: new Date().toISOString(),
        },
      ]
    }
  }

  // Основные методы работы с задачами
  const addTask = (
    task: Omit<Task, 'id' | 'createdAt' | 'lastModified'>
  ): Task => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completed: task.completed || false,
      priority: task.priority || 'medium',
      tags: task.tags || [],
      lastModified: new Date().toISOString(),
    }

    tasks.value.unshift(newTask)
    updateTagColors(newTask.tags)
    return newTask
  }

  const updateTask = (
    id: string,
    updates: Partial<Omit<Task, 'id'>>
  ): Task | null => {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index !== -1) {
      const updatedTask = {
        ...tasks.value[index],
        ...updates,
        lastModified: new Date().toISOString(),
      }
      tasks.value[index] = updatedTask
      updateTagColors(updatedTask.tags)
      return updatedTask
    }
    return null
  }

  const deleteTask = (id: string): void => {
    tasks.value = tasks.value.filter((task) => task.id !== id)
  }

  const toggleTaskCompletion = (id: string): void => {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      task.completed = !task.completed
      task.completedAt = task.completed ? new Date().toISOString() : undefined
      task.lastModified = new Date().toISOString()
    }
  }

  // Методы для работы с тегами
  const updateTagColors = (tags: Tag[] = []): void => {
    tags.forEach((tag) => {
      if (tag.name && !tagColors.value[tag.name] && tag.color) {
        tagColors.value[tag.name] = tag.color
      }
    })
  }

  const setTagColor = (tagName: string, color: string): void => {
    tagColors.value[tagName] = color

    // Обновляем цвет во всех задачах
    tasks.value.forEach((task) => {
      if (task.tags) {
        task.tags = task.tags.map((tag) =>
          tag.name === tagName ? { ...tag, color } : tag
        )
      }
    })
  }

  const getTagColor = (tagName: string): string => {
    return tagColors.value[tagName] || '#31a974' // Цвет по умолчанию
  }

  // Методы поиска и фильтрации
  const getTaskById = (id: string): Task | undefined => {
    return tasks.value.find((task) => task.id === id)
  }

  const getTasksForDate = (date: Date): Task[] => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.value.filter((task) => task.dueDate?.startsWith(dateStr))
  }

  const hasTasksForDate = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0]
    return tasks.value.some((task) => task.dueDate?.startsWith(dateStr))
  }

  const isTaskOverdue = (task: Task): boolean => {
    if (task.completed || !task.dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(task.dueDate) < today
  }

  // Вычисляемые свойства
  const totalTasks = computed(() => tasks.value.length)
  const activeTasks = computed(
    () => tasks.value.filter((t) => !t.completed).length
  )
  const completedTasks = computed(
    () => tasks.value.filter((t) => t.completed).length
  )
  const overdueTasks = computed(() => tasks.value.filter(isTaskOverdue).length)

  const taskCategories = computed(() => {
    const categories = new Set(
      tasks.value.map((t) => t.category).filter(Boolean)
    )
    return Array.from(categories) as string[]
  })

  const allTags = computed(() => {
    const allTags = tasks.value.flatMap((t) => t.tags || [])
    return Array.from(new Set(allTags.map((t) => t.name)))
  })

  // Фильтры для задач
  const filteredTasks = computed(() => ({
    all: tasks.value,
    active: tasks.value.filter((t) => !t.completed),
    completed: tasks.value.filter((t) => t.completed),
    overdue: tasks.value.filter(isTaskOverdue),
    highPriority: tasks.value.filter((t) => t.priority === 'high'),
    today: getTasksForDate(new Date()),
  }))

  // Инициализация при создании хранилища
  initialize()

  return {
    // Данные
    tasks,
    tagColors,

    // Методы
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getTaskById,
    getTasksForDate,
    hasTasksForDate,
    isTaskOverdue,
    setTagColor,
    getTagColor,

    // Вычисляемые свойства
    totalTasks,
    activeTasks,
    completedTasks,
    overdueTasks,
    taskCategories,
    allTags,
    filteredTasks,
  }
})
