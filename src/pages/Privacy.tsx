import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* COMPACTAÇÃO: py-8 em vez de py-24 no mobile */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-24 max-w-4xl text-left">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#040949]">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-6">Versão 3.1 — Em conformidade com a LGPD (Lei 13.709/2018)</p>

        <div className="prose prose-blue max-w-none space-y-6 text-gray-700 text-sm md:text-base">

          {/* 1. CONTROLADOR */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">1. Controlador dos Dados</h2>
            <p>
              O controlador dos seus dados pessoais é <strong>Palinos Produtora</strong>,
              inscrita no CNPJ sob o nº <strong>53.672.178/0001-45</strong>, com sede em
              <strong> Rua Pastor Abelar Suzano de Siqueira, n 25, Sala 206, Itaperuna - RJ</strong>.
              <br />
              <strong>Encarregado (DPO):</strong> <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline break-all">suportefocaaioficial@gmail.com</a>
            </p>
          </section>

          {/* 2. DADOS SENSÍVEIS */}
          <section className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h2 className="text-base md:text-lg font-bold text-[#040949] mb-2">2. Dados Sensíveis (Saúde)</h2>
            <p className="mb-2">
              Ao registrar dados sobre saúde, medicamentos, sintomas ou ciclo menstrual, você nos fornece <strong>dados pessoais sensíveis</strong>, conforme definido no Art. 5º, II da LGPD.
            </p>
            <p>
              <strong>Base Legal:</strong> O tratamento desses dados é realizado mediante seu <strong>consentimento específico e destacado</strong> (Art. 11, I da LGPD), para a finalidade exclusiva de organização pessoal e visualização em dashboards.
            </p>
          </section>

          {/* 3. TABELA */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">3. Tratamento de Dados</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-[500px] md:min-w-full text-xs md:text-sm text-left">
                <thead className="bg-gray-100 font-bold">
                  <tr>
                    <th className="p-2 border-b">Finalidade</th>
                    <th className="p-2 border-b">Dados</th>
                    <th className="p-2 border-b">Retenção</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border-b">Processamento via IA</td>
                    <td className="p-2 border-b">Áudio e Texto do WhatsApp</td>
                    <td className="p-2 border-b">Transitória (descartado após transcrição e estruturação).</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Histórico e Dashboards</td>
                    <td className="p-2 border-b">Tarefas, Finanças, Saúde, Estudos</td>
                    <td className="p-2 border-b">Enquanto a conta estiver ativa. Você pode excluir itens individualmente.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Pagamento</td>
                    <td className="p-2 border-b">Status da Assinatura</td>
                    <td className="p-2 border-b">Dados financeiros são processados exclusivamente pela Hotmart. <strong>Não temos acesso ao seu cartão de crédito.</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-1 italic md:hidden">Arraste para o lado para ver mais.</p>
          </section>

          {/* 4. SEUS DIREITOS (LGPD) */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">4. Seus Direitos (Art. 18 da LGPD)</h2>
            <p className="mb-2">Você tem o direito de solicitar a qualquer momento:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Confirmação e Acesso:</strong> Saber se tratamos seus dados e ter acesso a eles.</li>
              <li><strong>Correção:</strong> Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Para dados desnecessários, excessivos ou tratados em desconformidade.</li>
              <li><strong>Portabilidade:</strong> Solicitar a transferência dos dados a outro fornecedor (respeitados os segredos comercial e industrial).</li>
              <li><strong>Revogação do Consentimento:</strong> Retirar sua autorização para o tratamento de dados (o que pode limitar funcionalidades do serviço).</li>
            </ul>
            <p className="mt-2 text-sm italic">Para exercer esses direitos, entre em contato pelo e-mail do Encarregado.</p>
          </section>

          {/* 5. IA e Transferência Internacional */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">5. IA e Transferência Internacional</h2>
            <p>
              Utilizamos APIs de LLMs (como OpenAI) para processar suas mensagens. Isso pode envolver a transferência internacional de dados para servidores nos EUA, país que proporciona grau de proteção de dados adequado ao previsto na LGPD.
              <br />
              <strong>Importante:</strong> Não utilizamos seus dados pessoais para treinar os modelos de IA públicos.
            </p>
          </section>

          {/* 6. GOOGLE CALENDAR */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-base md:text-lg font-bold text-[#040949] mb-2">6. Dados do Google</h2>
            <p className="italic text-xs md:text-sm">
              O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo aderirão à <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-blue-600 underline">Google User Data Policy</a>, incluindo os requisitos de Uso Limitado. Não compartilhamos dados do usuário do Google com ferramentas de IA de terceiros para fins de treinamento de modelos generalistas.
            </p>
          </section>

          {/* 7. CONTATO */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">7. Contato</h2>
            <p>
              Para dúvidas sobre esta política ou sobre o tratamento de seus dados, entre em contato com nosso Encarregado pelo e-mail: <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  );
}