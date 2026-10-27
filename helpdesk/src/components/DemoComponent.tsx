
import {useState} from 'react';
import { fetchProducts } from './Products19';


function DemoComponent() {

    //direct value to the state variable
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState<string | null>(null);

    //use this direct value to the state variable whenever 
        //you want to use cheap, static values i.e. string, boolean, number, etc.
        //whenever you want to use these value only during first render, because for later renders, 
                // the value will be ignored and the current state variable will be used instead.

    function getData(){
        console.log('getData function called');
        return 'Hello World';
    }


    //function call result (eagar evaluation) to the state variable
    const [data, setData] = useState( getData() );      //getData() runs on every render
    const [promise, setPromise] = useState(fetchProducts());  //fetchProducts() runs on every render

    //lazy intialization: function call result to the state variable
    const [lazyData, setLazyData] = useState( () => getData() );  //getData() runs only on first render
    const [lazyPromise, setLazyPromise] = useState( () => fetchProducts() );  //fetchProducts() runs only on first render


    function getInitialCount() {
        console.log('getInitialCount function called');
        return 10;
    }

    const [anotherCount, setAnotherCount] = useState<number>(getInitialCount);  //getInitialCount() runs only on first render
    
    return (
        <div>
            <p>You clicked {anotherCount} times</p>
            <button onClick={() => setCount(anotherCount + 1)}>
                Click me
            </button>

            <p>{data}</p>
        </div>
    );
}

export default DemoComponent;