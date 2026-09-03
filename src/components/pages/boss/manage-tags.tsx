import { useState, useEffect, type FC } from 'react'
import { Button, Card, Chip, Input, TextArea } from '@heroui/react'
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
  { label: 'Teal (Cyan)', value: 'teal', hex: '#7ee7c9' },
  { label: 'Purple', value: 'purple', hex: '#c084fc' },
  { label: 'Rose', value: 'rose', hex: '#f472b6' },
  { label: 'Gold', value: 'gold', hex: '#fcd34d' },
  { label: 'Blue', value: 'blue', hex: '#7ca5f5' },
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

  const filteredTags = tags.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <BossLayout
      title="Curriculum Tags & Taxonomies"
      subtitle="Organize question topics and skills with distinct colored tag indicators"
      action={
        <Button className="boss-btn-primary" onClick={handleOpenCreate}>
          + Create New Tag
        </Button>
      }
    >
      {statusMessage && (
        <div className="boss-toast-notification">
          <span>✓ {statusMessage}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="boss-filter-bar">
        <div className="boss-search-wrapper" style={{ maxWidth: '400px' }}>
          <Input
            placeholder="Search tags by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="boss-search-input"
          />
        </div>
        <div className="boss-stat-pill">
          {tags.length} Total Tags Active
        </div>
      </div>

      {/* Tags Cards / Table */}
      <Card className="boss-table-card">
        {loading ? (
          <div className="boss-table-loading">Scanning tag registry...</div>
        ) : filteredTags.length === 0 ? (
          <div className="boss-empty-placeholder">
            <Icon icon={Icons.sparkles} size={36} />
            <h3>No tags created yet</h3>
            <p>Tags categorize questions by cosmic themes, subjects, or age ranks.</p>
            <Button className="boss-btn-secondary" onClick={handleOpenCreate}>
              Create First Tag
            </Button>
          </div>
        ) : (
          <div className="boss-table-responsive">
            <table className="boss-data-table">
              <thead>
                <tr>
                  <th>Tag Badge</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Mapped Questions</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTags.map((tag) => (
                  <tr key={tag.id}>
                    <td>
                      <div className="tag-name-cell">
                        <Chip
                          size="md"
                          variant="soft"
                          className={`chip-${tag.color || 'teal'}`}
                        >
                          #{tag.name}
                        </Chip>
                      </div>
                    </td>
                    <td>
                      <span className="table-sub-meta font-mono">/{tag.slug}</span>
                    </td>
                    <td>
                      <span className="table-desc-text">
                        {tag.description || '—'}
                      </span>
                    </td>
                    <td>
                      <Chip size="sm" variant="soft" className="chip-purple">
                        {tag.questionsCount} {tag.questionsCount === 1 ? 'Question' : 'Questions'}
                      </Chip>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <Button
                          size="sm"
                          className="boss-btn-ghost"
                          onClick={() => handleOpenEdit(tag)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="boss-btn-danger"
                          isDisabled={deletingId === tag.id}
                          onClick={() => handleDelete(tag)}
                        >
                          {deletingId === tag.id ? '...' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create / Edit Tag Modal */}
      {modalOpen && (
        <div className="boss-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="boss-modal-card tag-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="boss-modal-header">
                <div className="modal-title-group">
                  <Icon icon={Icons.sparkles} size={24} />
                  <h3>{editingTag ? `Edit Tag: #${editingTag.name}` : 'Create New Tag'}</h3>
                </div>
                <button
                  type="button"
                  className="boss-modal-close"
                  onClick={() => setModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="boss-modal-body">
                {errorMessage && (
                  <div className="boss-toast-notification boss-toast-error">
                    <span>⚠ {errorMessage}</span>
                  </div>
                )}

                <div className="boss-field-group">
                  <label className="boss-label">Tag Name *</label>
                  <Input
                    placeholder="e.g. Solar System, Black Holes, Space History"
                    value={tagName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="boss-input"
                  />
                </div>

                <div className="boss-field-group">
                  <label className="boss-label">Slug *</label>
                  <Input
                    placeholder="solar-system"
                    value={tagSlug}
                    onChange={(e) => setTagSlug(e.target.value)}
                    required
                    className="boss-input"
                  />
                </div>

                <div className="boss-field-group">
                  <label className="boss-label">Description (Optional)</label>
                  <TextArea
                    placeholder="Brief description of the subject or topic"
                    value={tagDesc}
                    onChange={(e) => setTagDesc(e.target.value)}
                    rows={2}
                    className="boss-textarea"
                  />
                </div>

                <div className="boss-field-group">
                  <label className="boss-label">Badge Color Tone</label>
                  <div className="color-palette-options">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={`color-choice-pill ${tagColor === c.value ? 'selected' : ''}`}
                        onClick={() => setTagColor(c.value)}
                      >
                        <span
                          className="color-dot"
                          style={{ backgroundColor: c.hex }}
                        ></span>
                        <span>{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tag-preview-box">
                  <span className="preview-label">Badge Preview:</span>
                  <Chip size="md" variant="soft" className={`chip-${tagColor}`}>
                    #{tagName || 'tag-preview'}
                  </Chip>
                </div>
              </div>

              <div className="boss-modal-footer">
                <Button
                  type="button"
                  className="boss-btn-ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="boss-btn-primary"
                  isDisabled={submitting}
                >
                  {submitting ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </BossLayout>
  )
}
