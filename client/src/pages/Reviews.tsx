import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Navbar } from "@/components/Navbar";
import { Star } from "lucide-react";

export default function Reviews() {
  const { isAuthenticated, user } = useAuth();

  const { data: reviews, isLoading } = trpc.reviews.byUser.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  const { data: stats } = trpc.reviews.stats.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para ver suas avaliações.
              </p>
              <Button onClick={() => window.location.href = getLoginUrl()}>
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Minhas Avaliações</h1>

        {/* Stats Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5 text-yellow-500" />
              Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats?.average || 0}
                </div>
                <div className="text-muted-foreground">Média de Avaliação</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">
                  {stats?.total || 0}
                </div>
                <div className="text-muted-foreground">Total de Avaliações</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando avaliações...</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-semibold">{review.reviewer?.name || "Usuário"}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-muted-foreground">{review.comment}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Você ainda não recebeu avaliações.</p>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
  );
}

