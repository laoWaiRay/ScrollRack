import "client-only"
import { useState } from "react"

export function useLocalStorage<ValueT>(key: string): [ValueT | null, (value: ValueT | null) => void] {
  const [state, setState] = useState<ValueT | null>(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.log(error)
    }
  })

  const setValue = (value: ValueT | null) => {
    try {
      if (value) {
        window.localStorage.setItem(key, JSON.stringify(value))
        setState(value)
      } else {
        window.localStorage.removeItem(key);
        setState(null);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [state, setValue]
}
