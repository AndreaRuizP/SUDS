export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 py-6 px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Sistema de Análisis Hidrometeorológico
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              Universidad Cooperativa de Colombia
            </p>
          </div>
        </div>
        <div className="text-right border border-white rounded-lg px-4 py-2">
          <p className="text-white text-xs font-semibold">Ubicación</p>
          <p className="text-white font-medium">Santa Marta, Colombia</p>
        </div>
      </div>
    </header>
  );
}