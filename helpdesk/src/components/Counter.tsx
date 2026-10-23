import { useId, useState } from "react"

export default function Counter() {

  const id = useId()
  
  const [count, setCount] = useState(0)

  return <div>
    <h1> id {id}</h1> 
    <h1>count {count}</h1> 
    <button onClick={() => setCount(c => c + 1)}>+1</button></div>
}