import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, DollarSign, Calendar, Briefcase, Building2, Loader2, MessageSquare } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

export default function JobDetail() {
  const [, params] = useRoute("/vaga/:id");
  const jobId = params?.id ? parseInt(params.id) : 0;
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const [applicationMessage, setApplicationMessage] = useState("");
  const utils = trpc.useUtils();

  const { data: job, isLoading } = trpc.jobs.getById.useQuery({ id: jobId });

  const applyMutation = trpc.applications.applyToJob.useMutation({
    onSuccess: () => {
      toast.success("Candidatura enviada com sucesso!");
      setApplicationMessage("");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar candidatura");
    },
  });

  const createChatMutation = trpc.chats.getOrCreate.useMutation({
    onSuccess: (chat) => {
      if (chat) {
        setLocation(`/chat/${chat.id}`);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao iniciar conversa");
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para se candidatar");
      return;
    }
    applyMutation.mutate({ jobId, message: applicationMessage });
  };

  const handleStartChat = () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para enviar mensagem");
      return;
    }
    if (job?.companyId) {
      createChatMutation.mutate({ otherUserId: job.companyId, jobId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Vaga não encontrada</h2>
              <Button onClick={() => setLocation("/buscar-vagas")}>
                Voltar para Busca
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Button variant="ghost" onClick={() => setLocation("/buscar-vagas")} className="mb-4">
          ← Voltar
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  {job.category}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                job.status === "open" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
                {job.status === "open" ? "Aberta" : "Fechada"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                {job.location}
              </div>
              {job.salary && (
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-5 w-5 mr-2" />
                  {job.salary}
                </div>
              )}
              {job.workDate && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-5 w-5 mr-2" />
                  {job.workDate}
                </div>
              )}
              <div className="flex items-center text-muted-foreground">
                <Building2 className="h-5 w-5 mr-2" />
                {job.company?.name || "Empresa"}
              </div>
            </div>

            {job.requirements && (
              <div>
                <h3 className="font-semibold mb-2">Requisitos</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {job.status === "open" && user?.id !== job.companyId && (
          <Card>
            <CardHeader>
              <CardTitle>Candidatar-se</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Mensagem para o empregador (opcional)..."
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                rows={4}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  onClick={handleApply}
                  disabled={applyMutation.isPending || !isAuthenticated}
                >
                  {applyMutation.isPending ? "Enviando..." : "Enviar Candidatura"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStartChat}
                  disabled={createChatMutation.isPending || !isAuthenticated}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {createChatMutation.isPending ? "Abrindo..." : "Enviar Mensagem"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
