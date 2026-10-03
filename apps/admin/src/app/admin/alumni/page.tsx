'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Award, Briefcase, MapPin, ExternalLink, X } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

// Disable SSR for this page
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Project {
  title: string;
  url: string;
}

interface Alumni {
  id: string;
  name: string;
  position: string;
  company: string;
  testimonial: string;
  image: string | null;
  projects?: Project[];
  course: {
    title: string;
  } | null;
  createdAt: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/alumni', {
        credentials: 'include',
      });
      const data = await response.json();
      // Map photoUrl to image for frontend compatibility
      const mappedAlumni = (data.data || []).map((alumni: any) => ({
        ...alumni,
        image: alumni.photoUrl || alumni.image || null,
      }));
      setAlumni(mappedAlumni);
    } catch (error) {
      console.error('Failed to fetch alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((person) =>
    (person.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (person.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (person.position || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm(t('alumni.confirmDelete'))) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3002/api/alumni/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setAlumni(alumni.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete alumni:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Выпускники
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
            Успешные истории наших студентов
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl hover:shadow-xl hover:scale-105 transition-all space-x-2 font-bold"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить выпускника</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по имени, компании или должности"
          className="w-full pl-12 pr-4 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white transition-all shadow-sm"
        />
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length === 0 ? (
        <div className="text-center py-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Выпускники не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <div
              key={person.id}
              className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header with gradient */}
              <div className="h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>

              {/* Alumni Info */}
              <div className="p-6 -mt-10">
                {/* Avatar */}
                <div className="mb-4">
                  {person.image ? (
                    <div className="relative w-24 h-24 overflow-hidden rounded-2xl border-4 border-white dark:border-slate-800 shadow-xl">
                      <img
                        src={person.image}
                        alt={person.name || 'Выпускник'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.parentElement) {
                            const fallback = document.createElement('div');
                            fallback.className = 'absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-black';
                            fallback.textContent = (person.name || 'A').charAt(0);
                            e.currentTarget.parentElement.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-3xl font-black border-4 border-white dark:border-slate-800 shadow-xl">
                      {(person.name || 'A').charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">
                  {person.name || t('common.noName')}
                </h3>

                <div className="space-y-2 mb-4">
                  {person.position && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      <span className="font-bold">{person.position}</span>
                    </div>
                  )}
                  {person.company && (
                    <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="font-bold">{person.company}</span>
                    </div>
                  )}
                  {person.course && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <Award className="w-4 h-4 flex-shrink-0" />
                      <span>{person.course?.title || 'Курс не указан'}</span>
                    </div>
                  )}
                </div>

                {person.testimonial && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 italic">
                    &ldquo;{person.testimonial}&rdquo;
                  </p>
                )}

                {/* Projects */}
                {person.projects && person.projects.length > 0 && (
                  <div className="mb-4 space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Проекты:</p>
                    {person.projects.map((project, idx) => (
                      <a
                        key={idx}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{project.title}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingAlumni(person)}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center justify-center space-x-2 font-bold hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    <span>{t('common.edit')}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || editingAlumni) && (
        <AlumniModal
          alumni={editingAlumni}
          onClose={() => {
            setShowCreateModal(false);
            setEditingAlumni(null);
          }}
          onSuccess={fetchAlumni}
        />
      )}
    </div>
  );
}

// Alumni Modal Component
function AlumniModal({
  alumni,
  onClose,
  onSuccess,
}: {
  alumni: Alumni | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: alumni?.name || '',
    position: alumni?.position || '',
    company: alumni?.company || '',
    testimonial: alumni?.testimonial || '',
    image: alumni?.image || '',
    projects: alumni?.projects || [],
  });
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', url: '' });

  const handleAddProject = () => {
    if (newProject.title.trim() && newProject.url.trim()) {
      setFormData({
        ...formData,
        projects: [...formData.projects, { title: newProject.title.trim(), url: newProject.url.trim() }],
      });
      setNewProject({ title: '', url: '' });
    }
  };

  const handleRemoveProject = (index: number) => {
    setFormData({
      ...formData,
      projects: formData.projects.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = alumni
        ? `http://localhost:3002/api/alumni/${alumni.id}`
        : 'http://localhost:3002/api/alumni';
      
      const payload = {
        name: formData.name,
        position: formData.position || undefined,
        company: formData.company || undefined,
        story: formData.testimonial || undefined,
        photoUrl: formData.image || undefined,
        projects: formData.projects,
        isFeatured: true,
      };
      
      const response = await fetch(url, {
        method: alumni ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Failed to save alumni:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {alumni ? 'Редактировать выпускника' : 'Добавить выпускника'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Должность
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Frontend Developer"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Компания
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Google"
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Описание / Отзыв
            </label>
            <textarea
              value={formData.testimonial}
              onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white"
            />
          </div>

          {/* Projects Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Проекты <span className="text-red-500">*</span> (минимум 1)
            </label>
            
            {/* Current Projects */}
            {formData.projects.length > 0 && (
              <div className="space-y-2 mb-4">
                {formData.projects.map((project, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{project.title}</p>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {project.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Project */}
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Название проекта (напр. Ekidos Taxi)"
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white text-sm"
              />
              <input
                type="url"
                value={newProject.url}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddProject}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Добавить проект
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Фото выпускника (3:4)
            </label>
            <ImageUploader
              currentImage={formData.image}
              onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
              label="Загрузить фото выпускника"
              aspectRatio="3:4"
              maxSizeMB={2}
            />
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name || formData.projects.length === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
