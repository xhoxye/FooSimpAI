import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertCircle, RefreshCw, Save, Zap } from 'lucide-react';
import { ComfyWorkflow, UIMappings, UIFieldType, FIELD_LABELS, ComfyNode } from '../types';
import { autoMapWorkflow, extractDefaultValues } from '../utils/comfyUtils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  workflow: ComfyWorkflow | null;
  setWorkflow: (wf: ComfyWorkflow) => void;
  mappings: UIMappings;
  setMappings: (m: UIMappings) => void;
  setWorkflowName: (name: string) => void;
  onUpdateUiValues: (values: Partial<Record<UIFieldType, any>>) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen, onClose, backendUrl, setBackendUrl, workflow, setWorkflow, mappings, setMappings, setWorkflowName, onUpdateUiValues
}) => {
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [checkStatus, setCheckStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        // Basic validation: check if it looks like an API format (object of objects with class_type)
        const keys = Object.keys(parsed);
        if (keys.length > 0 && parsed[keys[0]].class_type) {
          setWorkflow(parsed);
          setWorkflowName(file.name);
          setUploadedFileName(file.name);
          
          const newMappings = autoMapWorkflow(parsed);
          setMappings(newMappings);
          
          // Extract default values and update parent
          const newDefaults = extractDefaultValues(parsed, newMappings);
          onUpdateUiValues(newDefaults);

          setJsonError(null);
        } else {
          setJsonError("Invalid ComfyUI API JSON format. Make sure you use 'Save (API Format)' in ComfyUI.");
        }
      } catch (err) {
        setJsonError("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleCheckConnection = async () => {
      setCheckStatus('checking');
      try {
          const res = await fetch(`${backendUrl}/system_stats`);
          if (res.ok) {
              setCheckStatus('success');
              setTimeout(() => setCheckStatus('idle'), 2000);
          } else {
              setCheckStatus('error');
          }
      } catch (e) {
          setCheckStatus('error');
      }
  };

  const handleMappingChange = (field: UIFieldType, nodeId: string, nodeField: string) => {
    setMappings({
      ...mappings,
      [field]: { nodeId, field: nodeField }
    });
  };

  const getNodeOptions = () => {
    if (!workflow) return [];
    return Object.entries(workflow).map(([id, node]) => {
      const n = node as ComfyNode;
      return {
        id,
        label: `${id}: ${n._meta?.title || n.class_type}`
      };
    });
  };

  const getFieldsForNode = (nodeId: string) => {
    if (!workflow || !nodeId || !workflow[nodeId]) return [];
    return Object.keys(workflow[nodeId].inputs);
  };

  const getDefaultValue = (field: UIFieldType) => {
      if (!workflow || !mappings[field]) return "-";
      const { nodeId, field: nodeField } = mappings[field]!;
      if (workflow[nodeId] && workflow[nodeId].inputs) {
          const val = workflow[nodeId].inputs[nodeField];
          if (typeof val === 'object') return JSON.stringify(val).slice(0, 20) + '...';
          return String(val);
      }
      return "-";
  };

  const nodes = getNodeOptions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            Backend & Workflow Configuration
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Connection */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">1. ComfyUI Connection</h3>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Backend URL (e.g., http://127.0.0.1:8188)</label>
              <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={backendUrl}
                    onChange={(e) => setBackendUrl(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="http://127.0.0.1:8188"
                  />
                  <button 
                    onClick={handleCheckConnection}
                    disabled={checkStatus === 'checking'}
                    className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                        checkStatus === 'success' ? 'bg-green-600 text-white' : 
                        checkStatus === 'error' ? 'bg-red-600 text-white' : 
                        'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                      {checkStatus === 'checking' && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {checkStatus === 'success' && <Check className="w-4 h-4" />}
                      {checkStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                      {checkStatus === 'idle' && "Check"}
                  </button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Note: Ensure ComfyUI is launched with <code className="bg-slate-700 px-1 rounded text-slate-300">--listen --enable-cors-header *</code> if running on a different host/port.
              </p>
            </div>
          </section>

          {/* Section 2: Workflow */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">2. Workflow Upload</h3>
            <div className="flex flex-col gap-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${jsonError ? 'border-red-500 bg-red-500/10' : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json" 
                  onChange={handleFileUpload}
                />
                <Upload className="w-10 h-10 text-slate-400 mb-2" />
                <p className="text-slate-300 font-medium">Click to upload Workflow (API Format JSON)</p>
                <p className="text-slate-500 text-sm mt-1">Export from ComfyUI using "Save (API Format)"</p>
              </div>

              {jsonError && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                  <AlertCircle className="w-4 h-4" />
                  {jsonError}
                </div>
              )}

              {workflow && !jsonError && (
                <div className="flex items-center gap-2 text-green-400 text-sm bg-green-900/20 p-3 rounded-lg border border-green-900/50">
                  <Check className="w-4 h-4" />
                  Workflow loaded: <span className="font-bold">{uploadedFileName || 'Unknown'}</span> ({Object.keys(workflow).length} nodes)
                </div>
              )}
            </div>
          </section>

          {/* Section 3: Mapping */}
          {workflow && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">3. Parameter Mapping</h3>
                <button 
                  onClick={() => {
                      const newM = autoMapWorkflow(workflow);
                      setMappings(newM);
                      onUpdateUiValues(extractDefaultValues(workflow, newM));
                  }}
                  className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded text-white transition-colors"
                >
                  Auto-Reset Mappings
                </button>
              </div>
              
              <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-800 text-slate-300 font-medium border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 w-1/4">UI Parameter</th>
                      <th className="px-4 py-3 w-1/4">Default Value</th>
                      <th className="px-4 py-3 w-1/4">Target Node</th>
                      <th className="px-4 py-3 w-1/4">Input Field</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Object.values(UIFieldType).map((field) => (
                      <tr key={field} className="hover:bg-slate-800/50">
                        <td className="px-4 py-3 text-slate-300 font-medium">{FIELD_LABELS[field]}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs truncate max-w-[150px]">
                            {getDefaultValue(field)}
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-blue-500 outline-none"
                            value={mappings[field]?.nodeId || ''}
                            onChange={(e) => {
                              // Reset field when node changes
                              handleMappingChange(field, e.target.value, '');
                            }}
                          >
                            <option value="">-- Unmapped --</option>
                            {nodes.map(n => (
                              <option key={n.id} value={n.id}>{n.label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                           <select 
                            className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-300 focus:border-blue-500 outline-none"
                            value={mappings[field]?.field || ''}
                            disabled={!mappings[field]?.nodeId}
                            onChange={(e) => {
                              if (mappings[field]?.nodeId) {
                                handleMappingChange(field, mappings[field]!.nodeId, e.target.value);
                              }
                            }}
                          >
                            <option value="">-- Select Field --</option>
                            {mappings[field]?.nodeId && getFieldsForNode(mappings[field]!.nodeId).map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-900/50 flex justify-end gap-3">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
           >
             <Save className="w-4 h-4" />
             Done
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;