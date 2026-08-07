import type { TaskDraft } from './types'

export const TITLE_MAX = 120
export const DESCRIPTION_MAX = 500

export type FieldErrors = {
  title?: string
  description?: string
}

export function validateDraft(draft: Pick<TaskDraft, 'title' | 'description'>): FieldErrors {
  const errors: FieldErrors = {}
  const title = draft.title.trim()
  const description = draft.description.trim()

  if (!title) {
    errors.title = 'El título es obligatorio.'
  } else if (title.length > TITLE_MAX) {
    errors.title = `Máximo ${TITLE_MAX} caracteres.`
  }

  if (description.length > DESCRIPTION_MAX) {
    errors.description = `Máximo ${DESCRIPTION_MAX} caracteres.`
  }

  return errors
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Boolean(errors.title || errors.description)
}
