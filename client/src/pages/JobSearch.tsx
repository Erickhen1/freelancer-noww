import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { CATEGORIES } from "@/const";
import { Search, MapPin, Briefcase, DollarSign, Calendar, Filter } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<string>("all");

  const { data: jobs, isLoading } = trpc.jobs.list.useQuery({
    search: keyword || undefined,
    location: location || undefined,
    category: category === "all" ? undefined : category,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-blue-600 to-blue-700 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-90" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Encontre sua Próxima Oportunidade
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Milhares de vagas esperando por você. Filtre e encontre a ideal!
          </p>
        </div>
      </section>

      {/* Search Filters */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <Card className="shadow-2xl border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Keyword */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Palavra-chave
                </label>
                <Input
                  placeholder="Cargo, empresa..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </label>
                <Input
                  placeholder="Cidade, estado..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Tipo de Vaga
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Todas as áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as áreas</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <div className="space-y-2">
                <label className="text-sm font-medium opacity-0">Buscar</label>
                <Button
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                  size="lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Buscar Vagas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando vagas...</p>
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">
                        {job.companyName || "EMPRESA"}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                        {job.category}
                      </div>
                      <div className="flex items-center text-sm font-semibold text-green-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.salary}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Postado em: {format(new Date(job.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <Button
                        variant="link"
                        className="text-primary font-semibold p-0 h-auto hover:underline"
                        asChild
                      >
                        <Link href={`/vaga/${job.id}`}>Ver Detalhes</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros de busca para encontrar mais oportunidades.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

