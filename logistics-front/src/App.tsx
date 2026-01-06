import { useState } from 'react';
import './App.css';
import { QuoteRequestForm } from './presentation/components/QuoteRequestForm';
import { QuoteResultsList } from './presentation/components/QuoteResultsList';
import { requestQuotes } from './services/quoteService';
import { IQuoteRequest } from './domain/models/QuoteRequest';
import { IQuote, IProviderMessage } from './domain/models/Quote';

function App() {
  const [quotes, setQuotes] = useState<IQuote[]>([]);
  const [messages, setMessages] = useState<IProviderMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: IQuoteRequest) => {
    setLoading(true);
    setError(null);
    setQuotes([]);
    setMessages([]);

    try {
      const response = await requestQuotes(data);
      setQuotes(response.quotes);
      setMessages(response.messages || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1>Optimizador de Envíos</h1>
        <p>Compara cotizaciones de múltiples proveedores</p>
      </header>

      <main>
        <section style={{ marginBottom: '40px' }}>
          <h2>Solicitar Cotización</h2>
          <QuoteRequestForm onSubmit={handleSubmit} />
        </section>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Cargando cotizaciones...</p>
          </div>
        )}

        {error && (
          <div 
            style={{
              backgroundColor: '#f8d7da',
              border: '1px solid #f5c2c7',
              borderRadius: '4px',
              padding: '16px',
              marginBottom: '20px',
              color: '#842029',
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && (quotes.length > 0 || messages.length > 0) && (
          <section>
            <QuoteResultsList quotes={quotes} messages={messages} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
