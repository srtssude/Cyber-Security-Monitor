import React, { useState, useEffect } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx, keyframes } from '@emotion/css';
import { useStyles2, Button } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const styles = useStyles2(getStyles);
  
  const [threatLevel, setThreatLevel] = useState<string>('Initializing...');
  const [isLocked, setIsLocked] = useState(false);
  const [apiHistory, setApiHistory] = useState<number[]>([]);
  
  const [stats, setStats] = useState({ min: 999, max: 0 });
  const [lastUpdated, setLastUpdated] = useState<string>('-');
  const [aiConfidence, setAiConfidence] = useState<number>(0);

  useEffect(() => {
    if (isLocked) return;

    const fetchData = () => {
      const randomId = Math.floor(Math.random() * 20) + 1; 
      const url = `${options.apiUrl}${randomId}`; 

      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          
          const simulatedValue = json.id * 5; 
          const now = new Date();
          setLastUpdated(now.toLocaleTimeString());
          setAiConfidence(Math.floor(Math.random() * (99 - 85 + 1) + 85));

          setThreatLevel(`Threat ID: ${json.id} | Level: ${json.completed ? 'CRITICAL' : 'MODERATE'}`);
          
          setApiHistory(prev => {
            const newHistory = [...prev, simulatedValue];
            return newHistory.length > 80 ? newHistory.slice(1) : newHistory;
          });
        })
        .catch(() => setThreatLevel('⚠ API Error'));
    };

    const timer = setInterval(fetchData, options.apiPollInterval || 2000);
    return () => clearInterval(timer);
    
  }, [options.apiUrl, options.apiPollInterval, isLocked]);

  const series = data.series[0];
  const field = series?.fields.find((f) => f.type === 'number');
  const latestValue = field?.values.get(field.values.length - 1) || 0;

  useEffect(() => {
    if (latestValue > 0) {
        setStats(prev => ({
            min: Math.min(prev.min, latestValue),
            max: Math.max(prev.max, latestValue)
        }));
    }
  }, [latestValue]);

  const handleReset = () => {
      setStats({ min: latestValue, max: latestValue });
      setApiHistory([]);
      setIsLocked(false);
  };

  let aiStatus = "Normal";
  let aiColor = "#00ff00"; 
  if (options.enableAI && field) {
    const values = field.values.toArray();
    if (values.length > 5) {
        const last5 = values.slice(-5);
        const avg = last5.reduce((a, b) => a + b, 0) / last5.length;
        const diff = Math.abs(latestValue - avg);
        if (diff > (100 * (1 - options.aiSensitivity))) {
            aiStatus = "WARNING! Anomaly Detected!";
            aiColor = "orange";
        }
    }
  }

  const isCritical = latestValue > options.alertThreshold;
  const blinkClass = (isCritical && options.enableBlinking) ? css`animation: ${blinkKeyframe} 1s infinite;` : '';
  
  const bgColor = isCritical ? '#5c0000' : (isLocked ? '#000033' : 'transparent');

  return (
    <div className={cx(styles.wrapper, blinkClass, css`
          width: ${width}px; height: ${height}px; background-color: ${bgColor};
          transition: background-color 0.5s ease; border: ${isCritical ? '2px solid red' : '1px solid #333'};
        `)}>
      
      
      <div className={styles.header} style={{ fontSize: `${options.headerFontSize}px` }}> 
        
        <div className={cx(styles.pulseDot, css`background: ${isCritical ? 'red' : '#00ff00'};`)}></div>
        
        {options.panelTitle} 
      </div>

      <div className={styles.valueBox}>
        <div style={{ fontSize: `${options.baseFontSize}px`, fontWeight: 'bold' }}>
            {isLocked ? 'LOCKED' : latestValue.toFixed(1)}%
        </div>
        <div style={{ fontSize: '10px', opacity: 0.7 }}>Internal System Load</div>
      </div>

      {options.showStats && (
          <div style={{display: 'flex', gap: '10px', fontSize: '9px', opacity: 0.8, marginBottom: '5px'}}>
              <span>Min: {stats.min.toFixed(1)}</span>
              <span>Max: {stats.max.toFixed(1)}</span>
          </div>
      )}

      {options.enableAI && !isLocked && (
        <div className={styles.aiBox} style={{ borderLeft: `3px solid ${aiColor}` }}>
          <strong>AI Analysis:</strong> {aiStatus} 
          <span style={{float: 'right', opacity: 0.6}}>({aiConfidence}%)</span>
        </div>
      )}

      {options.showTrendGraph && (
        <div className={styles.graphContainer}>
            <div style={{display: 'flex', justifyContent:'space-between', fontSize: '8px', color: '#aaa', marginBottom: '2px'}}>
                <span>External Threat Trend</span>
                <span>{lastUpdated}</span> 
            </div>
            <div style={{display: 'flex', alignItems: 'flex-end', height: '25px', gap: '2px'}}>
                {apiHistory.map((val, i) => (
                    <div key={i} style={{
                        width: '6px', height: `${Math.min(val, 100)}%`,
                        backgroundColor: val > 50 ? '#ff4444' : '#44ff44', borderRadius: '1px'
                    }} />
                ))}
            </div>
        <div className={styles.apiBox}>{threatLevel}</div>
        </div>
      )}

      <div style={{display: 'flex', gap: '5px', marginTop: '5px'}}>
        <Button size="sm" variant={isLocked ? "primary" : "secondary"} onClick={() => setIsLocked(!isLocked)}>
            {isLocked ? 'UNLOCK' : 'LOCK'}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleReset}>RESET</Button>
      </div>

      <div className={styles.footer}>Developed by Zeynep Sude Sarıtaş - Fall 2025</div>
    </div>
  );
};

const blinkKeyframe = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const pulseKeyframe = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const getStyles = () => {
  return {
    wrapper: css`display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px; position: relative; overflow: hidden;`,
    header: css`font-weight: bold; font-size: 14px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; gap: 5px;`,
    pulseDot: css`width: 8px; height: 8px; border-radius: 50%; animation: ${pulseKeyframe} 2s infinite;`,
    valueBox: css`text-align: center; margin-bottom: 5px;`,
    aiBox: css`background: rgba(255, 255, 255, 0.05); padding: 5px; width: 90%; font-size: 10px; margin-bottom: 5px; text-align: left;`,
    apiBox: css`font-size: 9px; font-style: italic; opacity: 0.8; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;`,
    graphContainer: css`width: 90%; background: rgba(0,0,0,0.3); padding: 5px; border-radius: 4px; display: flex; flex-direction: column; margin-bottom: 5px;`,
    footer: css`position: absolute; bottom: 2px; right: 5px; font-size: 12px; color: #ffffff; font-weight: 500; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);`,
  };
};