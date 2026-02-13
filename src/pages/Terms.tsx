import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-[#040949]">Termos de Uso</h1>
        <p className="text-gray-500 mb-8">Versão 2.1 — Atualizada em: 06 de Fevereiro de 2026</p>

        <div className="prose prose-blue max-w-none space-y-8 text-gray-700">

          {/* IDENTIFICAÇÃO DO PRESTADOR */}
          <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-[#040949] mb-3">Identificação do Prestador</h2>
            <p className="text-sm">
              O serviço <strong>Foca.aí</strong> é fornecido por <strong>Palinos Produtora</strong>,
              inscrita no CNPJ sob o nº <strong>53.672.178/0001-45</strong>,
              com sede em <strong>Rua Pastor Abelar Suzano de Siqueira, n 25, Sala 206, Itaperuna - RJ</strong>.
            </p>
          </section>

          {/* 1. ACEITAÇÃO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">1. Aceitação e Elegibilidade</h2>
            <p>
              Ao utilizar o Foca.aí ("Serviço"), você declara que tem pelo menos 18 anos de idade ou é emancipado, e possui capacidade civil plena.
              O uso por menores de idade sem supervisão e autorização dos pais é estritamente proibido.
            </p>
          </section>

          {/* 2. NATUREZA DO SERVIÇO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">2. Natureza do Serviço e Limitações da IA</h2>
            <p>
              O Foca.aí é uma ferramenta de produtividade que utiliza Inteligência Artificial (LLMs) para processar mensagens e organizar informações.
            </p>
            <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400 my-4">
              <strong>ISENÇÃO DE RESPONSABILIDADE (DISCLAIMER):</strong>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                <li>A IA é uma tecnologia assistiva e pode gerar informações incorretas ("alucinações").</li>
                <li>O Serviço <strong>NÃO</strong> constitui aconselhamento financeiro, médico, jurídico, psicológico ou profissional de qualquer natureza.</li>
                <li>Você é o único responsável por verificar a precisão de dados (valores, datas, orientações de saúde) antes de tomar qualquer decisão baseada neles.</li>
                <li>A Palinos Produtora não se responsabiliza por decisões tomadas com base nas sugestões da IA.</li>
              </ul>
            </div>
          </section>

          {/* 3. USO ACEITÁVEL */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">3. Uso Aceitável</h2>
            <p>Você concorda em utilizar o serviço de boa-fé e não o utilizar para:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Enviar dados sensíveis de terceiros sem autorização explícita.</li>
              <li>Fins ilícitos, discurso de ódio, assédio, spam ou fraudes.</li>
              <li>Tentar burlar o sistema, realizar engenharia reversa ou sobrecarregar a infraestrutura.</li>
            </ul>
            <p className="mt-2 text-sm text-red-600 font-semibold">
              Violações resultarão no bloqueio imediato e permanente da conta, sem prejuízo das medidas legais cabíveis.
            </p>
          </section>

          {/* 4. PAGAMENTOS */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">4. Pagamentos, Renovação e Cancelamento</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Processamento:</strong> Os pagamentos são processados de forma segura e integral pela <strong>Hotmart</strong>. Nós não temos acesso e não armazenamos dados do seu cartão de crédito.</li>
              <li><strong>Renovação Automática:</strong> Para sua comodidade, a assinatura renova-se automaticamente ao fim de cada ciclo (mensal ou anual), garantindo a continuidade do serviço.</li>
              <li><strong>Cancelamento:</strong> Você pode cancelar a renovação automática a qualquer momento através do painel da Hotmart ou solicitando ao suporte. O acesso continuará liberado até o fim do ciclo já pago.</li>
              <li><strong>Direito de Arrependimento (7 Dias):</strong> Conforme o art. 49 do Código de Defesa do Consumidor (CDC), garantimos o reembolso integral se solicitado em até 7 dias corridos após a primeira compra (arrependimento).</li>
            </ul>
          </section>

          {/* 5. PRIVACIDADE */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">5. Dados e Privacidade</h2>
            <p>
              A sua privacidade é fundamental. O tratamento dos seus dados, incluindo o envio de mensagens para processamento por IA e a integração com o Google Calendar, é regido pela nossa <a href="/privacy" className="text-blue-600 hover:underline">Política de Privacidade</a>, que é parte integrante destes Termos.
            </p>
          </section>

          {/* 6. GARANTIAS */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">6. Disponibilidade e Limitação de Garantias</h2>
            <p>
              O Serviço é fornecido "no estado em que se encontra" ("as is"). Dependemos de plataformas terceiras (WhatsApp, OpenAI, Google, Hotmart) para operar. Não garantimos que o serviço será ininterrupto, livre de erros ou que funcionará 100% do tempo se houver falhas nestas plataformas externas ou na internet.
            </p>
          </section>

          {/* 7. FORO */}
          <section>
            <h2 className="text-xl font-bold text-[#040949] mb-3">7. Lei Aplicável e Foro</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de <strong>Itaperuna - RJ</strong> para dirimir quaisquer questões oriundas destes termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
              <br />
              <br />
              Dúvidas ou suporte? <a href="mailto:suportefocaaioficial@gmail.com" className="text-blue-600 hover:underline">suportefocaaioficial@gmail.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}