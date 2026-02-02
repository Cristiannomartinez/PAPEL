
import React from 'react';
import { Consultation, Response } from '../types';
import { ShieldCheck } from 'lucide-react';

interface A4DocumentProps {
  consultation: Consultation;
  response: Response;
}

export const A4Document: React.FC<A4DocumentProps> = ({ consultation, response }) => {
  return (
    <div className="bg-white shadow-2xl mx-auto my-8 print:my-0 print:shadow-none print:w-full overflow-hidden" 
         style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}>
      
      {/* Header do Documento */}
      <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Relatório de Consulta Formal</h1>
          <p className="text-sm text-slate-500 font-mono">ID do Documento: {response.id.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 text-blue-600 font-bold mb-1">
            <ShieldCheck size={20} />
            <span>ConsultWorker</span>
          </div>
          <p className="text-xs text-slate-400">Verificado Digitalmente</p>
        </div>
      </div>

      {/* Dados do Trabalhador */}
      <div className="grid grid-cols-2 gap-8 mb-8 bg-slate-50 p-4 rounded border border-slate-100">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Trabalhador</p>
          <p className="text-lg font-semibold text-slate-900">{response.workerName}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Matrícula / Identificação</p>
          <p className="text-lg font-semibold text-slate-900">{response.workerId}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Consulta Referente a</p>
          <p className="text-md font-medium text-slate-800">{consultation.title}</p>
        </div>
      </div>

      {/* Respostas */}
      <div className="space-y-6 mb-12">
        <h3 className="text-sm font-bold text-slate-900 uppercase border-b border-slate-200 pb-2 mb-4">Respostas Coletadas</h3>
        {consultation.questions.map((q) => (
          <div key={q.id} className="break-inside-avoid">
            <p className="text-sm font-bold text-slate-700 mb-2">{q.text}</p>
            <div className="pl-4 border-l-2 border-slate-100 py-1">
              <p className="text-slate-600 text-sm italic">
                {Array.isArray(response.answers[q.id]) 
                  ? response.answers[q.id].join(', ') 
                  : (response.answers[q.id] || 'Nenhuma resposta fornecida.')}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Assinatura e Selo */}
      <div className="mt-auto pt-12">
        <div className="flex flex-col items-center justify-center border-t border-slate-200 pt-8">
          <img 
            src={response.signature} 
            alt="Assinatura Digital" 
            className="max-h-24 mb-2 grayscale contrast-125"
          />
          <div className="w-64 h-px bg-slate-900 mb-2"></div>
          <p className="text-sm font-bold text-slate-900">{response.workerName}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Assinatura Digital Confirmada em {new Date(response.timestamp).toLocaleString('pt-BR')}</p>
        </div>
        
        <div className="mt-12 text-[9px] text-slate-400 text-center leading-relaxed font-mono">
          Este documento foi gerado eletronicamente e possui validade jurídica interna conforme as normas da organização.<br/>
          A integridade dos dados é garantida pelo hash de segurança do sistema ConsultWorker.
        </div>
      </div>
    </div>
  );
};
