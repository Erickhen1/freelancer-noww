import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { MessageSquare, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function Messages() {
  const { isAuthenticated, user } = useAuth();

  const { data: chats, isLoading } = trpc.chats.list.useQuery(undefined, {
    enabled: !!user?.id,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Necessário</h2>
              <p className="text-muted-foreground mb-6">
                Você precisa estar logado para acessar suas mensagens.
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
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">Mensagens</h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : chats && chats.length > 0 ? (
          <div className="space-y-4">
            {chats.map((chat) => (
              <Card key={chat.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/chat/${chat.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <MessageSquare className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">
                              {chat.otherUser?.name || "Usuário"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {chat.otherUser?.userType === "company" ? "Empresa" : "Freelancer"}
                            </div>
                          </div>
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-muted-foreground line-clamp-1 ml-13">
                            {chat.lastMessage.content}
                          </p>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString("pt-BR") : ""}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">Você ainda não tem conversas.</p>
              <Button asChild>
                <Link href="/buscar-vagas">Buscar Vagas</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

