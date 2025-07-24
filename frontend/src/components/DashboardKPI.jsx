import { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import './dashboard.css';
import WebSocketNotifications from  './WebSocketNotifications'
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [lastCalls, setLastCalls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
      console.log('✅ WebSocket connecté dashbord');
    };

    ws.onmessage = (message) => {
      const parsed = JSON.parse(message.data);
      if (parsed.type === 'STATS_UPDATE') {
        setStats(parsed.data);
        setZones(parsed.data.urgencesZones || []);
        setIsLoading(false);
        
      }
      if (parsed.type === 'DERNIERS_APPELS') {
        setLastCalls(parsed.data);
      }
    };

    ws.onclose = () => {
      console.log('❌ WebSocket déconnecté dashbord');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://localhost:3000/api/kpi/statistique');
        const statsJson = await statsRes.json();
        setData(statsJson);
        setZones(statsJson.urgencesZones || []);

        const appelsRes = await fetch('http://localhost:3000/appels/recents');
        const appelsJson = await appelsRes.json();
        setLastCalls(appelsJson);

        setIsLoading(false);
      } catch (err) {
        console.error("Erreur lors du fetch des stats ou appels:", err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedStats = stats || data;

  const getGravityLabel = (gravityId) => {
    switch(gravityId) {
      case '1': return 'faible';
      case '2': return 'moyenne';
      case '3': return 'ritique';
      default: return gravityId || 'Inconnue';
    }
  };
const [zonePage, setZonePage] = useState(0);
const zonesPerPage = 6;

const startIndex = zonePage * zonesPerPage;
const paginatedZones = zones.slice(startIndex, startIndex + zonesPerPage);
const totalPages = Math.ceil(zones.length / zonesPerPage);
  const gravityChartData = {
    labels: displayedStats?.repartitionUrgences?.map(item => getGravityLabel(item._id)) || [],
    datasets: [
      {
        data: displayedStats?.repartitionUrgences?.map(item => item.total) || [],
        backgroundColor: [
          '#FFD700', // Jaune pour Faible
          '#FFA500', // Orange pour Moyenne
          '#FF4500', // Rouge-orange pour Critique
          '#A9A9A9', // Gris pour autres
        ],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const gravityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: false,
      animateRotate: false
    },
    onClick: (e) => {
      if (chartRef.current) {
        chartRef.current.update();
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14
          },
          usePointStyle: true,
        },
        onClick: () => {}
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'terminé':
        return 'status-badge status-terminer';
      case 'en attente':
        return 'status-badge status-attente';
      case 'en intervention':
        return 'status-badge status-intervention';
      default:
        return 'status-badge';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        Chargement<span className="loading-dots"><span></span><span></span><span></span></span>
      </div>
    );
  }

  return (
    
    <div className="dashboard-container">
      <div className="min-h-screen bg-gray-100 p-6">
      <WebSocketNotifications />
    </div>
      <div className="dashboard-header">
        <h1>Tableau de bord - Urgences</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h2>Urgences</h2>
          <p>Terminées : <span className="stat-value">{displayedStats?.urgences?.appelterminer}</span></p>
          <p>En attente : <span className="stat-value">{displayedStats?.urgences?.appelenattend}</span></p>
          <p>En intervention : <span className="stat-value">{displayedStats?.urgences?.appeleninterv}</span></p>
        </div>

        <div className="stat-card">
          <h2>Temps moyen</h2>
          <p><span className="stat-value">{displayedStats?.tempsReponse}</span> minutes</p>
        </div>

        <div className="stat-card">
          <h2>Occupation</h2>
          <p><span className="stat-value">{displayedStats?.occupation}</span>%</p>
        </div>

        <div className="stat-card">
          <h2>Ambulances</h2>
          <p>Total : <span className="stat-value">{displayedStats?.ambulances?.total}</span></p>
          <p>Disponibles : <span className="stat-value">{displayedStats?.ambulances?.disponibles}</span></p>
          <p>En mission : <span className="stat-value">{displayedStats?.ambulances?.missions}</span></p>
        </div>
      </div>

      <div className="data-section">
        <div className="data-card">
          <h2>🕑 5 Derniers Appels</h2>
          <table className="last-calls-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Gravité</th>
                <th>État</th>
              </tr>
            </thead>
            <tbody>
              {lastCalls.map((call, index) => (
                <tr key={index}>
                  <td>{call.patientName || '---'}</td>
                  <td>{new Date(call.heureAppel).toLocaleString()}</td>
                  <td className={`gravity-${call.gravite}`}>
                    {getGravityLabel(call.gravite)}
                  </td>
                  <td><span className={getStatusBadgeClass(call.etat)}>{call.etat}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       <div className="data-card">
  <h2>📍 Répartition par zone</h2>
  <table className="zones-table">
    <thead>
      <tr>
        <th>Zone</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {paginatedZones.map((zone, index) => (
        <tr key={startIndex + index}>
          <td>{zone._id}</td>
          <td>{zone.total}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Pagination */}
  {zones.length > zonesPerPage && (
    <div className="pagination-controls">
      <button 
        onClick={() => setZonePage(zonePage - 1)} 
        disabled={zonePage === 0}
      >
        Précédent
      </button>

      <span> Page {zonePage + 1} / {totalPages} </span>

      <button 
        onClick={() => setZonePage(zonePage + 1)} 
        disabled={zonePage + 1 >= totalPages}
      >
        Suivant
      </button>
    </div>
  )}
</div>
      </div>

      {displayedStats?.repartitionUrgences?.length > 0 && (
        <div className="data-card full-width">
          <h2>⚠️ Répartition par gravité</h2>
          <div className="chart-container">
            <Pie 
              ref={chartRef}
              data={gravityChartData} 
              options={gravityChartOptions}
              redraw={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}