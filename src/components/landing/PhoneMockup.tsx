import { motion } from "framer-motion";
import { ArrowLeft, MoreVertical, Phone, Mic, Smile, Check, Wifi } from "lucide-react";

export function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex-1 w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[360px] mx-auto perspective-1000"
    >
      {/* Moldura do Celular Moderno */}
      <div className="relative mx-auto border-gray-900 bg-black border-[6px] rounded-[3rem] h-[700px] w-full shadow-2xl overflow-hidden ring-1 ring-white/20">
        {/* Ilha dinâmica / Câmera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[30%] h-6 bg-black rounded-full z-30"></div>

        {/* Botões laterais */}
        <div className="w-[3px] h-[32px] absolute -left-[9px] top-[100px] bg-gray-800 rounded-l-lg"></div>
        <div className="w-[3px] h-[46px] absolute -left-[9px] top-[150px] bg-gray-800 rounded-l-lg"></div>
        <div className="w-[3px] h-[64px] absolute -right-[9px] top-[170px] bg-gray-800 rounded-r-lg"></div>

        {/* TELA DO CELULAR */}
        <div className="w-full h-full bg-[#E5DDD5] relative flex flex-col font-sans rounded-[2.5rem] overflow-hidden">
          {/* Status Bar Fake */}
          <div className="h-10 bg-[#075E54] w-full flex justify-between items-end px-6 pb-1.5 text-[12px] text-white/90 z-20 font-medium">
            <span>15:48</span>
            <div className="flex gap-2 items-center">
              <Wifi className="w-4 h-4" />
              <div className="w-5 h-2.5 border border-white/60 rounded-[2px] p-[1px] relative">
                <div className="h-full w-[80%] bg-white rounded-[1px]"></div>
              </div>
            </div>
          </div>

          {/* Header do WhatsApp */}
          <div className="bg-[#075E54] px-3 pb-3 pt-1 text-white flex items-center gap-2 z-10 shadow-sm">
            <ArrowLeft className="w-5 h-5 cursor-pointer opacity-90" />

            <div className="flex items-center gap-2.5 flex-1 cursor-pointer">
              {/* ÍCONE DE PERFIL (Fundo Branco) */}
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white/20">
                <img
                  src="/logo-icon-fundo.png"
                  alt="Logo Foca.aí"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-[15px] leading-none">Assistente - Foca.Aí</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pr-1 opacity-90">
              <Phone className="w-5 h-5" />
              <MoreVertical className="w-5 h-5" />
            </div>
          </div>

          {/* Área do Chat */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto relative bg-[#e5ddd5]">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Data (mantém) */}
            <div className="flex justify-center my-2 relative z-[1]">
              <span className="bg-[#E1F3FB] text-[10px] text-gray-600 px-2 py-1 rounded-lg shadow-sm font-medium">
                14 de janeiro de 2026
              </span>
            </div>

            {/* Mensagem 1 - Usuário */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex justify-end relative z-[1]"
            >
              <div className="bg-[#E7FFDB] rounded-lg rounded-tr-none p-2.5 px-3 max-w-[85%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[13.5px] text-gray-800 leading-snug relative">
                <p>Olá. Como vai?</p>
                <div className="flex justify-end items-end gap-1 mt-1 -mb-1.5">
                  <span className="text-[10px] text-gray-500">15:47</span>
                  <div className="flex">
                    <Check className="w-3 h-3 text-[#53bdeb] -mr-1" />
                    <Check className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mensagem 2 - Bot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex justify-start relative z-[1]"
            >
              <div className="bg-white rounded-lg rounded-tl-none p-2.5 px-3 max-w-[85%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[13.5px] text-gray-800 leading-snug relative">
                <p>Olá! Estou bem, obrigado por perguntar. E você, como está? 😊</p>
                <span className="text-[10px] text-gray-400 block text-right mt-1 -mb-1">15:48</span>
              </div>
            </motion.div>

            {/* Mensagem 3 - Usuário */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 1.8 }}
              className="flex justify-end relative z-[1]"
            >
              <div className="bg-[#E7FFDB] rounded-lg rounded-tr-none p-2.5 px-3 max-w-[90%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[13.5px] text-gray-800 leading-snug relative">
                <p>Estou ótimo. Gastei hoje 45 reais na lanchonete</p>
                <div className="flex justify-end items-end gap-1 mt-1 -mb-1.5">
                  <span className="text-[10px] text-gray-500">15:48</span>
                  <div className="flex">
                    <Check className="w-3 h-3 text-[#53bdeb] -mr-1" />
                    <Check className="w-3 h-3 text-[#53bdeb]" />
                  </div>
                </div>
              </div>
            </motion.div>

          

            {/* Cartão - Registro Financeiro */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 2.4 }}
              className="flex justify-start relative z-[1]"
            >
              <div className="bg-white rounded-lg rounded-tl-none p-2.5 px-3 max-w-[92%] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] text-[13.5px] text-gray-800 leading-snug relative">
                <p className="font-semibold text-gray-900 mb-2">Registro Financeiro</p>

                <div className="space-y-1.5 text-[13px]">
                  <p>💰 Valor: R$ 45</p>
                  <p>📝 Descrição: Gasto na lanchonete</p>
                  <p>🏷️ Categoria: Alimentação</p>
                  <p>📅 Data: 29/01/2026</p>
                </div>

                <span className="text-[10px] text-gray-400 block text-right mt-2 -mb-1">15:48</span>
              </div>
            </motion.div>
          </div>

          {/* Barra de Input (Fake) */}
          <div className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-2 z-10 pb-6">
            <div className="p-1 rounded-full text-gray-500">
              <Smile className="w-6 h-6 text-gray-500" />
            </div>
            <div className="bg-white rounded-full flex-1 h-10 px-4 flex items-center text-[15px] text-gray-400 shadow-sm border border-gray-100">
              Mensagem
            </div>
            <div className="p-2.5 bg-[#00a884] rounded-full text-white shadow-sm flex items-center justify-center transform hover:scale-105 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Sombra / Reflexo do celular */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/40 blur-2xl rounded-[100%] -z-10 opacity-60"></div>
    </motion.div>
  );
}
