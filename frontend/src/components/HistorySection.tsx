import React from 'react';
import { Clock, Copy, Camera, Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  prompt: string;
  contentType: 'post' | 'story';
  selectedOption: 'A' | 'B';
  selectedContent: {
    caption: string;
    hashtags: string[];
  };
  createdAt: Date;
}

interface HistorySectionProps {
  history: HistoryItem[];
}

const HistorySection: React.FC<HistorySectionProps> = ({ history }) => {
  const { toast } = useToast();

  const copyToClipboard = async (content: { caption: string; hashtags: string[] }) => {
    try {
      const text = `${content.caption}\n\n${content.hashtags.join(' ')}`;
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência."
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o conteúdo.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center p-4 rounded-full bg-background-light mb-4">
        <Clock className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Nenhum histórico ainda
      </h3>
      <p className="text-text-secondary max-w-md mx-auto">
        Quando você gerar seu primeiro conteúdo, ele aparecerá aqui para você acessar e reutilizar.
      </p>
    </div>
  );

  if (history.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-medium border border-border">
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Histórico</h2>
          <p className="text-text-secondary">Seus conteúdos gerados recentemente</p>
        </div>
        <div className="text-sm text-text-muted">
          {history.length} {history.length === 1 ? 'item' : 'itens'}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {history.map((item) => (
          <div key={item.id} className="content-card card-hover group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded bg-background-light">
                  {item.contentType === 'post' ? (
                    <Camera className="h-4 w-4 text-primary" />
                  ) : (
                    <Smartphone className="h-4 w-4 text-primary" />
                  )}
                </div>
                <span className="text-xs font-medium text-text-secondary capitalize">
                  {item.contentType}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-text-muted">
                <Clock className="h-3 w-3" />
                {formatDate(item.createdAt)}
              </div>
            </div>

            {/* Prompt */}
            <div className="mb-4">
              <p className="text-sm text-text-primary leading-relaxed" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.prompt}
              </p>
            </div>

            {/* Selected Option Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="inline-flex items-center px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                  <Check className="h-3 w-3 mr-1" />
                  Opção {item.selectedOption}
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="bg-background-light rounded p-3 mb-4 space-y-2">
              <p className="text-xs text-text-primary leading-relaxed" style={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.selectedContent.caption}
              </p>
              <div className="flex flex-wrap gap-1">
                {item.selectedContent.hashtags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-hashtag-bg text-hashtag-text rounded-full">
                    {tag}
                  </span>
                ))}
                {item.selectedContent.hashtags.length > 3 && (
                  <span className="text-xs text-text-muted">
                    +{item.selectedContent.hashtags.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(item.selectedContent)}
              className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar conteúdo
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;