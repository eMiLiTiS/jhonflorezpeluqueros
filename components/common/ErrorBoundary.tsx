'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught:', error, info)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] px-4 py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="font-display text-2xl text-white mb-2">Algo salió mal</h2>
          <p className="text-muted text-sm mb-6 max-w-sm">
            Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-all text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-6 p-4 bg-white/3 rounded-xl text-xs text-left text-red-300 overflow-auto max-w-lg">
              {this.state.error.message}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
