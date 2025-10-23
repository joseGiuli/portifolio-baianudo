'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateProjectSchema } from '@/lib/schemas';
import {
  ArrowLeft,
  Save,
  Eye,
  Trash2,
  Plus,
  GripVertical,
  Type,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Copy,
  Minus,
  Link as LinkIcon,
  Send,
  AlertCircle,
  List,
} from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Componente para item draggable
function SortableBlock({ block, index, onUpdate, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id || `block-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move text-gray-400 hover:text-gray-600"
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex items-center space-x-2">
            {block.type === 'HEADING' && (
              <Type className="h-4 w-4 text-blue-500" />
            )}
            {block.type === 'PARAGRAPH' && (
              <FileText className="h-4 w-4 text-green-500" />
            )}
            {block.type === 'IMAGE' && (
              <ImageIcon className="h-4 w-4 text-purple-500" />
            )}
            {block.type === 'BUTTON' && (
              <LinkIcon className="h-4 w-4 text-orange-500" />
            )}
            {block.type === 'LIST' && (
              <List className="h-4 w-4 text-cyan-500" />
            )}
            <span className="text-sm font-medium text-gray-700">
              {block.type === 'HEADING' && 'Título'}
              {block.type === 'PARAGRAPH' && 'Texto'}
              {block.type === 'IMAGE' && 'Imagem'}
              {block.type === 'BUTTON' && 'Botão'}
              {block.type === 'LIST' && 'Lista'}
            </span>
          </div>
        </div>
        <button
          onClick={() => onDelete(index)}
          className="text-red-600 hover:text-red-900"
          title="Remover bloco"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <BlockEditor
        block={block}
        onChange={updatedBlock => onUpdate(index, updatedBlock)}
      />
    </div>
  );
}

// Componente para editar um bloco individual
function BlockEditor({ block, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...block, [field]: value });
  };

  switch (block.type) {
    case 'HEADING':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nível do título
            </label>
            <select
              value={block.level || 'h3'}
              onChange={e => handleChange('level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="h1">H1 - Título Principal</option>
              <option value="h2">H2 - Título Secundário</option>
              <option value="h3">H3 - Título de Seção</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇧🇷 Texto do título (Português)
            </label>
            <input
              type="text"
              value={block.textPt || ''}
              onChange={e => handleChange('textPt', e.target.value)}
              placeholder="Digite o título em português..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇺🇸 Texto do título (English)
            </label>
            <input
              type="text"
              value={block.textEn || ''}
              onChange={e => handleChange('textEn', e.target.value)}
              placeholder="Enter the title in English..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      );

    case 'PARAGRAPH':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇧🇷 Conteúdo do parágrafo (Português)
            </label>
            <textarea
              value={block.htmlPt || ''}
              onChange={e => handleChange('htmlPt', e.target.value)}
              placeholder="Digite o conteúdo em português..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇺🇸 Conteúdo do parágrafo (English)
            </label>
            <textarea
              value={block.htmlEn || ''}
              onChange={e => handleChange('htmlEn', e.target.value)}
              placeholder="Enter the content in English..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      );

    case 'DIVIDER':
      return (
        <div className="text-center text-gray-500 py-4">
          <p className="text-2xl mb-4">divisor</p>
          <div className="w-full bg-vermelho h-[4px]"></div>
        </div>
      );

    case 'LIST':
      return (
        <div className="space-y-3">
          {/* Items em Português */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                🇧🇷 Itens da lista (Português)
              </label>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(block.itemsPt || []), ''];
                  handleChange('itemsPt', newItems);
                }}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar item
              </button>
            </div>
            <div className="space-y-2">
              {(block.itemsPt || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const newItems = [...(block.itemsPt || [])];
                      newItems[index] = e.target.value;
                      handleChange('itemsPt', newItems);
                    }}
                    placeholder={`Item ${index + 1}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = (block.itemsPt || []).filter(
                        (_, i) => i !== index,
                      );
                      handleChange('itemsPt', newItems);
                    }}
                    className="p-2 text-red-600 hover:text-red-900 border border-gray-300 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {(!block.itemsPt || block.itemsPt.length === 0) && (
                <p className="text-sm text-gray-500 italic">
                  Nenhum item adicionado ainda
                </p>
              )}
            </div>
          </div>

          {/* Items em Inglês */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                🇺🇸 Itens da lista (English)
              </label>
              <button
                type="button"
                onClick={() => {
                  const newItems = [...(block.itemsEn || []), ''];
                  handleChange('itemsEn', newItems);
                }}
                className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add item
              </button>
            </div>
            <div className="space-y-2">
              {(block.itemsEn || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item}
                    onChange={e => {
                      const newItems = [...(block.itemsEn || [])];
                      newItems[index] = e.target.value;
                      handleChange('itemsEn', newItems);
                    }}
                    placeholder={`Item ${index + 1}...`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = (block.itemsEn || []).filter(
                        (_, i) => i !== index,
                      );
                      handleChange('itemsEn', newItems);
                    }}
                    className="p-2 text-red-600 hover:text-red-900 border border-gray-300 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {(!block.itemsEn || block.itemsEn.length === 0) && (
                <p className="text-sm text-gray-500 italic">
                  No items added yet
                </p>
              )}
            </div>
          </div>
        </div>
      );

    case 'BUTTON':
      // Validação de URL
      const isValidUrl = href => {
        if (!href || href.trim() === '') return true; // Vazio é válido (ainda não preenchido)
        try {
          const url = new URL(href);
          return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
          return false;
        }
      };

      const hrefValue = block.href || '';
      const isUrlValid = isValidUrl(hrefValue);
      const showUrlError = hrefValue.trim() !== '' && !isUrlValid;

      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇧🇷 Texto do botão (Português)
            </label>
            <input
              type="text"
              value={block.textPt || ''}
              onChange={e => handleChange('textPt', e.target.value)}
              placeholder="Digite o texto do botão em português..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🇺🇸 Texto do botão (English)
            </label>
            <input
              type="text"
              value={block.textEn || ''}
              onChange={e => handleChange('textEn', e.target.value)}
              placeholder="Enter the button text in English..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              🔗 Link (URL) *
            </label>
            <input
              type="url"
              value={hrefValue}
              onChange={e => handleChange('href', e.target.value)}
              onBlur={e => {
                const value = e.target.value.trim();
                // Auto-completar com https:// se não tiver protocolo
                if (
                  value &&
                  !value.startsWith('http://') &&
                  !value.startsWith('https://')
                ) {
                  handleChange('href', `https://${value}`);
                }
              }}
              placeholder="https://exemplo.com"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                showUrlError
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
              }`}
            />
            {showUrlError ? (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                URL inválida. Deve começar com http:// ou https://
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">
                O botão abrirá este link em uma nova aba. Se não começar com
                https://, será adicionado automaticamente.
              </p>
            )}
          </div>
        </div>
      );

    case 'IMAGE':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem
            </label>
            <ImageUpload
              currentImage={block.asset}
              onUpload={asset => {
                // Atualizar o bloco com o asset completo
                onChange({
                  ...block,
                  asset: asset,
                  assetId: asset.id,
                });
              }}
              onRemove={() => {
                onChange({
                  ...block,
                  asset: null,
                  assetId: null,
                });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto alternativo (alt) *
            </label>
            <input
              type="text"
              value={block.alt || ''}
              onChange={e => handleChange('alt', e.target.value)}
              placeholder="Descreva a imagem para acessibilidade..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legenda (opcional)
            </label>
            <input
              type="text"
              value={block.caption || ''}
              onChange={e => handleChange('caption', e.target.value)}
              placeholder="Legenda da imagem..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tamanho da imagem
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={block.useCustomSize || false}
                  onChange={e =>
                    handleChange('useCustomSize', e.target.checked)
                  }
                  className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">Personalizado</span>
              </label>
            </div>

            {block.useCustomSize ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Largura
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={block.customWidth || ''}
                        onChange={e =>
                          handleChange('customWidth', e.target.value)
                        }
                        placeholder="Ex: 800"
                        min="100"
                        max="2000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        px
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Altura (opcional)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={block.customHeight || ''}
                        onChange={e =>
                          handleChange('customHeight', e.target.value)
                        }
                        placeholder="Ex: 600"
                        min="100"
                        max="2000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        px
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Deixe altura vazia para manter proporção (100-2000px)
                </p>

                {block.customHeight && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Ajuste da imagem
                    </label>
                    <select
                      value={block.objectFit || 'cover'}
                      onChange={e => handleChange('objectFit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="cover">
                        Preencher (cortar se necessário)
                      </option>
                      <option value="contain">Ajustar (mostrar tudo)</option>
                      <option value="fill">Esticar</option>
                    </select>
                  </div>
                )}
              </div>
            ) : (
              <select
                value={block.size || 'large'}
                onChange={e => handleChange('size', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="small">Pequeno (400px)</option>
                <option value="medium">Médio (600px)</option>
                <option value="large">Grande (1000px)</option>
                <option value="full">Largura Total</option>
              </select>
            )}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function EditProjectPage({ params }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [projectId, setProjectId] = useState(null);

  const [project, setProject] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [heroMetaItemsPt, setHeroMetaItemsPt] = useState([]);
  const [heroMetaItemsEn, setHeroMetaItemsEn] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(UpdateProjectSchema),
  });

  // Carregar projeto
  const loadProject = async () => {
    if (!projectId) return;
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Projeto não encontrado');
      }
      const data = await response.json();
      setProject(data);
      setBlocks(data.blocks || []);
      setHeroMetaItemsPt(data.heroMetaPt || []);
      setHeroMetaItemsEn(data.heroMetaEn || []);

      // Preencher formulário
      setValue('titlePt', data.titlePt);
      setValue('subtitlePt', data.subtitlePt || '');
      setValue('titleEn', data.titleEn);
      setValue('subtitleEn', data.subtitleEn || '');
      setValue('previewTitlePt', data.previewTitlePt || '');
      setValue('previewTitleEn', data.previewTitleEn || '');
      setValue('status', data.status);
      setValue('seoTitle', data.seoTitle || '');
      setValue('seoDescription', data.seoDescription || '');

      // Carregar imagem de preview
      if (data.previewImage) {
        setPreviewImage({ url: data.previewImage });
      }
    } catch (err) {
      setError('Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  // Extrair ID dos params
  useEffect(() => {
    const extractId = async () => {
      const { id } = await params;
      setProjectId(id);
    };
    extractId();
  }, [params]);

  useEffect(() => {
    if (session?.user?.role === 'admin' && projectId) {
      loadProject();
    }
  }, [session, projectId]);

  // Funções para gerenciar heroMeta PT
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

  // Funções para gerenciar heroMeta EN
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

  // Função helper para validar URL
  const isValidUrl = href => {
    if (!href || href.trim() === '') return false;
    try {
      const url = new URL(href);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Auto-save com debounce
  const saveProject = useCallback(
    async data => {
      setSaving(true);
      try {
        // Filtrar heroMeta items vazios
        const validHeroMetaPt = heroMetaItemsPt.filter(
          item => item.label?.trim() && item.value?.trim(),
        );
        const validHeroMetaEn = heroMetaItemsEn.filter(
          item => item.label?.trim() && item.value?.trim(),
        );

        // Filtrar blocos vazios ou inválidos
        const invalidButtons = [];
        const validBlocks = blocks.filter((block, index) => {
          // Rastrear botões inválidos para feedback
          if (block.type === 'BUTTON') {
            const hasText = block.textPt?.trim() || block.textEn?.trim();
            const hasValidUrl = isValidUrl(block.href);
            if (hasText && !hasValidUrl) {
              invalidButtons.push(index + 1);
            }
          }

          // Validação normal
          const isValid = (() => {
            switch (block.type) {
              case 'HEADING':
                return block.textPt?.trim() || block.textEn?.trim(); // Título precisa ter texto em pelo menos um idioma
              case 'PARAGRAPH':
                return block.htmlPt?.trim() || block.htmlEn?.trim(); // Parágrafo precisa ter conteúdo em pelo menos um idioma
              case 'IMAGE':
                return block.assetId && block.alt?.trim(); // Imagem precisa ter asset e alt
              case 'BUTTON':
                return (
                  (block.textPt?.trim() || block.textEn?.trim()) &&
                  isValidUrl(block.href)
                ); // Botão precisa ter texto e link válido (http/https)
              case 'LIST':
                return (
                  (block.itemsPt && block.itemsPt.some(item => item?.trim())) ||
                  (block.itemsEn && block.itemsEn.some(item => item?.trim()))
                ); // Lista precisa ter pelo menos um item com conteúdo em pelo menos um idioma
              case 'DIVIDER':
                return true; // Divisor é sempre válido (texto é opcional)
              default:
                return false;
            }
          })();

          return isValid;
        });

        const response = await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            blocks: validBlocks,
            heroMetaPt: validHeroMetaPt.length > 0 ? validHeroMetaPt : null,
            heroMetaEn: validHeroMetaEn.length > 0 ? validHeroMetaEn : null,
            previewImage: previewImage?.url || '',
          }),
        });

        if (response.ok) {
          setLastSaved(new Date());
          setError(''); // Limpar erro se houver sucesso

          // Mensagem de sucesso com alerta se houver botões inválidos
          let successMessage = 'Projeto salvo com sucesso!';
          if (invalidButtons.length > 0) {
            successMessage += ` ⚠️ ${invalidButtons.length} botão(ões) com link inválido foi(ram) removido(s) automaticamente.`;
          }
          setSuccess(successMessage);

          // Atualizar lista de blocos removendo os vazios
          setBlocks(validBlocks);

          // Limpar mensagem de sucesso após 5 segundos se houver aviso
          setTimeout(
            () => setSuccess(''),
            invalidButtons.length > 0 ? 5000 : 3000,
          );
        } else {
          const errorData = await response.json();
          console.error('Erro ao salvar:', errorData);

          // Mostrar detalhes do erro se disponível
          let errorMessage = 'Erro ao salvar projeto';
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.details) {
            // Se houver detalhes de validação Zod
            errorMessage = errorData.details.map(d => d.message).join(', ');
          }

          setError(errorMessage);

          // Limpar erro após 5 segundos
          setTimeout(() => setError(''), 5000);
        }
      } catch (err) {
        console.error('Erro ao salvar:', err);
        setError('Erro ao salvar projeto');

        // Limpar erro após 5 segundos
        setTimeout(() => setError(''), 5000);
      } finally {
        setSaving(false);
      }
    },
    [
      projectId,
      blocks,
      heroMetaItemsPt,
      heroMetaItemsEn,
      previewImage,
      isValidUrl,
    ],
  );

  // Adicionar novo bloco
  const addBlock = type => {
    const newBlock = {
      id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      ...(type === 'HEADING' && { level: 'h3', textPt: '', textEn: '' }),
      ...(type === 'PARAGRAPH' && { htmlPt: '', htmlEn: '' }),
      ...(type === 'IMAGE' && {
        alt: '',
        caption: '',
        size: 'large',
        useCustomSize: false,
        customWidth: '',
        customHeight: '',
        objectFit: 'cover',
      }),
      ...(type === 'BUTTON' && { textPt: '', textEn: '', href: '' }),
      ...(type === 'LIST' && { itemsPt: [], itemsEn: [] }),
      ...(type === 'DIVIDER' && {}),
    };
    setBlocks([...blocks, newBlock]);
  };

  // Atualizar bloco
  const updateBlock = (index, updatedBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  // Remover bloco
  const deleteBlock = index => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  // Reordenar blocos (drag & drop)
  const handleDragEnd = event => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks(items => {
        const oldIndex = items.findIndex(
          item => (item.id || `block-${items.indexOf(item)}`) === active.id,
        );
        const newIndex = items.findIndex(
          item => (item.id || `block-${items.indexOf(item)}`) === over.id,
        );

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Copiar link do projeto
  const copyProjectLink = () => {
    const url = `${window.location.origin}/projetos/${project.slug}`;
    navigator.clipboard.writeText(url);
    // TODO: Mostrar toast de sucesso
  };

  // Publicar projeto
  const publishProject = async () => {
    setSaving(true);
    try {
      setValue('status', 'published');
      await handleSubmit(data =>
        saveProject({ ...data, status: 'published' }),
      )();
      setSuccess('Projeto publicado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Erro ao publicar projeto');
      setTimeout(() => setError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando projeto...</div>
      </div>
    );
  }

  if (!session || session?.user?.role !== 'admin' || !project) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para projetos
        </Link>

        <div className="flex justify-between items-start">
          <div>
            <div className="">
              <h1 className="text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
              {/* Badge de Status */}
              {watch('status') === 'draft' ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  <AlertCircle className="mr-1.5 h-4 w-4" />
                  Rascunho
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  <Eye className="mr-1.5 h-4 w-4" />
                  Publicado
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
              <span>Slug: {project.slug}</span>
              <button
                onClick={copyProjectLink}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                title="Copiar link"
              >
                <Copy className="mr-1 h-4 w-4" />
                Copiar link
              </button>
              {watch('status') === 'published' ? (
                <Link
                  href={`/projetos/${project.slug}`}
                  target="_blank"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
                >
                  <ExternalLink className="mr-1 h-4 w-4" />
                  Ver projeto
                </Link>
              ) : (
                <span
                  className="inline-flex items-center text-amber-600"
                  title="Publique o projeto para visualizar"
                >
                  <AlertCircle className="mr-1 h-3.5 w-3.5" />
                  Não visível publicamente
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {saving && (
              <span className="text-sm text-gray-500">Salvando...</span>
            )}
            {lastSaved && (
              <span className="text-sm text-gray-500">
                Salvo às {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {/* Botão Publicar - aparece apenas em rascunho */}
            {watch('status') === 'draft' && (
              <button
                onClick={publishProject}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Publicar projeto para torná-lo visível publicamente"
              >
                <Send className="mr-2 h-4 w-4" />
                Publicar
              </button>
            )}
            <button
              onClick={handleSubmit(saveProject)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-vermelho hover:saturate-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor (lado esquerdo) */}
        <div>
          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Configurações do Projeto
              </h2>
            </div>
            <div className="px-6 py-4 space-y-6">
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

              {/* Status */}
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <select
                    {...register('status')}
                    className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </select>

                  {/* Indicador visual do status */}
                  <div className="flex items-center px-3 py-2 rounded-md bg-gray-50">
                    {watch('status') === 'draft' ? (
                      <>
                        <span className="w-3 h-3 rounded-full mr-2 bg-amber-500"></span>
                        <span className="text-sm font-medium text-amber-500">
                          Rascunho
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                        <span className="text-sm font-medium text-green-500">
                          Publicado
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos Português */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  🇧🇷 Português
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Título (Português) *
                    </label>
                    <input
                      {...register('titlePt')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.titlePt && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.titlePt.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subtítulo (Português)
                    </label>
                    <input
                      {...register('subtitlePt')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Metadados Hero (Português)
                      </label>
                      <button
                        type="button"
                        onClick={addHeroMetaItemPt}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    </div>

                    {heroMetaItemsPt.length > 0 && (
                      <div className="space-y-2">
                        {heroMetaItemsPt.map((item, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <input
                              type="text"
                              value={item.label}
                              onChange={e =>
                                updateHeroMetaItemPt(
                                  index,
                                  'label',
                                  e.target.value,
                                )
                              }
                              placeholder="Label (ex: Cliente)"
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                              type="text"
                              value={item.value}
                              onChange={e =>
                                updateHeroMetaItemPt(
                                  index,
                                  'value',
                                  e.target.value,
                                )
                              }
                              placeholder="Valor (ex: Empresa XYZ)"
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeHeroMetaItemPt(index)}
                              className="p-1.5 text-red-600 hover:text-red-900 border border-gray-300 rounded-md"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Campos Inglês */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-md font-medium text-gray-900 mb-3">
                  🇺🇸 English
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title (English) *
                    </label>
                    <input
                      {...register('titleEn')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {errors.titleEn && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.titleEn.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subtitle (English)
                    </label>
                    <input
                      {...register('subtitleEn')}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Hero Metadata (English)
                      </label>
                      <button
                        type="button"
                        onClick={addHeroMetaItemEn}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </button>
                    </div>

                    {heroMetaItemsEn.length > 0 && (
                      <div className="space-y-2">
                        {heroMetaItemsEn.map((item, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <input
                              type="text"
                              value={item.label}
                              onChange={e =>
                                updateHeroMetaItemEn(
                                  index,
                                  'label',
                                  e.target.value,
                                )
                              }
                              placeholder="Label (ex: Client)"
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                            />
                            <input
                              type="text"
                              value={item.value}
                              onChange={e =>
                                updateHeroMetaItemEn(
                                  index,
                                  'value',
                                  e.target.value,
                                )
                              }
                              placeholder="Value (ex: Company XYZ)"
                              className="flex-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeHeroMetaItemEn(index)}
                              className="p-1.5 text-red-600 hover:text-red-900 border border-gray-300 rounded-md"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  🎨 Preview na Seção de Projetos
                </h3>

                <div className="space-y-4">
                  {/* Imagem de Preview */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Imagem de Preview *
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Esta imagem aparecerá na seção de projetos da página
                      inicial (617x602px recomendado)
                    </p>
                    <ImageUpload
                      images={previewImage ? [previewImage] : []}
                      onImagesChange={images =>
                        setPreviewImage(images[0] || null)
                      }
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
                        errors.previewTitlePt
                          ? 'border-red-300'
                          : 'border-gray-300'
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
                        errors.previewTitleEn
                          ? 'border-red-300'
                          : 'border-gray-300'
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
            </div>
          </div>

          {/* Editor de blocos */}
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Conteúdo</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addBlock('HEADING')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Adicionar Título"
                  >
                    <Type className="mr-2 h-4 w-4" />
                    Título
                  </button>
                  <button
                    onClick={() => addBlock('PARAGRAPH')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Adicionar Texto"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Texto
                  </button>
                  <button
                    onClick={() => addBlock('IMAGE')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Adicionar Imagem"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Imagem
                  </button>
                  <button
                    onClick={() => addBlock('BUTTON')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Adicionar Botão"
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Botão
                  </button>
                  <button
                    onClick={() => addBlock('LIST')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Adicionar Lista"
                  >
                    <List className="mr-2 h-4 w-4" />
                    Lista
                  </button>
                  <button
                    onClick={() => addBlock('DIVIDER')}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Adicionar Divisor"
                  >
                    <Minus className="mr-2 h-4 w-4" />
                    Divisor
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg font-medium">
                    Nenhum bloco adicionado ainda.
                  </p>
                  <p className="text-sm mt-1">
                    Use os botões abaixo para começar a adicionar conteúdo.
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map(
                      (block, index) => block.id || `block-${index}`,
                    )}
                    strategy={verticalListSortingStrategy}
                  >
                    {blocks.map((block, index) => (
                      <SortableBlock
                        key={block.id || `block-${index}`}
                        block={block}
                        index={index}
                        onUpdate={updateBlock}
                        onDelete={deleteBlock}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}

              {/* Barra de adição de blocos sempre visível embaixo */}
              <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Plus className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-semibold text-gray-700">
                      Adicionar novo bloco
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => addBlock('HEADING')}
                      className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      title="Adicionar Título"
                    >
                      <Type className="mr-2 h-4 w-4" />
                      Título
                    </button>
                    <button
                      onClick={() => addBlock('PARAGRAPH')}
                      className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      title="Adicionar Texto"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Texto
                    </button>
                    <button
                      onClick={() => addBlock('IMAGE')}
                      className="inline-flex items-center px-3 py-2 border border-purple-300 shadow-sm text-sm leading-4 font-medium rounded-md text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                      title="Adicionar Imagem"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Imagem
                    </button>
                    <button
                      onClick={() => addBlock('BUTTON')}
                      className="inline-flex items-center px-3 py-2 border border-orange-300 shadow-sm text-sm leading-4 font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                      title="Adicionar Botão"
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Botão
                    </button>
                    <button
                      onClick={() => addBlock('LIST')}
                      className="inline-flex items-center px-3 py-2 border border-cyan-300 shadow-sm text-sm leading-4 font-medium rounded-md text-cyan-700 bg-white hover:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                      title="Adicionar Lista"
                    >
                      <List className="mr-2 h-4 w-4" />
                      Lista
                    </button>
                    <button
                      onClick={() => addBlock('DIVIDER')}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                      title="Adicionar Divisor"
                    >
                      <Minus className="mr-2 h-4 w-4" />
                      Divisor
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões na parte inferior */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={copyProjectLink}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Copiar link"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar link
                  </button>
                  {watch('status') === 'published' && (
                    <Link
                      href={`/projetos/${project.slug}`}
                      target="_blank"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Ver projeto
                    </Link>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {saving && (
                    <span className="text-sm text-gray-500">Salvando...</span>
                  )}
                  {lastSaved && !saving && (
                    <span className="text-sm text-gray-500">
                      Salvo às {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                  {/* Botão Publicar - aparece apenas em rascunho */}
                  {watch('status') === 'draft' && (
                    <button
                      onClick={publishProject}
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                      title="Publicar projeto para torná-lo visível publicamente"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Publicar
                    </button>
                  )}
                  <button
                    onClick={handleSubmit(saveProject)}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-vermelho hover:saturate-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Projeto
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview (lado direito) */}
        <div>
          <div className="bg-white shadow sm:rounded-lg sticky top-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Preview</h2>
            </div>
            <div className="px-6 py-6 bg-black min-h-[400px]">
              {/* Hero - Preview em Português */}
              <div className="mb-8">
                <h1 className="text-vermelho font-bold text-5xl lg:text-3xl leading-tight tracking-tight">
                  {watch('titlePt') || 'Título do Projeto'}
                </h1>
                {watch('subtitlePt') && (
                  <p className="text-neutral text-4xl lg:text-2xl mt-2 max-w-4xl">
                    {watch('subtitlePt')}
                  </p>
                )}

                {/* Metadados do Hero */}
                {heroMetaItemsPt.filter(item => item.label && item.value)
                  .length > 0 && (
                  <div className="mt-6 grid grid-cols-1 gap-y-4 gap-x-6 -lg:grid-cols-4">
                    {heroMetaItemsPt
                      .filter(item => item.label && item.value)
                      .map(({ label, value }, index) => (
                        <div key={index}>
                          <p className="text-vermelho text-base font-medium">
                            {label}
                          </p>
                          <p className="text-neutral text-base mt-1">{value}</p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Conteúdo */}
              <div className="[&_p]:text-[22px] lg:[&_p]:text-lg [&_p]:leading-10 [&_p]:text-neutral space-y-8">
                {blocks.map((block, index) => {
                  const blockKey = block.id || `block-${index}`;
                  switch (block.type) {
                    case 'HEADING':
                      return (
                        <h3
                          key={blockKey}
                          className="text-4xl lg:text-3xl text-neutral text-center my-12"
                        >
                          {block.textPt || block.textEn || 'Título...'}
                        </h3>
                      );

                    case 'PARAGRAPH':
                      return (
                        <p
                          key={blockKey}
                          dangerouslySetInnerHTML={{
                            __html:
                              block.htmlPt || block.htmlEn || 'Parágrafo...',
                          }}
                        />
                      );

                    case 'IMAGE':
                      if (block.asset?.url || block.assetId) {
                        const imageUrl = block.asset?.url;

                        if (imageUrl) {
                          // Usar tamanho customizado ou tamanho padrão
                          let imageClass = 'mx-auto';
                          let imageStyle = { maxWidth: '100%' };

                          if (block.useCustomSize && block.customWidth) {
                            // Tamanho personalizado usando inline styles
                            const width = parseInt(block.customWidth);
                            imageStyle.width = `min(100%, ${width}px)`;

                            if (block.customHeight) {
                              // Se altura foi definida
                              const height = parseInt(block.customHeight);
                              imageStyle.height = `${height}px`;
                              imageStyle.objectFit = block.objectFit || 'cover';
                            } else {
                              // Manter proporção
                              imageStyle.height = 'auto';
                            }
                          } else {
                            // Mapear tamanho para inline styles também
                            const sizeMap = {
                              small: 'min(100%, 400px)',
                              medium: 'min(100%, 600px)',
                              large: 'min(100%, 1000px)',
                              full: '100%',
                            };
                            imageStyle.width =
                              sizeMap[block.size] || sizeMap.large;
                            imageStyle.height = 'auto';
                          }

                          return (
                            <figure key={blockKey}>
                              <img
                                src={imageUrl}
                                alt={block.alt || 'Imagem do projeto'}
                                className={imageClass}
                                style={imageStyle}
                              />
                              {block.caption && (
                                <figcaption className="text-center text-sm text-neutral/70 mt-2">
                                  {block.caption}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }
                      }

                      // Placeholder quando não há imagem
                      return (
                        <div
                          key={blockKey}
                          className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                          <p className="text-gray-400">
                            {block.alt || 'Adicione uma imagem ao bloco'}
                          </p>
                          {block.caption && (
                            <p className="text-sm text-gray-500 mt-2">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      );

                    case 'BUTTON':
                      if (block.textPt || block.textEn) {
                        return (
                          <div
                            key={blockKey}
                            className="flex justify-center my-8"
                          >
                            <button
                              className="relative isolate overflow-hidden rounded-xl border border-white bg-transparent px-8 py-4 lg:px-4 lg:py-3 text-white shadow-md"
                              disabled
                            >
                              <span className="relative z-10">
                                {block.textPt ||
                                  block.textEn ||
                                  'Texto do botão...'}
                              </span>
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={blockKey}
                          className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700"
                        >
                          <LinkIcon className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                          <p className="text-gray-400">
                            Configure o texto do botão
                          </p>
                        </div>
                      );

                    case 'LIST':
                      const items = block.itemsPt || block.itemsEn || [];
                      const validItems = items.filter(item => item?.trim());

                      if (validItems.length === 0) {
                        return (
                          <div
                            key={blockKey}
                            className="text-center py-8 bg-gray-800 rounded-lg border border-gray-700"
                          >
                            <List className="h-12 w-12 mx-auto text-gray-500 mb-2" />
                            <p className="text-gray-400">
                              Adicione itens à lista
                            </p>
                          </div>
                        );
                      }

                      return (
                        <ul
                          key={blockKey}
                          className="list-disc marker:text-neutral text-neutral pl-6 space-y-6 text-[22px] lg:text-lg leading-10"
                        >
                          {validItems.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );

                    case 'DIVIDER':
                      return (
                        <div key={blockKey} className="my-12 relative">
                          <div className="flex items-center">
                            <div className="flex-grow border-t border-vermelho"></div>
                            <div className="w-2 h-2 bg-vermelho rounded-full mx-4"></div>
                            <div className="flex-grow border-t border-vermelho"></div>
                          </div>
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
