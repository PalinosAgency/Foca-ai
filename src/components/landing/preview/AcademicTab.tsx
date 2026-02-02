import { GraduationCap, Calendar, FileText, MessageSquare, Clock, FolderOpen, MoreVertical, Download } from 'lucide-react';
import { academicDocs, academicCategories } from './mocks';

export function AcademicTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 mb-2">
         <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
             <GraduationCap className="w-6 h-6 text-purple-600" />
           </div>
           <div>
             <h2 className="text-2xl font-bold text-gray-900">Acadêmico</h2>
             <p className="text-gray-500 text-sm">Área de estudos</p>
           </div>
         </div>
         <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 shadow-sm">
           <Calendar className="w-4 h-4 opacity-50" />
           <span>28 dez - 28 jan</span>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center justify-between mb-3">
             <span className="text-xs font-bold text-gray-500 uppercase">Docs</span>
             <div className="p-1.5 bg-purple-50 rounded-lg"><FileText className="h-4 w-4 text-purple-500" /></div>
           </div>
           <p className="text-3xl font-extrabold text-[#0026f7]">2</p>
         </div>
         
         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center justify-between mb-3">
             <span className="text-xs font-bold text-gray-500 uppercase">Resumos</span>
             <div className="p-1.5 bg-green-50 rounded-lg"><MessageSquare className="h-4 w-4 text-green-600" /></div>
           </div>
           <p className="text-3xl font-extrabold text-green-600">2</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center justify-between mb-3">
             <span className="text-xs font-bold text-gray-500 uppercase">Horas</span>
             <div className="p-1.5 bg-amber-50 rounded-lg"><Clock className="h-4 w-4 text-amber-500" /></div>
           </div>
           <p className="text-3xl font-extrabold text-amber-500">0</p>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all">
           <div className="flex items-center justify-between mb-3">
             <span className="text-xs font-bold text-gray-500 uppercase">Data</span>
             <Calendar className="h-4 w-4 text-gray-400" />
           </div>
           <p className="text-2xl font-extrabold text-gray-900 mt-1">24/01</p>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 col-span-1 flex flex-col h-full">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-4">
              <FolderOpen className="w-5 h-5 text-gray-400" /> Categorias
            </h3>
            <div className="space-y-3 flex-1">
              {academicCategories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:border-purple-200 transition-all cursor-pointer">
                   <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-sm text-gray-700">{cat.name}</span>
                   </div>
                   <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                     {cat.count}
                   </span>
                </div>
              ))}
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-lg text-xs font-medium text-gray-400 hover:border-purple-300 hover:text-purple-500 cursor-pointer transition-all">
                + Nova categoria
              </div>
            </div>
         </div>

         <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 col-span-2">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-lg text-gray-900">Recentes</h3>
               <button className="text-xs font-bold text-[#0026f7] hover:underline bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                 Ver todos
               </button>
            </div>
            <div className="space-y-3">
               {academicDocs.map((doc) => (
                 <div key={doc.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:border-purple-200 transition-all">
                   <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 border border-purple-100">
                      <FileText className="w-5 h-5 text-purple-600" />
                   </div>
                   
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                         <p className="font-bold text-gray-900 text-sm">{doc.title}</p>
                         <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-bold border border-gray-200 uppercase">
                           {doc.category}
                         </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{doc.description}</p>
                      
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {doc.date}
                        </p>
                        <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-100 font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Resumo pronto
                        </span>
                      </div>
                   </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}