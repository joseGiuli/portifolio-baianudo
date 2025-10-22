export default function Divider({ className = '' }) {
  return (
    // herda a cor do texto: use text-vermelho no wrapper pai
    <div
      className={`relative flex items-center  text-vermelho ${className}`}
      role="separator"
      aria-hidden="true"
    >
      {/* linha esquerda */}
      <div className="h-[2px] flex-1 bg-current" />

      {/* ponto central */}
      <span className=" -lg:mx-8 relative z-10">
        {/* anel preto recorta a linha atrás para ficar idêntico ao print */}
        <span className="block w-3 h-3 -lg:w-[8px] -lg:h-[8px] rounded-full bg-current shadow-[0_0_0_4px_rgb(0,0,0)]" />
      </span>

      {/* linha direita */}
      <div className="h-[2px] flex-1 bg-current" />
    </div>
  );
}
