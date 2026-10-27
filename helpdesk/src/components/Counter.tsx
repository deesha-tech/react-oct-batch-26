import axios from "axios"
import { useEffect, useId, useState } from "react"

export default function Counter() {

   const [count, setCount] = useState(0)

   console.log('Counter is rendered...')

   useEffect(()=> {

    const controller = new AbortController()

    console.log('useEffect is executed...')

    //start fetching the data
    fetch('url', {signal: controller.signal})
    axios('url', {signal: controller.signal})

    return () => {
      console.log('cleanUP function runs...')
      //clean up, release the resources 
      controller.abort();
    }
   
  },[count])

  return <div>
   
    <h1>count {count}</h1> 
    <button onClick={() => setCount(c => c + 1)}>+1</button></div>
}