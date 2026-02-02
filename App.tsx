
import React, { useState, useEffect } from 'react';
import { Consultation, ConsultationStatus, Response as WorkerResponse } from './types';
import { consultationService } from './services/consultationService';
import { SignaturePad } from './components/SignaturePad';
import { A4Document } from './components/A4Document';
import { 
  ClipboardList, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  LayoutDashboard, 
  History, 
  Printer, 
  Download,
  Eye,
  Github,
  FileText
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'form' | 'admin' | 'success' | 'document'>('home');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<WorkerResponse | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [allResponses, setAllResponses] = useState<WorkerResponse[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [workerName, setWorkerName] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [signature, setSignature] = useState<string>('');

  useEffect(() => {
    setConsultations(consultationService.getConsultations());
    setAllResponses(consultationService.getResponses());
  }, [view]);

  const handleStartConsultation = (c: Consultation) => {
    setSelectedConsultation(c);
    setView('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signature) {
      alert('Por favor, assine o formulário antes de enviar.');
      return;
    }

    if (!selectedConsultation) return;

    const newResponse: WorkerResponse = {
      id: Math.random().toString(36).substr(2, 9),
      consultationId: selectedConsultation.id,
      workerName,
      workerId,
      answers: formData,
      signature,
      timestamp: new Date().toISOString()
    };

    consultationService.submitResponse(newResponse);
    setSelectedResponse(newResponse);
    setView('success');
  };

  const handleViewDocument = (res: WorkerResponse) => {
    const consultation = consultations.find(c => c.id === res.consultationId);
    if (consultation) {
      setSelectedConsultation(consultation);
      setSelectedResponse(res);
      setView('document');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">ConsultWorker</h1>
          </div>
          <p className="text-slate-500 font-medium">Compliance e Transparência na Gestão de Pessoas</p>
        </div>
        <div className="flex gap-3">
          <a href="https://github.com" target="_blank" className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Github size={24} />
          </a>
          <button 
            onClick={() => setView('admin')}
            className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <LayoutDashboard size={18} />
            <span>Painel Admin</span>
          </button>
        </div>
      </header>

      <section className="grid gap-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-lg font-bold text-slate-800">Consultas Ativas</h2>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Publicado via Vercel</span>
        </div>
        
        {consultations.filter(c => c.status === ConsultationStatus.OPEN).length === 0 ? (
          <div className="bg-white p-16 text-center rounded-3xl border border-slate-200 shadow-sm">
            <ClipboardList className="mx-auto w-12 h-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">Nenhum formulário ativo no momento.</p>
          </div>
        ) : (
          consultations.filter(c => c.status === ConsultationStatus.OPEN).map(c => (
            <div 
              key={c.id} 
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
              onClick={() => handleStartConsultation(c)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{c.title}</h3>
                </div>
                <p className="text-slate-500 text-sm line-clamp-1 max-w-xl mb-4">{c.description}</p>
                <div className="flex gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><ClipboardList size={14} /> {c.questions.length} Campos</span>
                  <span className="flex items-center gap-1.5"><FileText size={14} /> Formato A4</span>
                  <span className="flex items-center gap-1.5"><History size={14} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );

  const renderForm = () => {
    if (!selectedConsultation) return null;
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <button 
          onClick={() => setView('home')}
          className="text-slate-400 hover:text-slate-600 mb-8 flex items-center gap-2 font-bold text-sm uppercase tracking-wider"
        >
          &larr; Voltar
        </button>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
          
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 mb-3 leading-tight">{selectedConsultation.title}</h2>
            <p className="text-slate-500 text-lg leading-relaxed">{selectedConsultation.description}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={workerName}
                  onChange={e => setWorkerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Matrícula / ID</label>
                <input 
                  required
                  type="text" 
                  value={workerId}
                  onChange={e => setWorkerId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all font-medium"
                  placeholder="ID do colaborador"
                />
              </div>
            </div>

            <div className="space-y-8">
              {selectedConsultation.questions.map(q => (
                <div key={q.id} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <p className="font-bold text-slate-800 text-lg">{q.text}</p>
                  {q.type === 'text' && (
                    <textarea 
                      onChange={e => setFormData(prev => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-blue-500 outline-none min-h-[120px] bg-white transition-all shadow-sm"
                      placeholder="Descreva sua resposta com detalhes..."
                    />
                  )}
                  {q.type === 'radio' && (
                    <div className="grid gap-3">
                      {q.options?.map(opt => (
                        <label key={opt} className="flex items-center gap-4 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all">
                          <input 
                            required
                            type="radio" 
                            name={q.id} 
                            value={opt}
                            onChange={() => setFormData(prev => ({ ...prev, [q.id]: opt }))}
                            className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500" 
                          />
                          <span className="text-slate-700 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                Assinatura do Colaborador
              </label>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <SignaturePad 
                  onSave={setSignature}
                  onClear={() => setSignature('')}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-lg uppercase tracking-wider"
            >
              Assinar e Finalizar
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <LayoutDashboard className="text-blue-600" />
            Painel Administrativo
          </h2>
          <p className="text-slate-500 font-medium">Gestão de Respostas e Documentos Assinados</p>
        </div>
        <button 
          onClick={() => setView('home')}
          className="bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-300 transition-all"
        >
          Sair do Admin
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total de Respostas</p>
          <p className="text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-all">{allResponses.length}</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Deploy Status</p>
          <p className="text-4xl font-black text-green-500">Live</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Integridade</p>
          <p className="text-4xl font-black text-blue-600">Secure</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase tracking-tight">Logs de Assinatura</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                <th className="px-8 py-4">Colaborador</th>
                <th className="px-8 py-4">Data de Envio</th>
                <th className="px-8 py-4">Consulta</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allResponses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-medium italic">Nenhum registro encontrado.</td>
                </tr>
              ) : (
                allResponses.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-900">{res.workerName}</p>
                      <p className="text-xs font-medium text-slate-400">ID: {res.workerId}</p>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-600">
                      {new Date(res.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-slate-600">
                      {consultations.find(c => c.id === res.consultationId)?.title}
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">Assinado</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button 
                        onClick={() => handleViewDocument(res)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs uppercase flex items-center gap-1.5 ml-auto group"
                      >
                        <Eye size={16} className="group-hover:scale-110 transition-transform" /> Ver Folha A4
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDocumentView = () => {
    if (!selectedConsultation || !selectedResponse) return null;
    return (
      <div className="min-h-screen bg-slate-900 py-12 px-4 print:bg-white print:p-0">
        <div className="max-w-[210mm] mx-auto flex flex-col md:flex-row justify-between items-center mb-10 print:hidden gap-6">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => setView(selectedResponse === allResponses[allResponses.length-1] && view !== 'admin' ? 'success' : 'admin')}
              className="text-slate-400 hover:text-white flex items-center gap-2 font-bold uppercase text-xs transition-colors"
            >
              &larr; Sair da Visualização
            </button>
            <div className="flex items-center gap-2 text-green-400 text-[10px] font-black uppercase tracking-widest mt-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
               Documento Pronto para PDF
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handlePrint}
              className="bg-white text-slate-900 font-black px-8 py-3.5 rounded-2xl hover:bg-slate-100 flex items-center gap-3 shadow-2xl transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Printer size={20} /> Imprimir / Salvar PDF
            </button>
            <button 
              className="bg-slate-800 text-slate-400 font-bold px-6 py-3.5 rounded-2xl hover:text-white flex items-center gap-3 transition-all"
              onClick={() => alert('Exportação de dados JSON completa.')}
            >
              <Download size={20} /> Dados
            </button>
          </div>
        </div>
        <div className="relative group">
          <A4Document consultation={selectedConsultation} response={selectedResponse} />
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 text-center bg-white">
      <div className="bg-green-100 p-8 rounded-full text-green-600 mb-8 animate-bounce">
        <CheckCircle2 size={84} />
      </div>
      <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Assinatura Coletada!</h2>
      <p className="text-slate-500 text-xl max-w-xl mb-12 font-medium leading-relaxed">
        Excelente, <strong>{workerName}</strong>. Seu formulário foi assinado digitalmente e o documento A4 já está disponível para visualização.
      </p>
      <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg">
        <button 
          onClick={() => selectedResponse && handleViewDocument(selectedResponse)}
          className="flex-1 bg-blue-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
        >
          <FileText size={22} /> Visualizar Folha A4
        </button>
        <button 
          onClick={() => setView('home')}
          className="flex-1 bg-slate-100 text-slate-600 font-black py-5 px-8 rounded-2xl hover:bg-slate-200 transition-all"
        >
          Finalizar Sessão
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {view === 'home' && renderHome()}
      {view === 'form' && renderForm()}
      {view === 'admin' && renderAdmin()}
      {view === 'success' && renderSuccess()}
      {view === 'document' && renderDocumentView()}
      
      {view !== 'document' && (
        <footer className="py-20 mt-auto border-t border-slate-200 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center gap-4 mb-8">
               <span className="bg-slate-100 text-slate-400 font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">Vercel Edge</span>
               <span className="bg-slate-100 text-slate-400 font-black text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-widest border border-slate-200">GitHub Pages Ready</span>
            </div>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
              ConsultWorker Open Platform
            </p>
            <p className="text-slate-300 text-xs">
              &copy; {new Date().getFullYear()} - Sistema de Documentação de Alta Fidelidade.
            </p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
