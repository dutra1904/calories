import { Component } from 'react'

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: 'system-ui',
            maxWidth: 600,
            margin: '40px auto',
            background: '#fff5f5',
            border: '1px solid #fc8181',
            borderRadius: 8,
          }}
        >
          <h2 style={{ color: '#c53030', marginTop: 0 }}>Erro ao carregar o app</h2>
          <pre
            style={{
              overflow: 'auto',
              fontSize: 12,
              background: '#f0f0f0',
              padding: 12,
              borderRadius: 4,
            }}
          >
            {this.state.error?.toString()}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
