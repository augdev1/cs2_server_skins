import React, { useState } from 'react';
import { UserCheck, Check } from 'lucide-react';
import { playerService } from '../services/api';

export default function AgentSelector({ 
  agents, 
  team, 
  equippedAgent, 
  onAgentChanged 
}) {
  const [saving, setSaving] = useState(false);
  const teamKey = team === 2 ? 't' : 'ct';
  
  // agents data may be list or dict
  const agentList = Array.isArray(agents) 
    ? agents 
    : (agents?.[teamKey] || agents?.t || agents?.ct || []);

  const handleSelectAgent = async (agent) => {
    setSaving(true);
    try {
      const agentId = agent.model || agent.agent_id || agent.name;
      if (team === 2) {
        await playerService.updateAgent(null, agentId);
      } else {
        await playerService.updateAgent(agentId, null);
      }
      onAgentChanged(agentId);
    } catch (err) {
      console.error('Erro ao equipar agente:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 className="font-display" style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserCheck size={20} color="var(--cs-gold)" />
          <span>AGENTES CUSTOMIZADOS DO CS2</span>
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Selecione o agente oficial da Valve para o lado {team === 2 ? 'Terrorista' : 'Contra-Terrorista'}.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem'
      }}>
        {agentList.map((a, idx) => {
          const agentId = a.model || a.agent_id || a.name || `agent_${idx}`;
          const isEquipped = equippedAgent === agentId;

          return (
            <div
              key={agentId}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: isEquipped ? '2px solid var(--cs-gold)' : '1px solid var(--border-color)',
                borderRadius: '12px',
                position: 'relative'
              }}
            >
              {isEquipped && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'var(--cs-gold)',
                  color: '#000',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  EQUIPADO
                </div>
              )}

              <img
                src={a.image || 'https://raw.githubusercontent.com/ByMykel/counter-strike-image-tracker/main/static/panorama/images/econ/characters/customplayer_ctm_gendarmerie_varianta_png.png'}
                alt={a.name || 'Agente'}
                style={{
                  maxHeight: '130px',
                  objectFit: 'contain',
                  margin: '0.5rem 0'
                }}
              />

              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textAlign: 'center', marginBottom: '0.75rem' }}>
                {a.name || agentId}
              </h4>

              <button
                type="button"
                onClick={() => handleSelectAgent(a)}
                className={isEquipped ? 'btn-primary' : 'btn-secondary'}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                disabled={saving}
              >
                <span>{isEquipped ? 'Equipado' : 'Equipar Agente'}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
