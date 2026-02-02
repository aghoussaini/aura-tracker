import { useState, useEffect, useRef, useCallback } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, User } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Avatar } from './avatar'
import { API_URL } from '../../config'

export function UserSearch({
  token,
  selectedUsers = [],
  onSelect,
  onRemove,
  placeholder = 'Search by username...',
  className,
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${API_URL}/users/search?q=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          // Filter out already selected users
          const filtered = data.filter(
            u => !selectedUsers.some(s => s.username === u.username)
          )
          setResults(filtered)
          setIsOpen(filtered.length > 0)
          setHighlightedIndex(-1)
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, token, selectedUsers])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = useCallback((user) => {
    onSelect(user)
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }, [onSelect])

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          handleSelect(results[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
    }
  }

  return (
    <div className={cn('relative', className)}>
      {/* Selected Users Pills */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedUsers.map((user) => (
            <motion.div
              key={user.username}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              <Avatar
                size="sm"
                username={user.username}
                firstName={user.first_name}
                lastName={user.last_name}
                className="w-5 h-5 text-[10px]"
              />
              <span className="font-medium">@{user.username}</span>
              <button
                type="button"
                onClick={() => onRemove(user.username)}
                className="p-0.5 hover:bg-primary-200 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm',
            'shadow-sm transition-all duration-200',
            'placeholder:text-slate-400',
            'hover:border-slate-300',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20'
          )}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {results.map((user, index) => (
                <div
                  key={user.username}
                  onDoubleClick={() => handleSelect(user)}
                  onClick={() => setHighlightedIndex(index)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors',
                    highlightedIndex === index
                      ? 'bg-primary-50'
                      : 'hover:bg-slate-50'
                  )}
                >
                  <Avatar
                    size="sm"
                    username={user.username}
                    firstName={user.first_name}
                    lastName={user.last_name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      @{user.username}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    Double-click to add
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results message */}
      <AnimatePresence>
        {query.length >= 2 && !isLoading && results.length === 0 && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center"
          >
            <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No users found</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
