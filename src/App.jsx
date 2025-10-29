import React, { Suspense,useEffect, useState } from 'react';
import RemoteWrapper from './RemoteWrapper';
import { useSelector } from 'react-redux';
import { Store, CreditCard, PiggyBank, Loader2 } from 'lucide-react';


const CreditCardDashboard = React.lazy(() => import('CreditCardMFE/CreditCardDashboard'));
const AccountSummary = React.lazy(() => import('OnlineBankingMFE/AccountSummary'));
const CreditCardSelection = React.lazy(() => import('creditCardMFE1/CreditCardComponent'));
const Payment = React.lazy(() => import('onlineBankingMFE1/OnlineBankingComponent'));

// Function to safely extract state for display in the Host
const useSharedStateSummary = () => {
    const cards = useSelector(state => state.banking.cards);
    const selectedCardId = useSelector(state => state.banking.selectedCardId);

    const selectedCard = cards.find(c => c.id === selectedCardId);

    return {
        selectedCardName: selectedCard ? selectedCard.name : 'None',
        selectedCardBalance: selectedCard ? selectedCard.balance.toFixed(2) : 'N/A',
    };
};

const styles = {
  app: {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
  },
  header: {
    borderBottom: '1px solid #ccc',
    paddingBottom: '15px',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '10px 20px',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    margin: '0',
  },
  contentArea: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '0 10px',
  },
  paragraph: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px',
    padding: '15px',
    backgroundColor: '#fff',
    borderLeft: '4px solid #4a90e2',
  },
  mfeContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  slot: {
    border: '1px solid #ddd',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
  },
  slotTitle: {
      fontSize: '18px',
      marginBottom: '10px',
      color: '#000',
  }
};

const App = () => {

      const { selectedCardName, selectedCardBalance } = useSharedStateSummary();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="host-container flex items-center justify-center h-screen">
                <Loader2 className="loading-spinner" size={48} />
            </div>
        );
    }

    return (

  
  <div style={styles.app}>
    
    <div style={styles.header}>
      <div style={styles.contentArea}>
        <h1 style={styles.title}>MFEs Using Webpack</h1>
      </div>
    </div>

    <div style={styles.contentArea}>

      <div style={styles.mfeContainer}>
        
        <div style={styles.slot}>
          <h2 style={styles.slotTitle}>Credit Card Dashboard</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <RemoteWrapper
              remoteName="CreditCardMFE"
              exposedModule="./CreditCardDashboard"
              fallback={<div>Loading Credit Card MFE...</div>}
              errorFallback={<div style={{color: 'red'}}>Credit Card Dashboard is currently unavailable.</div>}
            />
          </Suspense>
        </div>

        <div style={styles.slot}>
          <h2 style={styles.slotTitle}>Account Summary</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <RemoteWrapper
                remoteName="OnlineBankingMFE"
                exposedModule="./AccountSummary"
                fallback={<div>Loading Online Banking MFE...</div>}
                errorFallback={<div style={{color: 'red'}}>Account Summary is currently unavailable.</div>}
              />
            </Suspense>
        </div>

          <div style={styles.slot}>
            <h2 style={styles.slotTitle}>Credit Card Selection</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <RemoteWrapper
                remoteName="creditCardMFE1"
                exposedModule="./CreditCardComponent"
                fallback={<div>Loading Credit Card Selection MFE...</div>}
                errorFallback={<div style={{color: 'red'}}>Credit Card Selection is currently unavailable.</div>}
              />
            </Suspense>
        </div>

          <div style={styles.slot}>
            <h2 style={styles.slotTitle}>Payment Dashboard</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <RemoteWrapper
                remoteName="onlineBankingMFE1"
                exposedModule="./OnlineBankingComponent"
                fallback={<div>Loading Online Banking MFE...</div>}
                errorFallback={<div style={{color: 'red'}}>Payment is currently unavailable.</div>}
              />
            </Suspense>
        </div>
      </div>

      <div style={styles.slot}>
                    <h3 className="footer-title">
                        <Store className="store-icon" /> Shared Redux Store State
                    </h3>
                    <p className="store-data">
                        Selected Card: **{selectedCardName}**
                        <br />
                        Balance of Selected Card: **${selectedCardBalance}**
                    </p>
                    <p className="store-flow">
                        <span className="remote-a"><CreditCard size={14} className="inline-block" /> Remote A</span> {'->'} Shared Store {'->'} <span className="remote-b"><PiggyBank size={14} className="inline-block" /> Remote B</span>
                        <br />
                        <span className="remote-b"><PiggyBank size={14} className="inline-block" /> Remote B</span> {'->'} Shared Store {'->'} <span className="remote-a"><CreditCard size={14} className="inline-block" /> Remote A</span>
                    </p>
                </div>
      
    </div>
  </div>
    )
  }

export default App;
