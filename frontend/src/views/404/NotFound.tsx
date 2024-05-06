import { Link } from "react-router-dom";


export default function NotFound() {
  return (
    <>
        <h1 className="font-black text-center text-4xl text-red-50">Página no encontrada :/</h1>
        <p className="mt-10 text-center text-gray-400">
            Probablemente quieras volver a {' '}
            <Link className= "text-gray-50 hover:text-red-100" to={'/'}>la página principal</Link>
        </p>
    </>
  )
}
