import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Termos e Condições</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Aceitação dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ao acessar e usar o Freelancer Now, você concorda em cumprir e estar vinculado a estes Termos e Condições de Uso.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Uso da Plataforma</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              O Freelancer Now é uma plataforma que conecta freelancers do setor de hospitalidade com empresas que buscam profissionais qualificados.
            </p>
            <p className="text-muted-foreground">
              Você concorda em usar a plataforma apenas para fins legais e de acordo com estes termos.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. Responsabilidades do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>Manter a confidencialidade de sua conta</li>
              <li>Não usar a plataforma para fins ilegais ou fraudulentos</li>
              <li>Respeitar outros usuários e manter comunicação profissional</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Privacidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Respeitamos sua privacidade. Suas informações pessoais são protegidas e usadas apenas para os fins desta plataforma.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Limitação de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              O Freelancer Now atua como intermediário entre freelancers e empresas. Não somos responsáveis por disputas, problemas ou questões que possam surgir entre as partes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Alterações nos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
