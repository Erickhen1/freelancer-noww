import { Navbar } from "@/components/Navbar";
import { APP_TITLE } from "@/const";
import { Users, Target, Heart, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-white py-20 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre o {APP_TITLE}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Conectando talentos e oportunidades no setor de hospitalidade
            </p>
          </div>
        </section>

        {/* Nossa História */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Nossa História
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="text-lg leading-relaxed mb-6">
                O <strong>{APP_TITLE}</strong> nasceu da necessidade de facilitar a conexão entre 
                estabelecimentos do setor de hospitalidade e profissionais qualificados. Sabemos que 
                encontrar o profissional certo para cada vaga pode ser desafiador, assim como encontrar 
                oportunidades que valorizem o talento e a experiência.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                Nossa plataforma foi desenvolvida especificamente para atender bares, restaurantes e 
                hotéis que buscam garçons, cozinheiros, bartenders, recepcionistas e outros profissionais 
                da área. Oferecemos um ambiente seguro, transparente e eficiente para que ambas as partes 
                encontrem exatamente o que procuram.
              </p>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nossos Valores
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Conexão</h3>
                <p className="text-gray-600">
                  Facilitamos o encontro entre talentos e oportunidades de forma simples e eficaz.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Precisão</h3>
                <p className="text-gray-600">
                  Ferramentas de busca e filtros que ajudam a encontrar exatamente o que você precisa.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Valorização</h3>
                <p className="text-gray-600">
                  Reconhecemos e valorizamos o trabalho de cada profissional da hospitalidade.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Confiança</h3>
                <p className="text-gray-600">
                  Sistema de avaliações transparente que constrói reputação e credibilidade.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
              <div>
                <div className="text-5xl font-bold mb-2">1000+</div>
                <div className="text-xl opacity-90">Freelancers Cadastrados</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">500+</div>
                <div className="text-xl opacity-90">Vagas Publicadas</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">2000+</div>
                <div className="text-xl opacity-90">Conexões Realizadas</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Faça Parte da Nossa Comunidade
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Junte-se a milhares de profissionais e empresas que já encontraram 
              sucesso através do {APP_TITLE}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/buscar-vagas" 
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Buscar Vagas
              </a>
              <a 
                href="/publicar-vaga" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Publicar Vaga
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2025 {APP_TITLE}. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Conectando você ao seu próximo trabalho no setor de hospitalidade.
          </p>
        </div>
      </footer>
    </div>
  );
}

