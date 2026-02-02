import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* Ajuste de Padding Mobile */}
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#040949]">Política de Privacidade</h1>
        <p className="text-sm md:text-base text-gray-500 mb-8">Versão 3.0 — Em conformidade com a LGPD (Lei 13.709/2018)</p>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-700 text-sm md:text-base">
          
          {/* 1. CONTROLADOR */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">1. Controlador dos Dados</h2>
            <p>
              O controlador dos seus dados pessoais é <strong className="text-red-600">[🔴 PREENCHER: RAZÃO SOCIAL DA EMPRESA]</strong>, 
              inscrita no CNPJ sob o nº <strong className="text-red-600">[🔴 PREENCHER: CNPJ]</strong>.
              <br />
              <strong>Encarregado (DPO) / Canal de Privacidade:</strong> <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline break-all">suportefocaaioficial@gmail.com</a>
            </p>
          </section>

          {/* 2. DADOS SENSÍVEIS - SAÚDE */}
          <section className="bg-red-50 p-4 md:p-6 rounded-lg border border-red-100">
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">2. Tratamento de Dados Sensíveis (Saúde)</h2>
            <p>
              Ao utilizar o Foca.aí para registar hábitos de saúde, medicamentos ou sintomas, você nos envia <strong>dados pessoais sensíveis</strong> (Art. 5º, II da LGPD).
            </p>
            <p className="mt-2">
              <strong>Base Legal:</strong> O tratamento destes dados é realizado com base no seu <strong>consentimento específico e destacado</strong> (Art. 11, I da LGPD), concedido ao ativar a funcionalidade e aceitar estes termos.
            </p>
          </section>

          {/* 3. TABELA - CORREÇÃO MOBILE: overflow-x-auto */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">3. Como e Porquê Tratamos os Seus Dados</h2>
            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-[600px] md:min-w-full text-sm text-left">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="p-3 border-b">Finalidade</th>
                    <th className="p-3 border-b">Dados Tratados</th>
                    <th className="p-3 border-b">Retenção</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border-b">Processamento de Voz</td>
                    <td className="p-3 border-b">Áudio original enviado no WhatsApp</td>
                    <td className="p-3 border-b"><strong>Transitória:</strong> Descartado imediatamente após a transcrição.</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">Histórico do Assistente</td>
                    <td className="p-3 border-b">Texto transcrito das mensagens</td>
                    <td className="p-3 border-b">Enquanto a conta estiver ativa.</td>
                  </tr>
                  <tr>
                    <td className="p-3 border-b">Integração Google</td>
                    <td className="p-3 border-b">Eventos da agenda</td>
                    <td className="p-3 border-b">Mediante consentimento ativo.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Aviso visual para mobile */}
            <p className="text-xs text-gray-500 mt-2 italic md:hidden">* Arraste para o lado para ver a tabela completa.</p>
          </section>

          {/* 4. IA */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">4. Inteligência Artificial e Transferência Internacional</h2>
            <p>
              Para interpretar as suas mensagens e comandos, utilizamos APIs de LLMs (como OpenAI). Isso implica que os dados (texto das mensagens e trechos da agenda) são processados em servidores nos Estados Unidos.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Contexto da Agenda:</strong> Trechos dos eventos são processados para dar respostas contextuais.</li>
              <li><strong>Não-Treinamento:</strong> Utilizamos configurações empresariais que impedem o uso dos seus dados para o treinamento de modelos públicos ("No-Training API").</li>
            </ul>
          </section>

          {/* 5. GOOGLE CALENDAR */}
          <section className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">5. Uso de Dados do Google</h2>
            <p className="italic mb-2">
              "O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo aderirão à 
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener" className="text-blue-600 underline ml-1">
                Google API Services User Data Policy
              </a>, incluindo os requisitos de 'Limited Use'."
            </p>
          </section>

          {/* 6. DIREITOS */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">6. Seus Direitos (Art. 18 LGPD)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirmação e Acesso aos dados.</li>
              <li>Correção de dados incompletos ou desatualizados.</li>
              <li>Portabilidade e Eliminação.</li>
              <li>Revogação do consentimento.</li>
            </ul>
          </section>

          {/* 7. CONTATO */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-3">7. Contato</h2>
            <p>
              Dúvidas sobre seus dados? Fale com nosso Encarregado de Dados:<br />
              <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline break-all">suportefocaaioficial@gmail.com</a>
            </p>
          </section>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}