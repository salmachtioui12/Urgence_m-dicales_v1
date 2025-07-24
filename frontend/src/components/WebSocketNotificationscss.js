// notificationStyles.js=> WebSocketNotifications

const styles = {
  container: {
    position: 'fixed',
    right: '20px',
    top: '20px',
    zIndex: 1000,
  },
  showButton: {
    padding: '8px 16px',
    fontSize: '14px',
    borderRadius: '6px',
    backgroundColor: 'white',
    color: '#333',
    border: '1px solid #ddd',
    cursor: 'pointer',
    fontWeight: '500',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
  badge: {
    backgroundColor: '#ef4444',
    color: 'white',
    borderRadius: '10px',
    padding: '2px 6px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '6px'
  },
  notificationPanel: {
    position: 'absolute',
    right: '0',
    top: '40px',
    width: '350px',
    maxHeight: '70vh',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    border: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#333'
  },
  controls: {
    display: 'flex',
    gap: '12px'
  },
  controlButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  listContainer: {
    overflowY: 'auto',
    flexGrow: 1,
    maxHeight: 'calc(70vh - 45px)'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  item: {
    padding: '14px 16px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
    lineHeight: '1.5',
    position: 'relative',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '6px'
  },
  userName: {
    fontWeight: '600',
    color: '#333',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  time: {
    color: '#999',
    fontSize: '12px',
    marginLeft: '75%',
    flexShrink: 0,
  },
  messageContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  actionContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
  },
  action: {
    color: '#666',
    fontSize: '13px'
  },
  target: {
    color: '#3a86ff',
    fontWeight: '500',
    fontSize: '13px'
  },
  emptyState: {
    padding: '24px',
    textAlign: 'center',
    color: '#999',
    fontSize: '14px'
  },
  closeButton: {
    position: 'absolute',
    right: '20px',
    top: '12px',
    background: 'none',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    fontSize: '14px',
  }
};

export default styles;
