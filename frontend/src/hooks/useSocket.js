import { useEffect, useRef, useCallback } from 'react'

export function useSocket(onMessage) {
  const ws = useRef(null)

  const connect = useCallback(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws')
    ws.current.onmessage = (e) => onMessage(JSON.parse(e.data))
    ws.current.onclose = () => setTimeout(connect, 3000)
  }, [onMessage])

  useEffect(() => {
    connect()
    return () => ws.current?.close()
  }, [connect])
}
