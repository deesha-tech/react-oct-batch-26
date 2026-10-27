

export async function fetchProducts(){
      
          const response = await fetch('https://dummyjson.com/products')
          const data  = await response.json()
          console.log('data is received ', data)

      }