import { useState, useEffect, type FC } from 'react'
import { BossLayout } from './boss-layout'
import { Icon } from '../../ui/icon'
import { Icons } from '../../ui/icons'

interface TagData {
  id: number
  name: string
  slug: string
  description?: string
  color: string
  questionsCount: number
  createdAt: string
}

const COLOR_OPTIONS = [
  { label: 'Cyan / Teal', value: 'teal', bgClass: 'text-bg-info' },
  { label: 'Purple', value: 'purple', bgClass: 'text-bg-primary' },
  { label: 'Rose / Pink', value: 'rose', bgClass: 'text-bg-danger' },
  { label: 'Gold / Yellow', value: 'gold', bgClass: 'text-bg-warning' },
  { label: 'Blue', value: 'blue', bgClass: 'text-bg-secondary' },
]

export const ManageTagsPage: FC = () => {
  const [tags, setTags] = useState<TagData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagData | null>(null)
  const [tagName, setTagName] = useState('')
  const [tagSlug, setTagSlug] = useState('')
  const [tagDesc, setTagDesc] = useState('')
  const [tagColor, setTagColor] = useState('teal')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const loadTags = () => {
    setLoading(true)
    fetch('/api/boss/tags')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTags(data.tags || [])
        }
      })
      .catch((err) => console.error('Failed to load tags:', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadTags()
  }, [])

  const handleOpenCreate = () => {
    setEditingTag(null)
    setTagName('')
    setTagSlug('')
    setTagDesc('')
    setTagColor('teal')
    setErrorMessage(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (tag: TagData) => {
    setEditingTag(tag)
    setTagName(tag.name)
    setTagSlug(tag.slug)
    setTagDesc(tag.description || '')
    setTagColor(tag.color || 'teal')
    setErrorMessage(null)
    setModalOpen(true)
  }

  const handleNameChange = (val: string) => {
    setTagName(val)
    if (!editingTag || !tagSlug) {
      setTagSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tagName.trim()) {
      setErrorMessage('Tag name is required.')
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    const payload = {
      name: tagName.trim(),
      slug: tagSlug.trim() || undefined,
      description: tagDesc.trim(),
      color: tagColor,
    }

    try {
      const url = editingTag ? `/api/boss/tags/${editingTag.id}` : '/api/boss/tags'
      const method = editingTag ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.success) {
        setStatusMessage(
          editingTag ? `Tag "${tagName}" updated!` : `Tag "${tagName}" created!`
        )
        setModalOpen(false)
        loadTags()
      } else {
        setErrorMessage(data.message || 'Failed to save tag')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error saving tag')
    } finally {
      setSubmitting(false)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const handleDelete = async (tag: TagData) => {
    if (!window.confirm(`Delete tag "${tag.name}"? It will be detached from ${tag.questionsCount} questions.`)) {
      return
    }

    setDeletingId(tag.id)
    try {
      const res = await fetch(`/api/boss/tags/${tag.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setStatusMessage(`Tag "${tag.name}" deleted.`)
        setTags((prev) => prev.filter((t) => t.id !== tag.id))
      } else {
        alert(data.message || 'Failed to delete tag')
      }
    } catch (err: any) {
      alert(err?.message || 'Error deleting tag')
    } finally {
      setDeletingId(null)
      setTimeout(() => setStatusMessage(null), 4000)
    }
  }

  const getBadgeClass = (colorName: string) => {
    switch (colorName) {
      case 'purple':
        return 'text-bg-primary'
      case 'rose':
        return 'text-bg-danger'
      case 'gold':
        return 'text-bg-warning'
      case 'blue':
        return 'text-bg-secondary'
      case 'teal':
      default:
        return 'text-bg-info'
    }
  }

  const filteredTags = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <BossLayout
      title="Categorization Tags"
      subtitle="Define curriculum tags, subject matters, and difficulty markers for question banks"
      action={
        <button
          type="button"
          className="btn btn-primary btn-sm fw-bold"
          onClick={handleOpenCreate}
        >
          + Create New Tag
        </button>
      }
    >
      {statusMessage && (
        <div className="alert alert-success py-2 px-3 small mb-3" role="alert">
          ✓ {statusMessage}
        </div>
      )}

      {/* Control Bar */}
      <div className="row g-2 mb-3 align-items-center">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search tags by name, slug, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tags Table */}
      <div className="card bg-dark text-light border border-secondary shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted">
            <div className="spinner-border spinner-border-sm text-info me-2" role="status"></div>
            <span>Scanning tag registry...</span>
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <div className="mb-2 text-warning">
              <Icon icon={Icons.sparkles} size={40} />
            </div>
            <h5 className="fw-bold text-light">No tags created yet</h5>
            <p className="small mb-3">Tags categorize questions by cosmic themes, subjects, or age ranks.</p>
            <button
              type="button"
              className="btn btn-outline-info btn-sm"
              onClick={handleOpenCreate}
            >
              Create First Tag
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-active">
                <tr>
                  <th scope="col">Tag Badge</th>
                  <th scope="col">Slug</th>
                  <th scope="col">Description</th>
                  <th scope="col">Mapped Questions</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag) => (
                  <tr key={tag.id}>
                    <td>
                      <span className={`badge ${getBadgeClass(tag.color)} fs-6 py-1 px-3`}>
                        #{tag.name}
                      </span>
                    </td>
                    <td>
                      <code className="text-info small">/{tag.slug}</code>
                    </td>
                    <td>
                      <span className="text-muted small">{tag.description || '—'}</span>
                    </td>
                    <td>
                      <span className="badge text-bg-secondary">
                        {tag.questionsCount} {tag.questionsCount === 1 ? 'Question' : 'Questions'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          onClick={() => handleOpenEdit(tag)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={deletingId === tag.id}
                          onClick={() => handleDelete(tag)}
                        >
                          {deletingId === tag.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Tag Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          onClick={() => setModalOpen(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-dark text-light border border-secondary">
              <form onSubmit={handleSubmit}>
                <div className="modal-header border-secondary">
                  <h5 className="modal-title d-flex align-items-center gap-2">
                    <Icon icon={Icons.sparkles} size={20} />
                    <span>{editingTag ? `Edit Tag: #${editingTag.name}` : 'Create New Tag'}</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setModalOpen(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {errorMessage && (
                    <div className="alert alert-danger py-2 px-3 small mb-3">
                      ⚠ {errorMessage}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Tag Name *</label>
                    <input
                      type="text"
                      className="form-control bg-black text-light border-secondary"
                      placeholder="e.g. Solar System, Black Holes, Space History"
                      value={tagName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Slug *</label>
                    <input
                      type="text"
                      className="form-control bg-black text-light border-secondary"
                      placeholder="solar-system"
                      value={tagSlug}
                      onChange={(e) => setTagSlug(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description (Optional)</label>
                    <textarea
                      className="form-control bg-black text-light border-secondary"
                      rows={2}
                      placeholder="Brief description of the subject or topic"
                      value={tagDesc}
                      onChange={(e) => setTagDesc(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Badge Color Tone</label>
                    <div className="btn-group btn-group-sm w-100">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          className={`btn ${tagColor === c.value ? 'btn-info fw-bold' : 'btn-outline-secondary text-light'}`}
                          onClick={() => setTagColor(c.value)}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-black border border-secondary text-center">
                    <span className="text-muted small me-2">Badge Preview:</span>
                    <span className={`badge ${getBadgeClass(tagColor)} fs-6 py-1 px-3`}>
                      #{tagName || 'preview'}
                    </span>
                  </div>
                </div>

                <div className="modal-footer border-secondary">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm fw-bold px-4"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </BossLayout>
  )
}
