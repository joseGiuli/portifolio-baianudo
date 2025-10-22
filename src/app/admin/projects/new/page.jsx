'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateProjectSchema } from '@/lib/schemas';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewProjectPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [heroMetaItemsPt, setHeroMetaItemsPt] = useState([]);
  const [heroMetaItemsEn, setHeroMetaItemsEn] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {},
  });

  // Funções para metadados PT
  const addHeroMetaItemPt = () => {
    setHeroMetaItemsPt([...heroMetaItemsPt, { label: '', value: '' }]);
  };

  const removeHeroMetaItemPt = index => {
    setHeroMetaItemsPt(heroMetaItemsPt.filter((_, i) => i !== index));
  };

  const updateHeroMetaItemPt = (index, field, value) => {
    const newItems = [...heroMetaItemsPt];
    newItems[index][field] = value;
    setHeroMetaItemsPt(newItems);
  };

  // Funções para metadados EN
  const addHeroMetaItemEn = () => {
    setHeroMetaItemsEn([...heroMetaItemsEn, { label: '', value: '' }]);
  };

  const removeHeroMetaItemEn = index => {
    setHeroMetaItemsEn(heroMetaItemsEn.filter((_, i) => i !== index));
  };

  const updateHeroMetaItemEn = (index, field, value) => {
    const newItems = [...heroMetaItemsEn];
    newItems[index][field] = value;
    setHeroMetaItemsEn(newItems);
  };

  const onSubmit = async data => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Filtrar heroMeta items vazios
      const validHeroMetaPt = heroMetaItemsPt.filter(
        item => item.label.trim() && item.value.trim(),
      );
      const validHeroMetaEn = heroMetaItemsEn.filter(
        item => item.label.trim() && item.value.trim(),
      );

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          heroMetaPt: validHeroMetaPt.length > 0 ? validHeroMetaPt : undefined,
          heroMetaEn: validHeroMetaEn.length > 0 ? validHeroMetaEn : undefined,
          previewImage: previewImage.url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao criar projeto');
        return;
      }

      const project = await response.json();

      // Mostrar feedback de sucesso antes de redirecionar
      setSuccess('Projeto criado com sucesso! Redirecionando...');

      // Pequeno delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        router.push(`/admin/projects/${project.id}`);
      }, 1000);
    } catch (err) {
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!session || session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pt-32 px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Overlay de loading */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="text-lg font-medium text-gray-900">
              Criando projeto...
            </p>
            <p className="text-sm text-gray-500">Aguarde um momento</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Criar Projeto</h1>
      </div>

      {/* Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Campos Português */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🇧🇷 Português
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="titlePt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título (Português) *
                </label>
                <input
                  {...register('titlePt')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: Meu Novo Projeto"
                />
                {errors.titlePt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.titlePt.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subtitlePt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subtítulo (Português)
                </label>
                <input
                  {...register('subtitlePt')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: Descrição breve do projeto"
                />
                {errors.subtitlePt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.subtitlePt.message}
                  </p>
                )}
              </div>

              {/* Metadados PT */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Metadados Hero (Português)
                  </label>
                  <button
                    type="button"
                    onClick={addHeroMetaItemPt}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Ex: Cliente, Ano, Tipo, etc.
                </p>

                {heroMetaItemsPt.length > 0 && (
                  <div className="space-y-3">
                    {heroMetaItemsPt.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <input
                          type="text"
                          value={item.label}
                          onChange={e =>
                            updateHeroMetaItemPt(index, 'label', e.target.value)
                          }
                          placeholder="Label (ex: Cliente)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={e =>
                            updateHeroMetaItemPt(index, 'value', e.target.value)
                          }
                          placeholder="Valor (ex: Empresa XYZ)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeHeroMetaItemPt(index)}
                          className="p-2 text-red-600 hover:text-red-900 border border-gray-300 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campos Inglês */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🇺🇸 English
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="titleEn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title (English) *
                </label>
                <input
                  {...register('titleEn')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: My New Project"
                />
                {errors.titleEn && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.titleEn.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subtitleEn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subtitle (English)
                </label>
                <input
                  {...register('subtitleEn')}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: Brief project description"
                />
                {errors.subtitleEn && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.subtitleEn.message}
                  </p>
                )}
              </div>

              {/* Metadados EN */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Hero Metadata (English)
                  </label>
                  <button
                    type="button"
                    onClick={addHeroMetaItemEn}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Ex: Client, Year, Type, etc.
                </p>

                {heroMetaItemsEn.length > 0 && (
                  <div className="space-y-3">
                    {heroMetaItemsEn.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <input
                          type="text"
                          value={item.label}
                          onChange={e =>
                            updateHeroMetaItemEn(index, 'label', e.target.value)
                          }
                          placeholder="Label (ex: Client)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={e =>
                            updateHeroMetaItemEn(index, 'value', e.target.value)
                          }
                          placeholder="Value (ex: Company XYZ)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeHeroMetaItemEn(index)}
                          className="p-2 text-red-600 hover:text-red-900 border border-gray-300 rounded-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campos de Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              🎨 Preview na Seção de Projetos
            </h3>

            <div className="space-y-4">
              {/* Imagem de Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem de Preview *
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Esta imagem aparecerá na seção de projetos da página inicial
                  (617x602px recomendado)
                </p>
                <ImageUpload
                  images={previewImage ? [previewImage] : []}
                  onImagesChange={images => setPreviewImage(images[0] || null)}
                  maxImages={1}
                />
                {!previewImage && (
                  <p className="mt-1 text-sm text-red-600">
                    Imagem de preview é obrigatória
                  </p>
                )}
              </div>

              {/* Título de Preview PT */}
              <div>
                <label
                  htmlFor="previewTitlePt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Título de Preview (Português) *
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  Aparecerá abaixo da imagem na seção de projetos
                </p>
                <input
                  {...register('previewTitlePt')}
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.previewTitlePt ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: | Projeto profissional | Ecori app"
                />
                {errors.previewTitlePt && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.previewTitlePt.message}
                  </p>
                )}
              </div>

              {/* Título de Preview EN */}
              <div>
                <label
                  htmlFor="previewTitleEn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Preview Title (English) *
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  Will appear below the image in the projects section
                </p>
                <input
                  {...register('previewTitleEn')}
                  type="text"
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.previewTitleEn ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ex: | Professional project | Ecori app"
                />
                {errors.previewTitleEn && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.previewTitleEn.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
              href="/admin/projects"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-vermelho hover:saturate-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                'Criar Projeto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
