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
              O controlador dos seus dados pessoais é <strong className="text-red-600">[🔴 PREENCHER: RAZÃO SOCIAL]</strong>, 
              inscrita no CNPJ sob o nº <strong className="text-red-600">[🔴 PREENCHER: CNPJ]</strong>.
              <br />
              <strong>Encarregado (DPO):</strong> <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline break-all">suportefocaaioficial@gmail.com</a>
            </p>
          </section>

          {/* 2. DADOS SENSÍVEIS */}
          <section className="bg-red-50 p-4 rounded-lg border border-red-100">
            <h2 className="text-base md:text-lg font-bold text-[#040949] mb-2">2. Dados Sensíveis (Saúde)</h2>
            <p className="mb-2">
              Ao registrar saúde, medicamentos ou sintomas, você envia <strong>dados sensíveis</strong> (Art. 5º, II da LGPD).
            </p>
            <p>
              <strong>Base Legal:</strong> Consentimento específico (Art. 11, I da LGPD) para fins de organização pessoal.
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
                    <td className="p-2 border-b">Voz</td>
                    <td className="p-2 border-b">Áudio do WhatsApp</td>
                    <td className="p-2 border-b">Transitória (descartado após transcrição).</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Histórico</td>
                    <td className="p-2 border-b">Texto das mensagens</td>
                    <td className="p-2 border-b">Enquanto a conta for ativa.</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-b">Pagamento</td>
                    <td className="p-2 border-b">Status da Assinatura</td>
                    <td className="p-2 border-b">Dados financeiros são processados pela Hotmart. <strong>Não armazenamos cartão.</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-1 italic md:hidden">Arraste para o lado para ver mais.</p>
          </section>

          {/* 4. IA */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">4. IA e Transferência Internacional</h2>
            <p>
              Usamos APIs de LLMs (como OpenAI). Dados são processados nos EUA com cláusulas de proteção padrão.
              <br/>
              <strong>Não usamos seus dados para treinar a IA pública.</strong>
            </p>
          </section>

          {/* 5. GOOGLE */}
          <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-base md:text-lg font-bold text-[#040949] mb-2">5. Dados do Google</h2>
            <p className="italic text-xs md:text-sm">
              Aderimos à <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" className="text-blue-600 underline">Google User Data Policy</a>. Não usamos dados do Workspace para treinar modelos generalistas.
            </p>
          </section>

          {/* 7. CONTATO */}
          <section>
            <h2 className="text-lg md:text-xl font-bold text-[#040949] mb-2">7. Contato</h2>
            <p>
              Dúvidas? <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>
            </p>
          </section>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}