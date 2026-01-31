import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-[#040949]">Termos de Uso</h1>
        <p className="text-gray-500 mb-8">Versão 2.0 — Atualizada em: 30 de Janeiro de 2026</p>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-700">
          
          {/* IDENTIFICAÇÃO DO PRESTADOR */}
          <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-[#040949] mb-3">Identificação do Prestador</h2>
            <p className="text-sm">
              O serviço <strong>Foca.aí</strong> é fornecido por <strong className="text-red-600">[🔴 PREENCHER: RAZÃO SOCIAL DA EMPRESA]</strong>, 
              inscrita no CNPJ sob o nº <strong className="text-red-600">[🔴 PREENCHER: CNPJ]</strong>, 
              com sede em <strong className="text-red-600">[🔴 PREENCHER: CIDADE/ESTADO]</strong>.
            </p>
          </section>

          {/* 1. ACEITAÇÃO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">1. Aceitação e Elegibilidade</h2>
            <p>
              Ao utilizar o Foca.aí ("Serviço"), você declara que tem pelo menos 18 anos de idade e possui capacidade civil plena. 
              O uso por menores de idade é estritamente proibido.
            </p>
          </section>

          {/* 2. NATUREZA DO SERVIÇO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">2. Natureza do Serviço e Limitações da IA</h2>
            <p>
              O Foca.aí é uma ferramenta de produtividade que utiliza Inteligência Artificial (LLMs) para processar mensagens.
            </p>
            <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 my-4">
              <strong>ISENÇÃO DE RESPONSABILIDADE (DISCLAIMER):</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>A IA pode gerar informações incorretas ("alucinações").</li>
                <li>O Serviço <strong>NÃO</strong> constitui aconselhamento financeiro, médico, jurídico ou psicológico.</li>
                <li>Você é o único responsável por verificar dados (valores, datas, orientações de saúde) antes de tomar decisões reais.</li>
              </ul>
            </div>
          </section>

          {/* 3. USO ACEITÁVEL */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">3. Uso Aceitável</h2>
            <p>Você concorda em não utilizar o serviço para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Enviar dados sensíveis de terceiros sem autorização.</li>
              <li>Fins ilícitos, discurso de ódio ou assédio.</li>
              <li>Tentar burlar o sistema, realizar engenharia reversa ou spam.</li>
            </ul>
            <p className="mt-2 text-sm text-red-600 font-semibold">
              Violações resultarão no bloqueio imediato da conta sem reembolso.
            </p>
          </section>

          {/* 4. PAGAMENTOS */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">4. Pagamentos e Cancelamento</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Cobrança:</strong> Os pagamentos são processados de forma segura por terceiros (Hotmart/Stripe).</li>
              <li><strong>Renovação Automática:</strong> A assinatura renova-se automaticamente ao fim de cada ciclo.</li>
              <li><strong>Cancelamento:</strong> Você pode cancelar a qualquer momento no painel. O acesso continua até o fim do ciclo pago.</li>
              <li><strong>Reembolso (7 Dias):</strong> Conforme o art. 49 do CDC, garantimos o reembolso integral se solicitado em até 7 dias após a primeira compra.</li>
            </ul>
          </section>

          {/* 5. PRIVACIDADE */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">5. Dados e Privacidade</h2>
            <p>
              O tratamento dos seus dados, incluindo o envio de mensagens para processamento por IA e a integração com o Google Calendar, é regido pela nossa <a href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</a>.
            </p>
          </section>

          {/* 6. GARANTIAS */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">6. Disponibilidade e Garantias</h2>
            <p>
              O Serviço é fornecido "no estado em que se encontra". Dependemos de plataformas terceiras (WhatsApp, OpenAI, Google). Não garantimos que o serviço será ininterrupto ou livre de erros em caso de falhas nestas plataformas externas.
            </p>
          </section>

          {/* 7. FORO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">7. Foro e Contato</h2>
            <p>
              Fica eleito o foro da comarca de <strong className="text-red-600">[🔴 PREENCHER: SUA CIDADE/ESTADO]</strong> para dirimir questões oriundas destes termos.
              <br />
              Dúvidas? <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}