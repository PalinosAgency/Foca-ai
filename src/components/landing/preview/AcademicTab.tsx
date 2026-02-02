import { GraduationCap, Calendar, FileText, MessageSquare, Clock, FolderOpen, MoreVertical, Download } from 'lucide-react';
import { academicDocs, academicCategories } from './mocks';

export function AcademicTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-4">
           <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
             <GraduationCap className="w-7 h-7 text-purple-600" />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-gray-900">Acadêmico</h2>
             <p className="text-gray-500 text-base">Área de estudos</p>
           </div>
         </div>
         <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-base text-gray-600 shadow-sm">
           <Calendar className="w-5 h-5 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-bold text-gray-500 uppercase">Documentos</span>
             <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors"><FileText className="h-5 w-5 text-purple-500" /></div>
           </div>
           <p className="text-4xl font-extrabold text-[#0026f7]">2</p>
         </div>
         
         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-bold text-gray-500 uppercase">Resumos</span>
             <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors"><MessageSquare className="h-5 w-5 text-green-600" /></div>
           </div>
           <p className="text-4xl font-extrabold text-green-600">2</p>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-bold text-gray-500 uppercase">Horas Estudo</span>
             <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors"><Clock className="h-5 w-5 text-amber-500" /></div>
           </div>
           <p className="text-4xl font-extrabold text-amber-500">0</p>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-bold text-gray-500 uppercase">Atualizado</span>
             <Calendar className="h-5 w-5 text-gray-400" />
           </div>
           <p className="text-2xl font-bold text-gray-900 mt-2">24/01</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 col-span-1 flex flex-col h-full">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-6">
              <FolderOpen className="w-5 h-5 text-gray-400" /> Categorias
            </h3>
            <div className="space-y-3 flex-1">
              {academicCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-purple-200 hover:shadow-sm transition-all cursor-pointer group">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-100">
                        <FileText className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                      </div>
                      <span className="font-bold text-gray-700">{cat.name}</span>
                   </div>
                   <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                     {cat.count}
                   </span>
                </div>
              ))}
              <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-400 hover:border-purple-300 hover:text-purple-500 cursor-pointer transition-all h-20">
                + Nova categoria
              </div>
            </div>
         </div>

         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 col-span-2">
            <div className="flex items-center justify-between mb-6">
               <h3 className="font-bold text-lg text-gray-900">Documentos Recentes</h3>
               <button className="text-sm font-bold text-[#0026f7] hover:underline bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                 Ver todos
               </button>
            </div>
            <div className="space-y-4">
               {academicDocs.map((doc) => (
                 <div key={doc.id} className="group flex items-start gap-5 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer">
                   <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100 group-hover:scale-105 transition-transform">
                      <FileText className="w-7 h-7 text-purple-600" />
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                         <p className="font-bold text-gray-900 text-base">{doc.title}</p>
                         <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-bold border border-gray-200 uppercase tracking-wide">
                           {doc.category}
                         </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{doc.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {doc.date}
                        </p>
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-md border border-green-100 font-bold flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" /> Resumo pronto
                        </span>
                      </div>
                   </div>
                   
                   <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#0026f7]"><Download className="w-5 h-5" /></button>
                     <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900"><MoreVertical className="w-5 h-5" /></button>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}