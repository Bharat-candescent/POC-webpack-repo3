import { createStore, combineReducers } from 'redux';

// Initial state for the banking slice
const INITIAL_STATE = {
    cards: [
        { id: 'cc-1', name: 'Visa Platinum', balance: 500.50, limit: 5000 },
        { id: 'cc-2', name: 'Mastercard Gold', balance: 2500.00, limit: 3000 },
        { id: 'cc-3', name: 'Amex Rewards', balance: 10.99, limit: 10000 },
    ],
    selectedCardId: 'cc-1',
};

// Reducer for the banking state slice
const bankingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_SELECTED_CARD':
            console.log('Host Store: Card selected:', action.payload);
            return {
                ...state,
                selectedCardId: action.payload,
            };
        case 'APPLY_PAYMENT':
            // Logic to simulate a payment being applied (used by OnlineBankingMFE)
            const newCards = state.cards.map(card => {
                if (card.id === action.payload.cardId) {
                    return {
                        ...card,
                        balance: Math.max(0, card.balance - action.payload.amount),
                    };
                }
                return card;
            });
            return {
                ...state,
                cards: newCards,
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    banking: bankingReducer,
});

// Create the single, canonical store used by all applications
const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export { store };
