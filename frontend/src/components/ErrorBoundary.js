import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Log error details
    console.error('React Error Boundary caught:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0a0a0f',
          color: '#00f3ff',
          fontFamily: "'Share Tech Mono', monospace",
          padding: '2rem'
        }}>
          <div style={{
            border: '2px solid #ff006e',
            borderRadius: '4px',
            padding: '2rem',
            maxWidth: '600px',
            background: 'rgba(255, 0, 110, 0.1)',
            textAlign: 'center'
          }}>
            <h1 style={{
              color: '#ff006e',
              marginBottom: '1rem',
              fontSize: '2rem'
            }}>
              ⚠️ SYSTEM ERROR
            </h1>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              An unexpected error has occurred in the application.
            </p>
            
            {this.state.error && (
              <details style={{
                marginBottom: '2rem',
                textAlign: 'left',
                background: 'rgba(0, 243, 255, 0.05)',
                padding: '1rem',
                borderRadius: '4px',
                border: '1px solid rgba(0, 243, 255, 0.3)'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Error Details
                </summary>
                <pre style={{
                  overflow: 'auto',
                  fontSize: '0.8rem',
                  color: '#00ff41',
                  margin: 0
                }}>
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#ffff00', marginBottom: '0.5rem' }}>
                Error Count: {this.state.errorCount}
              </p>
              <p style={{ color: '#00ff41', fontSize: '0.9rem' }}>
                If errors persist, try refreshing the page or restarting the application.
              </p>
            </div>

            <button
              onClick={this.resetError}
              style={{
                padding: '0.75rem 2rem',
                background: 'transparent',
                border: '2px solid #00f3ff',
                color: '#00f3ff',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: "'Orbitron', monospace",
                textTransform: 'uppercase',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                marginRight: '1rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#00f3ff';
                e.target.style.color = '#0a0a0f';
                e.target.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#00f3ff';
                e.target.style.boxShadow = 'none';
              }}
            >
              Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 2rem',
                background: 'transparent',
                border: '2px solid #ff006e',
                color: '#ff006e',
                cursor: 'pointer',
                fontSize: '1rem',
                fontFamily: "'Orbitron', monospace",
                textTransform: 'uppercase',
                borderRadius: '4px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#ff006e';
                e.target.style.color = '#0a0a0f';
                e.target.style.boxShadow = '0 0 20px rgba(255, 0, 110, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ff006e';
                e.target.style.boxShadow = 'none';
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
