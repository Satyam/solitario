import { useAppSelector, selStats } from 'store';

export const Stats = () => {
  const stats = useAppSelector(selStats);
  return (
    <div className="stats">
      <div className="stat">Jugadas: {stats.jugadas}</div>
      <div className="stat">Rondas: {stats.rondas}</div>
      <div className="stat">Undos: {stats.undos}</div>
      <div className="stat">Redos: {stats.redos}</div>
    </div>
  );
};

export default Stats;
