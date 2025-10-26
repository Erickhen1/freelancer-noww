import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/const";

export default function EditJob() {
  const [, params] = useRoute("/editar-vaga/:id");
  const [, setLocation] = useLocation();
  const jobId = params?.id ? parseInt(params.id) : 0;

  const { data: job, isLoading } = trpc.jobs.getById.useQuery({ id: jobId });
  const updateMutation = trpc.jobs.update.useMutation();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    salary: "",
    workDate: "",
    requirements: "",
    status: "open" as "open" | "closed",
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        category: job.category || "",
        description: job.description || "",
        location: job.location || "",
        salary: job.salary || "",
        workDate: job.workDate || "",
        requirements: job.requirements || "",
        status: (job.status === "closed" ? "closed" : "open") as "open" | "closed",
      });
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.title.length < 5) {
      toast.error("O título deve ter pelo menos 5 caracteres");
      return;
    }

    if (formData.description.length < 20) {
      toast.error("A descrição deve ter pelo menos 20 caracteres");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: jobId,
        ...formData,
      });

      toast.success("Vaga atualizada com sucesso!");
      setLocation("/perfil");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar vaga");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Vaga não encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-1 container mx-auto py-8">
        <Button
          variant="ghost"
          onClick={() => setLocation("/perfil")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Perfil
        </Button>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-6">Editar Vaga</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Título da Vaga (mínimo 5 caracteres)
              </label>
              <Input
                id="title"
                placeholder="Ex: Garçom para evento corporativo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Descrição (mínimo 20 caracteres)
              </label>
              <Textarea
                id="description"
                placeholder="Descreva as responsabilidades e detalhes da vaga..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/20 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-2">
                Localização
              </label>
              <Input
                id="location"
                placeholder="Ex: São Paulo, SP"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="salary" className="block text-sm font-medium mb-2">
                  Remuneração (opcional)
                </label>
                <Input
                  id="salary"
                  placeholder="Ex: R$ 150/dia"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="workDate" className="block text-sm font-medium mb-2">
                  Data do Trabalho (opcional)
                </label>
                <Input
                  id="workDate"
                  placeholder="Ex: 15/12/2025"
                  value={formData.workDate}
                  onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="requirements" className="block text-sm font-medium mb-2">
                Requisitos (opcional)
              </label>
              <Textarea
                id="requirements"
                placeholder="Liste os requisitos necessários para a vaga..."
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status da Vaga
              </label>
              <Select
                value={formData.status}
                onValueChange={(value: "open" | "closed") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Aberta</SelectItem>
                  <SelectItem value="closed">Fechada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Alterações"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/perfil")}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

