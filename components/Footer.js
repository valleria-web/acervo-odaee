export default function Footer() {
    const handleClick = () => {
        window.open("https://ordinals.com/sat/458201456508804", "_blank");
    };

    return (
        <footer className="py-5 bg-dark">
            <div className="container">
                <p className="m-0 text-center text-white" 
                   onClick={handleClick}
                   style={{ cursor: "pointer" }}
                >
                    Copyright &copy; <span style={{ textDecoration: "underline" }}>ODAEE</span>
                </p>
            </div>
        </footer>
    );
}
