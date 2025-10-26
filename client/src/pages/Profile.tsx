import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CATEGORIES, getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Star, Briefcase, User, FileText, Edit, Trash2 } from "lucide-react";
import { formatCPFOrCNPJ, validateCPFOrCNPJ } from "@/lib/cpfCnpjValidator";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";

function MyJobsTab({ userId }: { userId?: number }) {
  const { data: jobs, isLoading } = trpc.jobs.myJobs.useQuery(undefined, {
    enabled: !!userId,
  });

  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Você ainda não publicou nenhuma vaga.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.category} • {job.location}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Link href={`/editar-vaga/${job.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {job.description}
            </p>
            <div className="mt-4 flex gap-4 text-sm">
              {job.salary && (
                <span className="text-green-600 font-medium">{job.salary}</span>
              )}
              {job.workDate && (
                <span className="text-muted-foreground">{job.workDate}</span>
              )}
              <span className="ml-auto">
                Status: <span className={job.status === "open" ? "text-green-600" : "text-gray-500"}>
                  {job.status === "open" ? "Aberta" : "Fechada"}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Profile() {
  const { isAuthenticated, user } = useAuth();
  const utils = trpc.useUtils();

  const { data: profile, isLoading } = trpc.user.getProfile.useQuery(
    { userId: user?.id },
    { enabled: !!user?.id }
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cpfCnpj: "",
    bio: "",
    experience: "",
    area: "",
    location: "",
    userType: "freelancer" as "freelancer" | "company",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        cpfCnpj: profile.cpfCnpj || "",
        bio: profile.bio || "",
        experience: profile.experience || "",
        area: profile.area || "",
        location: profile.location || "",
        userType: profile.userType,
      });
    }
  }, [profile]);

  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      utils.user.getProfile.invalidate();
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para acessar seu perfil.
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Meu Perfil</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Star className="mr-2 h-4 w-4" />
              Estatísticas
            </TabsTrigger>
            {profile?.userType === "company" && (
              <TabsTrigger value="jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Minhas Vagas
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações profissionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="userType">Tipo de Usuário</Label>
                    <Select
                      value={formData.userType}
                      onValueChange={(value: "freelancer" | "company") =>
                        setFormData({ ...formData, userType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freelancer">Freelancer</SelectItem>
                        <SelectItem value="company">Empresa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cpfCnpj">
                      {formData.userType === "freelancer" ? "CPF" : "CNPJ"}
                    </Label>
                    <Input
                      id="cpfCnpj"
                      value={formData.cpfCnpj}
                      onChange={(e) => {
                        const formatted = formatCPFOrCNPJ(e.target.value);
                        setFormData({ ...formData, cpfCnpj: formatted });
                      }}
                      placeholder={formData.userType === "freelancer" ? "000.000.000-00" : "00.000.000/0000-00"}
                      maxLength={18}
                    />
                    {formData.cpfCnpj && (
                      <p className={`text-sm mt-1 ${
                        validateCPFOrCNPJ(formData.cpfCnpj).valid 
                          ? "text-green-600" 
                          : "text-red-600"
                      }`}>
                        {validateCPFOrCNPJ(formData.cpfCnpj).message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Cidade, Estado"
                    />
                  </div>

                  {formData.userType === "freelancer" && (
                    <>
                      <div>
                        <Label htmlFor="area">Área de Atuação</Label>
                        <Select
                          value={formData.area}
                          onValueChange={(value) => setFormData({ ...formData, area: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua área" />
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
                        <Label htmlFor="experience">Experiência</Label>
                        <Textarea
                          id="experience"
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          placeholder="Descreva sua experiência profissional..."
                          rows={4}
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="bio">Sobre {formData.userType === "company" ? "a Empresa" : "Você"}</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você ou sua empresa..."
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5 text-yellow-500" />
                    Avaliações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {profile?.avgRating || 0}
                    </div>
                    <div className="text-muted-foreground">
                      {profile?.reviewCount || 0} avaliações
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-primary" />
                    Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Membro desde:</span>
                      <span className="font-medium">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("pt-BR") : "-"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Último acesso:</span>
                      <span className="font-medium">
                        {profile?.lastSignedIn ? new Date(profile.lastSignedIn).toLocaleDateString("pt-BR") : "-"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {profile?.userType === "company" && (
            <TabsContent value="jobs">
              <MyJobsTab userId={user?.id} />
            </TabsContent>
          )}
        </Tabs>
      </div>
      </div>
    </div>
  );
}

