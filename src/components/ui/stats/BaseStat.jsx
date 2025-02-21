const BaseStat = ({ title, value, description, icon, iconColor }) => (
    <div className="stat">
      <div className={`stat-figure ${iconColor}`}>
        {icon}
      </div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-desc">{description}</div>
    </div>
  );
  
  export default BaseStat;