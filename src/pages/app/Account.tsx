import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Lock, Calendar, CheckCircle2, ArrowLeft, XCircle, Loader2, CreditCard, Wallet, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user, subscription, refreshSession } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

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

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast({ variant: "destructive", title: "Erro", description: "O nome não pode estar vazio." });
      return;
    }

    setIsLoading(true);
    try {
      await api.updateUser({
        name: formData.name,
        phone: formData.phone,
      });
      await refreshSession();
      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas com sucesso." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao salvar", description: "Não foi possível atualizar seus dados." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (user?.email) {
        await api.forgotPassword(user.email);
        setIsResetDialogOpen(true);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Erro ao solicitar redefinição." });
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setIsCanceling(true);
      await api.cancelSubscription(); 
      toast({ title: "Assinatura Cancelada", description: "Sua assinatura não será renovada no próximo ciclo." });
      await refreshSession();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível cancelar no momento." });
    } finally {
      setIsCanceling(false);
    }
  };

  const handlePaymentMethodClick = () => {
    toast({
      title: "Gerenciamento de Pagamento",
      description: "Para alterar seu cartão, cancele a assinatura atual e assine novamente.",
    });
  };

  const getInitials = (name: string) => name?.substring(0, 2).toUpperCase() || 'U';
  const isActive = subscription?.status === 'active' || subscription?.status === 'trialing';
  const planPrice = subscription?.price ? `R$ ${(subscription.price / 100).toFixed(2).replace('.', ',')}` : 'R$ 29,90';
  const nextBillingDate = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : '---';

  return (
    <div className="min-h-screen bg-[#040949] flex flex-col">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-16 md:py-24 max-w-4xl relative">
        
        <Link to="/" className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm font-medium mb-6 group p-2 -ml-2">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Voltar para o início
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Minha Conta</h1>
            <p className="text-blue-200/80 text-sm md:text-base">Gerencie seus dados e assinatura.</p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          {/* TABLIST: h-auto permite quebrar linha se a tela for muito pequena */}
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] bg-white/10 text-blue-100 border border-white/10 h-auto p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#0026f7] data-[state=active]:text-white hover:bg-white/5 font-medium text-xs md:text-sm py-2 h-9 md:h-10">Geral</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-[#0026f7] data-[state=active]:text-white hover:bg-white/5 font-medium text-xs md:text-sm py-2 h-9 md:h-10">Pagamento</TabsTrigger>
            <TabsTrigger value="subscription" className="data-[state=active]:bg-[#0026f7] data-[state=active]:text-white hover:bg-white/5 font-medium text-xs md:text-sm py-2 h-9 md:h-10">Assinatura</TabsTrigger>
          </TabsList>

          {/* --- ABA GERAL --- */}
          <TabsContent value="general">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="px-4 md:px-6 pt-6">
                <CardTitle className="text-gray-900 text-lg md:text-xl">Informações do Perfil</CardTitle>
                <CardDescription className="text-gray-500 text-sm">Seus dados de identificação.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-4 md:px-6">
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left">
                  <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-white shadow-lg ring-2 ring-gray-100">
                    <AvatarImage src={user?.avatar_url} className="object-cover" />
                    <AvatarFallback className="text-xl bg-gray-100 text-gray-600 font-bold">{getInitials(user?.name || '')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-gray-900">{user?.name}</h3>
                    <p className="text-sm text-gray-500 break-all">{user?.email}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Nome Completo</Label>
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                      className="bg-white text-gray-900 border-gray-300 h-11"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Telefone / WhatsApp</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      className="bg-white text-gray-900 border-gray-300 h-11"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="font-bold text-gray-700">Senha</Label>
                    <div className="flex gap-2">
                      <Input type="password" value="********" disabled className="bg-gray-100 text-gray-500 border-gray-200 h-11" />
                      <Button variant="outline" onClick={handlePasswordReset} className="bg-white border-gray-300 text-gray-700 font-bold hover:bg-gray-50 h-11 px-4">
                        Redefinir
                      </Button>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex justify-end border-t border-gray-100 bg-gray-50/50 rounded-b-xl pt-6 px-4 md:px-6 pb-6">
                <Button onClick={handleUpdateProfile} disabled={isLoading} className="bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold shadow-md w-full sm:w-auto h-11">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</> : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* --- ABA PAGAMENTO --- */}
          <TabsContent value="payment">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="px-4 md:px-6 pt-6">
                <CardTitle className="text-gray-900 text-lg">Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-4 md:px-6">
                
                {isActive ? (
                   <div className="border border-green-200 bg-green-50/50 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full">
                        <div className="p-3 bg-white rounded-full border border-green-100 shadow-sm shrink-0">
                          <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-green-900">Método Ativo</p>
                          <p className="text-xs sm:text-sm text-green-700">Gerenciado via Stripe</p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase whitespace-nowrap">Ativo</span>
                   </div>
                ) : (
                  <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 border-dashed text-center">
                    <CreditCard className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600 font-medium text-sm">Nenhum método salvo.</p>
                  </div>
                )}

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Histórico Recente</h4>
                    <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white shadow-sm overflow-hidden">
                      {isActive ? (
                        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 text-sm">Assinatura Mensal</span>
                            <span className="text-xs text-gray-500">Processado com sucesso</span>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            <span className="font-bold text-gray-900">{planPrice}</span>
                            <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded text-[10px] font-bold border border-green-100">PAGO</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-sm text-gray-500">
                           Sem cobranças recentes.
                        </div>
                      )}
                    </div>
                </div>

              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 bg-gray-50/50 rounded-b-xl pt-6 px-4 md:px-6 pb-6">
                <Button variant="outline" onClick={handlePaymentMethodClick} disabled={!isActive} className="w-full sm:w-auto bg-white h-11 font-bold">
                  <CreditCard className="w-4 h-4 mr-2" /> Cartões
                </Button>
                <Button variant="outline" onClick={handlePaymentMethodClick} disabled={!isActive} className="w-full sm:w-auto bg-white h-11 font-bold">
                  <Wallet className="w-4 h-4 mr-2" /> PIX
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* --- ABA ASSINATURA --- */}
          <TabsContent value="subscription">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="px-4 md:px-6 pt-6">
                <CardTitle className="text-gray-900 text-lg">Sua Assinatura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 px-4 md:px-6">
                
                <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 md:p-6 border rounded-xl shadow-sm ${isActive ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className={`p-3 rounded-full shrink-0 ${isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {isActive ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div className="text-center sm:text-left">
                      <p className={`font-bold text-lg ${isActive ? 'text-green-900' : 'text-red-900'}`}>
                        {isActive ? 'Assinatura Ativa' : 'Inativa'}
                      </p>
                      <p className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                        {isActive ? `Plano Premium • ${planPrice}/mês` : 'Sem acesso premium.'}
                      </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/50 p-4 md:p-6 rounded-xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                      <Calendar className="w-3 h-3" /> Renovação
                    </p>
                    <p className="text-lg font-bold text-gray-900">{isActive ? nextBillingDate : '---'}</p>
                  </div>
                  <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-500 flex items-center gap-2 uppercase tracking-wide">
                        <CheckCircle2 className="w-3 h-3" /> Valor
                    </p>
                    <p className="text-lg font-bold text-gray-900">{isActive ? planPrice : '---'}</p>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end border-t border-gray-100 bg-gray-50/50 rounded-b-xl pt-6 px-4 md:px-6 pb-6">
                  {isActive ? (
                    <Button variant="ghost" onClick={handleCancelSubscription} disabled={isCanceling} className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold h-11 w-full sm:w-auto">
                      {isCanceling ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cancelando...</> : "Cancelar Assinatura"}
                    </Button>
                  ) : (
                    <Button asChild className="w-full sm:w-auto bg-[#0026f7] hover:bg-[#0026f7]/90 text-white font-bold h-11">
                      <Link to="/plans">Assinar Agora</Link>
                    </Button>
                  )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Sucesso */}
        <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white text-gray-900 w-[90%] rounded-xl">
            <DialogHeader>
              <DialogTitle className="flex flex-col items-center gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-full">
                  <Mail className="w-8 h-8 text-[#0026f7]" />
                </div>
                <span className="text-xl">Email Enviado</span>
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600 text-base mt-2">
                Verifique seu e-mail <strong>{user?.email}</strong> para redefinir a senha.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center mt-4">
              <Button type="button" className="bg-[#0026f7] text-white font-bold w-full" onClick={() => setIsResetDialogOpen(false)}>
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