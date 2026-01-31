import { GraduationCap, Calendar, FileText, MessageSquare, Clock, FolderOpen, MoreVertical, Download } from 'lucide-react';
import { academicDocs, academicCategories } from './mocks';

export function AcademicTab() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
             <GraduationCap className="w-6 h-6 text-purple-600" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Acadêmico</h2>
             <p className="text-gray-500 text-sm">Gerencie seus estudos</p>
           </div>
         </div>
         
         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
           <Calendar className="w-4 h-4 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      {/* Stat Cards - Com hover e elevação */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-purple-200 transition-all">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500 font-medium">Total docs</span>
             <FileText className="h-4 w-4 text-purple-400" />
           </div>
           <p className="text-2xl font-bold text-[#0026f7]">2</p>
         </div>
         
         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-green-200 transition-all">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500 font-medium">Com resumo</span>
             <MessageSquare className="h-4 w-4 text-green-500" />
           </div>
           <p className="text-2xl font-bold text-green-600">2</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-amber-200 transition-all">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500 font-medium">Horas estudo</span>
             <Clock className="h-4 w-4 text-amber-500" />
           </div>
           <p className="text-2xl font-bold text-amber-500">0</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center justify-between mb-2">
             <span className="text-sm text-gray-500 font-medium">Atualização</span>
             <Calendar className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-gray-900">24/01</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Por Categoria - Visual Card com Hover */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-1 flex flex-col">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                 <FolderOpen className="w-4 h-4 text-gray-400" /> Por categoria
               </h3>
            </div>
            <div className="space-y-3 flex-1">
              {academicCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-purple-100 group-hover:bg-purple-50 transition-colors">
                        <FileText className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                      </div>
                      <span className="text-sm text-gray-700 font-medium group-hover:text-purple-900 transition-colors">{cat.name}</span>
                   </div>
                   <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 group-hover:border-purple-200 group-hover:text-purple-600 transition-colors">
                     {cat.count}
                   </span>
                </div>
              ))}
              {/* Item vazio para preencher visualmente se necessário */}
              <div className="flex items-center justify-center p-4 border border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                + Nova categoria
              </div>
            </div>
         </div>

         {/* Documentos Recentes - Visual Rico */}
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-gray-900">Documentos recentes</h3>
               <button className="text-xs font-medium text-[#0026f7] hover:underline bg-blue-50 px-3 py-1 rounded-full transition-colors">
                 Ver todos
               </button>
            </div>
            <div className="space-y-3">
               {academicDocs.map((doc) => (
                 <div key={doc.id} className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all cursor-pointer relative overflow-hidden">
                    {/* Indicador lateral no hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Ícone Rico */}
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100 group-hover:bg-purple-100 group-hover:scale-105 transition-all">
                       <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-0.5">
                       <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-bold text-gray-900 text-sm group-hover:text-purple-700 transition-colors">
                            {doc.title}
                          </p>
                          {/* Badge de Categoria */}
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold border border-gray-200 uppercase tracking-wide group-hover:bg-white group-hover:border-purple-100 transition-colors">
                            {doc.category}
                          </span>
                       </div>
                       <p className="text-sm text-gray-500 truncate mb-2">{doc.description}</p>
                       
                       {/* Rodapé do Card */}
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {doc.date}
                           </p>
                           <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 font-medium flex items-center gap-1">
                             <MessageSquare className="w-3 h-3" /> Resumo pronto
                           </span>
                         </div>
                       </div>
                    </div>
                    
                    {/* Botões de Ação */}
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-gray-400 hover:text-[#0026f7] p-1 hover:bg-blue-50 rounded">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}