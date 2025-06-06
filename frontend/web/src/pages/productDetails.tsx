import {useEffect, useState, useRef, useImperativeHandle, forwardRef} from "react";
import {Header} from "./header.tsx";
import {Footer} from "./footer.tsx";
import {useParams, Link, useNavigate} from 'react-router-dom'
import {useLastId} from "../hooks/lastIdProduct.tsx"


type Products = {
    id: number;
    fruit : string;
    name : string;
    price : number;
    img : string[];
    description : string[];
}


export const ProductsCards = () => {
    const { product } = useParams<string>();
    const [allProducts,setAllProducts] = useState<Products[]|null>(null)
    const [selectedId, setSelectedId] = useState<number|null>(null);
    const refProducts = useRef<Products[]|null>(null);
    const [ready, setReady] = useState<boolean>(false);
    const refButtonAdd = useRef<(HTMLButtonElement|null)[]>([])
    const {data, loading, error, refetch} = useLastId()
    const navigate = useNavigate();


    const sendProduct = ( e : MouseEvent) => {
        const id = e.target?.dataset.id;
        // const id = refButtonAdd.current?.dataset.id;
        console.log(id)
        if( id) {
            // setSelectedId(id)
            refetch(id);
            console.log(data)
        }

    }

    useEffect(() => {
        console.log('cuacksito -> ',refProducts.current)
        const fetchData = async () => {
            try {
                console.log(product, "<-");

                const response = await fetch(`http://localhost:3000/infoProducts/${product}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) throw new Error(`Error en la petición: ${response.statusText}`);

                const result = await response.json();
                refProducts.current = result.data;
                setReady(true)
                console.log(result.data);

            } catch (error) {
                console.error("Algo salió mal:", error);
            }
        };
        fetchData();
    }, [product]);  // ← Aquí incluimos `products` en las dependencias

    return (
        <>
            <Header/>
            <main className={"w-full"}>
                <h1 className={"text-center text-[50px]"}>Products Cards</h1>
                <section className="w-[80%] border-[5px]  justify-center border-[purple] mx-auto flex flex-wrap content-start gap-[15px]">
                    {refProducts.current && refProducts.current?.map((el,key)=>(
                        <div className={"border-[2px]  border-[gray] rounded-[15px] w-[275px] h-[450px] px-[5px] py-[17.5px] flex flex-col items-center"} key={key}>
                            <img src={el.img[0]} alt="" className={"size-[240px] rounded-[8px]"}/>
                            <h1>{el.fruit}</h1>
                            <h2>{el.description[0]}</h2>
                            <h2>{el.name}</h2>
                            <b>{el.price}</b>
                            <div className={"flex gap-[20px] justify-evenly w-full"}>
                                <button data-id={el.id} onMouseDown={sendProduct} className={" bg-white  border-[2px] border-[gray] text-sm w-[80px] h-[40px] rounded-[8px] leading-[1.1]"}>agregar al carrito</button>
                                <Link to={"/productos/seccion-de-pagos"} className={""} >
                                    <button ref={(node)=>(refButtonAdd.current[key]=node)} onMouseDown={sendProduct} data-id={el.id} className={"bg-white  border-[2px] border-[gray] text-sm w-[75px] h-[40px] rounded-[8px]"}>comprar</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>
            </main>
            <Footer/>
        </>
    );
};