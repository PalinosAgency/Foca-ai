import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      {/* COMPACTAÇÃO: py-8 em vez de py-24 no mobile */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-24 max-w-4xl text-left">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-[#040949]">Política de Privacidade</h1>
        <p className="text-sm text-gray-500 mb-6">Versão 3.2 — Atualizada em 04 de Março de 2026</p>

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

          {/* 6. GOOGLE USER DATA & API SERVICES */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">6. Política de Dados de Usuário do Google (OAuth e APIs)</h2>
            <p className="mb-4">
              A <strong>Foca.aí</strong> utiliza serviços de autenticação do Google (Google OAuth) para facilitar o acesso à nossa plataforma e pode vir a requerer permissões adicionais (como Google Calendar) visando oferecer melhor experiência de organização pessoal.
              <br /><br />
              O uso e a transferência de informações recebidas das APIs do Google para qualquer outro aplicativo aderirão estritamente à <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-blue-600 underline font-semibold">Google API Services User Data Policy</a>, incluindo os requisitos de Uso Limitado (Limited Use).
            </p>

            <div className="space-y-4">
              <div>
                <strong className="text-gray-800 block mb-1">A. Dados Acessados (Data Accessed)</strong>
                Acessamos exclusivamente os dados estritamente necessários para o funcionamento da plataforma. Ao fazer login com o Google, recebemos seu <strong>Nome completo, Endereço de e-mail e Foto de perfil</strong>. Caso você conecte integrações futuras (como o Google Calendar), acessaremos apenas as permissões explicitamente concedidas no momento da autorização.
              </div>

              <div>
                <strong className="text-gray-800 block mb-1">B. Uso de Dados (Data Usage)</strong>
                Utilizamos os dados recebidos do Google <strong>unicamente</strong> para criar, autenticar e gerenciar sua conta de usuário dentro da plataforma Foca.aí, além de prover as funcionalidades diretas solicitadas por você (ex: exibição do seu nome/foto no perfil ou sincronização de eventos, se autorizado).
              </div>

              <div>
                <strong className="text-gray-800 block mb-1">C. Compartilhamento de Dados (Data Sharing)</strong>
                A Foca.aí <strong>NÃO</strong> compartilha seus dados pessoais obtidos do Google com terceiros para fins publicitários, de marketing ou venda de dados. Em nenhuma hipótese dados do usuário do Google são compartilhados ou utilizados para fins de treinamento de modelos de Inteligência Artificial (generalistas ou proprietários). O compartilhamento só ocorrerá se formalmente exigido por força da lei.
              </div>

              <div>
                <strong className="text-gray-800 block mb-1">D. Armazenamento e Proteção (Data Storage & Protection)</strong>
                Todos os dados são armazenados em servidores em nuvem seguros e com tecnologia de ponta (AWS/Supabase), empregando criptografia em trânsito (HTTPS/SSL) e em repouso. O acesso aos bancos de dados é restrito, monitorado e protegido por rigorosas políticas de acesso.
              </div>

              <div>
                <strong className="text-gray-800 block mb-1">E. Retenção e Exclusão de Dados (Data Retention & Deletion)</strong>
                Reteremos seus dados apenas pelo tempo em que sua conta permanecer ativa na "Foca.aí" ou conforme exigido por obrigações legais no Brasil (Marco Civil da Internet). Você pode solicitar a <strong>exclusão completa e definitiva</strong> da sua conta e de todos os dados associados a qualquer momento através das opções do painel ou enviando um e-mail com o assunto "Excluir Conta" para <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>. O processamento da exclusão ocorre em até 15 dias úteis.
              </div>
            </div>
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