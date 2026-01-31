import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldX, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SubscriptionBlocked() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 max-w-md w-full text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldX className="w-8 h-8 text-destructive" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Assinatura Inativa</h1>
        <p className="text-muted-foreground mb-6">
          Sua assinatura está inativa ou expirou. Para continuar usando o Foca AI, 
          renove sua assinatura.
        </p>

        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link to="/plans">
              Ver Planos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link to="/account">Gerenciar Conta</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}