import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // También puedes registrar el error en un servicio de reporte de errores
    console.error("Error en el componente:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return (
        <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ color: '#e74c3c' }}>Algo salió mal</h1>
          <details style={{ whiteSpace: 'pre-wrap', marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <summary>Ver detalles del error</summary>
            <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>{this.state.error && this.state.error.toString()}</p>
            <p>La aplicación encontró un error que impide su funcionamiento normal.</p>
            {this.state.errorInfo && 
              <pre style={{ background: '#f8f8f8', padding: '10px', borderRadius: '4px' }}>
                {this.state.errorInfo.componentStack}
              </pre>
            }
          </details>
          <button 
            style={{ 
              padding: '10px 15px', 
              background: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
            onClick={() => window.location.reload()}
          >
            Recargar la página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;