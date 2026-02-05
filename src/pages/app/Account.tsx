import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// import { api } from '@/lib/api'; // Vamos usar fetch direto para a nova API
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Lock, Calendar, CheckCircle2, ArrowLeft, XCircle, Loader2, CreditCard, Wallet, Mail, AlertTriangle, CalendarClock, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { sql } from '@/lib/neon'; // Importando neon para buscar dados frescos

export default function Account() {
  const { user, subscription: contextSubscription, refreshSession } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isManagingSub, setIsManagingSub] = useState(false); // Substituto do isCanceling
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Estado local para garantir dados frescos da assinatura (auto_renew)
  const [localSubscription, setLocalSubscription] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Busca dados atualizados da assinatura (Auto Renew)
  useEffect(() => {
    async function fetchFreshSubscription() {
      if (!user) return;
      try {
        if (contextSubscription) setLocalSubscription(contextSubscription);
        
        // Busca direta no Neon para garantir status atualizado do auto_renew
        const data = await sql`
          SELECT status, plan_id, current_period_end, auto_renew 
          FROM subscriptions 
          WHERE user_id = ${user.id}
        `;
        if (data && data.length > 0) {
          setLocalSubscription(data[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar assinatura fresca", error);
      }
    }
    fetchFreshSubscription();
  }, [user, contextSubscription]);

  // --- ATUALIZAR PERFIL (PUT /api/account) ---
  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast({ variant: "destructive", title: "Erro", description: "O nome não pode estar vazio." });
      return;
    }

    setIsLoading(true);
    try {
      // Usando a nova API consolidada
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
        })
      });

      if (!response.ok) throw new Error('Falha ao atualizar');

      await refreshSession();

      toast({ 
        title: "Perfil atualizado!", 
        description: "Suas informações foram salvas com sucesso." 
      });
    } catch (error) {
      console.error(error);
      toast({ 
        variant: "destructive",
        title: "Erro ao salvar", 
        description: "Não foi possível atualizar seus dados." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    // Mantém lógica original se usar a api antiga ou adaptar
    toast({ description: "Funcionalidade de redefinição via e-mail." });
    setIsResetDialogOpen(true);
  };

  // --- GERENCIAR ASSINATURA (POST /api/account) ---
  const handleSubscriptionAction = async (action: 'cancel' | 'reactivate') => {
    try {
      setIsManagingSub(true);
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch('/api/account', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) throw new Error('Falha na operação');

      const data = await response.json();
      setLocalSubscription(data.subscription); // Atualiza visualmente na hora
      await refreshSession();

      toast({ 
        title: action === 'cancel' ? "Renovação Cancelada" : "Assinatura Reativada! 🚀", 
        description: action === 'cancel' 
          ? "Sua assinatura não renovará, mas você mantém o acesso até o fim do período." 
          : "Sua assinatura voltará a renovar automaticamente.",
        className: action === 'reactivate' ? "bg-green-50 border-green-200" : ""
      });

    } catch (error) {
      toast({ 
        variant: "destructive",
        title: "Erro", 
        description: "Não foi possível processar a solicitação." 
      });
    } finally {
      setIsManagingSub(false);
    }
  };

  const handlePaymentMethodClick = () => {
    toast({
      title: "Gerenciamento de Pagamento",
      description: "Para alterar seu cartão, cancele a assinatura atual e assine novamente ao final do período.",
    });
  };

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || 'U';

  // Helpers visuais
  const sub = localSubscription || contextSubscription;
  const isActive = sub?.status === 'active' || sub?.status === 'trialing';
  const isAutoRenew = sub?.auto_renew !== false; // Se undefined, assume true
  
  const planPrice = 'R$ 29,90';
  const formattedDate = sub?.current_period_end 
    ? new Date(sub.current_period_end).toLocaleDateString('pt-BR') 
    : '---';

  return (
    <div className="min-h-screen bg-[#040949] flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-24 max-w-4xl relative">
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-xs md:text-sm font-medium mb-4 group"
        >
          <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o início
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Minha Conta</h1>
            <p className="text-blue-200/80 text-sm">Gerencie seus dados, pagamentos e assinatura.</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-white/10 text-blue-100 border border-white/10 h-auto p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#0026f7] data-[state=active]:text-white hover:bg-white/5 transition-colors font-medium text-xs md:text-sm py-2">Geral</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-[#0026f7] data-[state=active]:text-white hover:bg-white/5 transition-colors font-medium text-xs md:text-sm py-2">Pagamento</TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-[#0026f7] data-[state=active]:text-white hover:bg-white/5 transition-colors font-medium text-xs md:text-sm py-2">Assinatura</TabsTrigger>
          </TabsList>

          {/* --- ABA GERAL --- */}
          <TabsContent value="general">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="p-4 md:p-6 pb-2 md:pb-6">
                <CardTitle className="text-gray-900 text-lg">Informações do Perfil</CardTitle>
                <CardDescription className="text-gray-500 text-xs md:text-sm">Seus dados de identificação e acesso.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 md:w-24 md:h-24 border-4 border-white shadow-lg ring-2 ring-gray-100">
                    <AvatarImage src={user?.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-xl bg-gray-100 text-gray-600 font-bold">{getInitials(user?.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h3 className="font-bold text-base md:text-lg text-gray-900">{user?.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500 break-all">{user?.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-700 text-xs md:text-sm">Nome Completo</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="bg-white text-gray-900 border-gray-300 focus-visible:ring-[#0026f7] h-10 md:h-11"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-700 text-xs md:text-sm">Telefone / WhatsApp</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      className="bg-white text-gray-900 border-gray-300 focus-visible:ring-[#0026f7] h-10 md:h-11"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-700 text-xs md:text-sm">Email (Não alterável)</Label>
                    <div className="relative">
                      <Input value={user?.email} disabled className="bg-gray-100 pl-9 text-gray-500 border-gray-200 cursor-not-allowed font-medium h-10 md:h-11 text-xs md:text-sm" />
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-gray-700 text-xs md:text-sm">Senha</Label>
                    <div className="flex gap-2">
                      <Input type="password" value="********" disabled className="bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed h-10 md:h-11" />
                      <Button 
                        variant="outline" 
                        onClick={handlePasswordReset} 
                        className="bg-white border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:text-[#0026f7] h-10 md:h-11 px-3 text-xs md:text-sm"
                      >
                        Redefinir
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t border-gray-100 bg-gray-50/50 rounded-b-xl pt-4 pb-4 px-4 md:px-6">
                <Button 
                  onClick={handleUpdateProfile} 
                  disabled={isLoading}
                  className="bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold shadow-md w-full md:w-auto h-10 md:h-11 text-sm"
                >
                  {isLoading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
                  ) : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* --- ABA PAGAMENTO --- */}
          <TabsContent value="payment">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="p-4 md:p-6 pb-2 md:pb-6">
                <CardTitle className="text-gray-900 text-lg">Método de Pagamento</CardTitle>
                <CardDescription className="text-gray-500 text-xs md:text-sm">Gerencie como você paga sua assinatura.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                {isActive ? (
                   <div className="border border-green-200 bg-green-50/50 rounded-xl p-4 flex flex-col items-start gap-3">
                     <div className="flex items-center gap-3 w-full">
                       <div className="p-2 bg-white rounded-full border border-green-100 shadow-sm">
                         <CreditCard className="w-5 h-5 text-green-600" />
                       </div>
                       <div className="text-left">
                         <p className="font-bold text-green-900 text-sm">Método Ativo</p>
                         <p className="text-xs text-green-700">Gerenciado via Stripe/Hotmart</p>
                       </div>
                       <span className="ml-auto bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Ativo</span>
                     </div>
                   </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 border-dashed text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium text-xs mb-1">Nenhum método salvo.</p>
                  </div>
                )}

                <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Histórico</h4>
                    <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
                      {isActive ? (
                        <div className="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col text-left">
                            <span className="font-medium text-gray-900 text-sm">Assinatura Mensal</span>
                            <span className="text-[10px] text-gray-500">Processado</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-sm">{planPrice}</span>
                            <span className="text-green-700 bg-green-50 px-1.5 py-0.5 rounded text-[9px] font-bold border border-green-100">PAGO</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-gray-500">
                           Nenhuma cobrança.
                        </div>
                      )}
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl pt-4 pb-4 px-4 md:px-6">
                <Button 
                  variant="outline" 
                  onClick={handlePaymentMethodClick}
                  disabled={!isActive}
                  className="w-full md:w-auto bg-white border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:text-[#0026f7] h-10 md:h-11 text-sm"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-2" />
                  Gerenciar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePaymentMethodClick}
                  disabled={!isActive}
                  className="w-full md:w-auto bg-white border-gray-300 text-gray-700 font-bold hover:bg-gray-50 hover:text-[#0026f7] h-10 md:h-11 text-sm"
                >
                  <Wallet className="w-3.5 h-3.5 mr-2" />
                  PIX
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* --- ABA ASSINATURA (MODIFICADA) --- */}
          <TabsContent value="subscription">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="p-4 md:p-6 pb-2 md:pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-900 text-lg">Detalhes da Assinatura</CardTitle>
                    <CardDescription className="text-gray-500 text-xs md:text-sm">Status do seu plano.</CardDescription>
                  </div>
                  {/* BADGE DE STATUS DINÂMICO */}
                  {isActive ? (
                    isAutoRenew ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 px-3 py-1">Ativa</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1">Cancelada</Badge>
                    )
                  ) : (
                    <Badge variant="destructive">Inativa</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6 pt-0 md:pt-0">
                
                {/* --- CARD PRINCIPAL DE STATUS --- */}
                {isActive ? (
                  isAutoRenew ? (
                    // ATIVA E RENOVANDO
                    <div className="flex items-center gap-3 p-4 border rounded-xl shadow-sm bg-green-50 border-green-200">
                      <div className="p-2 rounded-full bg-green-100 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-base text-green-900">Assinatura Ativa</p>
                        <p className="text-xs font-medium text-green-700">Renovação automática ativada.</p>
                      </div>
                    </div>
                  ) : (
                    // ATIVA MAS CANCELADA (EXPIRANDO)
                    <div className="flex items-center gap-3 p-4 border rounded-xl shadow-sm bg-yellow-50 border-yellow-200">
                      <div className="p-2 rounded-full bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-base text-yellow-900">Renovação Cancelada</p>
                        <p className="text-xs font-medium text-yellow-700">Acesso liberado até o fim do ciclo.</p>
                      </div>
                    </div>
                  )
                ) : (
                  // INATIVA
                  <div className="flex items-center gap-3 p-4 border rounded-xl shadow-sm bg-red-50 border-red-200">
                    <div className="p-2 rounded-full bg-red-100 text-red-600">
                      <XCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-base text-red-900">Assinatura Inativa</p>
                      <p className="text-xs font-medium text-red-700">Escolha um plano para começar.</p>
                    </div>
                  </div>
                )}

                {/* --- DETALHES DE DATA E PREÇO --- */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="space-y-1 text-left">
                    <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wide">
                      {isAutoRenew ? <Calendar className="w-3 h-3" /> : <CalendarClock className="w-3 h-3" />}
                      {isAutoRenew ? "Próxima Cobrança" : "Acesso até"}
                    </p>
                    <p className={`text-base font-bold ${isAutoRenew ? 'text-gray-900' : 'text-yellow-700'}`}>
                        {isActive ? formattedDate : 'Expirado'}
                    </p>
                  </div>
                  <div className="space-y-1 text-left">
                      <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1 uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3" /> 
                        Valor
                    </p>
                    <p className="text-base font-bold text-gray-900">
                      {isActive ? planPrice : '---'}
                    </p>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex flex-col md:flex-row gap-2 justify-end border-t border-gray-100 bg-gray-50/50 rounded-b-xl pt-4 pb-4 px-4 md:px-6">
                  {isActive ? (
                    isAutoRenew ? (
                      // BOTÃO CANCELAR (Se auto_renew = true)
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            disabled={isManagingSub} 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold h-10 md:h-11 w-full md:w-auto text-sm"
                          >
                            {isManagingSub ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : "Cancelar Assinatura"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancelar renovação automática?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ao confirmar, sua assinatura <strong>não será renovada</strong> em {formattedDate}.
                              <br/><br/>
                              Você continuará com acesso total até essa data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleSubscriptionAction('cancel')}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold"
                            >
                              Sim, cancelar renovação
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      // BOTÃO REATIVAR (Se auto_renew = false)
                      <Button 
                        onClick={() => handleSubscriptionAction('reactivate')}
                        disabled={isManagingSub}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold h-10 md:h-11 w-full md:w-auto text-sm shadow-md"
                      >
                        {isManagingSub ? (
                          <><Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> Processando...</>
                        ) : (
                          <><RotateCcw className="w-3.5 h-3.5 mr-2" /> Reativar Assinatura</>
                        )}
                      </Button>
                    )
                  ) : (
                    // BOTÃO ASSINAR (Se inativo)
                    <Button 
                      asChild
                      className="w-full md:w-auto bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold shadow-md h-10 md:h-11 text-sm" 
                    >
                      <Link to="/plans">Ver Planos</Link>
                    </Button>
                  )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* MODAL SUCESSO SENHA */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white text-gray-900 w-[90%] rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-blue-50 rounded-full">
                  <Mail className="w-6 h-6 text-[#0026f7]" />
                </div>
                <span className="text-lg">Email Enviado</span>
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-sm mt-2">
                As instruções foram enviadas para <strong>{user?.email}</strong>.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center mt-3">
              <Button 
                type="button" 
                className="bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold w-full"
                onClick={() => setIsResetDialogOpen(false)}
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
      
      <Footer />
    </div>
  );
}