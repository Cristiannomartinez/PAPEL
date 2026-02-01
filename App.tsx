
import React, { useState, useEffect } from 'react';
import { Consultation, ConsultationStatus, Response as WorkerResponse } from './types';
import { consultationService } from './services/consultationService';
import { SignaturePad } from './components/SignaturePad';
import { ClipboardList, Users, ShieldCheck, ChevronRight, CheckCircle2, LayoutDashboard, History } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'form' | 'admin' | 'success'>('home');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
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
    setView('success');
    
    // Reset states
    setFormData({});
    setWorkerName('');
    setWorkerId('');
    setSignature('');
  };

  const handleInputChange = (questionId: string, value: any) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
  };

  const renderHome = () => (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ShieldCheck className="text-blue-600 w-8 h-8" />
            ConsultWorker
          </h1>
          <p className="text-slate-600 mt-2">Portal de consultas formais aos colaboradores</p>
        </div>
        <button 
          onClick={() => setView('admin')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 rounded-lg transition-all"
        >
          <LayoutDashboard size={20} />
          <span className="hidden sm:inline">Admin Dashboard</span>
        </button>
      </header>

      <section className="grid gap-6">
        <h2 className="text-xl font-semibold text-slate-800">Consultas Disponíveis</h2>
        {consultations.filter(c => c.status === ConsultationStatus.OPEN).length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
            <ClipboardList className="mx-auto w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500">Nenhuma consulta aberta no momento.</p>
          </div>
        ) : (
          consultations.filter(c => c.status === ConsultationStatus.OPEN).map(c => (
            <div 
              key={c.id} 
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center"
              onClick={() => handleStartConsultation(c)}
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-slate-600 line-clamp-2 max-w-xl">{c.description}</p>
                <div className="flex gap-4 mt-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <ClipboardList size={16} /> {c.questions.length} questões
                  </span>
                  <span className="flex items-center gap-1">
                    <History size={16} /> Publicado em {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <ChevronRight className="text-blue-500" size={24} />
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
          className="text-slate-500 hover:text-slate-800 mb-6 flex items-center gap-2"
        >
          &larr; Voltar para o Início
        </button>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-lg">
          <div className="mb-8 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-900">{selectedConsultation.title}</h2>
            <p className="text-slate-600 mt-2">{selectedConsultation.description}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
                <input 
                  required
                  type="text" 
                  value={workerName}
                  onChange={e => setWorkerName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Matrícula / ID</label>
                <input 
                  required
                  type="text" 
                  value={workerId}
                  onChange={e => setWorkerId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="ID do trabalhador"
                />
              </div>
            </div>

            {selectedConsultation.questions.map(q => (
              <div key={q.id} className="space-y-3">
                <p className="font-semibold text-slate-800">{q.text}</p>
                {q.type === 'text' && (
                  <textarea 
                    onChange={e => handleInputChange(q.id, e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                    placeholder="Sua resposta..."
                  />
                )}
                {q.type === 'radio' && q.options?.map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <input 
                      required
                      type="radio" 
                      name={q.id} 
                      value={opt}
                      onChange={() => handleInputChange(q.id, opt)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500" 
                    />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
                {q.type === 'checkbox' && q.options?.map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors">
                    <input 
                      type="checkbox" 
                      onChange={e => {
                        const current = formData[q.id] || [];
                        const next = e.target.checked 
                          ? [...current, opt] 
                          : current.filter((i: string) => i !== opt);
                        handleInputChange(q.id, next);
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" 
                    />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
            ))}

            <div className="pt-6 border-t border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                Assinatura Digital de Verificação
              </label>
              <SignaturePad 
                onSave={setSignature}
                onClear={() => setSignature('')}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Enviar Consulta Assinada
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderAdmin = () => (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            Painel Administrativo
          </h2>
          <p className="text-slate-500">Monitoramento e análise de resultados</p>
        </div>
        <button 
          onClick={() => setView('home')}
          className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200"
        >
          Sair do Admin
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600"><ClipboardList /></div>
            <div>
              <p className="text-sm text-slate-500">Consultas Ativas</p>
              <p className="text-2xl font-bold">{consultations.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600"><Users /></div>
            <div>
              <p className="text-sm text-slate-500">Total Respostas</p>
              <p className="text-2xl font-bold">{allResponses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-full text-amber-600"><ShieldCheck /></div>
            <div>
              <p className="text-sm text-slate-500">Assinaturas Coletadas</p>
              <p className="text-2xl font-bold">{allResponses.filter(r => !!r.signature).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Respostas Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Trabalhador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Data/Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Consulta</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Assinatura</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Resumo</th>
              </tr>
            </thead>
            <tbody>
              {allResponses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Ainda não há respostas para exibir.</td>
                </tr>
              ) : (
                allResponses.map(res => {
                  const consultation = consultations.find(c => c.id === res.consultationId);
                  return (
                    <tr key={res.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{res.workerName}</p>
                        <p className="text-xs text-slate-500">ID: {res.workerId}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(res.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {consultation?.title || 'Consulta Deletada'}
                      </td>
                      <td className="px-6 py-4">
                        <img src={res.signature} alt="Assinatura" className="h-10 border border-slate-100 rounded bg-white p-1" />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="max-w-xs truncate text-slate-500">
                          {Object.values(res.answers).join(', ')}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="bg-green-100 p-4 rounded-full text-green-600 mb-6">
        <CheckCircle2 size={64} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Consulta Enviada com Sucesso!</h2>
      <p className="text-slate-600 text-lg max-w-md mb-8">
        Obrigado por sua participação, {workerName}. Sua resposta e assinatura foram registradas para conformidade legal.
      </p>
      <button 
        onClick={() => setView('home')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md"
      >
        Voltar ao Portal
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {view === 'home' && renderHome()}
      {view === 'form' && renderForm()}
      {view === 'admin' && renderAdmin()}
      {view === 'success' && renderSuccess()}
      
      <footer className="py-12 mt-auto border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} ConsultWorker. Sistema seguro de conformidade e participação.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <ShieldCheck size={12} /> Assinatura digital criptografada
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Users size={12} /> Foco no colaborador
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
