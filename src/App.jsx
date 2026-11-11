import './App.css';
import FeedbackForm from './components/FeedbackForm';

function App() {
  return (
    <div className="app">
      <h1 style={{ textAlign: 'center', fontFamily: 'system-ui', marginBottom: '1rem' }}>
        Форма обратной связи
      </h1>
      <FeedbackForm />
    </div>
  );
}

export default App;