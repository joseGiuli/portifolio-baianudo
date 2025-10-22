'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Redirecionar se não autenticado
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session?.user?.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  // Carregar projetos
  const loadProjects = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/projects?${params}`);
      const data = await response.json();

      setProjects(data.projects || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      loadProjects();
    }
  }, [session, statusFilter]);

  // Deletar projeto
  const handleDelete = async (projectId, projectTitle) => {
    if (
      !confirm(`Tem certeza que deseja deletar o projeto "${projectTitle}"?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProjects(pagination.page);
      } else {
        alert('Erro ao deletar projeto');
      }
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      alert('Erro ao deletar projeto');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!session || session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-30 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projetos</h1>
            <p className="mt-2 text-gray-600">
              Gerencie seus projetos dinâmicos
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-vermelho hover:saturate-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="relative inline-block">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todos os status</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </div>
      </div>

      {/* Lista de projetos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum projeto encontrado</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {projects.map(project => (
              <li key={project.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {project.titlePt}
                      </h3>
                      {project.subtitlePt && (
                        <p className="mt-1 text-sm text-gray-600 truncate">
                          {project.subtitlePt}
                        </p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            project.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {project.status === 'published'
                            ? 'Publicado'
                            : 'Rascunho'}
                        </span>
                        <span>Slug: {project.slug}</span>
                        <span>
                          Atualizado em{' '}
                          {new Date(project.updatedAt).toLocaleDateString(
                            'pt-BR',
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.status === 'published' && (
                        <Link
                          href={`/projetos/${project.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-600"
                          title="Ver projeto"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      )}
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Editar projeto"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="text-red-600 hover:text-red-900"
                        title="Deletar projeto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Paginação */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
            {pagination.total} projetos
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadProjects(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 py-1 text-sm font-medium">
              {pagination.page} de {pagination.pages}
            </span>
            <button
              onClick={() => loadProjects(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
