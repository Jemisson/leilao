import { NoDataProps } from "../types";

function NoData({ className = "" }: NoDataProps) {
  return (
    <div className={`flex flex-col items-center justify-center mt-10 ${className}`}>
      <img src="/notFound.svg" alt="Nenhum dado encontrado" className="w-auto h-auto" />
    </div>
  );
};

export default NoData;
