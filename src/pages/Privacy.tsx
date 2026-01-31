import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-[#040949]">Política de Privacidade</h1>
        <p className="text-gray-500 mb-8">Versão 3.0 — Em conformidade com a LGPD (Lei 13.709/2018)</p>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-700">
          
          {/* 1. CONTROLADOR */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">1. Controlador dos Dados</h2>
            <p>
              O controlador dos seus dados pessoais é <strong className="text-red-600">[🔴 PREENCHER: RAZÃO SOCIAL DA EMPRESA]</strong>, 
              inscrita no CNPJ sob o nº <strong className="text-red-600">[🔴 PREENCHER: CNPJ]</strong>.
              <br />
              <strong>Encarregado (DPO) / Canal de Privacidade:</strong> <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>
            </p>
          </section>

          {/* 2. DADOS SENSÍVEIS - SAÚDE */}
          <section className="bg-red-50 p-6 rounded-lg border border-red-100">
            <h2 className="text-xl font-bold text-[#040949] mb-3">2. Tratamento de Dados Sensíveis (Saúde)</h2>
            <p>
              Ao utilizar o Foca.aí para registar hábitos de saúde, medicamentos ou sintomas, você nos envia <strong>dados pessoais sensíveis</strong> (Art. 5º, II da LGPD).
            </p>
            <p className="mt-2">
              <strong>Base Legal:</strong> O tratamento destes dados é realizado com base no seu <strong>consentimento específico e destacado</strong> (Art. 11, I da LGPD), concedido ao ativar a funcionalidade e aceitar estes termos.
            </p>
            <p className="mt-2">
              Estes dados são usados <strong>exclusivamente</strong> para organizar o seu dashboard de saúde e não são partilhados com terceiros para fins publicitários.
            </p>
          </section>

          {/* 3. TABELA DE BASES LEGAIS */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">3. Como e Porquê Tratamos os Seus Dados</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border rounded-lg">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="p-3 border">Finalidade</th>
                    <th className="p-3 border">Dados Tratados</th>
                    <th className="p-3 border">Retenção</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">Processamento de Voz</td>
                    <td className="p-3 border">Áudio original (.ogg/.mp3) enviado no WhatsApp</td>
                    <td className="p-3 border"><strong>Transitória:</strong> O áudio é convertido em texto e o arquivo original é descartado imediatamente após a transcrição.</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Histórico do Assistente</td>
                    <td className="p-3 border">Texto transcrito das mensagens</td>
                    <td className="p-3 border">Enquanto a conta estiver ativa (para manter o contexto da conversa).</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Integração Google Calendar</td>
                    <td className="p-3 border">Eventos da agenda, Tokens de acesso</td>
                    <td className="p-3 border">Mediante consentimento ativo (revogável a qualquer momento).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. IA E TRANSFERÊNCIA INTERNACIONAL */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">4. Inteligência Artificial e Transferência Internacional</h2>
            <p>
              Para interpretar as suas mensagens e comandos, utilizamos APIs de LLMs (como OpenAI). Isso implica que os dados (texto das mensagens e trechos da agenda) são processados em servidores nos Estados Unidos.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Contexto da Agenda:</strong> Para que o assistente responda a perguntas como "O que tenho hoje?", trechos dos seus eventos do Google Calendar são enviados para o provedor de IA para processamento contextual.</li>
              <li><strong>Não-Treinamento:</strong> Utilizamos configurações empresariais que impedem o uso dos seus dados para o treinamento de modelos públicos ("No-Training API").</li>
              <li><strong>Segurança:</strong> Asseguramos que os provedores adotam cláusulas contratuais padrão de proteção de dados.</li>
            </ul>
          </section>

          {/* 5. GOOGLE CALENDAR */}
          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-[#040949] mb-3">5. Uso de Dados do Google (Google User Data Policy)</h2>
            <p className="italic mb-2">
              "O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo aderirão à 
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener" className="text-blue-600 underline ml-1">
                Google API Services User Data Policy
              </a>, incluindo os requisitos de 'Limited Use'."
            </p>
            <p>
              Especificamente:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Não usamos os seus dados do Google Workspace para treinar modelos de IA generalistas.</li>
              <li>Compartilhamos dados necessários com provedores de IA (como OpenAI) <strong>estritamente</strong> para fornecer a funcionalidade de assistência solicitada pelo usuário.</li>
              <li>Não vendemos nem compartilhamos os seus dados do Google com terceiros para fins de publicidade.</li>
            </ul>
          </section>

          {/* 6. DIREITOS */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">6. Seus Direitos (Art. 18 LGPD)</h2>
            <p>Você pode solicitar a qualquer momento:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirmação e Acesso aos dados.</li>
              <li>Correção de dados incompletos ou desatualizados.</li>
              <li><strong>Portabilidade</strong> dos dados a outro fornecedor.</li>
              <li><strong>Eliminação</strong> de dados tratados com consentimento.</li>
              <li><strong>Revogação:</strong> Você pode desconectar o Google Calendar a qualquer momento através das configurações da sua Conta Google ou solicitando ao suporte.</li>
            </ul>
          </section>

          {/* 7. CONTATO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">7. Contato</h2>
            <p>
              Dúvidas sobre seus dados? Fale com nosso Encarregado de Dados:<br />
              <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>
            </p>
          </section>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}