import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CATEGORIES, getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";

export default function PostJob() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary: "",
    workDate: "",
    requirements: "",
  });

  const createJobMutation = trpc.jobs.create.useMutation({
    onSuccess: () => {
      toast.success("Vaga publicada com sucesso!");
      utils.jobs.list.invalidate();
      setFormData({
        title: "",
        description: "",
        category: "",
        location: "",
        salary: "",
        workDate: "",
        requirements: "",
      });
      setLocation("/buscar-vagas");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao publicar vaga");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.title.length < 5) {
      toast.error("O título deve ter pelo menos 5 caracteres");
      return;
    }

    if (formData.description.length < 20) {
      toast.error("A descrição deve ter pelo menos 20 caracteres");
      return;
    }

    createJobMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para publicar uma vaga.
              </p>
              <Button onClick={() => window.location.href = getLoginUrl()}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Publicar Vaga</h1>

        <Card>
          <CardHeader>
            <CardTitle>Nova Vaga</CardTitle>
            <CardDescription>
              Preencha as informações abaixo para publicar uma nova vaga
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Título da Vaga * (mínimo 5 caracteres)</Label>
                <Input
                  id="title"
                  placeholder="Ex: Garçom para evento corporativo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{borderColor: '#000000', paddingRight: '30px', marginTop: '19px'}}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger style={{paddingLeft: '8px', marginTop: '15px', borderColor: '#000000'}}>
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
                <Label htmlFor="description">Descrição * (mínimo 20 caracteres)</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva as responsabilidades e detalhes da vaga..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required style={{paddingTop: '11px', marginTop: '10px', borderColor: '#000000'}}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.description.length}/20 caracteres
                </p>
              </div>

              <div>
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo, SP"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  style={{borderColor: '#000000', paddingTop: '6px', marginTop: '6px'}}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary">Salário/Remuneração</Label>
                  <Input
                    id="salary"
                    placeholder="Ex: R$ 150/dia"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    style={{marginTop: '7px', borderColor: '#000000'}}
                  />
                </div>

                <div>
                  <Label htmlFor="workDate">Data do Trabalho</Label>
                  <Input
                    id="workDate"
                    placeholder="Ex: 15/12/2025"
                    value={formData.workDate}
                    onChange={(e) => setFormData({ ...formData, workDate: e.target.value })}
                    style={{borderColor: '#000000', paddingTop: '6px', marginTop: '7px'}}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Requisitos</Label>
                <Textarea
                  id="requirements"
                  placeholder="Liste os requisitos necessários para a vaga..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3} style={{borderColor: '#000000'}}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createJobMutation.isPending}
                >
                  {createJobMutation.isPending ? "Publicando..." : "Publicar Vaga"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/buscar-vagas")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}

