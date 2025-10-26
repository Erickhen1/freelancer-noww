import { useAuth } from "@/_core/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Search, PlusCircle, Briefcase, Users, Star } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white py-32 px-4">
        <div className="container mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-3xl border-4 border-white/30 shadow-2xl">
              <img
                src={APP_LOGO}
                alt={`${APP_TITLE} Logo`}
                className="object-fill"
                style={{borderRadius: '17px', width: '153px', height: '154px', borderStyle: 'ridge'}}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Conectando Talentos e Oportunidades
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-95 leading-relaxed">
            A plataforma ideal para bares, restaurantes e hotéis encontrarem<br />
            freelancers qualificados. Garçons, cozinheiros, bartenders e mais!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-[#fbbf24] hover:bg-[#f59e0b] text-gray-900 font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/buscar-vagas">
                <Search className="mr-2 h-5 w-5" />
                Buscar Vagas
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#0ea5e9] font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/publicar-vaga">
                <PlusCircle className="mr-2 h-5 w-5" />
                Publicar Vaga
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Como Funciona
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Para Empresas */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0ea5e9]/10">
                    <img
                      src={APP_LOGO}
                      alt="Para Empresas"
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Para Empresas</h3>
                <p className="text-gray-600 leading-relaxed">
                  Publique vagas rapidamente e encontre os melhores freelancers para o seu estabelecimento. 
                  Visualize perfis detalhados e avaliações.
                </p>
              </CardContent>
            </Card>

            {/* Para Freelancers */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0ea5e9]/10">
                    <Users className="h-12 w-12 text-[#0ea5e9]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Para Freelancers</h3>
                <p className="text-gray-600 leading-relaxed">
                  Cadastre-se, crie seu perfil profissional destacando sua experiência e área de atuação. 
                  Encontre oportunidades incríveis.
                </p>
              </CardContent>
            </Card>

            {/* Avaliações Transparentes */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#0ea5e9]/10">
                    <Star className="h-12 w-12 text-[#0ea5e9]" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Avaliações Transparentes</h3>
                <p className="text-gray-600 leading-relaxed">
                  Sistema de avaliação mútua para construir confiança e garantir a qualidade dos 
                  serviços prestados e das contratações.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0ea5e9] to-[#0284c7] text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 mr-3" />
                <div className="text-5xl font-bold">1000+</div>
              </div>
              <p className="text-xl opacity-90">Freelancers Cadastrados</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <Briefcase className="h-8 w-8 mr-3" />
                <div className="text-5xl font-bold">500+</div>
              </div>
              <p className="text-xl opacity-90">Vagas Publicadas</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-3">
                <Star className="h-8 w-8 mr-3" />
                <div className="text-5xl font-bold">2000+</div>
              </div>
              <p className="text-xl opacity-90">Conexões Realizadas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#0369a1] via-[#0284c7] to-[#0ea5e9] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto para Começar?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Junte-se ao Freelancer Now e transforme a maneira como você contrata ou<br />
            encontra trabalho no setor de hospitalidade.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-4">
            <Link href="/termos" className="hover:text-[#0ea5e9] transition-colors">
              Termos e Condições
            </Link>
            <span className="hidden md:inline">|</span>
            <Link href="/termos" className="hover:text-[#0ea5e9] transition-colors">
              Política de Privacidade
            </Link>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © 2025 Freelancer Now. Todos os direitos reservados.
          </div>
          <div className="text-center text-gray-500 text-xs mt-2">
            Conectando você ao seu próximo trabalho ou talento.
          </div>
        </div>
      </footer>
    </div>
  );
}

