import Image from "next/image";

export default function Banner() {
  return (
    <header className="py-2 bg-light border-bottom mb-4">
      <div className="container">
        <div className="text-center my-5">
          <Image
            src="/images/logo-odaee.png"
            alt="Logo de la ODAEE"
            width={100}
            height={100}
          />
          <h1 className="fw-bolder">Acervo ODAEE</h1>
          <p className="lead mb-0">Compilación de artículos y biografías de los galardonados de la rede ODAEE</p>
        </div>
      </div>
    </header>
  );
}
